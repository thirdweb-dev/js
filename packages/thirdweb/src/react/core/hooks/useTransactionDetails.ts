import { useQuery } from "@tanstack/react-query";
import type { AbiFunction } from "abitype";
import { toFunctionSelector } from "viem";
import type { Token } from "../../../bridge/index.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import type { CompilerMetadata } from "../../../contract/actions/compiler-metadata.js";
import { getCompilerMetadata } from "../../../contract/actions/get-compiler-metadata.js";
import { getContract } from "../../../contract/contract.js";
import { decimals } from "../../../extensions/erc20/read/decimals.js";
import { getToken } from "../../../pay/convert/get-token.js";
import { encode } from "../../../transaction/actions/encode.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import { getTransactionGasCost } from "../../../transaction/utils.js";
import { resolvePromisedValue } from "../../../utils/promise/resolve-promised-value.js";
import { toTokens } from "../../../utils/units.js";
import {
  formatCurrencyAmount,
  formatTokenAmount,
} from "../../web/ui/ConnectWallet/screens/formatTokenBalance.js";
import { useChainMetadata } from "./others/useChainQuery.js";

export interface TransactionDetails {
  contractMetadata: CompilerMetadata | null;
  functionInfo: {
    functionName: string;
    selector: string;
    description?: string;
  };
  usdValueDisplay: string | null;
  txCostDisplay: string;
  gasCostDisplay: string | null;
  tokenInfo: Token | null;
  costWei: bigint;
  gasCostWei: bigint | null;
  totalCost: string;
  totalCostWei: bigint;
}

export interface UseTransactionDetailsOptions {
  transaction: PreparedTransaction;
  client: ThirdwebClient;
}

/**
 * Hook to fetch comprehensive transaction details including contract metadata,
 * function information, cost calculations, and gas estimates.
 */
export function useTransactionDetails({
  transaction,
  client,
}: UseTransactionDetailsOptions) {
  const chainMetadata = useChainMetadata(transaction.chain);

  return useQuery({
    queryKey: [
      "transaction-details",
      transaction.to,
      transaction.chain.id,
      transaction.erc20Value,
    ],
    queryFn: async (): Promise<TransactionDetails> => {
      // Create contract instance for metadata fetching
      const contract = getContract({
        client,
        chain: transaction.chain,
        address: transaction.to as string,
      });

      const [contractMetadata, value, erc20Value, transactionData] =
        await Promise.all([
          getCompilerMetadata(contract).catch(() => null),
          resolvePromisedValue(transaction.value),
          resolvePromisedValue(transaction.erc20Value),
          encode(transaction).catch(() => "0x"),
        ]);

      const [tokenInfo, gasCostWei] = await Promise.all([
        getToken(
          client,
          erc20Value ? erc20Value.tokenAddress : NATIVE_TOKEN_ADDRESS,
          transaction.chain.id,
        ).catch(() => null),
        getTransactionGasCost(transaction).catch(() => null),
      ]);

      // Process function info from ABI if available
      let functionInfo = {
        functionName: "Contract Call",
        selector: "0x",
        description: undefined,
      };

      if (contractMetadata?.abi && transactionData.length >= 10) {
        try {
          const selector = transactionData.slice(0, 10) as `0x${string}`;
          const abi = contractMetadata.abi;

          // Find matching function in ABI
          const abiItems = Array.isArray(abi) ? abi : [];
          const functions = abiItems
            .filter(
              (item) =>
                item &&
                typeof item === "object" &&
                "type" in item &&
                (item as { type: string }).type === "function",
            )
            .map((item) => item as AbiFunction);

          const matchingFunction = functions.find((fn) => {
            return toFunctionSelector(fn) === selector;
          });

          if (matchingFunction) {
            functionInfo = {
              functionName: matchingFunction.name,
              selector,
              description: undefined, // Skip devdoc for now
            };
          }
        } catch {
          // Keep default values
        }
      }

      const resolveDecimals = async () => {
        if (tokenInfo) {
          return tokenInfo.decimals;
        }
        if (erc20Value) {
          return decimals({
            contract: getContract({
              client,
              chain: transaction.chain,
              address: erc20Value.tokenAddress,
            }),
          });
        }
        return 18;
      };

      const decimal = await resolveDecimals();
      const costWei = erc20Value ? erc20Value.amountWei : value || 0n;
      const nativeTokenSymbol =
        chainMetadata.data?.nativeCurrency?.symbol || "ETH";
      const tokenSymbol = tokenInfo?.symbol || nativeTokenSymbol;

      const totalCostWei = erc20Value
        ? erc20Value.amountWei
        : (value || 0n) + (gasCostWei || 0n);
      const totalCost = toTokens(totalCostWei, decimal);

      const usdValue = tokenInfo?.priceUsd
        ? Number(totalCost) * tokenInfo.priceUsd
        : null;

      return {
        contractMetadata,
        functionInfo,
        usdValueDisplay: usdValue
          ? formatCurrencyAmount("USD", usdValue)
          : null,
        txCostDisplay: `${formatTokenAmount(costWei, decimal)} ${tokenSymbol}`,
        gasCostDisplay: gasCostWei
          ? `${formatTokenAmount(gasCostWei, 18)} ${nativeTokenSymbol}`
          : null,
        tokenInfo,
        costWei,
        gasCostWei,
        totalCost,
        totalCostWei,
      };
    },
    enabled: !!transaction.to && !!chainMetadata.data,
  });
}
