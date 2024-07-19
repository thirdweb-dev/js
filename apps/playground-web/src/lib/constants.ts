import { createWallet } from "thirdweb/wallets";

export const metadataBase = process.env.VERCEL_ENV
  ? new URL("https://playground.thirdweb.com")
  : undefined;

export const WALLETS = [
  createWallet("inApp", {
    auth: {
      options: [
        "google",
        "facebook",
        "discord",
        "apple",
        "email",
        "passkey",
        "phone",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("com.trustwallet.app"),
];
