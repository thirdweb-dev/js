import {
  getCoinbaseWebProvider,
  isCoinbaseSDKWallet,
} from "../coinbase/coinbase-web.js";
import { isInAppWallet } from "../in-app/core/wallet/index.js";
import { getInjectedProvider } from "../injected/index.js";
import type { Ethereum } from "../interfaces/ethereum.js";
import type { Wallet } from "../interfaces/wallet.js";
import { isSmartWallet } from "../smart/index.js";
import { isWalletConnect } from "../wallet-connect/controller.js";
import type { WalletSendCallsId } from "./types.js";

type ShowCallsStatusOptions = {
  wallet: Wallet;
  id: WalletSendCallsId;
};

/**
 * Request a wallet to show the status of a bundle of calls.
 *
 * Note: This function is dependent on the wallet's support for EIP-5792 and could fail. It is currently not supported with in-app or smart wallets.
 *
 * @param {ShowCallsStatusOptions} options
 * @param {Wallet} options.wallet - The wallet to show the status of the calls for.
 * @param {WalletSendCallsId} options.bundleId - The bundle ID of the calls to show the status of.
 * @returns {Promise<void>}
 *
 * @beta
 * @example
 * ```ts
 *  import { createThirdwebClient } from "thirdweb";
 *  import { showCallsStatus } from "thirdweb/wallets/eip5792";
 *
 *  const client = createThirdwebClient({ clientId: ... });
 *
 *  const bundleId = await sendCalls({ wallet, client, calls });
 *  await showCallsStatus({ wallet, bundleId });
 * ```
 * @extension EIP5792
 * @internal
 */
export async function showCallsStatus({
  wallet,
  id,
}: ShowCallsStatusOptions): Promise<void> {
  if (
    isSmartWallet(wallet) ||
    isInAppWallet(wallet) ||
    isWalletConnect(wallet)
  ) {
    throw new Error(
      "showCallsStatus is currently unsupported for this wallet type",
    );
  }

  let provider: Ethereum;
  if (isCoinbaseSDKWallet(wallet)) {
    provider = (await getCoinbaseWebProvider(wallet.getConfig())) as Ethereum;
  } else {
    // Default to injected wallet
    provider = getInjectedProvider(wallet.id);
  }

  try {
    return await provider.request({
      method: "wallet_showCallsStatus",
      params: [id],
    });
  } catch (error: unknown) {
    if (/unsupport|not support/i.test((error as Error).message)) {
      throw new Error(
        `${wallet.id} does not support wallet_showCallsStatus, reach out to them directly to request EIP-5792 support.`,
      );
    }
    throw error;
  }
}
