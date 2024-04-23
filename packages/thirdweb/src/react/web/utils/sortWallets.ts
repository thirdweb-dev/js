import { getInstalledWalletProviders } from "../../../wallets/injected/mipdStore.js";
import type { WalletId } from "../../../wallets/wallet-types.js";

/**
 *
 * @internal
 */
export function sortWallets<T extends { id: string }>(
  wallets: T[],
  recommendedWallets?: { id: WalletId }[],
): T[] {
  const providers = getInstalledWalletProviders();
  return (
    wallets
      // show the installed wallets first
      .sort((a, b) => {
        const aInstalled = providers.find((p) => p.info.rdns === a.id);
        const bInstalled = providers.find((p) => p.info.rdns === b.id);

        if (aInstalled && !bInstalled) {
          return -1;
        }
        if (!aInstalled && bInstalled) {
          return 1;
        }
        return 0;
      })
      // show the recommended wallets even before that
      .sort((a, b) => {
        const aIsRecommended = recommendedWallets?.find((w) => w === a);
        const bIsRecommended = recommendedWallets?.find((w) => w === b);

        if (aIsRecommended && !bIsRecommended) {
          return -1;
        }
        if (!aIsRecommended && bIsRecommended) {
          return 1;
        }
        return 0;
      })
      // show wallets with select ui first ( currently only in-app )
      .sort((a, b) => {
        const aIsInApp = a.id === "inApp" || a.id === "embedded";
        const bIsInApp = b.id === "inApp" || b.id === "embedded";
        if (aIsInApp && !bIsInApp) {
          return -1;
        }
        if (!aIsInApp && bIsInApp) {
          return 1;
        }
        return 0;
      })
  );
}
