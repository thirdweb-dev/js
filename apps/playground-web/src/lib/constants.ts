import { createWallet } from "thirdweb/wallets";

export const metadataBase = process.env.VERCEL_ENV
  ? new URL("https://playground.thirdweb.com")
  : undefined;

const getDomain = () => {
  if (process.env.VERCEL_ENV === "production") {
    return "thirdweb.com";
  }
  if (process.env.VERCEL_ENV === "preview") {
    return "thirdweb-preview.com";
  }
  return undefined;
};

export const WALLETS = [
  createWallet("inApp", {
    auth: {
      options: [
        "google",
        "discord",
        "telegram",
        "email",
        "passkey",
        "phone",
        "farcaster",
        "line",
      ],
      required: ["email"],
      mode: "redirect",
      passkeyDomain: getDomain(),
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("io.rabby"),
  createWallet("com.trustwallet.app"),
];
