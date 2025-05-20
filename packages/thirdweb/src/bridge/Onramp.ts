import type { Address as ox__Address } from "ox";
import type { ThirdwebClient } from "../client/client.js";
import { getThirdwebBaseUrl } from "../utils/domains.js";
import { getClientFetch } from "../utils/fetch.js";
import { stringify } from "../utils/json.js";
import type { RouteStep } from "./types/Route.js";
import type { Token } from "./types/Token.js";

// export status within the Onramp module
export { status } from "./OnrampStatus.js";

type OnrampIntent = {
  onramp: "stripe" | "coinbase" | "transak";
  chainId: number;
  tokenAddress: ox__Address.Address;
  receiver: ox__Address.Address;
  amount?: string; // Corresponds to buyAmountWei in some other contexts
  purchaseData?: unknown;
  sender?: ox__Address.Address;
  onrampTokenAddress?: ox__Address.Address;
  onrampChainId?: number;
  currency?: string;
  maxSteps?: number;
  excludeChainIds?: string | string[];
};

type OnrampPrepareQuoteResponseData = {
  id: string;
  link: string;
  currency: string;
  currencyAmount: number;
  destinationAmount: bigint;
  destinationToken: Token;
  timestamp?: number;
  expiration?: number;
  steps: RouteStep[];
  intent: OnrampIntent;
};

// Explicit type for the API request body
interface OnrampApiRequestBody {
  onramp: "stripe" | "coinbase" | "transak";
  chainId: number;
  tokenAddress: ox__Address.Address;
  receiver: ox__Address.Address;
  amount?: string;
  purchaseData?: unknown;
  sender?: ox__Address.Address;
  onrampTokenAddress?: ox__Address.Address;
  onrampChainId?: number;
  currency?: string;
  maxSteps?: number;
  excludeChainIds?: string;
}

/**
 * Prepares an onramp transaction, returning a link from the specified provider to onramp to the specified token.
 *
 * @example
 * ```typescript
 * import { Bridge } from "thirdweb";
 * import { ethereum } from "thirdweb/chains";
 * import { NATIVE_TOKEN_ADDRESS, toWei } from "thirdweb/utils";
 *
 * const preparedOnramp = await Bridge.Onramp.prepare({
 *   client: thirdwebClient,
 *   onramp: "stripe",
 *   chainId: ethereum.id,
 *   tokenAddress: NATIVE_TOKEN_ADDRESS,
 *   receiver: "0x...", // receiver's address
 *   amount: toWei("10"), // 10 of the destination token
 *   // Optional params:
 *   // sender: "0x...", // sender's address
 *   // onrampTokenAddress: NATIVE_TOKEN_ADDRESS, // token to initially onramp to
 *   // onrampChainId: 1, // chain to initially onramp to
 *   // currency: "USD",
 *   // maxSteps: 2,
 *   // purchaseData: { customId: "123" }
 * });
 *
 * console.log(preparedOnramp.link); // URL to redirect the user to
 * console.log(preparedOnramp.currencyAmount); // Amount in fiat the user will pay
 * ```
 *
 * This function returns a quote that might look like:
 * ```typescript
 * {
 *   id: "123e4567-e89b-12d3-a456-426614174000",
 *   link: "https://onramp.example.com/session?id=...",
 *   currency: "USD",
 *   currencyAmount: 10.52,
 *   destinationAmount: 10000000000000000000n, // 10 ETH if decimals 18
 *   timestamp: 1689812800,
 *   expiration: 1689842800,
 *   steps: [
 *     // ... further steps if any post-onramp swaps are needed
 *   ],
 *   intent: {
 *     onramp: "stripe",
 *     chainId: 1,
 *     tokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *     receiver: "0x...",
 *     amount: "10000000000000000000"
 *   }
 * }
 * ```
 *
 * @param options - The options for preparing the onramp.
 * @param options.client - Your thirdweb client.
 * @param options.onramp - The onramp provider to use (e.g., "stripe", "coinbase", "transak").
 * @param options.chainId - The destination chain ID.
 * @param options.tokenAddress - The destination token address.
 * @param options.receiver - The address that will receive the output token.
 * @param [options.amount] - The desired token amount in wei.
 * @param [options.purchaseData] - Arbitrary purchase data.
 * @param [options.sender] - An optional address to associate as the onramp sender.
 * @param [options.onrampTokenAddress] - The token to initially onramp to if the destination token is not supported by the provider.
 * @param [options.onrampChainId] - The chain ID to initially onramp to if the destination chain is not supported.
 * @param [options.currency] - The currency for the onramp (e.g., "USD", "GBP"). Defaults to user's preferred or "USD".
 * @param [options.maxSteps] - Maximum number of post-onramp steps.
 * @param [options.excludeChainIds] - Chain IDs to exclude from the route (string or array of strings).
 *
 * @returns A promise that resolves to the prepared onramp details, including the link and quote.
 * @throws Will throw an error if there is an issue preparing the onramp.
 * @bridge Onramp
 * @beta
 */
export async function prepare(
  options: prepare.Options,
): Promise<prepare.Result> {
  const {
    client,
    onramp,
    chainId,
    tokenAddress,
    receiver,
    amount,
    purchaseData,
    sender,
    onrampTokenAddress,
    onrampChainId,
    currency,
    maxSteps,
    excludeChainIds,
  } = options;

  const clientFetch = getClientFetch(client);
  const url = `${getThirdwebBaseUrl("bridge")}/v1/onramp/prepare`;

  const apiRequestBody: OnrampApiRequestBody = {
    onramp,
    chainId: Number(chainId),
    tokenAddress,
    receiver,
  };

  if (amount !== undefined) {
    apiRequestBody.amount = amount.toString();
  }
  if (purchaseData !== undefined) {
    apiRequestBody.purchaseData = purchaseData;
  }
  if (sender !== undefined) {
    apiRequestBody.sender = sender;
  }
  if (onrampTokenAddress !== undefined) {
    apiRequestBody.onrampTokenAddress = onrampTokenAddress;
  }
  if (onrampChainId !== undefined) {
    apiRequestBody.onrampChainId = Number(onrampChainId);
  }
  if (currency !== undefined) {
    apiRequestBody.currency = currency;
  }
  if (maxSteps !== undefined) {
    apiRequestBody.maxSteps = maxSteps;
  }
  if (excludeChainIds !== undefined) {
    apiRequestBody.excludeChainIds = Array.isArray(excludeChainIds)
      ? excludeChainIds.join(",")
      : excludeChainIds;
  }

  const response = await clientFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: stringify(apiRequestBody),
  });

  if (!response.ok) {
    const errorJson = await response.json();
    throw new Error(
      `${errorJson.code || response.status} | ${errorJson.message || response.statusText} - ${errorJson.correlationId || "N/A"}`,
    );
  }

  const { data }: { data: OnrampPrepareQuoteResponseData } =
    await response.json();

  // Transform amounts from string to bigint where appropriate
  const transformedSteps = data.steps.map((step) => ({
    ...step,
    originAmount: BigInt(step.originAmount),
    destinationAmount: BigInt(step.destinationAmount),
    transactions: step.transactions.map((tx) => ({
      ...tx,
      value: tx.value ? BigInt(tx.value) : undefined,
    })),
  }));

  const intentFromResponse = {
    ...data.intent,
    amount: data.intent.amount ? data.intent.amount : undefined,
  };

  return {
    ...data,
    destinationAmount: BigInt(data.destinationAmount),
    steps: transformedSteps,
    intent: intentFromResponse,
  };
}

export declare namespace prepare {
  export type Options = {
    client: ThirdwebClient;
    onramp: "stripe" | "coinbase" | "transak";
    chainId: number;
    tokenAddress: ox__Address.Address;
    receiver: ox__Address.Address;
    amount?: bigint;
    purchaseData?: unknown;
    sender?: ox__Address.Address;
    onrampTokenAddress?: ox__Address.Address;
    onrampChainId?: number;
    currency?: string;
    maxSteps?: number;
    excludeChainIds?: string | string[];
  };

  export type Result = OnrampPrepareQuoteResponseData;
}
