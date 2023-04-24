import type { AbstractClientWallet } from "@thirdweb-dev/wallets";

export type WalletMeta = {
  id: string;
  meta: (typeof AbstractClientWallet)["meta"];
  installed: boolean;
  onClick: () => Promise<void>;
};
