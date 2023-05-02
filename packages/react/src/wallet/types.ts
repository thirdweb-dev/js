import { Wallet } from "@thirdweb-dev/react-core";

export type WalletInfo = {
  wallet: Wallet;
  installed: boolean;
  connect: () => Promise<void>;
};
