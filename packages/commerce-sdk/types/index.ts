import { SDKOptions } from "@thirdweb-dev/sdk";
import { AbstractClientWallet } from "@thirdweb-dev/wallets";
import { Signer } from 'ethers';

export type LoyaltyRewardsParams = {
  signerOrWallet: Signer | AbstractClientWallet;
  body: Record<string, unknown>;
  headers: {[key: string]: any}
  webhookSecret: string;
  tokenContractAddress: string;
  gaslessRelayerUrl?: string;
  chain: string;
  rewardAmount: number;
  shopifyAdminUrl: string;
  shopifyAccessToken: string;
};

export type RewardTokensParams = {
  signerOrWallet: Signer | AbstractClientWallet;
  wallet: string;
  tokenContractAddress: string;
  rewardAmount: number;
  chain: string;
  sdkOptions?: SDKOptions;
}

export interface ShopifyFetchParams {
  shopifyAdminUrl: string;
  shopifyAccessToken: string;
  query: string;
  variables?: Record<string, unknown>;
}

export interface ShopifyFetchResult {
  status: number;
  body?: any;
  error?: string;
}

export type ResponseBody = {
  data: {
    order: {
      id: string;
      tags: string[];
      lineItems: {
        edges: {
          node: {
            id: string;
            quantity: number;
            variant: {
              id: string;
              price: {
                amount: number;
              };
              product: {
                id: string;
                title: string;
                description: string;
                featuredImage: {
                  id: string;
                  url: string;
                };
              }
            };
            customAttributes: {
              key: string;
              value: string;
            }[];
          };
        }[];
      };
    };
  };
};