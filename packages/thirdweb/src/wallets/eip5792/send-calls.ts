import type { Abi, AbiFunction } from "abitype";
import type { WalletSendCallsParameters as ViemWalletSendCallsParameters } from "viem";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { encode } from "../../transaction/actions/encode.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import { getAddress } from "../../utils/address.js";
import { type Hex, numberToHex } from "../../utils/encoding/hex.js";
import {
  type PromisedObject,
  resolvePromisedValue,
} from "../../utils/promise/resolve-promised-value.js";
import type { OneOf, Prettify } from "../../utils/type-utils.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import type { WalletId } from "../wallet-types.js";
import type {
  EIP5792Call,
  WalletSendCallsId,
  WalletSendCallsParameters,
} from "./types.js";

type WalletCall = OneOf<{
  to?: string | undefined; // TODO: Make this required but compatible with StaticPrepareTransactionOptions to prevent runtime error
  data?: Hex | undefined;
  value?: bigint | undefined;
}>;

export type PreparedSendCall<
  abi extends Abi = [],
  abiFunction extends AbiFunction = AbiFunction,
> = PreparedTransaction<abi, abiFunction, PrepareCallOptions>;

export type PrepareCallOptions = {
  chain: Chain;
  client: ThirdwebClient;
} & PromisedObject<WalletCall>;

export type SendCallsOptions<
  ID extends WalletId = WalletId,
  abi extends Abi = [],
  abiFunction extends AbiFunction = AbiFunction,
> = Prettify<{
  wallet: Wallet<ID>;
  calls: PreparedSendCall<abi, abiFunction>[];
  capabilities?: WalletSendCallsParameters[number]["capabilities"];
  version?: WalletSendCallsParameters[number]["version"];
  chain?: Chain;
  atomicRequired?: boolean;
}>;

export type SendCallsResult = Prettify<{
  id: WalletSendCallsId;
  client: ThirdwebClient;
  chain: Chain;
  wallet: Wallet;
}>;

/**
 * Send [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) calls to a wallet.
 * This function works with all Thirdweb wallets (in-app and smart) and certain injected wallets that already support EIP-5792.
 * Transactions will be bundled and sponsored when those capabilities are supported, otherwise they will be sent as individual transactions.
 *
 *  This function is dependent on the wallet's support for EIP-5792 and could fail.
 *
 * @param {SendCallsOptions} options
 * @param {Wallet} options.wallet - The wallet to send the calls to.
 * @param {PreparedSendCall[]} options.calls - An array of prepared transactions to send.
 * @param {WalletSendCallsParameters[number]["capabilities"]} [options.capabilities] - Capabilities objects to use, see the [EIP-5792 spec](https://eips.ethereum.org/EIPS/eip-5792) for details.
 * @param {string} [options.version="1.0"] - The `wallet_sendCalls` version to use, defaults to "1.0".
 * @param {Chain} [options.chain] - A {@link Chain} instance to override the wallet's current chain.
 * @throws an error if the wallet does not support EIP-5792.
 * @returns The ID of the bundle of the calls.
 *
 * @see getCallsStatus for how to retrieve the status of the bundle.
 * @see getCapabilities for how to retrieve the capabilities of the wallet.
 * @beta
 * @example
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 * import { sendCalls } from "thirdweb/wallets/eip5792";
 *
 * const client = createThirdwebClient({ clientId: ... });
 * const wallet = createWallet("com.coinbase.wallet");
 * await wallet.connect({ client });
 *
 * const sendTx1 = approve({
      contract: USDT_CONTRACT,
      amount: 100,
      spender: "0x33d9B8BEfE81027E2C859EDc84F5636cbb202Ed6",
    });
 * const sendTx2 = approve({
      contract: USDT_CONTRACT,
      amount: 100,
      spender: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
    });
 * const bundleId = await sendCalls({
 *   wallet,
 *   client,
 *   calls: [sendTx1, sendTx2],
 * });
 * ```
 * Sponsor transactions with a paymaster:
 * ```ts
 * const bundleId = await sendCalls({
 *   wallet,
 *   client,
 *   calls: [send1, send2],
 *   capabilities: {
 *     paymasterService: {
 *       url: `https://${CHAIN.id}.bundler.thirdweb.com/${client.clientId}`
 *     }
 *   }
 * });
 * ```
 * We recommend proxying any paymaster calls via an API route you setup and control.
 *
 * @extension EIP5792
 */
export async function sendCalls<const ID extends WalletId>(
  options: SendCallsOptions<ID>,
): Promise<SendCallsResult> {
  const { wallet, chain } = options;

  const account = wallet.getAccount();
  if (!account) {
    throw new Error(
      `Cannot send calls, no account connected for wallet: ${wallet.id}`,
    );
  }

  const firstCall = options.calls[0];
  if (!firstCall) {
    throw new Error("No calls to send");
  }

  const callChain = firstCall.chain || chain;

  if (wallet.getChain()?.id !== callChain.id) {
    await wallet.switchChain(callChain);
  }

  // check internal implementations
  if (account.sendCalls) {
    const { wallet: _, ...optionsWithoutWallet } = options;
    const result = await account.sendCalls(optionsWithoutWallet);
    return {
      ...result,
      wallet,
    };
  }

  throw new Error(
    `Cannot send calls, wallet ${wallet.id} does not support EIP-5792`,
  );
}

export async function toProviderCallParams(
  options: Omit<SendCallsOptions, "wallet">,
  account: Account,
): Promise<{ callParams: ViemWalletSendCallsParameters; chain: Chain }> {
  const firstCall = options.calls[0];
  if (!firstCall) {
    throw new Error("No calls to send");
  }

  const {
    calls,
    capabilities,
    version = "2.0.0",
    chain = firstCall.chain,
  } = options;

  const preparedCalls: EIP5792Call[] = await Promise.all(
    calls.map(async (call) => {
      const { to, value } = call;
      if (to === undefined && call.data === undefined) {
        throw new Error("Cannot send call, `to` or `data` must be provided.");
      }

      const [_to, _data, _value] = await Promise.all([
        resolvePromisedValue(to),
        encode(call),
        resolvePromisedValue(value),
      ]);

      if (_to) {
        return {
          data: _data as Hex,
          to: getAddress(_to),
          value:
            typeof _value === "bigint" || typeof _value === "number"
              ? numberToHex(_value)
              : undefined,
        };
      }

      return {
        data: _data as Hex,
        to: undefined,
        value: undefined,
      };
    }),
  );

  const injectedWalletCallParams: ViemWalletSendCallsParameters = [
    {
      // see: https://eips.ethereum.org/EIPS/eip-5792#wallet_sendcalls
      atomicRequired: options.atomicRequired ?? false,
      calls: preparedCalls,
      capabilities,
      chainId: numberToHex(chain.id),
      from: getAddress(account.address),
      version,
    },
  ];

  return { callParams: injectedWalletCallParams, chain };
}
