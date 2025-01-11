import { useQuery } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";

type PayNewCustomersData = {
  intervalType: "day" | "week";
  intervalResults: Array<{
    /**
     * Date formatted in ISO 8601 format
     */
    interval: string;
    distinctCustomers: number;
  }>;
  aggregate: {
    // totals in the [fromDate, toDate] range
    distinctCustomers: number;
    bpsIncreaseFromPriorRange: number;
  };
};

type Response = {
  result: {
    data: PayNewCustomersData;
  };
};

export function usePayNewCustomers(options: {
  clientId: string;
  from: Date;
  to: Date;
  intervalType: "day" | "week";
}) {
  const address = useActiveAccount()?.address;
  return useQuery({
    queryKey: ["usePayNewCustomers", address, options],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("intervalType", options.intervalType);
      searchParams.append("clientId", options.clientId);
      searchParams.append("fromDate", `${options.from.getTime()}`);
      searchParams.append("toDate", `${options.to.getTime()}`);

      const res = await fetch(
        `/api/server-proxy/pay/stats/aggregate/customers/v1?${searchParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch new customers");
      }

      const resJSON = (await res.json()) as Response;

      return resJSON.result.data;
    },
  });
}
