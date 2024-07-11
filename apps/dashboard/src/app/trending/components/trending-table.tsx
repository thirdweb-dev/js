import {
  type ChainMetadata,
  defineChain,
  getChainMetadata,
} from "thirdweb/chains";
import { shortenAddress } from "thirdweb/utils";
import invariant from "tiny-invariant";
import { ChainIcon } from "../../(dashboard)/(chain)/components/server/chain-icon";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../@/components/ui/table";
import { TablePagination } from "./pagination.client";
import { TimeRangeSwitcher } from "./time-range-switcher.client";

export type TimeRange = "month" | "week" | "day";

type TrendingContractProps = {
  chainId?: number;
  perPage?: number;
  page?: number;
  timeRange?: TimeRange;
};

const typesenseApiKey =
  process.env.NEXT_PUBLIC_TYPESENSE_CONTRACT_API_KEY || "";

type TrendingContract = {
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

export const getSearchQueryUrl = ({
  page = 1,
  perPage = 10,
  query = "",
  chainId,
  timeRange = "day",
}: {
  page?: number;
  perPage?: number;
  query?: string;
  chainId?: number;
  timeRange?: TimeRange;
}) => {
  const baseUrl = new URL(TYPESENSE_URL);
  baseUrl.searchParams.set("query_by", "name,chainId,contractAddress");
  baseUrl.searchParams.set("q", query);
  baseUrl.searchParams.set("page", page.toString());
  baseUrl.searchParams.set("per_page", perPage.toString());
  if (chainId) {
    baseUrl.searchParams.set("filter_by", `chainId:=${chainId}`);
  }
  baseUrl.searchParams.set(
    "sort_by",
    timeRange === "month"
      ? "last30Days.transactionCount:desc"
      : timeRange === "week"
        ? "last7Days.transactionCount:desc"
        : "last24Hr.transactionCount:desc",
  );
  return baseUrl.toString();
};

export async function fetchTopContracts(args?: {
  chainId?: number;
  query?: string;
  perPage?: number;
  page?: number;
  timeRange?: TimeRange;
}) {
  invariant(typesenseApiKey, "No typesense api key");
  const res = await fetch(
    getSearchQueryUrl({
      perPage: args?.perPage || 10,
      page: args?.page || 1,
      chainId: args?.chainId,
      query: args?.query,
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
        defineChain(Number(document.chainId)),
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
        name,
        chainMetadata,
        contractAddress: document.contractAddress,
        transactionCount: formatNumber(timeData.transactionCount),
        transactionCountChange: timeData.transactionCountChange,
        walletCount: formatNumber(timeData.walletCount),
        walletCountChange: timeData.walletCountChange,
        gasUsage: `${formatNumber(timeData.gasUsage)} ${chainMetadata.nativeCurrency.symbol}`,
        gasUsageChange: timeData.gasUsageChange,
        valueMoved:
          timeData.totalValueMoved !== 0
            ? `${formatNumber(timeData.totalValueMoved)} ${chainMetadata.nativeCurrency.symbol}`
            : "",
        valueMovedChange: timeData.totalValueMovedChange,
        type: (document.type as Array<string>)?.find((t) =>
          t.startsWith("ERC"),
        ),
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
  const name = compilationTarget[targets[0]];
  return name;
}

export async function TrendingContractSection(props: TrendingContractProps) {
  const isLandingPage = props.chainId === undefined;
  const topContracts = await fetchTopContracts({
    timeRange: props.timeRange,
    perPage: props.perPage,
    chainId: props.chainId,
    page: props.page,
  });
  const firstIndex = Math.max(
    0,
    ((props.page || 1) - 1) * (props.perPage || 10),
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full flex flex-row gap-4 justify-center md:justify-end py-4">
        <TimeRangeSwitcher />
      </div>
      <Table
        className={`border-white ${isLandingPage && "border-b-[1px] font-mono text-xs md:text-sm mb-4"}`}
      >
        <TableHeader>
          <TableRow
            className={`bg-secondary ${isLandingPage && "border-white"}`}
          >
            <TableHead className="text-left">RANK</TableHead>
            <TableHead>CONTRACT</TableHead>
            <TableHead className="text-left">
              CHANGE (
              {props.timeRange === "month"
                ? "30d"
                : props.timeRange === "week"
                  ? "7d"
                  : "24h"}
              )
            </TableHead>
            {props.chainId ? null : <TableHead>CHAIN</TableHead>}
            <TableHead className="text-center">TYPE</TableHead>
            <TableHead className="text-right">TRANSACTIONS</TableHead>
            <TableHead className="text-right">WALLETS</TableHead>
            <TableHead className="text-right">GAS USAGE</TableHead>
            <TableHead className="text-right">VALUE RECEIVED</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topContracts.map((contract, index) => (
            <TableRow
              key={`${contract.chainMetadata.chainId}${contract.contractAddress}${index}`}
              className={`${isLandingPage && index + firstIndex < 3 ? `bg-orange-${300 + index * 100}/20` : isLandingPage && "bg-black/50"}  ${isLandingPage && "border-white !border-x-[1px]"}`}
            >
              <TableCell className="text-left">
                {index + 1 + firstIndex}
              </TableCell>
              <TableCell className="font-medium">
                <a
                  href={`/${contract.chainMetadata.chainId}/${contract.contractAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`${isLandingPage ? "underline" : "text-primary"}`}
                >
                  {getContractName(contract)}
                </a>
              </TableCell>
              <TableCell className="text-left flex justify-start">
                <ChangeCell
                  displayCount={contract.transactionCount}
                  change={contract.transactionCountChange}
                />
              </TableCell>
              {props.chainId ? null : (
                <TableCell>
                  <ChainCell chainMetadata={contract.chainMetadata} />
                </TableCell>
              )}
              <TableCell className="text-center">
                {contract.type ? contract.type : null}
              </TableCell>
              <TableCell className="text-right">
                {contract.transactionCount}
              </TableCell>
              <TableCell className="text-right">
                {contract.walletCount}
              </TableCell>
              <TableCell className="text-right">{contract.gasUsage}</TableCell>
              <TableCell className="text-right">
                {contract.valueMoved}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {isLandingPage && (
          <TableCaption className="text-left text-primary-foreground">
            built by{" "}
            <a href="https://thirdweb.com" className="underline">
              thirdweb
            </a>
          </TableCaption>
        )}
      </Table>
      <div className="w-full flex flex-row gap-4 justify-end">
        <TablePagination isLandingPage={isLandingPage} />
      </div>
    </div>
  );
}

function ChangeCell(props: { displayCount: string; change: number }) {
  if (!props.displayCount) {
    return null;
  }
  const color = props.change > 0 ? "text-success-foreground" : "text-red-400";
  const badge = (
    <span className={`${color}`}>
      {props.change > 0 ? "▲" : "▼"}{" "}
      {props.change < 10 ? props.change.toFixed(1) : props.change.toFixed(0)}%
    </span>
  );
  return (
    <div className="flex flex-row items-center gap-2 justify-end group">
      {badge}
    </div>
  );
}

function ChainCell(props: { chainMetadata: ChainMetadata }) {
  const chainMetadata = props.chainMetadata;
  return (
    <div className="flex flex-row items-center gap-3">
      <ChainIcon iconUrl={chainMetadata.icon?.url} className="size-6" />
      <a
        href={`/${chainMetadata.chainId}`}
        target="_blank"
        rel="noreferrer"
        className="underline"
      >
        {chainMetadata.name.split(" ")[0]}
      </a>
    </div>
  );
}

function getContractName(contract: TrendingContract) {
  if (contract.name && contract.name !== "Unimported Contract") {
    return contract.name;
  }
  return shortenAddress(contract.contractAddress);
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}k`;
  }
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: num < 10 ? 2 : 1,
  });
};
