import { NFTCollection, NFTMetadataOrUri, SDKOptions, Token } from "@thirdweb-dev/sdk";
import { AbstractClientWallet } from "@thirdweb-dev/wallets";
import { Signer } from 'ethers';

type WebhookParams = {
  rawBody: Buffer;
  headers: {[key: string]: any}
  shopifyAdminUrl: string;
  shopifyAccessToken: string;
  gaslessRelayerUrl?: string;
  webhookSecret: string;
  signerOrWallet: Signer | AbstractClientWallet;
  chain: string;
}

type StandardFunctionParams = {
  signerOrWallet: Signer | AbstractClientWallet;
  chain: string;
  receiver: string;
  waitForResponse?: boolean;
  sdkOptions?: SDKOptions;
}

export type RewardTokensWebhookParams = WebhookParams & {
  tokenContractAddress: string;
  rewardAmount: number;
};

export type RewardTokensParams = StandardFunctionParams & {
  tokenContractAddress: string;
  rewardAmount: number;
}

export type SendTokensParams = {
  tokenContract: Token; 
  receiver: string; 
  rewardAmount: number;
}

export type IssueDigitalReceiptWebhookParams = WebhookParams & {
  receiptContractAddress: string;
}

export type IssueDigitalReceiptParams = StandardFunctionParams & {
  receiptContractAddress: string;
  metadata: NFTMetadataOrUri;
}

export type SendReceiptParams = {
  receiptContract: NFTCollection;
  receiver: string;
  metadata: NFTMetadataOrUri;
}

export type RedeemDiscountCodeParams = StandardFunctionParams & {
  tokenContractAddress: string;
  requiredPoints: number;
  discountPercentage: number;
  shopifyAdminUrl: string;
  shopifyAccessToken: string;
}

export type RedeemPointsParams = {
  tokenContract: Token;
  receiver: string;
  quantity: number;
}