export type CheckoutParams = {
  chainId: string;
  recipientAddress: string;
  tokenAddress: string;
  amount: string;
  name?: string;
  image?: string;
  theme?: "light" | "dark";
  redirectUri?: string;
  clientId?: string;
};
