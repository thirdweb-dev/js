import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Fuse from "fuse.js";
import { StarButton } from "../../../components/client/star-button";
import type {
  ChainMetadataWithServices,
  ChainSupportedService,
} from "../../../types/chain";
import { getChains } from "../../../utils";
import { ChainlistPagination } from "../client/pagination";
import { ChainListCard } from "../server/chainlist-card";
import { ChainListRow } from "../server/chainlist-row";

export type SearchParams = Partial<{
  type: "mainnets" | "testnets";
  service: ChainSupportedService[] | ChainSupportedService;
  includeDeprecated: boolean;
  query: string;
  page: number;
  // maybe later we'll have a page size param?
  // pageSize: number;

  // table or grid style?
  view: "table" | "grid";
}>;

// 24 because it is cleanly divisible by 2,3 and 4 (for card grid)
const DEFAULT_PAGE_SIZE = 24;
const DEFAULT_PAGE = 1;

async function getChainsToRender(params: SearchParams) {
  const chains = await getChains();

  // sort the chains
  const sortedChains = chains.sort((a, b) => {
    // sort by number of services first
    const aServices = a.services.filter((s) => s.enabled).length;
    const bServices = b.services.filter((s) => s.enabled).length;
    if (aServices > bServices) {
      return -1;
    }
    if (aServices < bServices) {
      return 1;
    }
    // if they have the same number of services, sort by chainId
    if (a.chainId > b.chainId) {
      return 1;
    }
    if (a.chainId < b.chainId) {
      return -1;
    }
    return 0;
  });

  const filteredChains: ChainMetadataWithServices[] = [];
  for (const chain of sortedChains) {
    // handle deprecated chains
    if (!params.includeDeprecated) {
      // if chain is deprecated, return false to filter it out
      if (chain.status === "deprecated") {
        // skip to the next chain
        continue;
      }
    }
    // handle testnet and mainnet filter cases (if )
    if (params.type) {
      // if the filter is testnet and the chain is not a testnet, return false to filter it out
      if (params.type === "testnets" && !chain.testnet) {
        // skip to the next chain
        continue;
      }
      // if the filter is mainnet and the chain is a testnet, return false to filter it out
      if (params.type === "mainnets" && chain.testnet) {
        // skip to the next chain
        continue;
      }
    }

    // handle services filter (if no filter set, all chains pass through here)
    if (params.service) {
      const urlServiceArray = Array.isArray(params.service)
        ? params.service
        : [params.service];

      // if the chain does not have all of the services in the filter, return false to filter it out
      if (
        !urlServiceArray.every((service) => {
          return chain.services.find((s) => s.enabled && s.service === service);
        })
      ) {
        // skip to the next chain
        continue;
      }
    }

    // if we got here, push the chain to the filtered chains array
    filteredChains.push(chain);
  }

  const totalCount = chains.length;
  const filteredCount = filteredChains.length;

  if (params.query) {
    const fuse = new Fuse(filteredChains, {
      keys: [
        {
          name: "name",
          weight: 2,
        },
        {
          name: "chainId",
          weight: 1,
        },
      ],
      threshold: 0.2,
    });
    return {
      chainsToRender: fuse
        .search(params.query, {
          limit: DEFAULT_PAGE_SIZE,
        })
        .map((e) => e.item),
      totalCount,
      filteredCount,
    };
  }
  return {
    chainsToRender: filteredChains,
    totalCount,
    filteredCount,
  };
}

export async function ChainsData(props: {
  searchParams: SearchParams;
  activeView: "table" | "grid";
  isLoggedIn: boolean;
}) {
  const { chainsToRender, totalCount, filteredCount } = await getChainsToRender(
    props.searchParams,
  );

  // pagination
  const totalPages = Math.ceil(chainsToRender.length / DEFAULT_PAGE_SIZE);

  const activePage = Number(props.searchParams.page || DEFAULT_PAGE);
  const pageSize = DEFAULT_PAGE_SIZE;
  const startIndex = (activePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedChains = chainsToRender.slice(startIndex, endIndex);

  return (
    <>
      <main>
        {/* empty state */}
        {paginatedChains.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center rounded-lg border p-8 lg:h-[500px]">
            <p className="text-2xl">No Results found</p>
          </div>
        ) : props.activeView === "table" ? (
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Chain ID</TableHead>
                  <TableHead>Native Token</TableHead>
                  <TableHead>Enabled Services</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedChains.map((chain) => (
                  <ChainListRow
                    key={chain.chainId}
                    chainId={chain.chainId}
                    chainName={chain.name}
                    chainSlug={chain.slug}
                    currencySymbol={chain.nativeCurrency.symbol}
                    enabledServices={chain.services
                      .filter((c) => c.enabled)
                      .map((c) => c.service)}
                    isDeprecated={chain.status === "deprecated"}
                    favoriteButton={
                      props.isLoggedIn ? (
                        <div className="relative h-6 w-6">
                          <StarButton
                            chainId={chain.chainId}
                            className="absolute top-0 left-0 z-10 h-full w-full"
                          />
                        </div>
                      ) : undefined
                    }
                    iconUrl={chain.icon?.url}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedChains.map((chain) => (
              <li key={chain.chainId} className="h-full">
                <ChainListCard
                  key={chain.chainId}
                  chainId={chain.chainId}
                  chainName={chain.name}
                  chainSlug={chain.slug}
                  currencySymbol={chain.nativeCurrency.symbol}
                  enabledServices={chain.services
                    .filter((c) => c.enabled)
                    .map((c) => c.service)}
                  isDeprecated={chain.status === "deprecated"}
                  favoriteButton={
                    props.isLoggedIn ? (
                      <div className="relative h-6 w-6">
                        <StarButton
                          chainId={chain.chainId}
                          className="absolute top-0 left-0 z-10 h-full w-full"
                        />
                      </div>
                    ) : undefined
                  }
                  iconUrl={chain.icon?.url}
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
        <span className="text-accent-foreground">{paginatedChains.length}</span>{" "}
        out of{" "}
        {filteredCount !== totalCount ? (
          <>
            <span className="text-accent-foreground">{filteredCount}</span>{" "}
            chains that match filters. (Total:{" "}
            <span className="text-accent-foreground">{totalCount}</span>)
          </>
        ) : (
          <>
            <span className="text-accent-foreground">{totalCount}</span> chains.
          </>
        )}
      </p>
    </>
  );
}
