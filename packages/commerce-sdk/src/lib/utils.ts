import { createHmac } from "crypto";
import { Readable } from "stream";
import { ShopifyFetchParams, ShopifyFetchResult } from "../../types";

export async function getRawBody(readable: Readable): Promise<Buffer> {
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