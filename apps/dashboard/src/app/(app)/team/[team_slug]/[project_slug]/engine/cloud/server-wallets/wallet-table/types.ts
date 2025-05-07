export type Wallet = {
  id: string;
  address: string;
  metadata: {
    type: string;
    projectId: string;
    label?: string;
  };
  createdAt: string;
  updatedAt: string;
};
