import { useQuery } from "@tanstack/react-query";
import { getContractEventBreakdown } from "./contract-event-breakdown";
import { getContractEventAnalytics } from "./contract-events";
import { getContractFunctionBreakdown } from "./contract-function-breakdown";
import { getContractTransactionAnalytics } from "./contract-transactions";
import { getContractUniqueWalletAnalytics } from "./contract-wallet-analytics";
import { getTotalContractEvents } from "./total-contract-events";
import { getTotalContractTransactions } from "./total-contract-transactions";
import { getTotalContractUniqueWallets } from "./total-unique-wallets";

export type AnalyticsQueryParams = {
  chainId: number;
  contractAddress: string;
  startDate?: Date;
  endDate?: Date;
};

export function useContractTransactionAnalytics(params: {
  chainId: number;
  contractAddress: string;
  endDate?: Date;
  startDate?: Date;
}) {
  const { startDate, endDate, contractAddress, chainId } = params;

  return useQuery({
    queryKey: [
      "analytics",
      "transactions",
      {
        contractAddress: contractAddress,
        chainId: chainId,
        startDate: getDayKey(startDate),
        endDate: getDayKey(endDate),
      },
    ] as const,
    queryFn: async () => {
      return getContractTransactionAnalytics(params);
    },
  });
}

export type TotalQueryResult = {
  count: number;
};

export function useTotalContractTransactionAnalytics(params: {
  chainId: number;
  contractAddress: string;
}) {
  return useQuery({
    queryKey: [
      "analytics",
      "total-transactions",
      {
        contractAddress: params.contractAddress,
        chainId: params.chainId,
        currentDate: getDayKey(new Date()),
      },
    ] as const,
    queryFn: async () => {
      return getTotalContractTransactions(params);
    },
  });
}

function getDayKey(date?: Date) {
  if (!date) {
    return "";
  }
  return date.toISOString().split("T")[0];
}

export function useContractEventAnalytics(params: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [
      "analytics",
      "logs",
      {
        contractAddress: params.contractAddress,
        chainId: params.chainId,
        startDate: getDayKey(params.startDate),
        endDate: getDayKey(params.endDate),
      },
    ] as const,
    queryFn: async () => {
      return await getContractEventAnalytics(params);
    },
    enabled: !!params.contractAddress && !!params.chainId,
  });
}

export function useTotalContractEvents(params: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [
      "analytics",
      "total-logs",
      {
        contractAddress: params.contractAddress,
        chainId: params.chainId,
        currentDate: getDayKey(new Date()),
      },
    ] as const,
    queryFn: async () => {
      return getTotalContractEvents(params);
    },
  });
}

export function useContractFunctionBreakdown(params: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [
      "analytics",
      "functions",
      {
        contractAddress: params.contractAddress,
        chainId: params.chainId,
        startDate: `${params.startDate?.getDate()}-${params.startDate?.getMonth()}-${params.startDate?.getFullYear()}`,
        endDate: `${params.endDate?.getDate()}-${params.endDate?.getMonth()}-${params.endDate?.getFullYear()}`,
      },
    ] as const,
    queryFn: () => {
      return getContractFunctionBreakdown(params);
    },
    enabled: !!params.contractAddress && !!params.chainId,
  });
}

export function useContractEventBreakdown(params: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [
      "analytics",
      "events",
      {
        contractAddress: params.contractAddress,
        chainId: params.chainId,
        startDate: `${params.startDate?.getDate()}-${params.startDate?.getMonth()}-${params.startDate?.getFullYear()}`,
        endDate: `${params.endDate?.getDate()}-${params.endDate?.getMonth()}-${params.endDate?.getFullYear()}`,
      },
    ] as const,
    queryFn: () => {
      return getContractEventBreakdown(params);
    },
    enabled: !!params.contractAddress && !!params.chainId,
  });
}

export function useContractUniqueWalletAnalytics(params: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [
      "analytics",
      "unique-wallets",
      {
        contractAddress: params.contractAddress,
        chainId: params.chainId,
        startDate: getDayKey(params.startDate),
        endDate: getDayKey(params.endDate),
      },
    ],
    queryFn: async () => getContractUniqueWalletAnalytics(params),
  });
}

export function useTotalContractUniqueWallets(params: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [
      "analytics",
      "total-wallets",
      {
        contractAddress: params.contractAddress,
        chainId: params.chainId,
        currentDate: getDayKey(new Date()),
      },
    ] as const,
    queryFn: () => {
      return getTotalContractUniqueWallets(params);
    },
  });
}
