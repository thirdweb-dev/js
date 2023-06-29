import { SDKOptions, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { AbstractClientWallet } from "@thirdweb-dev/wallets";
import { createHmac } from "crypto";
import { ContractTransaction, Signer } from "ethers";
import { Readable } from "stream";
import { RedeemPointsParams, SendReceiptParams, SendTokensParams } from "../../types";
import { ShopifyFetchParams, ShopifyFetchResult } from "../../types/shopify";

export async function getSdkInstance (signerOrWallet: Signer | AbstractClientWallet, chain: string, sdkOptions?: SDKOptions) {
  let sdk = undefined;
  if (signerOrWallet instanceof Signer) {
    sdk = ThirdwebSDK.fromSigner(
      signerOrWallet,
      chain,
      sdkOptions,
    );
  } else if (signerOrWallet instanceof AbstractClientWallet) {
    sdk = await ThirdwebSDK.fromWallet(
      signerOrWallet,
      chain,
      sdkOptions,
    );
  }
  return sdk;
}

export async function getNextJsRawBody(readable: Readable): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function shopifyFetchAdminAPI(params: ShopifyFetchParams) {
  const endpoint = params.shopifyAdminUrl;
  const key = params.shopifyAccessToken;

  return fetchFromShopify(params, endpoint, {
    "X-Shopify-Access-Token": key,
  });
}

export async function shopifyFetch(params: ShopifyFetchParams) {
  const endpoint = params.shopifyAdminUrl;
  const key = params.shopifyAccessToken;

  return fetchFromShopify(params, endpoint, {
    "Shopify-Storefront-Private-Token": key,
  });
}

async function fetchFromShopify(
  { query, variables }: ShopifyFetchParams,
  endpoint: string,
  headers: Record<string, string>,
): Promise<ShopifyFetchResult> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();

    return {
      status: response.status,
      body: data,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      status: 500,
      error: "Error receiving data",
    };
  }
}

export function verifyWebhook(data: any, headers: {[key: string]: any}, secret: string): boolean {
    const hmacHeader = headers['x-shopify-hmac-sha256'];
    if (!hmacHeader) {
      throw new Error("Bad request - missing HMAC header");
    }

    const hmac = createHmac('sha256', secret);
    const digest = hmac.update(data).digest('base64');

    return Buffer.from(digest).toString() === hmacHeader;
}

export async function sendTokensSync({
  tokenContract,
  receiver,
  rewardAmount,
}: SendTokensParams): Promise<ContractTransaction["hash"]> {
  const tx = await tokenContract.erc20.transfer(receiver, rewardAmount);
  console.log(`Rewarding ${rewardAmount} points to receiver address: ${receiver}`, `tx: ${tx.receipt.transactionHash}`);
  return tx.receipt.transactionHash;
}

export async function sendTokensAsync({
  tokenContract,
  receiver,
  rewardAmount
  } : SendTokensParams): Promise<ContractTransaction["hash"]> {
  const preparedTx = await tokenContract.erc20.transfer.prepare(receiver, rewardAmount);
  const tx = await preparedTx.send();
  console.log(`Rewarding ${rewardAmount} points to receiver address: ${receiver}`, `tx: ${tx.hash}`);
  return tx.hash;
}

export async function sendReceiptSync({
  receiptContract,
  receiver,
  metadata
}: SendReceiptParams): Promise<ContractTransaction["hash"]> {
  const tx = await receiptContract.erc721.mintTo(receiver, metadata);
  console.log(`Sending digital receipt to receiver address: ${receiver}`, `tx: ${tx.receipt.transactionHash}`);
  return tx.receipt.transactionHash;
}

export async function sendReceiptAsync({
  receiptContract,
  receiver,
  metadata
}: SendReceiptParams): Promise<ContractTransaction["hash"]> {
  const preparedTx = await receiptContract.erc721.mintTo.prepare(receiver, metadata);
  preparedTx.encode();
  const tx = await preparedTx.send();
  console.log(`Sending digital receipt to receiver address: ${receiver}`, `tx: ${tx.hash}`);
  return tx.hash;
}

export async function redeemPointsSync({
  tokenContract,
  receiver,
  quantity,
}: RedeemPointsParams): Promise<ContractTransaction["hash"]> {
  const tx = await tokenContract.erc20.burnFrom(receiver, quantity);
  console.log(`Redeemed ${quantity} points for address: ${receiver}`, `tx: ${tx.receipt.transactionHash}`);
  return tx.receipt.transactionHash;
}

export async function redeemPointsAsync({
  tokenContract,
  receiver,
  quantity,
}: RedeemPointsParams): Promise<ContractTransaction["hash"]> {
  const preparedTx = await tokenContract.erc20.burnFrom.prepare(receiver, quantity);
  const tx = await preparedTx.send();
  console.log(`Redeemed ${quantity} points for address: ${receiver}`, `tx: ${tx.hash}`);
  return tx.hash;
}