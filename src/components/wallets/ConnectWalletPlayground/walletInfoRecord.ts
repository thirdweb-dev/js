import {
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  embeddedWallet,
  trustWallet,
  zerionWallet,
  phantomWallet,
  bloctoWallet,
  frameWallet,
  rainbowWallet,
  WalletConfig,
} from "@thirdweb-dev/react";
import type { WalletId as AnyWalletId } from "thirdweb/wallets";

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
  code: (isReccomended?: boolean) => string;
  component: WalletConfig<any>;
  import: string;
  type?: "social" | "eoa" | "guest";
  id?: AnyWalletId;
};

export type WalletId =
  | "MetaMask"
  | "Coinbase"
  | "WalletConnect"
  // | "Safe"
  // | "Guest Mode"
  | "Email Wallet"
  | "Trust"
  | "Zerion"
  // | "Magic Link"
  // | "Blocto"
  // | "Frame"
  | "Rainbow"
  | "Phantom";

type WalletInfoRecord = Record<WalletId, WalletInfo>;

export const walletInfoRecord: WalletInfoRecord = {
  MetaMask: {
    code: (isReccomended) =>
      isReccomended
        ? "metamaskWallet({ recommended: true })"
        : "metamaskWallet()",
    component: metamaskWalletConfig,
    import: "metamaskWallet",
    type: "eoa",
    id: "io.metamask",
  },
  Coinbase: {
    code: (isReccomended) =>
      isReccomended
        ? "coinbaseWallet({ recommended: true })"
        : "coinbaseWallet()",
    component: coinbaseWalletConfig,
    import: "coinbaseWallet",
    type: "eoa",
    id: "com.coinbase.wallet",
  },
  WalletConnect: {
    code: (isReccomended) =>
      isReccomended
        ? "walletConnect({ recommended: true })"
        : "walletConnect()",
    component: walletConnectConfig,
    import: "walletConnect",
    type: "eoa",
  },
  Trust: {
    code: (isReccomended) =>
      isReccomended ? "trustWallet({ recommended: true })" : "trustWallet()",
    component: trustWalletConfig,
    import: "trustWallet",
    type: "eoa",
    id: "com.trustwallet.app",
  },
  Rainbow: {
    code: (isReccomended) =>
      isReccomended
        ? "rainbowWallet({ recommended: true })"
        : "rainbowWallet()",
    component: rainbowWalletConfig,
    import: "rainbowWallet",
    type: "eoa",
    id: "me.rainbow",
  },
  Zerion: {
    code: (isReccomended) =>
      isReccomended ? "zerionWallet({ recommended: true })" : "zerionWallet()",
    component: zerionWalletConfig,
    import: "zerionWallet",
    type: "eoa",
    id: "io.zerion.wallet",
  },
  Phantom: {
    code: (isReccomended) =>
      isReccomended
        ? "phantomWallet({ recommended: true })"
        : "phantomWallet()",
    component: phantomConfig,
    import: "phantomWallet",
    type: "eoa",
    id: "app.phantom",
  },
  // "Guest Mode": {
  //   code: () => `localWallet()`,
  //   component: localWallet(),
  //   import: "localWallet",
  //   type: "guest",
  // },
  "Email Wallet": {
    code: (isReccomended) =>
      isReccomended ? "inAppWallet({ recommended: true })" : "inAppWallet()",
    component: embeddedWallet(),
    import: "inAppWallet",
    type: "social",
  },
  // Safe: {
  //   code: () => "safeWallet()",
  //   component: safeWallet({
  //     personalWallets: [metamaskWallet(), coinbaseWallet(), walletConnect()],
  //   }),
  //   import: "safeWallet",
  //   type: "eoa",
  //   id: "global.safe",
  // },
  // "Magic Link": {
  //   code(isReccomended) {
  //     return isReccomended
  //       ? `magicLink({ recommended: true, apiKey: "YOUR_MAGIC_API_KEY", oauthOptions: { providers: ["google", "facebook", "twitter", "apple"] }})`
  //       : `magicLink({ apiKey: "YOUR_MAGIC_API_KEY", oauthOptions: { providers: ["google", "facebook", "twitter", "apple"] }})`;
  //   },
  //   component: magicLink({
  //     apiKey: "pk_live_3EFC32B01A29985C",
  //     oauthOptions: {
  //       providers: ["google", "facebook", "twitter", "apple"],
  //     },
  //   }),
  //   import: "magicLink",
  //   type: "social",
  // },
  // Blocto: {
  //   code(isReccomended) {
  //     return isReccomended
  //       ? "bloctoWallet({ recommended: true })"
  //       : "bloctoWallet()";
  //   },
  //   component: bloctoWalletConfig,
  //   import: "bloctoWallet",
  //   type: "eoa",
  // },
  // Frame: {
  //   code(isReccomended) {
  //     return isReccomended
  //       ? "frameWallet({ recommended: true })"
  //       : "frameWallet()";
  //   },
  //   component: frameWalletConfig,
  //   import: "frameWallet",
  //   type: "eoa",
  // },
};
