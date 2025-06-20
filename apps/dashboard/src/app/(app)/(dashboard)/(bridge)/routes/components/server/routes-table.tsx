import type { Address } from "thirdweb";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRoutes } from "../../../utils";
import { ChainlistPagination } from "../client/pagination";
import { RouteListCard } from "./routelist-card";
import { RouteListRow } from "./routelist-row";

export type SearchParams = Partial<{
  includeDeprecated: boolean;
  query: string;
  page: number;
  type: "origin" | "destination";
  // maybe later we'll have a page size param?
  // pageSize: number;
  view: "table" | "grid";
}>;

// 120 is divisible by 2, 3, and 4 so card layout looks nice
const DEFAULT_PAGE_SIZE = 120;

async function getRoutesToRender(params: SearchParams) {
  const filters: Partial<{
    originQuery?: string;
    destinationQuery?: string;
    originChainId?: number;
    originTokenAddress?: Address;
    destinationChainId?: number;
    destinationTokenAddress?: Address;
  }> = {};

  if (params.type === "origin" || typeof params.type === "undefined") {
    if (params.query?.startsWith("0x")) {
      filters.originTokenAddress = params.query as Address;
    } else if (Number.isInteger(Number(params.query))) {
      filters.originChainId = Number(params.query);
    } else if (params.query) {
      filters.originQuery = params.query;
    }
  } else if (params.type === "destination") {
    if (params.query?.startsWith("0x")) {
      filters.destinationTokenAddress = params.query as Address;
    } else if (Number.isInteger(Number(params.query))) {
      filters.destinationChainId = Number(params.query);
    } else if (params.query) {
      filters.destinationQuery = params.query;
    }
  }
  const routes = await getRoutes({
    destinationQuery: filters.destinationQuery,
    limit: DEFAULT_PAGE_SIZE,
    offset: DEFAULT_PAGE_SIZE * ((params.page || 1) - 1),
    originQuery: filters.originQuery,
  });

  return {
    filteredCount: routes.meta.filteredCount,
    routesToRender: routes.data,
    totalCount: routes.meta.totalCount,
  };
}

export async function RoutesData(props: {
  searchParams: SearchParams;
  activeView: "table" | "grid";
  isLoggedIn: boolean;
}) {
  const { routesToRender, totalCount, filteredCount } = await getRoutesToRender(
    props.searchParams,
  );

  const totalPages = Math.ceil(filteredCount / DEFAULT_PAGE_SIZE);

  return (
    <>
      <main>
        {/* empty state */}
        {routesToRender.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center rounded-lg border p-8 lg:h-[500px]">
            <p className="text-2xl">No Results found</p>
          </div>
        ) : props.activeView === "table" ? (
          <TableContainer className="overflow-hidden rounded-xl border border-border/50 bg-card/50 shadow-sm transition-all">
            <Table>
              <TableHeader className="z-0">
                <TableRow className="border-border/50 border-b bg-muted/50">
                  <TableHead className="py-4 font-medium text-muted-foreground/80 text-xs uppercase tracking-wider">
                    Origin Token
                  </TableHead>
                  <TableHead className="py-4 font-medium text-muted-foreground/80 text-xs uppercase tracking-wider">
                    Origin Chain
                  </TableHead>
                  <TableHead className="py-4 font-medium text-muted-foreground/80 text-xs uppercase tracking-wider">
                    Destination Token
                  </TableHead>
                  <TableHead className="py-4 font-medium text-muted-foreground/80 text-xs uppercase tracking-wider">
                    Destination Chain
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routesToRender.map((route) => (
                  <RouteListRow
                    destinationChainId={route.destinationToken.chainId}
                    destinationTokenAddress={route.destinationToken.address}
                    destinationTokenIconUri={route.destinationToken.iconUri}
                    destinationTokenName={route.destinationToken.name}
                    destinationTokenSymbol={route.destinationToken.symbol}
                    key={`${route.originToken.chainId}:${route.originToken.address}-${route.destinationToken.chainId}:${route.destinationToken.address}`}
                    originChainId={route.originToken.chainId}
                    originTokenAddress={route.originToken.address}
                    originTokenIconUri={route.originToken.iconUri}
                    originTokenName={route.originToken.name}
                    originTokenSymbol={route.originToken.symbol}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {routesToRender.map((route) => (
              <li
                className="h-full"
                key={`${route.originToken.chainId}:${route.originToken.address}-${route.destinationToken.chainId}:${route.destinationToken.address}`}
              >
                <RouteListCard
                  destinationChainId={route.destinationToken.chainId}
                  destinationTokenAddress={route.destinationToken.address}
                  destinationTokenIconUri={route.destinationToken.iconUri}
                  destinationTokenName={route.destinationToken.name}
                  destinationTokenSymbol={route.destinationToken.symbol}
                  originChainId={route.originToken.chainId}
                  originTokenAddress={route.originToken.address}
                  originTokenIconUri={route.originToken.iconUri}
                  originTokenName={route.originToken.name}
                  originTokenSymbol={route.originToken.symbol}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
      <div className="h-10" />
      {totalPages > 1 && (
        <ChainlistPagination
          activePage={Number(props.searchParams.page) || 1}
          totalPages={totalPages}
        />
      )}
      <div className="h-4" />
      <p className="text-balance text-center text-muted-foreground text-sm">
        Showing{" "}
        <span className="text-accent-foreground">{routesToRender.length}</span>{" "}
        out of{" "}
        {filteredCount !== totalCount ? (
          <>
            <span className="text-accent-foreground">
              {filteredCount.toLocaleString()}
            </span>{" "}
            routes that match filters. (Total:{" "}
            <span className="text-accent-foreground">
              {totalCount.toLocaleString()}
            </span>
            )
          </>
        ) : (
          <>
            <span className="text-accent-foreground">
              {totalCount.toLocaleString()}
            </span>{" "}
            routes.
          </>
        )}
      </p>
    </>
  );
}
