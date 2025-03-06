import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Address } from "thirdweb";
import { getRoutes } from "../../../utils";
import { ChainlistPagination } from "../client/pagination";
import { RouteListCard } from "../server/routelist-card";
import { RouteListRow } from "../server/routelist-row";

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
const DEFAULT_PAGE = 1;

async function getRoutesToRender(params: SearchParams) {
  const filters: Partial<{
    limit: number;
    offset: number;
    originChainId?: number;
    originTokenAddress?: Address;
    destinationChainId?: number;
    destinationTokenAddress?: Address;
  }> = {};

  if (params.type === "origin" || typeof params.type === "undefined") {
    if (params.query?.startsWith("0x")) {
      filters.originTokenAddress = params.query as Address;
    } else if (params.query) {
      filters.originChainId = Number(params.query);
    }
  } else if (params.type === "destination") {
    if (params.query?.startsWith("0x")) {
      filters.destinationTokenAddress = params.query as Address;
    } else if (params.query) {
      filters.destinationChainId = Number(params.query);
    }
  }
  // Temporary, will update this after the /routes endpoint
  filters.limit = 10_000;

  const routes = await getRoutes(filters);

  const totalCount = routes.length;

  return {
    routesToRender: routes,
    totalCount,
    filteredCount: routes.length,
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

  // pagination
  const totalPages = Math.ceil(routesToRender.length / DEFAULT_PAGE_SIZE);

  const activePage = Number(props.searchParams.page || DEFAULT_PAGE);
  const pageSize = DEFAULT_PAGE_SIZE;
  const startIndex = (activePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRoutes = routesToRender.slice(startIndex, endIndex);

  return (
    <>
      <main>
        {/* empty state */}
        {paginatedRoutes.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center rounded-lg border p-8 lg:h-[500px]">
            <p className="text-2xl">No Results found</p>
          </div>
        ) : props.activeView === "table" ? (
          <TableContainer>
            <Table>
              <TableHeader className="z-0">
                <TableRow>
                  <TableHead>Origin Token</TableHead>
                  <TableHead>Origin Chain</TableHead>
                  <TableHead>Destination Token</TableHead>
                  <TableHead>Destination Chain</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRoutes.map((route) => (
                  <RouteListRow
                    key={`${route.originToken.chainId}:${route.originToken.address}-${route.destinationToken.chainId}:${route.destinationToken.address}`}
                    originChainId={route.originToken.chainId}
                    originTokenAddress={route.originToken.address}
                    originTokenIconUri={route.originToken.iconUri}
                    destinationChainId={route.destinationToken.chainId}
                    destinationTokenAddress={route.destinationToken.address}
                    destinationTokenIconUri={route.destinationToken.iconUri}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedRoutes.map((route) => (
              <li
                key={`${route.originToken.chainId}:${route.originToken.address}-${route.destinationToken.chainId}:${route.destinationToken.address}`}
                className="h-full"
              >
                <RouteListCard
                  originChainId={route.originToken.chainId}
                  originTokenAddress={route.originToken.address}
                  originTokenIconUri={route.originToken.iconUri}
                  destinationChainId={route.destinationToken.chainId}
                  destinationTokenAddress={route.destinationToken.address}
                  destinationTokenIconUri={route.destinationToken.iconUri}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
      <div className="h-10" />
      {totalPages > 1 && (
        <ChainlistPagination totalPages={totalPages} activePage={activePage} />
      )}
      <div className="h-4" />
      <p className="text-balance text-center text-muted-foreground text-sm">
        Showing{" "}
        <span className="text-accent-foreground">{paginatedRoutes.length}</span>{" "}
        out of{" "}
        {filteredCount !== totalCount ? (
          <>
            <span className="text-accent-foreground">{filteredCount}</span>{" "}
            routes that match filters. (Total:{" "}
            <span className="text-accent-foreground">{totalCount}</span>)
          </>
        ) : (
          <>
            <span className="text-accent-foreground">{totalCount}</span> routes.
          </>
        )}
      </p>
    </>
  );
}
