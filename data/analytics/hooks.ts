import { THIRDWEB_ANALYTICS_API_HOSTNAME } from "./constants";
import { useQuery } from "@tanstack/react-query";
import {
  Arbitrum,
  ArbitrumGoerli,
  Avalanche,
  AvalancheFuji,
  Base,
  BaseGoerli,
  BinanceTestnet,
  Ethereum,
  Fantom,
  Goerli,
  Mumbai,
  Optimism,
  Polygon,
  PolygonZkevmTestnet,
  ScrollAlphaTestnet,
  Sepolia,
} from "@thirdweb-dev/chains";
import { ethers } from "ethers";

export type AnalyticsQueryParams = {
  chainId: number;
  contractAddress: string;
  startDate?: Date;
  endDate?: Date;
  interval?: "minute" | "hour" | "day" | "week" | "month";
};

// TODO: Keep updated with actual ClickHouse data
export const SUPPORTED_ANALYTICS_CHAINS: number[] = [
  Ethereum.chainId,
  Goerli.chainId,
  Optimism.chainId,
  BinanceTestnet.chainId,
  Polygon.chainId,
  Fantom.chainId,
  PolygonZkevmTestnet.chainId,
  Base.chainId,
  Arbitrum.chainId,
  AvalancheFuji.chainId,
  Avalanche.chainId,
  Mumbai.chainId,
  BaseGoerli.chainId,
  ArbitrumGoerli.chainId,
  ScrollAlphaTestnet.chainId,
  Sepolia.chainId,
];

async function makeQuery(
  path: string,
  query: Record<string, string | number | undefined>,
) {
  const queryString = `?${Object.entries(query)
    .filter(([, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
    .join(`&`)}`;
  return fetch(`${THIRDWEB_ANALYTICS_API_HOSTNAME}${path}${queryString}`, {
    method: "GET",
  });
}

type TransactionQueryResult = {
  count: number;
  time: string;
};

async function getTransactionAnalytics(
  params: AnalyticsQueryParams,
): Promise<TransactionQueryResult[]> {
  const res = await makeQuery("/transactions", {
    chainId: params.chainId,
    contractAddress: params.contractAddress,
    startDate: params.startDate?.toString(),
    endDate: params.endDate?.toString(),
    interval: params.interval,
  });

  const { results } = await res.json();
  return results.map((item: any) => ({
    count: parseInt(item.cnt),
    time: new Date(item.time).getTime(),
  }));
}

export function useTransactionAnalytics(params: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [
      "analytics",
      "transactions",
      {
        contractAddress: params.contractAddress,
        chainId: params.chainId,
        startDate: `${params.startDate?.getDate()}-${params.startDate?.getMonth()}-${params.startDate?.getFullYear()}`,
        endDate: `${params.endDate?.getDate()}-${params.endDate?.getMonth()}-${params.endDate?.getFullYear()}`,
      },
    ] as const,
    queryFn: async () => {
      return await getTransactionAnalytics(params);
    },
    enabled: !!params.contractAddress && !!params.chainId,
  });
}

export type TotalQueryResult = {
  count: number;
};

async function getTotalTransactionAnalytics(
  params: AnalyticsQueryParams,
): Promise<TotalQueryResult> {
  const res = await makeQuery("/transactions/total", {
    chainId: params.chainId,
    contractAddress: params.contractAddress,
  });

  const { results } = await res.json();
  return {
    count: parseInt(results[0].cnt),
  };
}

export function useTotalTransactionAnalytics(params: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [
      "analytics",
      "total-transactions",
      {
        contractAddress: params.contractAddress,
        chainId: params.chainId,
        currentDate: new Date().toISOString().split("T")[0],
      },
    ] as const,
    queryFn: async () => {
      return await getTotalTransactionAnalytics(params);
    },
    enabled: !!params.contractAddress && !!params.chainId,
  });
}

async function getLogsAnalytics(
  params: AnalyticsQueryParams,
): Promise<TransactionQueryResult[]> {
  const res = await makeQuery("/logs", {
    chainId: params.chainId,
    contractAddress: params.contractAddress,
    startDate: params.startDate?.toString(),
    endDate: params.endDate?.toString(),
    interval: params.interval,
  });

  const { results } = await res.json();
  return results.map((item: any) => ({
    count: parseInt(item.cnt),
    time: new Date(item.time).getTime(),
  }));
}

export function useLogsAnalytics(params: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [
      "analytics",
      "logs",
      {
        contractAddress: params.contractAddress,
        chainId: params.chainId,
        startDate: `${params.startDate?.getDate()}-${params.startDate?.getMonth()}-${params.startDate?.getFullYear()}`,
        endDate: `${params.endDate?.getDate()}-${params.endDate?.getMonth()}-${params.endDate?.getFullYear()}`,
      },
    ] as const,
    queryFn: async () => {
      return await getLogsAnalytics(params);
    },
    enabled: !!params.contractAddress && !!params.chainId,
  });
}

async function getTotalLogsAnalytics(
  params: AnalyticsQueryParams,
): Promise<TotalQueryResult> {
  const res = await makeQuery("/logs/total", {
    chainId: params.chainId,
    contractAddress: params.contractAddress,
  });

  const { results } = await res.json();
  return {
    count: parseInt(results[0].cnt),
  };
}

export function useTotalLogsAnalytics(params: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [
      "analytics",
      "total-logs",
      {
        contractAddress: params.contractAddress,
        chainId: params.chainId,
        currentDate: new Date().toISOString().split("T")[0],
      },
    ] as const,
    queryFn: async () => {
      return await getTotalLogsAnalytics(params);
    },
    enabled: !!params.contractAddress && !!params.chainId,
  });
}

type FunctionsQueryResponse = {
  function_name: string;
  cnt: string;
  time: string;
};

type FunctionsQueryResult = {
  time: string;
  [key: string]: any;
};

async function getFunctionsAnalytics(
  params: AnalyticsQueryParams,
): Promise<FunctionsQueryResult[]> {
  const res = await makeQuery("/functions", {
    chainId: params.chainId,
    contractAddress: params.contractAddress,
    startDate: params.startDate?.toString(),
    endDate: params.endDate?.toString(),
    interval: params.interval,
  });

  const { results } = await res.json();
  const callsByTime = (results as FunctionsQueryResponse[]).reduce(
    (acc, item) => {
      const time = new Date(item.time).getTime();
      if (!acc[time]) {
        acc[time] = {
          [item.function_name]: parseInt(item.cnt),
        };
      } else {
        acc[time][item.function_name] = parseInt(item.cnt);
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  return Object.keys(callsByTime).map((time) => {
    return { time: parseInt(time), ...callsByTime[time] };
  });
}

export function useFunctionsAnalytics(params: AnalyticsQueryParams) {
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
      return getFunctionsAnalytics(params);
    },
    enabled: !!params.contractAddress && !!params.chainId,
  });
}

type EventsQueryResponse = {
  event_name: string;
  cnt: string;
  time: string;
};

type EventsQueryResult = {
  time: string;
  [key: string]: any;
};

async function getEventsAnalytics(
  params: AnalyticsQueryParams,
): Promise<EventsQueryResult[]> {
  const res = await makeQuery("/events", {
    chainId: params.chainId,
    contractAddress: params.contractAddress,
    startDate: params.startDate?.toString(),
    endDate: params.endDate?.toString(),
    interval: params.interval,
  });

  const { results } = await res.json();
  const callsByTime = (results as EventsQueryResponse[]).reduce(
    (acc, item) => {
      const time = new Date(item.time).getTime();
      if (!acc[time]) {
        acc[time] = {
          [item.event_name]: parseInt(item.cnt),
        };
      } else {
        acc[time][item.event_name] = parseInt(item.cnt);
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  return Object.keys(callsByTime).map((time) => {
    return { time: parseInt(time), ...callsByTime[time] };
  });
}

export function useEventsAnalytics(params: AnalyticsQueryParams) {
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
      return getEventsAnalytics(params);
    },
    enabled: !!params.contractAddress && !!params.chainId,
  });
}

type ValueQueryResult = {
  value: number;
  time: string;
};

async function getValueAnalytics(
  params: AnalyticsQueryParams,
): Promise<ValueQueryResult[]> {
  const res = await makeQuery("/value", {
    chainId: params.chainId,
    contractAddress: params.contractAddress,
    startDate: params.startDate?.toString(),
    endDate: params.endDate?.toString(),
    interval: params.interval,
  });

  const { results } = await res.json();
  return results.map((item: any) => ({
    value: parseFloat(ethers.utils.formatEther(item.value.toString())),
    time: new Date(item.time).getTime(),
  }));
}

export function useValueAnalytics(params: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [
      "analytics",
      "value",
      {
        contractAddress: params.contractAddress,
        chainId: params.chainId,
        startDate: `${params.startDate?.getDate()}-${params.startDate?.getMonth()}-${params.startDate?.getFullYear()}`,
        endDate: `${params.endDate?.getDate()}-${params.endDate?.getMonth()}-${params.endDate?.getFullYear()}`,
      },
    ] as const,
    queryFn: () => {
      return getValueAnalytics(params);
    },
    enabled: !!params.contractAddress && !!params.chainId,
  });
}

type WalletsQueryResult = {
  wallets: number;
  time: string;
};

async function getUniqueWalletsAnalytics(
  params: AnalyticsQueryParams,
): Promise<WalletsQueryResult[]> {
  const res = await makeQuery("/wallets/active", {
    chainId: params.chainId,
    contractAddress: params.contractAddress,
    startDate: params.startDate?.toString(),
    endDate: params.endDate?.toString(),
    interval: params.interval,
  });

  const { results } = await res.json();
  return results.map((item: any) => ({
    wallets: parseInt(item.active_wallets),
    time: new Date(item.time).getTime(),
  }));
}

export function useUniqueWalletsAnalytics(params: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [
      "analytics",
      "unique-wallets",
      {
        contractAddress: params.contractAddress,
        chainId: params.chainId,
        startDate: `${params.startDate?.getDate()}-${params.startDate?.getMonth()}-${params.startDate?.getFullYear()}`,
        endDate: `${params.endDate?.getDate()}-${params.endDate?.getMonth()}-${params.endDate?.getFullYear()}`,
      },
    ] as const,
    queryFn: () => {
      return getUniqueWalletsAnalytics(params);
    },
    enabled: !!params.contractAddress && !!params.chainId,
  });
}

async function getCumulativeWalletsAnalytics(
  params: AnalyticsQueryParams,
): Promise<WalletsQueryResult[]> {
  const res = await makeQuery("/wallets/cumulative", {
    chainId: params.chainId,
    contractAddress: params.contractAddress,
    startDate: params.startDate?.toString(),
    endDate: params.endDate?.toString(),
    interval: params.interval,
  });

  const { results } = await res.json();
  return results.map((item: any) => ({
    wallets: parseInt(item.cumulative_user_count),
    time: new Date(item.time).getTime(),
  }));
}

export function useCumulativeWalletsAnalytics(params: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [
      "analytics",
      "cumulative-wallets",
      {
        contractAddress: params.contractAddress,
        chainId: params.chainId,
        startDate: `${params.startDate?.getDate()}-${params.startDate?.getMonth()}-${params.startDate?.getFullYear()}`,
        endDate: `${params.endDate?.getDate()}-${params.endDate?.getMonth()}-${params.endDate?.getFullYear()}`,
      },
    ] as const,
    queryFn: () => {
      return getCumulativeWalletsAnalytics(params);
    },
    enabled: !!params.contractAddress && !!params.chainId,
  });
}

async function getTotalWalletsAnalytics(
  params: AnalyticsQueryParams,
): Promise<TotalQueryResult> {
  const res = await makeQuery("/wallets/total", {
    chainId: params.chainId,
    contractAddress: params.contractAddress,
  });

  const { results } = await res.json();
  return {
    count: parseInt(results[0].cnt),
  };
}

export function useTotalWalletsAnalytics(params: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [
      "analytics",
      "total-wallets",
      {
        contractAddress: params.contractAddress,
        chainId: params.chainId,
        currentDate: new Date().toISOString().split("T")[0],
      },
    ] as const,
    queryFn: () => {
      return getTotalWalletsAnalytics(params);
    },
    enabled: !!params.contractAddress && !!params.chainId,
  });
}
