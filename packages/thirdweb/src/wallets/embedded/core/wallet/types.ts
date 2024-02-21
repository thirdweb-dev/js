import type { ThirdwebClient } from "../../../../client/client.js";

export type EmbeddedWalletConfig = {
  client: ThirdwebClient;
};

export type AuthenticatedUser = {
  email: string | undefined;
  walletAddress: string;
};
