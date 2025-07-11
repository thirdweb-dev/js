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
import type { SupportedFiatCurrency } from "../../../pay/convert/type.js";
import { encode } from "../../../transaction/actions/encode.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import { getTransactionGasCost } from "../../../transaction/utils.js";
import { resolvePromisedValue } from "../../../utils/promise/resolve-promised-value.js";
import { toTokens } from "../../../utils/units.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import { hasSponsoredTransactionsEnabled } from "../../../wallets/smart/is-smart-wallet.js";
import {
  formatCurrencyAmount,
  formatTokenAmount,
} from "../../web/ui/ConnectWallet/screens/formatTokenBalance.js";
import { useChainMetadata } from "./others/useChainQuery.js";

interface TransactionDetails {
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

interface UseTransactionDetailsOptions {
  transaction: PreparedTransaction;
  client: ThirdwebClient;
  wallet: Wallet | undefined;
  currency?: SupportedFiatCurrency;
}

/**
 * Hook to fetch comprehensive transaction details including contract metadata,
 * function information, cost calculations, and gas estimates.
 */
export function useTransactionDetails({
  transaction,
  currency,
  client,
  wallet,
}: UseTransactionDetailsOptions) {
  const chainMetadata = useChainMetadata(transaction.chain);
  const hasSponsoredTransactions = hasSponsoredTransactionsEnabled(wallet);

  return useQuery({
    enabled: !!transaction.to && !!chainMetadata.data,
    queryFn: async (): Promise<TransactionDetails> => {
      // Create contract instance for metadata fetching
      const contract = getContract({
        address: transaction.to as string,
        chain: transaction.chain,
        client,
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
          erc20Value?.tokenAddress || NATIVE_TOKEN_ADDRESS,
          transaction.chain.id,
        ).catch(() => null),
        hasSponsoredTransactions
          ? 0n
          : getTransactionGasCost(transaction).catch(() => null),
      ]);

      // Process function info from ABI if available
      let functionInfo = {
        description: undefined,
        functionName: "Contract Call",
        selector: "0x",
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
              description: undefined,
              functionName: matchingFunction.name,
              selector, // Skip devdoc for now
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
              address: erc20Value.tokenAddress,
              chain: transaction.chain,
              client,
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

      const totalCostWei =
        erc20Value &&
        erc20Value.tokenAddress.toLowerCase() !== NATIVE_TOKEN_ADDRESS
          ? erc20Value.amountWei
          : (value || 0n) + (gasCostWei || 0n);
      const totalCost = toTokens(totalCostWei, decimal);

      const price = tokenInfo?.prices[currency || "USD"] || 0;
      const usdValue = price ? Number(totalCost) * price : null;

      return {
        contractMetadata,
        costWei,
        functionInfo,
        gasCostDisplay: gasCostWei
          ? `${formatTokenAmount(gasCostWei, 18)} ${nativeTokenSymbol}`
          : null,
        gasCostWei,
        tokenInfo,
        totalCost,
        totalCostWei,
        txCostDisplay: `${formatTokenAmount(costWei, decimal)} ${tokenSymbol}`,
        usdValueDisplay: usdValue
          ? formatCurrencyAmount(currency || "USD", usdValue)
          : null,
      };
    },
    queryKey: [
      "transaction-details",
      transaction.to,
      transaction.chain.id,
      transaction.erc20Value?.toString(),
      hasSponsoredTransactions,
    ],
  });
}
