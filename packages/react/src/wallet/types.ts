import { SupportedWallet } from "@thirdweb-dev/react-core";

export type WalletMeta = {
  id: SupportedWallet["id"];
  name: string;
  iconURL: string;
  installed: boolean;
  onClick: () => Promise<void>;
};
