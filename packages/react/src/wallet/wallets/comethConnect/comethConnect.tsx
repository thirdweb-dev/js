import type { WalletConfig } from "@thirdweb-dev/react-core";
import {
  ComethConnect,
  ComethAdditionalOptions,
  walletIds,
} from "@thirdweb-dev/wallets";

export const comethConnect = (
  config: Omit<ComethAdditionalOptions, "chain">,
): WalletConfig<ComethConnect> => ({
  id: walletIds.comethConnect,
  meta: {
    name: "ComethConnect",
    iconURL:
      "https://www.gitbook.com/cdn-cgi/image/width=40,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F2054789935-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FbqtzcB3112boJAhglgmx%252Ficon%252Ft1hk4Ml9QiJoKgLRT7hx%252Ffavicon.png%3Falt%3Dmedia%26token%3D1932b499-2a89-485d-8d01-cff76468be28",
  },
  create(walletOptions) {
    return new ComethConnect({
      ...walletOptions,
      ...config,
    });
  },
  isInstalled() {
    return false;
  },
});
