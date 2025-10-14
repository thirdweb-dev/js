export type SolanaWallet = {
  id: string;
  publicKey: string;
  metadata: {
    type: string;
    projectId: string;
    label?: string;
  };
  createdAt: string;
  updatedAt: string;
};
