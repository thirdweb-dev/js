import { createWallet } from "thirdweb/wallets";

export const metadataBase = process.env.VERCEL_ENV
  ? new URL("https://playground.thirdweb.com")
  : undefined;

export const WALLETS = [
  createWallet("inApp", {
    auth: {
      options: [
        "google",
        "discord",
        "apple",
        "email",
        "passkey",
        "phone",
        "farcaster",
      ],
      mode: "redirect",
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("com.trustwallet.app"),
];
