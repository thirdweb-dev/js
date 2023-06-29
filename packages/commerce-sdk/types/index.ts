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
  fromWebhook?: boolean;
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

export type issueDigitalReceiptWebhookParams = WebhookParams & {
  receiptContractAddress: string;
}

export type issueDigitalReceiptParams = StandardFunctionParams & {
  receiptContractAddress: string;
  metadata: NFTMetadataOrUri;
}

export type SendReceiptParams = {
  receiptContract: NFTCollection;
  receiver: string;
  metadata: NFTMetadataOrUri;
}