import { getCachedChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import { getAddress } from "../utils/address.js";
import type { AsyncStorage } from "../utils/storage/AsyncStorage.js";
import { webLocalStorage } from "../utils/storage/webStorage.js";
import type { Wallet } from "../wallets/interfaces/wallet.js";
import { safeBase64Decode } from "./encode.js";
import { clearPermitSignatureFromCache } from "./permitSignatureStorage.js";
import {
  extractEvmChainId,
  networkToCaip2ChainId,
  type RequestedPaymentRequirements,
  RequestedPaymentRequirementsSchema,
} from "./schemas.js";
import { createPaymentHeader } from "./sign.js";

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
 * @param maxValue - The maximum allowed payment amount in base units
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

    let x402Version: number;
    let parsedPaymentRequirements: RequestedPaymentRequirements[];
    let error: string | undefined;

    // Check payment-required header first before falling back to JSON body
    const paymentRequiredHeader = response.headers.get("payment-required");
    if (paymentRequiredHeader) {
      const decoded = safeBase64Decode(paymentRequiredHeader);
      const parsed = JSON.parse(decoded) as {
        x402Version: number;
        accepts: unknown[];
        error?: string;
      };
      x402Version = parsed.x402Version;
      parsedPaymentRequirements = parsed.accepts.map((x) =>
        RequestedPaymentRequirementsSchema.parse(x),
      );
      error = parsed.error;
    } else {
      const body = (await response.json()) as {
        x402Version: number;
        accepts: unknown[];
        error?: string;
      };
      x402Version = body.x402Version;
      parsedPaymentRequirements = body.accepts.map((x) =>
        RequestedPaymentRequirementsSchema.parse(x),
      );
      error = body.error;
    }

    const account = wallet.getAccount();
    let chain = wallet.getChain();

    if (!account || !chain) {
      throw new Error(
        "Wallet not connected. Please connect your wallet to continue.",
      );
    }
    const selectedPaymentRequirements = options?.paymentRequirementsSelector
      ? options.paymentRequirementsSelector(parsedPaymentRequirements)
      : defaultPaymentRequirementsSelector(
          parsedPaymentRequirements,
          chain.id,
          error,
        );

    if (!selectedPaymentRequirements) {
      throw new Error(
        `No suitable payment requirements found for chain ${chain.id}. ${error}`,
      );
    }

    if (
      options?.maxValue &&
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

    const paymentHeader = await createPaymentHeader(
      client,
      account,
      selectedPaymentRequirements,
      x402Version,
      options?.storage ?? webLocalStorage,
    );

    const initParams = init || {};

    if ((initParams as { __is402Retry?: boolean }).__is402Retry) {
      throw new Error("Payment already attempted");
    }

    const newInit = {
      ...initParams,
      headers: {
        ...(initParams.headers || {}),
        "X-PAYMENT": paymentHeader,
        "Access-Control-Expose-Headers": "X-PAYMENT-RESPONSE",
      },
      __is402Retry: true,
    };

    const secondResponse = await fetch(input, newInit);

    // If payment was rejected (still 402), clear cached signature
    if (secondResponse.status === 402 && options?.storage) {
      await clearPermitSignatureFromCache(options.storage, {
        chainId: paymentChainId,
        asset: selectedPaymentRequirements.asset,
        owner: getAddress(account.address),
        spender: getAddress(selectedPaymentRequirements.payTo),
      });
    }

    return secondResponse;
  };
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
