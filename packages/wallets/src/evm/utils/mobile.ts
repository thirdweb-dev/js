
import { wallets, WalletType } from "../constants/wallets";

export function formatMobileLink(uri: string, walletId: keyof WalletType) {
    const { mobile } = wallets[walletId]
    const encodedUri = encodeURIComponent(uri);
    return mobile.universal
        ? `${mobile.universal}/${encodedUri}`
        : mobile.native
            ? `${mobile.native}${mobile.native.endsWith(":") ? "//" : "/"}${encodedUri}`
            : "";
}

export function getWalletLink(walletId: keyof WalletType) {
    const { mobile } = wallets[walletId]
    return mobile.universal ? mobile.universal : mobile.native;
}