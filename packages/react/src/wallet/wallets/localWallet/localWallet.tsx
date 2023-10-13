import { LocalWallet, WalletOptions } from "@thirdweb-dev/wallets";
import type { LocalWalletConfigOptions, LocalWalletConfig } from "./types";
import { LocalWalletConnectUI } from "./LocalWalletConnectUI";
import { isMobile } from "../../../evm/utils/isMobile";

const desktopIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xXzY0KSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMV82NCkiPgo8cGF0aCBkPSJNNTguNzUgMTkuMTY2N0gyMS4yNUMxOC45NTgzIDE5LjE2NjcgMTcuMDgzMyAyMS4wNDE3IDE3LjA4MzMgMjMuMzMzNFY0OC4zMzM0QzE3LjA4MzMgNTAuNjI1IDE4Ljk1ODMgNTIuNSAyMS4yNSA1Mi41SDM1LjgzMzNMMzEuNjY2NyA1OC43NVY2MC44MzM0SDQ4LjMzMzNWNTguNzVMNDQuMTY2NyA1Mi41SDU4Ljc1QzYxLjA0MTcgNTIuNSA2Mi45MTY3IDUwLjYyNSA2Mi45MTY3IDQ4LjMzMzRWMjMuMzMzNEM2Mi45MTY3IDIxLjA0MTcgNjEuMDQxNyAxOS4xNjY3IDU4Ljc1IDE5LjE2NjdaTTU4Ljc1IDQ0LjE2NjdIMjEuMjVWMjMuMzMzNEg1OC43NVY0NC4xNjY3WiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzFfNjQiIHgxPSI0MCIgeTE9IjAiIHgyPSI0MCIgeTI9IjgwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNDRTExQUIiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOTAwQkI1Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMV82NCI+CjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1IDE1KSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=";

const phoneIcon = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl80NF8yKSIvPgo8cGF0aCBkPSJNNDguNjE1NCAxNkgzMS4zODQ2QzI4LjQxMjMgMTYgMjYgMTguMzkyNyAyNiAyMS4zNDA5VjU3LjY1OTFDMjYgNjAuNjA3MyAyOC40MTIzIDYzIDMxLjM4NDYgNjNINDguNjE1NEM1MS41ODc3IDYzIDU0IDYwLjYwNzMgNTQgNTcuNjU5MVYyMS4zNDA5QzU0IDE4LjM5MjcgNTEuNTg3NyAxNiA0OC42MTU0IDE2Wk00MCA2MC44NjM2QzM4LjIxMjMgNjAuODYzNiAzNi43NjkyIDU5LjQzMjMgMzYuNzY5MiA1Ny42NTkxQzM2Ljc2OTIgNTUuODg1OSAzOC4yMTIzIDU0LjQ1NDUgNDAgNTQuNDU0NUM0MS43ODc3IDU0LjQ1NDUgNDMuMjMwOCA1NS44ODU5IDQzLjIzMDggNTcuNjU5MUM0My4yMzA4IDU5LjQzMjMgNDEuNzg3NyA2MC44NjM2IDQwIDYwLjg2MzZaTTQ5LjY5MjMgNTIuMzE4MkgzMC4zMDc3VjIyLjQwOTFINDkuNjkyM1Y1Mi4zMTgyWiIgZmlsbD0id2hpdGUiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl80NF8yIiB4MT0iNDAiIHkxPSIwIiB4Mj0iNDAiIHkyPSI4MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjQ0UxMUFCIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzkwMEJCNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=`;

export const localWallet = (
  config?: LocalWalletConfigOptions,
): LocalWalletConfig => {
  return {
    id: LocalWallet.id,
    isHeadless: true,
    meta: {
      ...LocalWallet.meta,
      name: "Guest Wallet",
      iconURL: isMobile() ? phoneIcon : desktopIcon,
    },
    create: (options: WalletOptions) => new LocalWallet(options),
    connectUI(props) {
      return (
        <LocalWalletConnectUI
          {...props}
          persist={
            config && config.persist !== undefined ? config.persist : true
          }
        />
      );
    },
  };
};
