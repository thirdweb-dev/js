import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getChainMetadata } from "../../../../../../../chains/utils.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import { getContract } from "../../../../../../../contract/contract.js";
import { getCurrencyMetadata } from "../../../../../../../extensions/erc20/read/getCurrencyMetadata.js";
import { encode } from "../../../../../../../transaction/actions/encode.js";
import type { PreparedTransaction } from "../../../../../../../transaction/prepare-transaction.js";
import { getTransactionGasCost } from "../../../../../../../transaction/utils.js";
import type { Hex } from "../../../../../../../utils/encoding/hex.js";
import { resolvePromisedValue } from "../../../../../../../utils/promise/resolve-promised-value.js";
import type { Account } from "../../../../../../../wallets/interfaces/wallet.js";
import { getWalletBalance } from "../../../../../../../wallets/utils/getWalletBalance.js";
import type { SupportedChainAndTokens } from "../swap/useSwapSupportedChains.js";
import type { TransactionCostAndData } from "./types.js";

export function useTransactionCostAndData(args: {
  transaction: PreparedTransaction;
  account: Account | undefined;
  supportedDestinations: SupportedChainAndTokens;
}) {
  const { transaction, account, supportedDestinations } = args;
  // Compute query key of the transaction first
  const [txQueryKey, setTxQueryKey] = useState<
    | {
        value: string | undefined;
        erc20Value: string | undefined;
        erc20Currency: string | undefined;
        to: string | undefined;
        data: Hex | undefined;
      }
    | undefined
  >();
  useEffect(() => {
    Promise.all([
      resolvePromisedValue(transaction.value),
      resolvePromisedValue(transaction.erc20Value),
      resolvePromisedValue(transaction.to),
      encode(transaction),
    ]).then(([value, erc20Value, to, data]) => {
      setTxQueryKey({
        value: value?.toString(),
        erc20Value: erc20Value?.amountWei?.toString(),
        erc20Currency: erc20Value?.tokenAddress,
        to,
        data,
      });
    });
  }, [transaction]);

  return useQuery({
    queryKey: [
      "transaction-cost",
      transaction.chain.id,
      account?.address,
      txQueryKey,
    ],
    queryFn: async () => {
      if (!account) {
        throw new Error("No payer account found");
      }

      const erc20Value = await resolvePromisedValue(transaction.erc20Value);
      if (erc20Value) {
        const [tokenBalance, tokenMeta, gasCostWei] = await Promise.all([
          getWalletBalance({
            address: account.address,
            chain: transaction.chain,
            client: transaction.client,
            tokenAddress: erc20Value.tokenAddress,
          }),
          getCurrencyMetadata({
            contract: getContract({
              address: erc20Value.tokenAddress,
              chain: transaction.chain,
              client: transaction.client,
            }),
          }),
          getTransactionGasCost(transaction, account?.address),
        ]);
        const transactionValueWei = erc20Value.amountWei;
        const walletBalance = tokenBalance;
        const currency = {
          address: erc20Value.tokenAddress,
          name: tokenMeta.name,
          symbol: tokenMeta.symbol,
          icon: supportedDestinations
            .find((c) => c.chain.id === transaction.chain.id)
            ?.tokens.find(
              (t) =>
                t.address.toLowerCase() ===
                erc20Value.tokenAddress.toLowerCase(),
            )?.icon,
        };
        return {
          token: currency,
          decimals: tokenMeta.decimals,
          walletBalance,
          gasCostWei,
          transactionValueWei,
        } satisfies TransactionCostAndData;
      }

      const [nativeWalletBalance, chainMetadata, gasCostWei] =
        await Promise.all([
          getWalletBalance({
            address: account.address,
            chain: transaction.chain,
            client: transaction.client,
          }),
          getChainMetadata(transaction.chain),
          getTransactionGasCost(transaction, account?.address),
        ]);
      const walletBalance = nativeWalletBalance;
      const transactionValueWei =
        (await resolvePromisedValue(transaction.value)) || 0n;
      return {
        token: {
          address: NATIVE_TOKEN_ADDRESS,
          name: chainMetadata.nativeCurrency.name,
          symbol: chainMetadata.nativeCurrency.symbol,
          icon: chainMetadata.icon?.url,
        },
        decimals: 18,
        walletBalance,
        gasCostWei,
        transactionValueWei,
      } satisfies TransactionCostAndData;
    },
    enabled: !!transaction && !!txQueryKey,
    refetchInterval: () => {
      if (transaction.erc20Value) {
        // if erc20 value is set, we don't need to poll
        return undefined;
      }
      return 30_000;
    },
  });
}
