import { useQuery } from "@tanstack/react-query";
import { useLoggedInUser } from "../../../../@3rdweb-sdk/react/hooks/useLoggedInUser";

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

type PayPurcaseOptions = {
  clientId: string;
  from: Date;
  to: Date;
  start: number;
  count: number;
};

export function usePayPurchases(options: PayPurcaseOptions) {
  const { user, isLoggedIn } = useLoggedInUser();

  return useQuery({
    queryKey: ["usePayPurchases", user?.address, options],
    queryFn: async () => getPayPurchases(options),
    enabled: isLoggedIn,
    keepPreviousData: true,
  });
}

export async function getPayPurchases(options: PayPurcaseOptions) {
  const searchParams = new URLSearchParams();
  searchParams.append("skip", `${options.start}`);
  searchParams.append("take", `${options.count}`);

  searchParams.append("clientId", options.clientId);
  searchParams.append("fromDate", `${options.from.getTime()}`);
  searchParams.append("toDate", `${options.to.getTime()}`);

  const res = await fetch(
    `/api/server-proxy/pay/stats/purchases/v1?${searchParams.toString()}`,
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

  return resJSON.result.data;
}
