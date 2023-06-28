import { createHmac } from "crypto";
import { Readable } from "stream";
import { SendTokensParams, ShopifyFetchParams, ShopifyFetchResult } from "../../types";

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
  // apiUrl,
  // chain,
  tokenContract,
  wallet,
  rewardAmount,
}: SendTokensParams) {
  // Once web3api is ready, we can use this:
  // const response = await fetch(`${apiUrl}/contracts/${chain}/${tokenContract.getAddress()}/erc20/transfer`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     wallet,
  //     rewardAmount,
  //   }),
  // })
  // const data = await response.json();
  // console.log(`Rewarding ${rewardAmount} points to wallet address: ${wallet}`, `tx: ${data.result}`);
  // return data.result;

  const tx = await tokenContract.erc20.transfer(wallet, rewardAmount);
  console.log(`Rewarding ${rewardAmount} points to wallet address: ${wallet}`, `tx: ${tx.receipt.transactionHash}`);
  return tx.receipt.transactionHash;
}

export async function sendTokensAsync({ 
  // apiUrl,
  // chain,
  tokenContract,
  wallet,
  rewardAmount
  } : SendTokensParams) {
  // Once web3api is ready, we can use this:
  // const response = await fetch(`${apiUrl}/contract/${chain}/${tokenContract.getAddress()}/erc20/transfer`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     wallet,
  //     rewardAmount,
  //   }),
  // })
  // const data = await response.json();
  // console.log(`Rewarding ${rewardAmount} points to wallet address: ${wallet}`, `tx: ${data.result}`);
  // return data.result;

  const preparedTx = await tokenContract.erc20.transfer.prepare(wallet, rewardAmount);
  const tx = await preparedTx.send();
  console.log(`Rewarding ${rewardAmount} points to wallet address: ${wallet}`, `tx: ${tx.hash}`);
  return tx.hash;
}