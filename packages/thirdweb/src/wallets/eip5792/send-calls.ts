import type { Abi, AbiFunction } from "abitype";
import type { WalletSendCallsParameters as ViemWalletSendCallsParameters } from "viem";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { toSerializableTransaction } from "../../transaction/actions/to-serializable-transaction.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import { type Address, getAddress } from "../../utils/address.js";
import { type Hex, numberToHex } from "../../utils/encoding/hex.js";
import type { PromisedObject } from "../../utils/promise/resolve-promised-value.js";
import type { OneOf } from "../../utils/type-utils.js";
import { isCoinbaseSDKWallet } from "../coinbase/coinbaseSDKWallet.js";
import { isInAppWallet } from "../in-app/core/wallet/index.js";
import { getInjectedProvider } from "../injected/index.js";
import type { Wallet } from "../interfaces/wallet.js";
import { isSmartWallet } from "../smart/index.js";
import { isWalletConnect } from "../wallet-connect/index.js";
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
> = {
  wallet: Wallet<ID>;
  calls: PreparedSendCall<abi, abiFunction>[];
  capabilities?: WalletSendCallsParameters[number]["capabilities"];
  version?: WalletSendCallsParameters[number]["version"];
  chain?: Chain;
};

export type SendCallsResult = WalletSendCallsId;

/**
 * Send [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) calls to a wallet.
 * This function works with all Thirdweb wallets (in-app and smart) and certain injected wallets that already support EIP-5792.
 * Transactions will be bundled and sponsored when those capabilities are supported, otherwise they will be sent as individual transactions.
 *
 * Note: This function is dependent on the wallet's support for EIP-5792 and could fail.
 *
 * @param {SendCallsOptions} options
 * @param {Wallet} options.wallet - The wallet to send the calls to.
 * @param {PreparedSendCall[]} options.calls - An array of prepared transactions to send.
 * @param {ThirdwebClient} options.client - A {@link ThirdwebClient} instance for RPC access.
 * @param {WalletSendCallsParameters[number]["capabilities"]} options.capabilities - Capabilities objects to use, see the [EIP-5792 spec](https://eips.ethereum.org/EIPS/eip-5792) for details.
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
 *
 * const preparedTx = approve({
      contract: USDT_CONTRACT,
      amount: 100,
      spender: TEST_ACCOUNT_B.address,
    });
 * const bundleId = await sendCalls({
 *   wallet,
 *   client,
 *   calls: [preparedTx],
 * });
 * ```
 * @wallets
 */
export async function sendCalls<const ID extends WalletId>(
  options: SendCallsOptions<ID>,
): Promise<SendCallsResult> {
  const {
    wallet,
    calls,
    capabilities,
    version = "1.0",
    chain = wallet.getChain(),
  } = options;

  if (!chain) {
    throw new Error(
      `Cannot send calls, no active chain found for wallet: ${wallet.id}`,
    );
  }

  const account = wallet.getAccount();
  if (!account) {
    throw new Error(
      `Cannot send calls, no account connected for wallet: ${wallet.id}`,
    );
  }

  // These conveniently operate the same
  if (isSmartWallet(wallet) || isInAppWallet(wallet)) {
    const { inAppWalletSendCalls } = await import(
      "../in-app/core/eip5972/in-app-wallet-calls.js"
    );
    return inAppWalletSendCalls({ account, calls });
  }

  const preparedCalls: EIP5792Call[] = await Promise.all(
    calls.map(async (call) => {
      const serializableTransaction = await toSerializableTransaction({
        transaction: call,
        from: account.address,
      });

      const { to, data, value } = serializableTransaction;
      if (to === undefined && data === undefined) {
        throw new Error("Cannot send call, `to` or `data` must be provided.");
      }

      return {
        to: to as Address,
        data: data as Hex,
        value:
          typeof value === "bigint" || typeof value === "number"
            ? numberToHex(value)
            : undefined,
      };
    }),
  );

  const injectedWalletCallParams: WalletSendCallsParameters = [
    {
      from: getAddress(account.address),
      calls: preparedCalls,
      capabilities,
      version,
      chainId: numberToHex(chain.id),
    },
  ];

  if (isCoinbaseSDKWallet(wallet)) {
    const { coinbaseSDKWalletSendCalls } = await import(
      "../coinbase/coinbaseSDKWallet.js"
    );
    return coinbaseSDKWalletSendCalls({
      wallet,
      params: injectedWalletCallParams,
    });
  }

  if (isWalletConnect(wallet)) {
    throw new Error("sendCalls is not yet supported for Wallet Connect");
  }

  // Default to injected wallet
  const provider = getInjectedProvider(wallet.id);
  try {
    return await provider.request({
      method: "wallet_sendCalls",
      params: injectedWalletCallParams as ViemWalletSendCallsParameters, // The viem type definition is slightly different
    });
  } catch (error) {
    if (/unsupport|not support/i.test((error as Error).message)) {
      throw new Error(
        `${wallet.id} does not support wallet_sendCalls, reach out to them directly to request EIP-5792 support.`,
      );
    }
    throw error;
  }
}
