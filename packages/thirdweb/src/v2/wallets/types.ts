import type { ThirdwebClient } from "../../client/client.js";
import type { GetBalanceResult } from "../../extensions/erc20/read/getBalance.js";
import type { Profile } from "../../wallets/in-app/core/authentication/types.js";
import type { Ecosystem } from "../../wallets/in-app/core/wallet/types.js";

export type BaseLoginOptions = {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
};

export type UserWallet = {
  client: ThirdwebClient;
  address: string;
  authToken: string;
  getBalance: (options: { chainId: number }) => Promise<GetBalanceResult>;
  getProfiles: () => Promise<Profile[]>;
};
