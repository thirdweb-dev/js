import type { ThirdwebClient } from "../../client/client.js";
import { isCoinbaseSDKWallet } from "../coinbase/coinbaseWebSDK.js";
import { isInAppWallet } from "../in-app/core/wallet/index.js";
import { getInjectedProvider } from "../injected/index.js";
import type { Wallet } from "../interfaces/wallet.js";
import { isSmartWallet } from "../smart/index.js";
import { isWalletConnect } from "../wallet-connect/controller.js";
import type { GetCallsStatusResponse, WalletSendCallsId } from "./types.js";

export type GetCallsStatusOptions = {
  wallet: Wallet;
  client: ThirdwebClient;
  bundleId: WalletSendCallsId;
};

/**
 * Get the status of an [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) bundle.
 *
 * @note This function is dependent on the wallet's support for EIP-5792 and could fail.
 *
 * @param {GetCallsStatusOptions} options
 * @param {Wallet} options.wallet - The wallet that send the original calls.
 * @param {ThirdwebClient} options.client - A {@link ThirdwebClient} instance.
 * @param {WalletSendCallsId} options.bundleId - The ID of the bundle to get the status of.
 * @throws an error if the wallet does not support EIP-5792.
 * @returns {Promise<GetCallsStatusResponse>} - A promise that resolves to the bundle's status and receipts (if available). {@link GetCallsStatusResponse}
 * @beta
 * @example
 * ```ts
 *  import { createThirdwebClient } from "thirdweb";
 *  import { sendCalls, getCallsStatus } from "thirdweb/wallets/eip5792";
 *
 *  const client = createThirdwebClient({ clientId: ... });
 *
 *  const bundleId = await sendCalls({ wallet, client, calls });
 *
 *  let result;
 *  while (result.status !== "CONFIRMED") {
 *    result = await getCallsStatus({ wallet, client, bundleId });
 *  }
 * ```
 * @extension EIP5792
 * @extension EIP5792
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
      "../in-app/core/eip5972/in-app-wallet-calls.js"
    );
    return inAppWalletGetCallsStatus({ wallet, client, bundleId });
  }

  if (isCoinbaseSDKWallet(wallet)) {
    const { coinbaseSDKWalletGetCallsStatus } = await import(
      "../coinbase/coinbaseWebSDK.js"
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
