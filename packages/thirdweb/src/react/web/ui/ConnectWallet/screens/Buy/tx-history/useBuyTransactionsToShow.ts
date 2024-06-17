import { type UseQueryOptions, useQueries } from "@tanstack/react-query";
import { useState, useSyncExternalStore } from "react";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import {
  type ValidBuyWithCryptoStatus,
  getBuyWithCryptoStatus,
} from "../../../../../../../pay/buyWithCrypto/getStatus.js";
import {
  type ValidBuyWithFiatStatus,
  getBuyWithFiatStatus,
} from "../../../../../../../pay/buyWithFiat/getStatus.js";
import { useBuyHistory } from "../../../../../../core/hooks/pay/useBuyHistory.js";
import { useActiveAccount } from "../../../../../hooks/wallets/useActiveAccount.js";
import { pendingTransactions } from "../swap/pendingSwapTx.js";

export type TxStatusInfo =
  | {
      type: "swap";
      status: ValidBuyWithCryptoStatus;
    }
  | {
      type: "fiat";
      status: ValidBuyWithFiatStatus;
    };

export function useBuyTransactionsToShow(client: ThirdwebClient) {
  const account = useActiveAccount();
  const [pageIndex, setPageIndex] = useState(0);
  const txStatusList: TxStatusInfo[] = [];
  const PAGE_SIZE = 10;

  const buyHistory = useBuyHistory(
    {
      walletAddress: account?.address || "",
      start: pageIndex * PAGE_SIZE,
      count: PAGE_SIZE,
      client,
    },
    {
      refetchInterval: 10 * 1000, // 10 seconds
    },
  );

  const pendingTxStoreValue = useSyncExternalStore(
    pendingTransactions.subscribe,
    pendingTransactions.getValue,
  );

  const pendingStatusQueries = useQueries<
    UseQueryOptions<TxStatusInfo | null>[]
  >({
    queries: pendingTxStoreValue.map((tx) => {
      return {
        queryKey: ["pending-tx-status", tx],
        queryFn: async () => {
          if (tx.type === "swap") {
            const swapStatus = await getBuyWithCryptoStatus({
              client: client,
              transactionHash: tx.txHash,
            });

            if (
              swapStatus.status === "NOT_FOUND" ||
              swapStatus.status === "NONE"
            ) {
              return null;
            }

            return {
              type: "swap",
              status: swapStatus,
            };
          }

          const fiatStatus = await getBuyWithFiatStatus({
            client: client,
            intentId: tx.intentId,
          });

          if (
            fiatStatus.status === "NOT_FOUND" ||
            fiatStatus.status === "NONE"
          ) {
            return null;
          }

          return {
            type: "fiat",
            status: fiatStatus,
          };
        },
        refetchInterval: 10 * 1000, // 10 seconds
      };
    }),
  });

  if (pendingStatusQueries.length > 0 && pageIndex === 0) {
    for (const query of pendingStatusQueries) {
      if (query.data) {
        const txStatusInfo = query.data;

        // if already present in endpoint - don't add it
        if (buyHistory.data) {
          if (txStatusInfo.type === "swap") {
            const isPresent = buyHistory.data.page.find((tx) => {
              if (
                "buyWithCryptoStatus" in tx &&
                tx.buyWithCryptoStatus.status !== "NOT_FOUND"
              ) {
                return (
                  tx.buyWithCryptoStatus.source?.transactionHash ===
                  txStatusInfo.status.source?.transactionHash
                );
              }
              return false;
            });

            if (!isPresent) {
              txStatusList.push(txStatusInfo);
            }
          }

          if (txStatusInfo.type === "fiat") {
            const isPresent = buyHistory.data.page.find((tx) => {
              if (
                "buyWithFiatStatus" in tx &&
                tx.buyWithFiatStatus.status !== "NOT_FOUND"
              ) {
                return (
                  tx.buyWithFiatStatus.intentId === txStatusInfo.status.intentId
                );
              }
              return false;
            });

            if (!isPresent) {
              txStatusList.push(txStatusInfo);
            }
          }
        } else {
          // if no buy history available for this walllet - add without duplicate check
          txStatusList.push(txStatusInfo);
        }
      }
    }
  }

  if (buyHistory.data) {
    for (const tx of buyHistory.data.page) {
      if ("buyWithCryptoStatus" in tx) {
        if (
          tx.buyWithCryptoStatus.status !== "NOT_FOUND" &&
          tx.buyWithCryptoStatus.status !== "NONE"
        ) {
          txStatusList.push({
            type: "swap",
            status: tx.buyWithCryptoStatus,
          });
        }
      } else {
        if (
          tx.buyWithFiatStatus.status !== "NOT_FOUND" &&
          tx.buyWithFiatStatus.status !== "NONE"
        ) {
          txStatusList.push({
            type: "fiat",
            status: tx.buyWithFiatStatus,
          });
        }
      }
    }
  }

  const hidePagination =
    !buyHistory.data ||
    (buyHistory.data && !buyHistory.data.hasNextPage && pageIndex === 0);

  return {
    pageIndex,
    setPageIndex,
    txInfosToShow: txStatusList,
    hidePagination,
    isLoading: buyHistory.isLoading,
    pagination: buyHistory.data
      ? {
          hasNextPage: buyHistory.data.hasNextPage,
        }
      : undefined,
  };
}
