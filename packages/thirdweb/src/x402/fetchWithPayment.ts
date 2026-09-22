import { getCachedChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import { getAddress } from "../utils/address.js";
import type { AsyncStorage } from "../utils/storage/AsyncStorage.js";
import { webLocalStorage } from "../utils/storage/webStorage.js";
import type { Wallet } from "../wallets/interfaces/wallet.js";
import { base64DecodeUtf8 } from "./encode.js";
import {
  getPaymentRequestHeader,
  getPaymentResponseHeader,
} from "./headers.js";
import { clearPermitSignatureFromCache } from "./permitSignatureStorage.js";
import {
  extractEvmChainId,
  networkToCaip2ChainId,
  normalizePaymentRequirements,
  parsePaymentRequired,
  type RequestedPaymentRequirements,
} from "./schemas.js";
import { createPaymentHeader } from "./sign.js";
import { x402Version as defaultX402Version } from "./types.js";

/**
 * Enables the payment of APIs using the x402 payment protocol.
 *
 * This function wraps the native fetch API to automatically handle 402 Payment Required responses
 * by creating and sending a payment header. It will:
 * 1. Make the initial request
 * 2. If a 402 response is received, parse the payment requirements
 * 3. Verify the payment amount is within the allowed maximum
 * 4. Create a payment header using the provided wallet client
 * 5. Retry the request with the payment header
 *
 * @param fetch - The fetch function to wrap (typically globalThis.fetch)
 * @param client - The thirdweb client used to access RPC infrastructure
 * @param wallet - The wallet used to sign payment messages
 * @param maxValue - The maximum allowed payment amount in base units. `0n` only allows zero-amount payments
 * @returns A wrapped fetch function that handles 402 responses automatically
 *
 * @example
 * ```typescript
 * import { wrapFetchWithPayment } from "thirdweb/x402";
 * import { createThirdwebClient } from "thirdweb";
 * import { createWallet } from "thirdweb/wallets";
 *
 * const client = createThirdwebClient({ clientId: "your-client-id" });
 * const wallet = createWallet("io.metamask");
 * await wallet.connect({ client })
 *
 * const fetchWithPay = wrapFetchWithPayment(fetch, client, wallet);
 *
 * // Make a request that may require payment
 * const response = await fetchWithPay('https://api.example.com/paid-endpoint');
 * ```
 *
 * @throws {Error} If the payment amount exceeds the maximum allowed value
 * @throws {Error} If a payment has already been attempted for this request
 * @throws {Error} If there's an error creating the payment header
 *
 * @x402
 */
export function wrapFetchWithPayment(
  fetch: typeof globalThis.fetch,
  client: ThirdwebClient,
  wallet: Wallet,
  options?: {
    maxValue?: bigint;
    /**
     * Selects the payment requirement to pay. Return one of the provided requirements;
     * the returned requirement is validated again before payment.
     */
    paymentRequirementsSelector?: (
      paymentRequirements: RequestedPaymentRequirements[],
    ) => RequestedPaymentRequirements | undefined;
    /**
     * Storage for caching permit signatures (for "upto" scheme).
     * When provided, permit signatures will be cached and reused if the on-chain allowance is sufficient.
     */
    storage?: AsyncStorage;
  },
) {
  return async (input: RequestInfo, init?: RequestInit) => {
    const response = await fetch(input, init);

    if (response.status !== 402) {
      return response;
    }

    const initParams = init || {};

    if ((initParams as { __is402Retry?: boolean }).__is402Retry) {
      throw new Error("Payment already attempted");
    }

    // Check payment-required header first before falling back to JSON body
    const paymentRequiredHeader = response.headers.get("payment-required");
    const paymentRequired: unknown = paymentRequiredHeader
      ? JSON.parse(base64DecodeUtf8(paymentRequiredHeader))
      : await response.json();

    const parsed = parsePaymentRequired(paymentRequired, getRequestUrl(input));
    const x402Version = parsed.x402Version ?? defaultX402Version;
    const error = parsed.error;
    const normalizedPaymentRequirements = parsed.accepts;
    const parsedPaymentRequirements = normalizedPaymentRequirements.map(
      (x) => x.requirements,
    );

    const account = wallet.getAccount();
    let chain = wallet.getChain();

    if (!account || !chain) {
      throw new Error(
        "Wallet not connected. Please connect your wallet to continue.",
      );
    }
    const selected = options?.paymentRequirementsSelector
      ? options.paymentRequirementsSelector(parsedPaymentRequirements)
      : defaultPaymentRequirementsSelector(
          parsedPaymentRequirements,
          chain.id,
          error,
        );

    if (!selected) {
      throw new Error(
        `No suitable payment requirements found for chain ${chain.id}. ${error}`,
      );
    }

    const { requirements: selectedPaymentRequirements } =
      normalizePaymentRequirements(selected, {
        resourceUrl: parsed.resourceUrl,
      });
    const acceptedRequirement =
      normalizedPaymentRequirements.find((x) => x.requirements === selected)
        ?.raw ?? selected;

    if (
      options?.maxValue !== undefined &&
      BigInt(selectedPaymentRequirements.maxAmountRequired) > options.maxValue
    ) {
      throw new Error(
        `Payment amount exceeds maximum allowed (currently set to ${options.maxValue} in base units)`,
      );
    }

    const caip2ChainId = networkToCaip2ChainId(
      selectedPaymentRequirements.network,
    );
    const paymentChainId = extractEvmChainId(caip2ChainId);
    // TODO (402): support solana
    if (paymentChainId === null) {
      throw new Error(
        `Unsupported chain ID: ${selectedPaymentRequirements.network}`,
      );
    }

    // switch to the payment chain if it's not the current chain
    if (paymentChainId !== chain.id) {
      await wallet.switchChain(getCachedChain(paymentChainId));
      chain = wallet.getChain();
      if (!chain) {
        throw new Error(`Failed to switch chain (${paymentChainId})`);
      }
    }

    const storage = options?.storage ?? webLocalStorage;
    const paymentHeader = await createPaymentHeader(
      client,
      account,
      selectedPaymentRequirements,
      x402Version,
      storage,
      {
        accepted: acceptedRequirement,
        resource: parsed.resource ?? {
          url: selectedPaymentRequirements.resource,
          description: selectedPaymentRequirements.description,
          mimeType: selectedPaymentRequirements.mimeType,
        },
      },
      options?.maxValue,
    );

    const paymentRequestHeaderName = getPaymentRequestHeader(x402Version);
    const paymentResponseHeaderName = getPaymentResponseHeader(x402Version);

    const newInit = {
      ...initParams,
      headers: {
        ...(initParams.headers || {}),
        [paymentRequestHeaderName]: paymentHeader,
        "Access-Control-Expose-Headers": paymentResponseHeaderName,
      },
      __is402Retry: true,
    };

    const secondResponse = await fetch(input, newInit);

    // If payment was rejected (still 402), clear cached signature
    if (secondResponse.status === 402) {
      await clearPermitSignatureFromCache(storage, {
        chainId: paymentChainId,
        asset: selectedPaymentRequirements.asset,
        owner: getAddress(account.address),
        spender: getAddress(selectedPaymentRequirements.payTo),
      });
    }

    return secondResponse;
  };
}

/**
 * Resolves the absolute URL of a fetch input, if it can be determined.
 * @internal
 */
export function getRequestUrl(input: RequestInfo | URL): string | undefined {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : (input as Partial<Request> | undefined)?.url;
  if (typeof url !== "string") {
    return undefined;
  }
  try {
    const base =
      typeof globalThis.location !== "undefined"
        ? globalThis.location.href
        : undefined;
    return new URL(url, base).toString();
  } catch {
    return undefined;
  }
}

function defaultPaymentRequirementsSelector(
  paymentRequirements: RequestedPaymentRequirements[],
  chainId: number,
  error?: string,
) {
  if (!paymentRequirements.length) {
    throw new Error(
      `No valid payment requirements found in server 402 response. ${error}`,
    );
  }
  // find the payment requirements matching the connected wallet chain
  const matchingPaymentRequirements = paymentRequirements.find(
    (x) => extractEvmChainId(networkToCaip2ChainId(x.network)) === chainId,
  );

  if (matchingPaymentRequirements) {
    return matchingPaymentRequirements;
  } else {
    // if no matching payment requirements, use the first payment requirement
    // and switch the wallet to that chain
    const firstPaymentRequirement = paymentRequirements[0];
    return firstPaymentRequirement;
  }
}
