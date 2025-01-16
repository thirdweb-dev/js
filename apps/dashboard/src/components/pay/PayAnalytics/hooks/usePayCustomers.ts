import { payServerProxy } from "@/actions/proxies";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";

export type PayTopCustomersData = {
  count: number;
  customers: Array<{
    walletAddress: string;
    totalSpendUSDCents: number;
  }>;
};

type Response = {
  result: {
    data: PayTopCustomersData;
  };
};

export function usePayCustomers(options: {
  clientId: string;
  from: Date;
  to: Date;
  pageSize: number;
  type: "top-customers" | "new-customers";
}) {
  const address = useActiveAccount()?.address;
  return useInfiniteQuery({
    queryKey: ["usePayCustomers", address, options],
    queryFn: async ({ pageParam }) => {
      const endpoint =
        options.type === "new-customers"
          ? "/stats/new-customers/v1"
          : "/stats/customers/v1";

      const start = options.pageSize * pageParam;

      const res = await payServerProxy({
        method: "GET",
        pathname: endpoint,
        searchParams: {
          skip: `${start}`,
          take: `${options.pageSize}`,
          clientId: options.clientId,
          fromDate: `${options.from.getTime()}`,
          toDate: `${options.to.getTime()}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch pay volume");
      }

      const resJSON = res.data as Response;
      const pageData = resJSON.result.data;

      const itemsRequested = options.pageSize * (pageParam + 1);
      const totalItems = pageData.count;

      let nextPageIndex: number | null = null;
      if (itemsRequested < totalItems) {
        nextPageIndex = pageParam + 1;
      }

      return {
        pageData: resJSON.result.data,
        nextPageIndex,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPageIndex;
    },
  });
}
