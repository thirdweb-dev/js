import { defineDashboardChain } from "lib/defineDashboardChain";
import { type ChainMetadata, getChainMetadata } from "thirdweb/chains";
import invariant from "tiny-invariant";

export type TimeRange = "month" | "week" | "day";
export type SortBy = "transactionCount" | "walletCount" | "gasUsage";

const typesenseApiKey =
  process.env.NEXT_PUBLIC_TYPESENSE_CONTRACT_API_KEY || "";

export type TrendingContract = {
  name: string;
  chainMetadata: ChainMetadata;
  contractAddress: string;
  transactionCount: string;
  transactionCountChange: number;
  walletCount: string;
  walletCountChange: number;
  gasUsage: string;
  gasUsageChange: number;
  valueMoved: string;
  valueMovedChange: number;
  type?: string;
};

const DOMAIN = "https://search.thirdweb.com";
const COLLECTION = "hot_contracts";
const TYPESENSE_URL = `${DOMAIN}/collections/${COLLECTION}/documents/search`;

const getSearchQueryUrl = ({
  page = 1,
  perPage = 10,
  query = "",
  chainId,
  timeRange = "month",
  sortBy = "transactionCount",
}: {
  page?: number;
  perPage?: number;
  query?: string;
  chainId?: number;
  timeRange?: TimeRange;
  sortBy?: SortBy;
}) => {
  const baseUrl = new URL(TYPESENSE_URL);
  baseUrl.searchParams.set("query_by", "name,chainId,contractAddress");
  baseUrl.searchParams.set("q", query);
  baseUrl.searchParams.set("page", page.toString());
  baseUrl.searchParams.set("per_page", perPage.toString());
  const dateFilter =
    timeRange === "month"
      ? `updatedAt:> ${Date.now() - 30 * 24 * 60 * 60 * 1000}`
      : timeRange === "week"
        ? `updatedAt:> ${Date.now() - 7 * 24 * 60 * 60 * 1000}`
        : `updatedAt:> ${Date.now() - 1 * 24 * 60 * 60 * 1000}`;
  const gasUsageFilter =
    timeRange === "month"
      ? "last30Days.gasUsage:> 0"
      : timeRange === "week"
        ? "last7Days.gasUsage:> 0"
        : "last24Hr.gasUsage:> 0";
  baseUrl.searchParams.set(
    "filter_by",
    `${dateFilter} && ${gasUsageFilter}${chainId ? ` && chainId:=${chainId}` : ""}`,
  );
  baseUrl.searchParams.set(
    "sort_by",
    timeRange === "month"
      ? `last30Days.${sortBy}:desc`
      : timeRange === "week"
        ? `last7Days.${sortBy}:desc`
        : `last24Hr.${sortBy}:desc`,
  );
  return baseUrl.toString();
};

export async function fetchTopContracts(args?: {
  chainId?: number;
  query?: string;
  perPage?: number;
  page?: number;
  timeRange?: TimeRange;
  sortBy?: SortBy;
}) {
  invariant(typesenseApiKey, "No typesense api key");
  const res = await fetch(
    getSearchQueryUrl({
      chainId: args?.chainId,
      page: args?.page || 1,
      perPage: args?.perPage || 10,
      query: args?.query,
      sortBy: args?.sortBy,
      timeRange: args?.timeRange,
    }),
    {
      headers: {
        "x-typesense-api-key": typesenseApiKey,
      },
      next: { revalidate: 120 },
    },
  );
  const result = await res.json();
  if (!result.hits) return [];

  return (await Promise.all(
    // biome-ignore lint/suspicious/noExplicitAny: FIXME
    result.hits.map(async (hit: any) => {
      const document = hit.document;
      const chainMetadata = await getChainMetadata(
        // eslint-disable-next-line no-restricted-syntax
        defineDashboardChain(Number(document.chainId), undefined),
      );
      let name = document.name;
      if (
        !name ||
        name === "Unimported Contract" ||
        name === "UnknownContract"
      ) {
        name = await fetchContractName(
          document.chainId,
          document.contractAddress,
        );
      }

      let timeData: {
        walletCount: number;
        walletCountChange: number;
        transactionCount: number;
        transactionCountChange: number;
        gasUsage: number;
        gasUsageChange: number;
        totalValueMoved: number;
        totalValueMovedChange: number;
      };
      switch (args?.timeRange) {
        case "week":
          timeData = document.last7Days;
          break;
        case "day":
          timeData = document.last24Hr;
          break;
        case "month":
          timeData = document.last30Days;
          break;
        default:
          timeData = document.last24Hr;
          break;
      }

      return {
        chainMetadata,
        contractAddress: document.contractAddress,
        gasUsage: `${formatNumber(timeData.gasUsage)} ${chainMetadata.nativeCurrency.symbol}`,
        gasUsageChange: timeData.gasUsageChange,
        name,
        transactionCount: formatNumber(timeData.transactionCount),
        transactionCountChange: timeData.transactionCountChange,
        type: (document.type as Array<string>)?.find((t) =>
          t.startsWith("ERC"),
        ),
        valueMoved:
          timeData.totalValueMoved !== 0
            ? `${formatNumber(timeData.totalValueMoved)} ${chainMetadata.nativeCurrency.symbol}`
            : "",
        valueMovedChange: timeData.totalValueMovedChange,
        walletCount: formatNumber(timeData.walletCount),
        walletCountChange: timeData.walletCountChange,
      } as TrendingContract;
    }),
  )) as TrendingContract[];
}

async function fetchContractName(chainId: number, contractAddress: string) {
  const res = await fetch(
    `https://contract.thirdweb.com/metadata/${chainId}/${contractAddress}`,
  );
  const json = await res.json();
  if (json.error) {
    return "";
  }
  const compilationTarget = json.settings.compilationTarget;
  const targets = Object.keys(compilationTarget);
  const name = targets[0] ? compilationTarget[targets[0]] : "";
  return name;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toLocaleString(undefined, {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    })}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toLocaleString(undefined, {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    })}k`;
  }
  return num.toLocaleString(undefined, {
    maximumFractionDigits: num < 10 ? 2 : 1,
    minimumFractionDigits: 0,
  });
};
