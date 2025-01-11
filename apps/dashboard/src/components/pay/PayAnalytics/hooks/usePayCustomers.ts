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

      const searchParams = new URLSearchParams();

      const start = options.pageSize * pageParam;
      searchParams.append("skip", `${start}`);
      searchParams.append("take", `${options.pageSize}`);

      searchParams.append("clientId", options.clientId);
      searchParams.append("fromDate", `${options.from.getTime()}`);
      searchParams.append("toDate", `${options.to.getTime()}`);

      const res = await fetch(
        `/api/server-proxy/pay/${endpoint}?${searchParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch pay volume");
      }

      const resJSON = (await res.json()) as Response;
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
