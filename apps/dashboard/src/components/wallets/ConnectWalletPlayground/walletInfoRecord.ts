import {
  type WalletConfig,
  bloctoWallet,
  coinbaseWallet,
  embeddedWallet,
  frameWallet,
  metamaskWallet,
  phantomWallet,
  rainbowWallet,
  trustWallet,
  walletConnect,
  zerionWallet,
} from "@thirdweb-dev/react";

const metamaskWalletConfig = metamaskWallet();
const walletConnectConfig = walletConnect();
const coinbaseWalletConfig = coinbaseWallet();
const bloctoWalletConfig = bloctoWallet();
const frameWalletConfig = frameWallet();
const trustWalletConfig = trustWallet();
const rainbowWalletConfig = rainbowWallet();

const zerionWalletConfig = zerionWallet();
const phantomConfig = phantomWallet();

export const hideUIForWalletIds = new Set([
  metamaskWalletConfig.id,
  coinbaseWalletConfig.id,
  bloctoWalletConfig.id,
  frameWalletConfig.id,
  phantomConfig.id,
]);

export const hideUIForWalletIdsMobile = new Set([
  zerionWalletConfig.id,
  rainbowWalletConfig.id,
  trustWalletConfig.id,
]);

type WalletInfo = {
  code: string;
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  component: WalletConfig<any>;
  import: string;
  type?: "social" | "eoa";
};

export type WalletId =
  | "MetaMask"
  | "Coinbase"
  | "WalletConnect"
  | "Email Wallet"
  | "Trust"
  | "Zerion"
  | "Rainbow"
  | "Phantom";

type WalletInfoRecord = Record<WalletId, WalletInfo>;

export const walletInfoRecord: WalletInfoRecord = {
  MetaMask: {
    code: `createWallet("io.metamask")`,
    component: metamaskWalletConfig,
    import: "createWallet",
    type: "eoa",
  },
  Coinbase: {
    code: `createWallet("com.coinbase.wallet")`,
    component: coinbaseWalletConfig,
    import: "createWallet",
    type: "eoa",
  },
  WalletConnect: {
    code: "walletConnect()",
    component: walletConnectConfig,
    import: "walletConnect",
    type: "eoa",
  },
  Trust: {
    code: `createWallet("com.trustwallet.app")`,
    component: trustWalletConfig,
    import: "createWallet",
    type: "eoa",
  },
  Rainbow: {
    code: `createWallet("me.rainbow")`,
    component: rainbowWalletConfig,
    import: "createWallet",
    type: "eoa",
  },
  Zerion: {
    code: `createWallet("io.zerion.wallet")`,
    component: zerionWalletConfig,
    import: "createWallet",
    type: "eoa",
  },
  Phantom: {
    code: `createWallet("app.phantom")`,
    component: phantomConfig,
    import: "createWallet",
    type: "eoa",
  },
  "Email Wallet": {
    code: "inAppWallet()",
    component: embeddedWallet(),
    import: "inAppWallet",
    type: "social",
  },
};
