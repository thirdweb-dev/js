import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import { BloctoWallet } from "@thirdweb-dev/wallets";

export type BloctoAdditionalOptions = {
  /**
   * Your app’s unique identifier that can be obtained at https://developers.blocto.app,
   * To get advanced features and support with Blocto.
   *
   * https://docs.blocto.app/blocto-sdk/register-app-id
   */
  appId?: string;

  /**
   * If true, the wallet will be tagged as "reccomended" in ConnectWallet Modal
   */
  recommended?: boolean;
};

export const bloctoWallet = (
  options?: BloctoAdditionalOptions,
): WalletConfig<BloctoWallet> => ({
  id: BloctoWallet.id,
  recommended: options?.recommended,
  meta: {
    ...BloctoWallet.meta,
    iconURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik00NC4xNTE0IDI2LjM1NjJDMzguODg4MiAyNi4zNTYyIDMzLjc1MDggMjguMzg1NiAyOS45MTAzIDMxLjk4NTdDMjUuNjk3OSAzNS45MzU0IDIzLjAzMjEgNDEuNzY4NCAyMS41MDQgNDcuMjU1NEMyMC41MDMyIDUwLjg0NjEgMjAuMDAxOCA1NC41NzAyIDIwLjAwMTggNTguMjk2QzIwLjAwMTggNTkuNDIyNyAyMC4wNDggNjAuNTQwMSAyMC4xMzY5IDYxLjY0NDVDMjAuMjQ2IDYyLjk4NzUgMjEuNTU0IDYzLjkxODEgMjIuODU2MyA2My41NjY2QzIzLjk5MjIgNjMuMjYxMyAyNS4xODczIDYzLjA5NjcgMjYuNDE5NCA2My4wOTY3QzI4Ljk1MDIgNjMuMDk2NyAzMS4zMjE5IDYzLjc4NDkgMzMuMzU1IDY0Ljk4NzRDMzMuNDA0OSA2NS4wMTcgMzMuNDUzIDY1LjA0NjYgMzMuNTAyOSA2NS4wNzQzQzM2LjgwNyA2Ny4wNDQ2IDQwLjcwNDkgNjguMTI2OCA0NC44NjE4IDY3Ljk4ODFDNTUuNzA0NSA2Ny42MjkxIDY0LjU2MjEgNTguODA2NiA2NC45NjE4IDQ3Ljk2NTdDNjUuMzk4NCAzNi4xMDU2IDU1LjkxNTMgMjYuMzU0NCA0NC4xNTMzIDI2LjM1NDRMNDQuMTUxNCAyNi4zNTYyWk00NC4xNTE0IDU2LjY5NEMzOC44OTU2IDU2LjY5NCAzNC42MzUyIDUyLjQzMzUgMzQuNjM1MiA0Ny4xNzk2QzM0LjYzNTIgNDEuOTI1NiAzOC44OTU2IDM3LjY2MzIgNDQuMTUxNCAzNy42NjMyQzQ5LjQwNzIgMzcuNjYzMiA1My42Njc3IDQxLjkyMzggNTMuNjY3NyA0Ny4xNzk2QzUzLjY2NzcgNTIuNDM1MiA0OS40MDcyIDU2LjY5NCA0NC4xNTE0IDU2LjY5NFoiIGZpbGw9IiMxNEFBRkYiLz4KPHBhdGggZD0iTTM1LjU4OTcgMTkuNzk1OEMzNS41ODk3IDIyLjUzOTMgMzQuMTUyNCAyNS4wODQ4IDMxLjc5MTggMjYuNDgzNEMzMC4zMDk5IDI3LjM2MjIgMjguOTIwNiAyOC40IDI3LjY2MjYgMjkuNTgyMUMyNC44NzExIDMyLjE5OCAyMi43ODc5IDM1LjQwNzggMjEuMjQ1MSAzOC41ODk3QzIwLjk0MTcgMzkuMjE2OCAyMCAzOC45OTQ5IDIwIDM4LjI5NzRWMTkuNzk1OEMyMCAxNS40OTA5IDIzLjQ5MDkgMTIgMjcuNzk1OCAxMkMzMi4xMDA3IDEyIDM1LjU5MTYgMTUuNDkwOSAzNS41OTE2IDE5Ljc5NThIMzUuNTg5N1oiIGZpbGw9IiMwMDc1RkYiLz4KPC9zdmc+Cg==",
  },
  create(walletOptions: WalletOptions) {
    return new BloctoWallet({
      ...walletOptions,
      ...options,
    });
  },
  isInstalled() {
    return false;
  },
});
