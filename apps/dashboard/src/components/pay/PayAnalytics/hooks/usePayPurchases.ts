import { payServerProxy } from "@/actions/proxies";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";

export type PayPurchasesData = {
  count: number;
  purchases: Array<
    {
      createdAt: string;
      updatedAt: string;
      status: "COMPLETED" | "FAILED" | "PENDING";
      fromAddress: string;
      estimatedFeesUSDCents: number;
      fromAmountUSDCents: number;
      toAmountUSDCents: number;
      toAmountWei: string;
      toAmount: string;
      purchaseId: string;

      toToken: {
        chainId: number;
        decimals: number;
        symbol: string;
        name: string;
        tokenAddress: string;
      };
    } & (
      | {
          purchaseType: "ONRAMP";
          fromCurrencyDecimals: number;
          fromCurrencySymbol: string;
          fromAmountUnits: string;
        }
      | {
          purchaseType: "SWAP";
          fromAmountWei: string;
          fromAmount: string;
          fromToken: {
            chainId: number;
            decimals: number;
            symbol: string;
            name: string;
            tokenAddress: string;
          };
        }
    )
  >;
};

type Response = {
  result: {
    data: PayPurchasesData;
  };
};

type PayPurchaseOptions = {
  clientId: string;
  from: Date;
  to: Date;
  start: number;
  count: number;
};

export function usePayPurchases(options: PayPurchaseOptions) {
  const address = useActiveAccount()?.address;
  return useQuery({
    queryKey: ["usePayPurchases", address, options],
    queryFn: async () => getPayPurchases(options),
    // keep the previous data while fetching new data
    placeholderData: keepPreviousData,
  });
}

export async function getPayPurchases(options: PayPurchaseOptions) {
  const res = await payServerProxy({
    pathname: "/stats/purchases/v1",
    searchParams: {
      skip: `${options.start}`,
      take: `${options.count}`,
      clientId: options.clientId,
      fromDate: `${options.from.getTime()}`,
      toDate: `${options.to.getTime()}`,
    },
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch pay volume");
  }

  const resJSON = res.data as Response;

  return resJSON.result.data;
}
