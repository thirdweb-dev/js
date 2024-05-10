import type { ThirdwebClient } from "../../client/client.js";
import { isCoinbaseSDKWallet } from "../coinbase/coinbaseSDKWallet.js";
import { isInAppWallet } from "../in-app/core/wallet/index.js";
import { getInjectedProvider } from "../injected/index.js";
import type { Wallet } from "../interfaces/wallet.js";
import { isSmartWallet } from "../smart/index.js";
import { isWalletConnect } from "../wallet-connect/index.js";
import type { GetCallsStatusResponse, WalletSendCallsId } from "./types.js";

export type GetCallsStatusOptions = {
  wallet: Wallet;
  client: ThirdwebClient;
  bundleId: WalletSendCallsId;
};

/**
 * Get the status of an [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) bundle.
 *
 * @param {GetCallsStatusOptions} options
 * @param {Wallet} options.wallet - The wallet that send the original calls.
 * @param {ThirdwebClient} options.client - A {@link ThirdwebClient} instance.
 * @param {WalletSendCallsId} options.bundleId - The ID of the bundle to get the status of.
 * @returns {Promise<GetCallsStatusResponse>} A promise that resolves to the bundle's status and receipts (if available). {@link GetCallsStatusResponse}
 *
 * @example
 * ```ts
 * import { sendCalls, getCallsStatus } from "thirdweb/wallets";
 *
 *
 * ```
 */
export async function getCallsStatus({
  wallet,
  client,
  bundleId,
}: GetCallsStatusOptions): Promise<GetCallsStatusResponse> {
  const account = wallet.getAccount();
  if (!account) {
    throw new Error(
      `Failed to get call status, no account found for wallet ${wallet.id}`,
    );
  }

  // These conveniently operate the same
  if (isSmartWallet(wallet) || isInAppWallet(wallet)) {
    const { inAppWalletGetCallsStatus } = await import(
      "../in-app/core/lib/in-app-wallet-calls.js"
    );
    return inAppWalletGetCallsStatus({ wallet, client, bundleId });
  }

  if (isCoinbaseSDKWallet(wallet)) {
    const { coinbaseSDKWalletGetCallsStatus } = await import(
      "../coinbase/coinbaseSDKWallet.js"
    );
    return coinbaseSDKWalletGetCallsStatus({ wallet, bundleId });
  }

  if (isWalletConnect(wallet)) {
    throw new Error("getCallsStatus is not yet supported for Wallet Connect");
  }

  // Default to injected wallet
  const provider = getInjectedProvider(wallet.id);
  try {
    return await provider.request({
      method: "wallet_getCallsStatus",
      params: [bundleId],
    });
  } catch (error) {
    if (/unsupport|not support/i.test((error as Error).message)) {
      throw new Error(
        `${wallet.id} does not support wallet_getCallsStatus, reach out to them directly to request EIP-5792 support.`,
      );
    }
    throw error;
  }
}
