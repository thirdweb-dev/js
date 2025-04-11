export type Wallet = {
  id: string;
  address: string;
  metadata: {
    type: string;
    projectId: string;
    name?: string;
  };
  createdAt: string;
  updatedAt: string;
};
