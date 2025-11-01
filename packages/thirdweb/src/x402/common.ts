import type { Abi } from "abitype";
import { toFunctionSelector } from "viem/utils";
import { getCachedChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import { resolveContractAbi } from "../contract/actions/resolve-abi.js";
import { getContract } from "../contract/contract.js";
import { isPermitSupported } from "../extensions/erc20/__generated__/IERC20Permit/write/permit.js";
import { isTransferWithAuthorizationSupported } from "../extensions/erc20/__generated__/USDC/write/transferWithAuthorization.js";
import { decodePayment } from "./encode.js";
import {
  networkToCaip2ChainId,
  type RequestedPaymentPayload,
  type RequestedPaymentRequirements,
} from "./schemas.js";
import {
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
  const { errorMessages } = routeConfig;

  const paymentRequirementsResult = await facilitator.accepts({
    resourceUrl,
    method,
    network,
    price,
    routeConfig,
    payTo,
  });

  // Check for payment header, if none, return the payment requirements
  if (!paymentData) {
    return paymentRequirementsResult;
  }

  const paymentRequirements = paymentRequirementsResult.responseBody.accepts;

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
      networkToCaip2ChainId(value.network) ===
        networkToCaip2ChainId(decodedPayment.network),
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

  // prefer transferWithAuthorization over permit
  if (hasTransferWithAuthorization) {
    return "TransferWithAuthorization";
  }
  if (hasPermit) {
    return "Permit";
  }
  return undefined;
}
