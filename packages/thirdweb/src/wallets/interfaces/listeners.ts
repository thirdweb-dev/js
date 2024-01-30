export type AddListener = {
  (event: "accountsChanged", listener: (accounts: string[]) => void): void;
  (event: "chainChanged", listener: (chainId: bigint | number) => void): void;
  (event: "disconnect", listener: () => void): void;
};

export type RemoveListener = AddListener;
