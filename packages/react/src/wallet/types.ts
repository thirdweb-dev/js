export type WalletMeta = {
  id: SupportedWallet["id"];
  name: string;
  icon: JSX.Element;
  installed: boolean;
  onClick: () => Promise<void>;
};
