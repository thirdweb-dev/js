import { useInfiniteQuery } from "@tanstack/react-query";
import {
  type GetTransactionsParams,
  type Transactions,
  getTransactions,
} from "thirdweb";

export type PayTopCustomersData = {
  count: number;
  customers: Array<{
    walletAddress: string;
    totalSpendUSDCents: number;
  }>;
};

export function useGetTransactions(params: GetTransactionsParams) {
  return useInfiniteQuery<
    GetTransactionsParams,
    Error,
    { pageData: Transactions; nextPageIndex?: number }
  >({
    queryKey: ["useGetTransactions", params],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getTransactions(params);
      const pageData = result.transactions;

      const itemsRequested = params.pageSize * (pageParam + 1);
      const totalItems = pageData.count;

      let nextPageIndex: number | null = null;
      if (itemsRequested < totalItems) {
        nextPageIndex = pageParam + 1;
      }

      return {
        pageData,
        nextPageIndex,
      };
    },
    enabled: !!params,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPageIndex;
    },
  });
}
