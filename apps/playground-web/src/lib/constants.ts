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

// const getEcosystem = () => {
//   if (process.env.NEXT_PUBLIC_IN_APP_WALLET_URL?.endsWith(".thirdweb.com")) {
//     // prod ecosystem
//     return "ecosystem.new-age";
//   }
//   // dev ecosystem
//   return "ecosystem.bonfire-development";
// };

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
      mode: "redirect",
      passkeyDomain: getDomain(),
    },
  }),
  // ecosystemWallet(getEcosystem()), TODO put this in its own section
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("io.rabby"),
  createWallet("com.trustwallet.app"),
];
