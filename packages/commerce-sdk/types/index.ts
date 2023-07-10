import { NFTCollection, NFTMetadataOrUri, SDKOptions, SmartContract } from "@thirdweb-dev/sdk";
import { AbstractClientWallet } from "@thirdweb-dev/wallets";
import { BaseContract, Signer } from 'ethers';

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
  loyaltyPointsContractAddress: string;
  rewardAmount: number;
};

export type RewardTokensParams = StandardFunctionParams & {
  loyaltyPointsContractAddress: string;
  rewardAmount: number;
}

export type SendTokensParams = {
  tokenContract: SmartContract<BaseContract>;
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
  loyaltyPointsContractAddress: string;
  requiredPoints: number;
  discountPercentage: number;
  shopifyAdminUrl: string;
  shopifyAccessToken: string;
}

export type RedeemPointsParams = {
  tokenContract: SmartContract<BaseContract>
  receiver: string;
  quantity: number;
}