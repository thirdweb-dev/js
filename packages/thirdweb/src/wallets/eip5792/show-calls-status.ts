import type { InjectedSupportedWalletIds } from "../__generated__/wallet-ids.js";
import { isInAppWallet } from "../in-app/core/wallet/index.js";
import { getInjectedProvider } from "../injected/index.js";
import type { Wallet } from "../interfaces/wallet.js";
import { isSmartWallet } from "../smart/index.js";
import { isWalletConnect } from "../wallet-connect/index.js";
import type { WalletSendCallsId } from "./types.js";

export type ShowCallsStatusOptions = {
  wallet: Wallet<InjectedSupportedWalletIds>;
  bundleId: WalletSendCallsId;
};

export async function showCallsStatus({
  wallet,
  bundleId,
}: ShowCallsStatusOptions) {
  if (
    isSmartWallet(wallet) ||
    isInAppWallet(wallet) ||
    isWalletConnect(wallet)
  ) {
    throw new Error(
      "showCallsStatus is currently unsupported for this wallet type",
    );
  }
  // Default to injected wallet
  const provider = getInjectedProvider(wallet.id);

  try {
    return await provider.request({
      method: "wallet_showCallsStatus",
      params: [bundleId],
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
