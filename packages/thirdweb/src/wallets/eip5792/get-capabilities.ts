import type { Prettify } from "../../utils/type-utils.js";
import { isCoinbaseSDKWallet } from "../coinbase/coinbaseSDKWallet.js";
import { isInAppWallet } from "../in-app/core/wallet/index.js";
import type { Wallet } from "../interfaces/wallet.js";
import { isSmartWallet } from "../smart/index.js";
import { isWalletConnect } from "../wallet-connect/index.js";
import type { WalletId } from "../wallet-types.js";
import type { WalletCapabilities, WalletCapabilitiesRecord } from "./types.js";

export type GetCapabilitiesOptions<ID extends WalletId> = {
  wallet: Wallet<ID>;
};

export type GetCapabilitiesResult = Prettify<
  WalletCapabilitiesRecord<WalletCapabilities, number>
>;

export async function getCapabilities<const ID extends WalletId>({
  wallet,
}: GetCapabilitiesOptions<ID>): Promise<GetCapabilitiesResult> {
  if (isSmartWallet(wallet)) {
    const { getSmartWalletCapabilities } = await import(
      "../smart/lib/smart-wallet-capabilities.js"
    );
    return getSmartWalletCapabilities({ wallet });
  }

  if (isInAppWallet(wallet)) {
    const { getInAppWalletCapabilities } = await import(
      "../in-app/core/lib/in-app-wallet-capabilities.js"
    );
    return getInAppWalletCapabilities({ wallet });
  }

  if (isCoinbaseSDKWallet(wallet)) {
    const { getCoinbaseSDKWalletCapabilities } = await import(
      "../coinbase/coinbaseSDKWallet.js"
    );
    return await getCoinbaseSDKWalletCapabilities({ wallet });
  }

  // TODO: Add Wallet Connect support
  if (isWalletConnect(wallet)) {
    const chain = wallet.getChain();
    if (!chain) return {};
    return {
      [chain.id]: {},
    };
  }

  // Default to injected wallet
  const { getInjectedWalletCapabilities } = await import(
    "../injected/lib/injected-wallet-capabilities.js"
  );
  return await getInjectedWalletCapabilities({ wallet });
}
