import type { WalletSendCallsParameters as ViemWalletSendCallsParameters } from "viem";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getAddress } from "../../utils/address.js";
import { type Hex, numberToHex } from "../../utils/encoding/hex.js";
import type { OneOf } from "../../utils/type-utils.js";
import { isCoinbaseSDKWallet } from "../coinbase/coinbaseSDKWallet.js";
import { isInAppWallet } from "../in-app/core/wallet/index.js";
import { getInjectedProvider } from "../injected/index.js";
import type { Wallet } from "../interfaces/wallet.js";
import { isSmartWallet } from "../smart/index.js";
import { isWalletConnect } from "../wallet-connect/index.js";
import type { WalletId } from "../wallet-types.js";
import type { WalletSendCallsId, WalletSendCallsParameters } from "./types.js";

export type WalletCall = OneOf<
  | {
      to: Hex;
      data?: Hex | undefined;
      value?: bigint | undefined;
    }
  | {
      data: Hex; // Contract creation case
    }
>;

export type SendCallsOptions<ID extends WalletId = WalletId> = {
  wallet: Wallet<ID>;
  client: ThirdwebClient;
  calls: WalletCall[];
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
 * @param {WalletCall[]} options.calls - An array of calls to send containing the to address, data, and value.
 * @param {ThirdwebClient} options.client - A {@link ThirdwebClient} instance for RPC access.
 * @param {WalletSendCallsParameters[number]["capabilities"]} options.capabilities - Capabilities objects to use, see the [EIP-5792 spec](https://eips.ethereum.org/EIPS/eip-5792) for details.
 * @param {string} [options.version="1.0"] - The `wallet_sendCalls` version to use, defaults to "1.0".
 * @param {Chain} [options.chain] - A {@link Chain} instance to override the wallet's current chain.
 * @throws an error if the wallet does not support EIP-5792.
 * @returns The ID of the bundle of the calls.
 *
 * @see getCallsStatus for how to retrieve the status of the bundle.
 * @see getCapabilities for how to retrieve the capabilities of the wallet.
 *
 * @example
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 * import { sendCalls } from "thirdweb/wallets";
 *
 * const client = createThirdwebClient({ clientId: ... });
 * const wallet = createWallet("com.coinbase.wallet");
 *
 * const bundleId = await sendCalls({
 *   wallet,
 *   client,
 *   calls: [{ to: ..., value: ... }, { to: ..., value: ... }],
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
    client,
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
      "../in-app/core/lib/in-app-wallet-calls.js"
    );
    return inAppWalletSendCalls({ wallet, chain, client, calls });
  }

  const injectedWalletCallParams: WalletSendCallsParameters = [
    {
      from: getAddress(account.address),
      calls: calls.map((call) =>
        call.to
          ? {
              ...call,
              value: call.value ? numberToHex(call.value) : undefined,
            }
          : {
              data: call.data,
            },
      ),
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
