import type { ThirdwebClient } from "thirdweb";
import { type Abi, getContract, resolveContractAbi } from "thirdweb/contract";
import {
  isPermitSupported,
  isTransferWithAuthorizationSupported,
} from "thirdweb/extensions/erc20";
import { getAddress, toFunctionSelector, toUnits } from "thirdweb/utils";
import { ChainIdToNetwork, type Money, moneySchema } from "x402/types";
import { getCachedChain } from "../../thirdweb/dist/types/chains/utils.js";
import { decodePayment } from "./encode.js";
import type { ThirdwebX402Facilitator } from "./facilitator.js";
import {
  networkToChainId,
  type RequestedPaymentPayload,
  type RequestedPaymentRequirements,
} from "./schemas.js";
import {
  type DefaultAsset,
  type ERC20TokenAmount,
  type PaymentArgs,
  type PaymentRequiredResult,
  type SupportedSignatureType,
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
    payTo,
    resourceUrl,
    routeConfig = {},
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

  const mappedNetwork = ChainIdToNetwork[chainId];
  paymentRequirements.push({
    scheme: "exact",
    network: mappedNetwork ? mappedNetwork : `eip155:${chainId}`,
    maxAmountRequired,
    resource: resourceUrl,
    description: description ?? "",
    mimeType: mimeType ?? "application/json",
    payTo: getAddress(facilitator.address), // always pay to the facilitator address first
    maxTimeoutSeconds: maxTimeoutSeconds ?? 86400,
    asset: getAddress(asset.address),
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
      recipientAddress: payTo, // input payTo is the final recipient address
      ...((asset as ERC20TokenAmount["asset"]).eip712 ?? {}),
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

  // decode b64 payment
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
      networkToChainId(value.network) ===
        networkToChainId(decodedPayment.network),
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
  facilitator: ThirdwebX402Facilitator,
): Promise<
  { maxAmountRequired: string; asset: DefaultAsset } | { error: string }
> {
  // Handle USDC amount (string) or token amount (ERC20TokenAmount)
  let maxAmountRequired: string;
  let asset: DefaultAsset;

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
    maxAmountRequired = toUnits(
      parsedUsdAmount.toString(),
      defaultAsset.decimals,
    ).toString();
  } else {
    // Token amount in atomic units
    maxAmountRequired = price.amount;
    const tokenExtras = await getOrDetectTokenExtras({
      facilitator,
      partialAsset: price.asset,
      chainId,
    });
    if (!tokenExtras) {
      return {
        error: `Unable to find token information for ${price.asset.address} on chain ${chainId}. Please specify the asset decimals and eip712 information in the asset options.`,
      };
    }
    asset = {
      address: price.asset.address,
      decimals: tokenExtras.decimals,
      eip712: {
        name: tokenExtras.name,
        version: tokenExtras.version,
        primaryType: tokenExtras.primaryType,
      },
    };
  }

  return {
    maxAmountRequired,
    asset,
  };
}

async function getDefaultAsset(
  chainId: number,
  facilitator: ThirdwebX402Facilitator,
): Promise<DefaultAsset | undefined> {
  const supportedAssets = await facilitator.supported();
  const matchingAsset = supportedAssets.kinds.find(
    (supported) => networkToChainId(supported.network) === chainId,
  );
  const assetConfig = matchingAsset?.extra?.defaultAsset as DefaultAsset;
  return assetConfig;
}

export async function getSupportedSignatureType(args: {
  client: ThirdwebClient;
  asset: string;
  chainId: number;
  eip712Extras: ERC20TokenAmount["asset"]["eip712"] | undefined;
}): Promise<SupportedSignatureType | undefined> {
  const primaryType = args.eip712Extras?.primaryType;

  if (primaryType === "Permit" || primaryType === "TransferWithAuthorization") {
    return primaryType;
  }

  // not specified, so we need to detect it
  const abi: Abi = await resolveContractAbi(
    getContract({
      client: args.client,
      address: args.asset,
      chain: getCachedChain(args.chainId),
    }),
  ).catch((error) => {
    console.error("Error resolving contract ABI", error);
    return [];
  });
  const selectors = abi
    .filter((f) => f.type === "function")
    .map((f) => toFunctionSelector(f));
  const hasPermit = isPermitSupported(selectors);
  const hasTransferWithAuthorization =
    isTransferWithAuthorizationSupported(selectors);

  // prefer transferWithAuthorization over permit
  if (hasTransferWithAuthorization) {
    return "TransferWithAuthorization";
  }
  if (hasPermit) {
    return "Permit";
  }
  return undefined;
}

async function getOrDetectTokenExtras(args: {
  facilitator: ThirdwebX402Facilitator;
  partialAsset: ERC20TokenAmount["asset"];
  chainId: number;
}): Promise<
  | {
      name: string;
      version: string;
      decimals: number;
      primaryType: SupportedSignatureType;
    }
  | undefined
> {
  const { facilitator, partialAsset, chainId } = args;
  if (
    partialAsset.eip712?.name &&
    partialAsset.eip712?.version &&
    partialAsset.decimals !== undefined
  ) {
    return {
      name: partialAsset.eip712.name,
      version: partialAsset.eip712.version,
      decimals: partialAsset.decimals,
      primaryType: partialAsset.eip712.primaryType,
    };
  }
  // read from facilitator
  const response = await facilitator
    .supported({
      chainId,
      tokenAddress: partialAsset.address,
    })
    .catch(() => {
      return {
        kinds: [],
      };
    });

  const exactScheme = response.kinds?.find((kind) => kind.scheme === "exact");
  if (!exactScheme) {
    return undefined;
  }
  const supportedAsset = exactScheme.extra?.supportedAssets?.find(
    (asset) =>
      asset.address.toLowerCase() === partialAsset.address.toLowerCase(),
  );
  if (!supportedAsset) {
    return undefined;
  }

  return {
    name: supportedAsset.eip712.name,
    version: supportedAsset.eip712.version,
    decimals: supportedAsset.decimals,
    primaryType: supportedAsset.eip712.primaryType as SupportedSignatureType,
  };
}
