import type { Abi } from "abitype";
import { toFunctionSelector } from "viem/utils";
import { type ERC20TokenAmount, type Money, moneySchema } from "x402/types";
import { getCachedChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import { resolveContractAbi } from "../contract/actions/resolve-abi.js";
import { getContract } from "../contract/contract.js";
import { isPermitSupported } from "../extensions/erc20/__generated__/IERC20Permit/write/permit.js";
import { isTransferWithAuthorizationSupported } from "../extensions/erc20/__generated__/USDC/write/transferWithAuthorization.js";
import { getAddress } from "../utils/address.js";
import { decodePayment } from "./encode.js";
import type { facilitator as facilitatorType } from "./facilitator.js";
import {
  networkToChainId,
  type RequestedPaymentPayload,
  type RequestedPaymentRequirements,
} from "./schemas.js";
import {
  type PaymentArgs,
  type PaymentRequiredResult,
  x402Version,
} from "./types.js";

type GetPaymentRequirementsResult = {
  status: 200;
  paymentRequirements: RequestedPaymentRequirements[];
  selectedPaymentRequirements: RequestedPaymentRequirements;
  decodedPayment: RequestedPaymentPayload;
};

/**
 * Decodes a payment request and returns the payment requirements, selected payment requirements, and decoded payment
 * @param args
 * @returns The payment requirements, selected payment requirements, and decoded payment
 */
export async function decodePaymentRequest(
  args: PaymentArgs,
): Promise<GetPaymentRequirementsResult | PaymentRequiredResult> {
  const {
    price,
    network,
    facilitator,
    resourceUrl,
    routeConfig = {},
    payTo,
    method,
    paymentData,
  } = args;
  const {
    description,
    mimeType,
    maxTimeoutSeconds,
    inputSchema,
    outputSchema,
    errorMessages,
    discoverable,
  } = routeConfig;

  let chainId: number;
  try {
    chainId = networkToChainId(network);
  } catch (error) {
    return {
      status: 402,
      responseHeaders: { "Content-Type": "application/json" },
      responseBody: {
        x402Version,
        error:
          error instanceof Error
            ? error.message
            : `Invalid network: ${network}`,
        accepts: [],
      },
    };
  }

  const atomicAmountForAsset = await processPriceToAtomicAmount(
    price,
    chainId,
    facilitator,
  );
  if ("error" in atomicAmountForAsset) {
    return {
      status: 402,
      responseHeaders: { "Content-Type": "application/json" },
      responseBody: {
        x402Version,
        error: atomicAmountForAsset.error,
        accepts: [],
      },
    };
  }
  const { maxAmountRequired, asset } = atomicAmountForAsset;

  const paymentRequirements: RequestedPaymentRequirements[] = [];

  paymentRequirements.push({
    scheme: "exact",
    network: `eip155:${chainId}`,
    maxAmountRequired,
    resource: resourceUrl,
    description: description ?? "",
    mimeType: mimeType ?? "application/json",
    payTo: getAddress(payTo),
    maxTimeoutSeconds: maxTimeoutSeconds ?? 300,
    asset: getAddress(asset.address),
    // TODO: Rename outputSchema to requestStructure
    outputSchema: {
      input: {
        type: "http",
        method,
        discoverable: discoverable ?? true,
        ...inputSchema,
      },
      output: outputSchema,
    },
    extra: {
      facilitatorAddress: facilitator.address,
      ...(asset as ERC20TokenAmount["asset"]).eip712,
    },
  });

  // Check for payment header
  if (!paymentData) {
    return {
      status: 402,
      responseHeaders: {
        "Content-Type": "application/json",
      },
      responseBody: {
        x402Version,
        error: errorMessages?.paymentRequired || "X-PAYMENT header is required",
        accepts: paymentRequirements,
      },
    };
  }

  // Verify payment
  let decodedPayment: RequestedPaymentPayload;
  try {
    decodedPayment = decodePayment(paymentData);
    decodedPayment.x402Version = x402Version;
  } catch (error) {
    return {
      status: 402,
      responseHeaders: {
        "Content-Type": "application/json",
      },
      responseBody: {
        x402Version,
        error:
          errorMessages?.invalidPayment ||
          (error instanceof Error ? error.message : "Invalid payment"),
        accepts: paymentRequirements,
      },
    };
  }

  const selectedPaymentRequirements = paymentRequirements.find(
    (value) =>
      value.scheme === decodedPayment.scheme &&
      value.network === decodedPayment.network,
  );
  if (!selectedPaymentRequirements) {
    return {
      status: 402,
      responseHeaders: {
        "Content-Type": "application/json",
      },
      responseBody: {
        x402Version,
        error:
          errorMessages?.noMatchingRequirements ||
          "Unable to find matching payment requirements",
        accepts: paymentRequirements,
      },
    };
  }

  return {
    status: 200,
    paymentRequirements,
    decodedPayment,
    selectedPaymentRequirements,
  };
}

/**
 * Parses the amount from the given price
 *
 * @param price - The price to parse
 * @param network - The network to get the default asset for
 * @returns The parsed amount or an error message
 */
async function processPriceToAtomicAmount(
  price: Money | ERC20TokenAmount,
  chainId: number,
  facilitator: ReturnType<typeof facilitatorType>,
): Promise<
  | { maxAmountRequired: string; asset: ERC20TokenAmount["asset"] }
  | { error: string }
> {
  // Handle USDC amount (string) or token amount (ERC20TokenAmount)
  let maxAmountRequired: string;
  let asset: ERC20TokenAmount["asset"];

  if (typeof price === "string" || typeof price === "number") {
    // USDC amount in dollars
    const parsedAmount = moneySchema.safeParse(price);
    if (!parsedAmount.success) {
      return {
        error: `Invalid price (price: ${price}). Must be in the form "$3.10", 0.10, "0.001", ${parsedAmount.error}`,
      };
    }
    const parsedUsdAmount = parsedAmount.data;
    const defaultAsset = await getDefaultAsset(chainId, facilitator);
    if (!defaultAsset) {
      return {
        error: `Unable to get default asset on chain ${chainId}. Please specify an asset in the payment requirements.`,
      };
    }
    asset = defaultAsset;
    maxAmountRequired = (parsedUsdAmount * 10 ** asset.decimals).toString();
  } else {
    // Token amount in atomic units
    maxAmountRequired = price.amount;
    asset = price.asset;
  }

  return {
    maxAmountRequired,
    asset,
  };
}

async function getDefaultAsset(
  chainId: number,
  facilitator: ReturnType<typeof facilitatorType>,
): Promise<ERC20TokenAmount["asset"] | undefined> {
  const supportedAssets = await facilitator.supported();
  const matchingAsset = supportedAssets.kinds.find(
    (supported) => supported.network === `eip155:${chainId}`,
  );
  const assetConfig = matchingAsset?.extra
    ?.defaultAsset as ERC20TokenAmount["asset"];
  return assetConfig;
}

export type SupportedAuthorizationMethods = {
  hasPermit: boolean;
  hasTransferWithAuthorization: boolean;
};

export async function detectSupportedAuthorizationMethods(args: {
  client: ThirdwebClient;
  asset: string;
  chainId: number;
}): Promise<SupportedAuthorizationMethods> {
  const abi = await resolveContractAbi<Abi>(
    getContract({
      client: args.client,
      address: args.asset,
      chain: getCachedChain(args.chainId),
    }),
  ).catch((error) => {
    console.error("Error resolving contract ABI", error);
    return [] as Abi;
  });
  const selectors = abi
    .filter((f) => f.type === "function")
    .map((f) => toFunctionSelector(f));
  const hasPermit = isPermitSupported(selectors);
  const hasTransferWithAuthorization =
    isTransferWithAuthorizationSupported(selectors);

  return {
    hasPermit,
    hasTransferWithAuthorization,
  };
}
