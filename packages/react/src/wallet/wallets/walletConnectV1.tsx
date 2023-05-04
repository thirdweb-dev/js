import { WalletConnectV1 } from "@thirdweb-dev/wallets";
import { ConfiguredWallet, WalletOptions } from "@thirdweb-dev/react-core";

export const walletConnectV1 = () => {
  const configuredWallet = {
    id: WalletConnectV1.id,
    meta: {
      name: "WalletConnect",
      iconURL:
        "ipfs://QmX58KPRaTC9JYZ7KriuBzeoEaV2P9eZcA3qbFnTHZazKw/wallet-connect.svg",
    },
    create: (options: WalletOptions) =>
      new WalletConnectV1({ ...options, qrcode: true }),
  } satisfies ConfiguredWallet<WalletConnectV1>;

  return configuredWallet;
};
