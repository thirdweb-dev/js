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
    queryFn: async () => {
      return getContractTransactionAnalytics(params);
    },
    queryKey: [
      "analytics",
      "transactions",
      {
        chainId: chainId,
        contractAddress: contractAddress,
        endDate: getDayKey(endDate),
        startDate: getDayKey(startDate),
      },
    ] as const,
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
    queryFn: async () => {
      return getTotalContractTransactions(params);
    },
    queryKey: [
      "analytics",
      "total-transactions",
      {
        chainId: params.chainId,
        contractAddress: params.contractAddress,
        currentDate: getDayKey(new Date()),
      },
    ] as const,
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
    enabled: !!params.contractAddress && !!params.chainId,
    queryFn: async () => {
      return await getContractEventAnalytics(params);
    },
    queryKey: [
      "analytics",
      "logs",
      {
        chainId: params.chainId,
        contractAddress: params.contractAddress,
        endDate: getDayKey(params.endDate),
        startDate: getDayKey(params.startDate),
      },
    ] as const,
  });
}

export function useTotalContractEvents(params: AnalyticsQueryParams) {
  return useQuery({
    queryFn: async () => {
      return getTotalContractEvents(params);
    },
    queryKey: [
      "analytics",
      "total-logs",
      {
        chainId: params.chainId,
        contractAddress: params.contractAddress,
        currentDate: getDayKey(new Date()),
      },
    ] as const,
  });
}

export function useContractFunctionBreakdown(params: AnalyticsQueryParams) {
  return useQuery({
    enabled: !!params.contractAddress && !!params.chainId,
    queryFn: () => {
      return getContractFunctionBreakdown(params);
    },
    queryKey: [
      "analytics",
      "functions",
      {
        chainId: params.chainId,
        contractAddress: params.contractAddress,
        endDate: `${params.endDate?.getDate()}-${params.endDate?.getMonth()}-${params.endDate?.getFullYear()}`,
        startDate: `${params.startDate?.getDate()}-${params.startDate?.getMonth()}-${params.startDate?.getFullYear()}`,
      },
    ] as const,
  });
}

export function useContractEventBreakdown(params: AnalyticsQueryParams) {
  return useQuery({
    enabled: !!params.contractAddress && !!params.chainId,
    queryFn: () => {
      return getContractEventBreakdown(params);
    },
    queryKey: [
      "analytics",
      "events",
      {
        chainId: params.chainId,
        contractAddress: params.contractAddress,
        endDate: `${params.endDate?.getDate()}-${params.endDate?.getMonth()}-${params.endDate?.getFullYear()}`,
        startDate: `${params.startDate?.getDate()}-${params.startDate?.getMonth()}-${params.startDate?.getFullYear()}`,
      },
    ] as const,
  });
}

export function useContractUniqueWalletAnalytics(params: AnalyticsQueryParams) {
  return useQuery({
    queryFn: async () => getContractUniqueWalletAnalytics(params),
    queryKey: [
      "analytics",
      "unique-wallets",
      {
        chainId: params.chainId,
        contractAddress: params.contractAddress,
        endDate: getDayKey(params.endDate),
        startDate: getDayKey(params.startDate),
      },
    ],
  });
}

export function useTotalContractUniqueWallets(params: AnalyticsQueryParams) {
  return useQuery({
    queryFn: () => {
      return getTotalContractUniqueWallets(params);
    },
    queryKey: [
      "analytics",
      "total-wallets",
      {
        chainId: params.chainId,
        contractAddress: params.contractAddress,
        currentDate: getDayKey(new Date()),
      },
    ] as const,
  });
}
