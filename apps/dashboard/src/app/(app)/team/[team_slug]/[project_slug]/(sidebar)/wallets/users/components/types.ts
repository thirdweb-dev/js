export interface UserSearchResult {
  userId: string;
  walletAddress: string;
  email?: string;
  phone?: string;
  createdAt: string;
  linkedAccounts: {
    type: string;
    details: {
      phone?: string;
      email?: string;
      address?: string;
      id?: string;
      [key: string]: unknown;
    };
  }[];
}

export type SearchType = "email" | "phone" | "id" | "address";

export interface SearchParams {
  queryBy: SearchType | "walletAddress";
  email?: string;
  phone?: string;
  id?: string;
  walletAddress?: string;
}
