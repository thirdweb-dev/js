export type WalletMeta = {
  id: string;
  name: string;
  iconURL: string;
  installed: boolean;
  onClick: () => Promise<void>;
};
