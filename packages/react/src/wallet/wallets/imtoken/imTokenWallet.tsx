import type {
  WalletOptions,
  WalletConfig,
  ConnectUIProps,
} from "@thirdweb-dev/react-core";
import { ImTokenWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { ExtensionOrWCConnectionUI } from "../_common/ExtensionORWCConnectionUI";

const imTokenWalletUris = {
  ios: "https://itunes.apple.com/us/app/imtoken2/id1384798940",
  android: "https://play.google.com/store/apps/details?id=im.token.app",
};

export type ImTokenWalletConfigOptions = {
  projectId?: string;
  recommended?: boolean;
};

export const imTokenWallet = (
  options?: ImTokenWalletConfigOptions,
): WalletConfig<ImTokenWallet> => {
  return {
    id: ImTokenWallet.id,
    recommended: options?.recommended,
    meta: {
      ...ImTokenWallet.meta,
      iconURL:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzIyMl80NzgzKSI+CjxtYXNrIGlkPSJtYXNrMF8yMjJfNDc4MyIgc3R5bGU9Im1hc2stdHlwZTpsdW1pbmFuY2UiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+CjxwYXRoIGQ9Ik03OS44OTQ4IDBIMC4wNTA3ODEyVjgwSDc5Ljg5NDhWMFoiIGZpbGw9IndoaXRlIi8+CjwvbWFzaz4KPGcgbWFzaz0idXJsKCNtYXNrMF8yMjJfNDc4MykiPgo8cGF0aCBkPSJNNjIuMDI3NSAwSDE4LjA1MDlDOC4xNDYzOSAwIDAuMTE3MTg4IDguMDQ0ODggMC4xMTcxODggMTcuOTY4OFY2Mi4wMzEyQzAuMTE3MTg4IDcxLjk1NTEgOC4xNDYzOSA4MCAxOC4wNTA5IDgwSDYyLjAyNzVDNzEuOTMyIDgwIDc5Ljk2MTIgNzEuOTU1MSA3OS45NjEyIDYyLjAzMTJWMTcuOTY4OEM3OS45NjEyIDguMDQ0ODggNzEuOTMyIDAgNjIuMDI3NSAwWiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzIyMl80NzgzKSIvPgo8cGF0aCBkPSJNNjUuMDk4MSAyNC43MzNDNjYuNzU4NiA0Ny4yNjY3IDUyLjMwMjEgNTcuOTE3MiAzOS4zNDIzIDU5LjA1M0MyNy4yOTM1IDYwLjEwODcgMTUuOTUyIDUyLjY5MDggMTQuOTU3MSA0MS4yOTM2QzE0LjEzNjMgMzEuODc3NiAxOS45NDQ1IDI3Ljg2ODkgMjQuNTA4IDI3LjQ2OTRDMjkuMjAxNSAyNy4wNTcgMzMuMTQ1OCAzMC4zMDAxIDMzLjQ4NzkgMzQuMjI2OUMzMy44MTc1IDM4LjAwMiAzMS40NjY0IDM5LjcyMDUgMjkuODMxMyAzOS44NjM0QzI4LjUzODIgMzkuOTc3IDI2LjkxMTQgMzkuMTkwNSAyNi43NjQ1IDM3LjUwMTZDMjYuNjM4NSAzNi4wNTAzIDI3LjE4ODUgMzUuODUyNiAyNy4wNTQxIDM0LjMxMDlDMjYuODE0OSAzMS41NjYyIDI0LjQyNjEgMzEuMjQ2NiAyMy4xMTgzIDMxLjM2MDFDMjEuNTM1NyAzMS40OTkxIDE4LjY2NDEgMzMuMzQ5OCAxOS4wNjcgMzcuOTZDMTkuNDcyMiA0Mi42MTAxIDIzLjkyMjIgNDYuMjg0NSAyOS43NTU3IDQ1Ljc3MzRDMzYuMDUwOSA0NS4yMjIzIDQwLjQzMzcgNDAuMzExNCA0MC43NjM0IDMzLjQyMzRDNDAuNzYwMyAzMy4wNTg2IDQwLjgzNyAzMi42OTc1IDQwLjk4OCAzMi4zNjU1TDQwLjk5IDMyLjM1NzJDNDEuMDU3OCAzMi4yMTI4IDQxLjEzNzIgMzIuMDc0MiA0MS4yMjcyIDMxLjk0MjhDNDEuMzYxNiAzMS43NDA5IDQxLjUzMzggMzEuNTE4IDQxLjc1NjIgMzEuMjczOUM0MS43NTgzIDMxLjI2NzYgNDEuNzU4MyAzMS4yNjc2IDQxLjc2MjYgMzEuMjY3NkM0MS45MjQxIDMxLjA4NDcgNDIuMTE5NCAzMC44ODcgNDIuMzM5NyAzMC42NzQ1QzQ1LjA4OTcgMjguMDc1IDU0Ljk5MzEgMjEuOTQ0MiA2NC4zNTkyIDIzLjg4NTVDNjQuNTU3MyAyMy45MjggNjQuNzM2MSAyNC4wMzM0IDY0Ljg2OTMgMjQuMTg2MkM2NS4wMDI1IDI0LjMzOTEgNjUuMDgyNiAyNC41MzA4IDY1LjA5ODEgMjQuNzMzWiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8L2c+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjIyXzQ3ODMiIHgxPSI3My41MDA5IiB5MT0iNS4zMTI1IiB4Mj0iMi44NzI0MSIgeTI9Ijc3LjY3NDciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzExQzREMSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDYyQUQiLz4KPC9saW5lYXJHcmFkaWVudD4KPGNsaXBQYXRoIGlkPSJjbGlwMF8yMjJfNDc4MyI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4=",
    },
    create: (walletOptions: WalletOptions) => {
      const wallet = new ImTokenWallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: false,
      });

      return wallet;
    },
    connectUI: ConnectUI,
    isInstalled: isInstalled,
  };
};

function isInstalled() {
  if (assertWindowEthereum(globalThis.window)) {
    return !!globalThis.window.ethereum.isImToken;
  }
  return false;
}

function ConnectUI(props: ConnectUIProps<ImTokenWallet>) {
  const locale = useTWLocale();
  return (
    <ExtensionOrWCConnectionUI
      connect={props.connect}
      connected={props.connected}
      createWalletInstance={props.createWalletInstance}
      goBack={props.goBack}
      meta={props.walletConfig.meta}
      setConnectedWallet={(w) => props.setConnectedWallet(w as ImTokenWallet)}
      setConnectionStatus={props.setConnectionStatus}
      supportedWallets={props.supportedWallets}
      walletConnectUris={{
        ios: imTokenWalletUris.ios,
        android: imTokenWalletUris.android,
        other: imTokenWalletUris.android,
      }}
      walletLocale={locale.wallets.imTokenWallet}
      isInstalled={isInstalled}
    />
  );
}
