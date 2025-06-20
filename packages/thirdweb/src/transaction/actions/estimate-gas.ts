import * as ox__Hex from "ox/Hex";
import { formatTransactionRequest } from "viem";
import { roundUpGas } from "../../gas/op-gas-fee-reducer.js";
import { getAddress } from "../../utils/address.js";
import { hexToBytes } from "../../utils/encoding/to-bytes.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { Account } from "../../wallets/interfaces/wallet.js";
import { extractError } from "../extract-error.js";
import type { PreparedTransaction } from "../prepare-transaction.js";

export type EstimateGasOptions = Prettify<
  {
    /**
     * The prepared transaction to estimate the gas for.
     */
    // TODO: update this to `Transaction<"prepared">` once the type is available to ensure only prepared transactions are accepted
    // biome-ignore lint/suspicious/noExplicitAny: library function that accepts any prepared transaction type
    transaction: PreparedTransaction<any>;
  } & (
    | {
        /**
         * The account the transaction would be sent from.
         *
         * @deprecated Use `from` instead
         */
        account: Account;
        from?: never;
      }
    | {
        account?: never;
        /**
         * The address the transaction would be sent from.
         */
        from?: string | Account;
      }
  )
>;

export type EstimateGasResult = bigint;

const cache = new WeakMap<
  PreparedTransaction & { from: string | undefined },
  Promise<EstimateGasResult>
>();

/**
 * Estimates the gas required to execute a transaction. The gas is returned as a `bigint` and in gwei units.
 * @param options - The options for estimating gas.
 * @returns A promise that resolves to the estimated gas as a bigint.
 * @transaction
 * @example
 * ```ts
 * import { estimateGas } from "thirdweb";
 * const gas = await estimateGas({
 *  transaction,
 *  from: "0x...",
 * });
 * ```
 */
export async function estimateGas(
  options: EstimateGasOptions,
): Promise<EstimateGasResult> {
  // from is:
  // 1. the user specified from address
  // 2. the passed in account address
  // 3. the passed in wallet's account address
  const fromAddress =
    typeof options.from === "string"
      ? (options.from ?? undefined)
      : (options.from?.address ?? options.account?.address);
  const txWithFrom = { ...options.transaction, from: fromAddress };
  if (cache.has(txWithFrom)) {
    // biome-ignore lint/style/noNonNullAssertion: the `has` above ensures that this will always be set
    return cache.get(txWithFrom)!;
  }
  const { account } = options;
  const promise = (async () => {
    const predefinedGas = await resolvePromisedValue(options.transaction.gas);
    // if we have a predefined gas value in the TX -> always use that
    if (predefinedGas !== undefined) {
      return predefinedGas;
    }

    // if the wallet itself overrides the estimateGas function, use that
    if (account?.estimateGas) {
      try {
        let gas = await account.estimateGas(options.transaction);
        if (options.transaction.chain.experimental?.increaseZeroByteCount) {
          gas = roundUpGas(gas);
        }
        return gas;
      } catch (error) {
        throw await extractError({
          contract: options.transaction.__contract,
          error,
          fromAddress,
        });
      }
    }

    // load up encode function if we need it
    const { encode } = await import("./encode.js");
    const [encodedData, toAddress, value, authorizationList] =
      await Promise.all([
        encode(options.transaction),
        resolvePromisedValue(options.transaction.to),
        resolvePromisedValue(options.transaction.value),
        resolvePromisedValue(options.transaction.authorizationList),
      ]);

    // load up the rpc client and the estimateGas function if we need it
    const [{ getRpcClient }, { eth_estimateGas }] = await Promise.all([
      import("../../rpc/rpc.js"),
      import("../../rpc/actions/eth_estimateGas.js"),
    ]);

    const rpcRequest = getRpcClient(options.transaction);
    try {
      let gas = await eth_estimateGas(
        rpcRequest,
        formatTransactionRequest({
          authorizationList: authorizationList?.map((auth) => ({
            ...auth,
            contractAddress: getAddress(auth.address),
            nonce: Number(auth.nonce),
            r: ox__Hex.fromNumber(auth.r),
            s: ox__Hex.fromNumber(auth.s),
          })),
          data: encodedData,
          from: fromAddress ? getAddress(fromAddress) : undefined,
          to: toAddress ? getAddress(toAddress) : undefined,
          value,
          ...(authorizationList && authorizationList?.length > 0
            ? {
                gas:
                  minGas(
                    hexToBytes(encodedData),
                    BigInt(authorizationList?.length ?? 0),
                  ) + 100_000n,
              }
            : {}),
        }),
      );

      if (options.transaction.chain.experimental?.increaseZeroByteCount) {
        gas = roundUpGas(gas);
      }
      return gas;
    } catch (error) {
      throw await extractError({
        contract: options.transaction.__contract,
        error,
        fromAddress,
      });
    }
  })();
  cache.set(txWithFrom, promise);
  return promise;
}

// EIP-7623 + EIP-7702 floor calculation
const TxGas = 21_000n;
const TxCostFloorPerToken = 10n; // params.TxCostFloorPerToken
const TxTokenPerNonZero = 4n; // params.TxTokenPerNonZeroByte
const TxAuthTupleGas = 12_500n;

function minGas(data: Uint8Array, authCount = 0n) {
  let nz = 0n;
  for (const b of data) if (b !== 0) nz++;
  const z = BigInt(data.length) - nz;
  const tokens = nz * TxTokenPerNonZero + z;
  const floor = TxGas + tokens * TxCostFloorPerToken;
  const intrinsic = TxGas + authCount * TxAuthTupleGas;
  return floor > intrinsic ? floor : intrinsic;
}
