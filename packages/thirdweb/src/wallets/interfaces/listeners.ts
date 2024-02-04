export type WalletEventListener = {
  (event: "accountsChanged", listener: (accounts: string[]) => void): void;
  (event: "chainChanged", listener: (chainId: string) => void): void;
  (event: "disconnect", listener: () => void): void;
};

export type WalletEvents = {
  addListener: WalletEventListener;
  removeListener: WalletEventListener;
};
