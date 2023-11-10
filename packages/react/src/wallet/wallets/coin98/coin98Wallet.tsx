import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { Coin98Wallet, getInjectedCoin98Provider } from "@thirdweb-dev/wallets";
import { Coin98ConnectUI } from "./Coin98ConnectUI";

type Coin98WalletOptions = {
  /**
   * When connecting Coin98 using the QR Code - Wallet Connect connector is used which requires a project id.
   * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;

  /**
   * If true, the wallet will be tagged as "reccomended" in ConnectWallet Modal
   */
  recommended?: boolean;
};

export const coin98Wallet = (
  options?: Coin98WalletOptions,
): WalletConfig<Coin98Wallet> => {
  return {
    id: Coin98Wallet.id,
    recommended: options?.recommended,
    meta: {
      name: "Coin98 Wallet",
      urls: {
        chrome:
          "https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg",
        android:
          "https://play.google.com/store/apps/details?id=coin98.crypto.finance.media",
        ios: "https://apps.apple.com/us/app/coin98-super-wallet/id1561969966",
      },
      iconURL:
        "data:image/png;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHZpZXdCb3g9IjAgMCA3MCA3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTU3LjIxODMgMEwxMi43ODE3IDBDNS42OTE4NyAwIDAgNS42OTE4NyAwIDEyLjc4MTdMMCA1Ny4yMTgzQzAgNjQuMzA4MSA1LjY5MTg3IDcwIDEyLjc4MTcgNzBINTcuMjE4M0M2NC4yMDgzIDcwIDcwIDY0LjMwODEgNzAgNTcuMjE4M1YxMi43ODE3QzcwIDUuNjkxODcgNjQuMzA4MSAwIDU3LjIxODMgMFpNNDYuNDMzNyAxNy40NzVDNTEuNjI2MiAxNy40NzUgNTUuODIwMyAyMS42NjkgNTUuODIwMyAyNi44NjE2QzU1LjgyMDMgMjguNDU5MyA1NS40MjA4IDI5Ljk1NzIgNTQuNzIxOCAzMS4zNTUyQzUzLjUyMzUgMzAuNDU2NSA1Mi4yMjU0IDI5LjY1NzYgNTAuODI3NCAyOS4xNTgzQzUxLjIyNjggMjguNDU5MyA1MS40MjY1IDI3LjY2MDUgNTEuNDI2NSAyNi44NjE2QzUxLjQyNjUgMjQuMTY1NSA0OS4yMjk3IDIxLjk2ODYgNDYuNTMzNSAyMS45Njg2QzQzLjgzNzQgMjEuOTY4NiA0MS42NDA1IDI0LjE2NTUgNDEuNjQwNSAyNi44NjE2QzQxLjY0MDUgMjcuNjYwNSA0MS44NDAyIDI4LjQ1OTMgNDIuMjM5NyAyOS4xNTgzQzQwLjg0MTcgMjkuNjU3NiAzOS40NDM3IDMwLjM1NjYgMzguMzQ1MiAzMS4zNTUyQzM3LjU0NjQgMjkuOTU3MiAzNy4yNDY4IDI4LjQ1OTMgMzcuMjQ2OCAyNi44NjE2QzM3LjA0NzEgMjEuNjY5IDQxLjI0MTEgMTcuNDc1IDQ2LjQzMzcgMTcuNDc1Wk0yMy41NjYzIDUyLjUyNUMxOC4zNzM4IDUyLjUyNSAxNC4xNzk3IDQ4LjMzMSAxNC4xNzk3IDQzLjEzODRIMTguNjczM0MxOC42NzMzIDQ1LjgzNDUgMjAuODcwMiA0OC4wMzE0IDIzLjU2NjMgNDguMDMxNEMyNi4yNjI1IDQ4LjAzMTQgMjguNDU5MyA0NS44MzQ1IDI4LjQ1OTMgNDMuMTM4NEgzMi45NTI5QzMyLjk1MjkgNDguMzMxIDI4Ljc1ODkgNTIuNTI1IDIzLjU2NjMgNTIuNTI1Wk0yMy41NjYzIDM5LjM0MzhDMTcuNTc0OSAzOS4zNDM4IDEyLjY4MTkgMzQuNDUwOCAxMi42ODE5IDI4LjQ1OTNDMTIuNjgxOSAyMi40Njc5IDE3LjU3NDkgMTcuNDc1IDIzLjU2NjMgMTcuNDc1QzI5LjU1NzggMTcuNDc1IDM0LjU1MDYgMjIuMzY4IDM0LjU1MDYgMjguNDU5M0MzNC40NTA4IDM0LjQ1MDggMjkuNTU3OCAzOS4zNDM4IDIzLjU2NjMgMzkuMzQzOFpNNDYuNDMzNyA1Mi41MjVDNDAuNDQyMiA1Mi41MjUgMzUuNDQ5NCA0Ny42MzIgMzUuNDQ5NCA0MS42NDA1QzM1LjQ0OTQgMzUuNTQ5MiA0MC4zNDI0IDMwLjY1NjIgNDYuNDMzNyAzMC42NTYyQzUyLjQyNTEgMzAuNjU2MiA1Ny4zMTgxIDM1LjU0OTIgNTcuMzE4MSA0MS42NDA1QzU3LjMxODEgNDcuNjMyIDUyLjQyNTEgNTIuNTI1IDQ2LjQzMzcgNTIuNTI1Wk01Mi45MjQ0IDQxLjU0MDdDNTIuOTI0NCA0NS4xMzU1IDUwLjAyODUgNDcuOTMxNSA0Ni40MzM3IDQ3LjkzMTVDNDIuODM4OCA0Ny45MzE1IDM5Ljk0MjkgNDUuMDM1NyAzOS45NDI5IDQxLjU0MDdDMzkuOTQyOSAzNy45NDU4IDQyLjgzODggMzUuMDQ5OSA0Ni40MzM3IDM1LjA0OTlDNTAuMDI4NSAzNS4xNDk4IDUyLjkyNDQgMzguMDQ1NiA1Mi45MjQ0IDQxLjU0MDdaTTI5Ljk1NzIgMjguNDU5M0MyOS45NTcyIDMyLjA1NDIgMjcuMDYxMyAzNC45NTAxIDIzLjQ2NjUgMzQuOTUwMUMxOS44NzE2IDM0Ljk1MDEgMTYuOTc1NyAzMi4wNTQyIDE2Ljk3NTcgMjguNDU5M0MxNi45NzU3IDI0Ljg2NDUgMTkuODcxNiAyMS45Njg2IDIzLjQ2NjUgMjEuOTY4NkMyNy4xNjEyIDIxLjk2ODYgMjkuOTU3MiAyNC44NjQ1IDI5Ljk1NzIgMjguNDU5M1oiIGZpbGw9IiNEOUI0MzIiLz4KPC9zdmc+Cg==",
    },
    create: (walletOptions: WalletOptions) => {
      const wallet = new Coin98Wallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: false,
      });

      return wallet;
    },
    connectUI: Coin98ConnectUI,
    isInstalled() {
      return !!getInjectedCoin98Provider();
    },
  };
};
