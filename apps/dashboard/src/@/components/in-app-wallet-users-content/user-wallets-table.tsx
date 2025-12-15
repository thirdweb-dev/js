"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DollarSignIcon,
  RefreshCwIcon,
  UserIcon,
  WalletIcon,
} from "lucide-react";
import Papa from "papaparse";
import { useCallback, useMemo, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { WalletUser } from "thirdweb/wallets";
import { StatCard } from "@/components/analytics/stat";
import { MultiNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { TWTable } from "@/components/blocks/TWTable";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/Spinner";
import {
  ToolTipLabel,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useAllEmbeddedWallets,
  useEmbeddedWallets,
} from "@/hooks/useEmbeddedWallets";
import {
  useFetchAllPortfolios,
  type WalletPortfolioData,
} from "@/hooks/useWalletPortfolio";
import { CopyTextButton } from "../ui/CopyTextButton";
import { AdvancedSearchInput } from "./AdvancedSearchInput";
import { SearchResults } from "./SearchResults";
import { searchUsers } from "./searchUsers";
import type { SearchType } from "./types";

const getAuthIdentifier = (accounts: WalletUser["linkedAccounts"]) => {
  const mainDetail = accounts[0]?.details;
  return (
    mainDetail?.id ??
    mainDetail?.email ??
    mainDetail?.phone ??
    mainDetail?.address
  );
};

const getPrimaryEmail = (accounts: WalletUser["linkedAccounts"]) => {
  const emailFromPrimary = accounts[0]?.details?.email;
  if (emailFromPrimary) {
    return emailFromPrimary;
  }

  const emailAccount = accounts.find((account) => {
    return typeof account.details?.email === "string" && account.details.email;
  });

  if (emailAccount && typeof emailAccount.details.email === "string") {
    return emailAccount.details.email;
  }

  return undefined;
};

const columnHelper = createColumnHelper<WalletUser>();

const truncateIdentifier = (value: string) => {
  if (value.length <= 18) {
    return value;
  }
  return `${value.slice(0, 8)}...${value.slice(-4)}`;
};

export function UserWalletsTable(
  props: {
    authToken: string;
    client: ThirdwebClient;
    teamId: string;
  } & (
    | { projectClientId: string; ecosystemSlug?: never }
    | { ecosystemSlug: string; projectClientId?: never }
  ),
) {
  const [activePage, setActivePage] = useState(1);
  const [searchResults, setSearchResults] = useState<WalletUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearchResults, setHasSearchResults] = useState(false);

  // Portfolio state
  const [selectedChains, setSelectedChains] = useState<number[]>([1]); // Default to Ethereum
  const [portfolioMap, setPortfolioMap] = useState<
    Map<string, WalletPortfolioData>
  >(new Map());
  const [portfolioLoaded, setPortfolioLoaded] = useState(false);
  const [fetchProgress, setFetchProgress] = useState({
    completed: 0,
    total: 0,
  });

  const walletsQuery = useEmbeddedWallets({
    authToken: props.authToken,
    clientId: props.projectClientId,
    ecosystemSlug: props.ecosystemSlug,
    teamId: props.teamId,
    page: activePage,
  });
  const wallets = walletsQuery?.data?.users || [];
  const { mutateAsync: getAllEmbeddedWallets, isPending: isLoadingAllWallets } =
    useAllEmbeddedWallets({
      authToken: props.authToken,
    });

  const fetchPortfoliosMutation = useFetchAllPortfolios();

  const handleFetchBalances = useCallback(async () => {
    if (selectedChains.length === 0) return;

    try {
      // First get all wallets
      const allWallets = await getAllEmbeddedWallets({
        clientId: props.projectClientId,
        ecosystemSlug: props.ecosystemSlug,
        teamId: props.teamId,
      });

      const allAddresses = allWallets
        .map((w) => w.wallets[0]?.address)
        .filter((a): a is string => !!a);

      if (allAddresses.length === 0) {
        setPortfolioLoaded(true);
        return;
      }

      setFetchProgress({ completed: 0, total: allAddresses.length });

      const results = await fetchPortfoliosMutation.mutateAsync({
        addresses: allAddresses,
        client: props.client,
        chainIds: selectedChains,
        authToken: props.authToken,
        onProgress: (completed, total) => {
          setFetchProgress({ completed, total });
        },
      });

      setPortfolioMap(results);
      setPortfolioLoaded(true);
    } catch (error) {
      console.error("Failed to fetch balances:", error);
    }
  }, [
    selectedChains,
    getAllEmbeddedWallets,
    props.projectClientId,
    props.ecosystemSlug,
    props.teamId,
    props.client,
    props.authToken,
    fetchPortfoliosMutation,
  ]);

  const isFetchingBalances =
    isLoadingAllWallets || fetchPortfoliosMutation.isPending;

  const aggregatedStats = useMemo(() => {
    let fundedWallets = 0;
    let totalValue = 0;
    portfolioMap.forEach((data) => {
      if (data.totalUsdValue > 0) {
        fundedWallets++;
        totalValue += data.totalUsdValue;
      }
    });
    return { fundedWallets, totalValue };
  }, [portfolioMap]);

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("id", {
        cell: (cell) => {
          const userId = cell.getValue();

          if (!userId) {
            return "N/A";
          }

          return (
            <CopyTextButton
              textToShow={truncateIdentifier(userId)}
              textToCopy={userId}
              tooltip="Copy User Identifier"
              copyIconPosition="left"
              variant="ghost"
            />
          );
        },
        header: "User Identifier",
        id: "user_identifier",
      }),
      columnHelper.accessor("linkedAccounts", {
        cell: (cell) => {
          const identifier = getAuthIdentifier(cell.getValue());

          if (!identifier) {
            return "N/A";
          }

          return (
            <CopyTextButton
              textToShow={truncateIdentifier(identifier)}
              textToCopy={identifier}
              tooltip="Copy Auth Identifier"
              copyIconPosition="left"
              variant="ghost"
            />
          );
        },
        enableColumnFilter: true,
        header: "Auth Identifier",
        id: "auth_identifier",
      }),
      columnHelper.accessor("wallets", {
        cell: (cell) => {
          const address = cell.getValue()[0]?.address;
          return address ? (
            <WalletAddress address={address} client={props.client} />
          ) : null;
        },
        header: "Address",
        id: "address",
      }),
      columnHelper.accessor("wallets", {
        id: "total_balance",
        header: "Total Balance",
        cell: (cell) => {
          const address = cell.getValue()[0]?.address;
          if (!address) return "N/A";
          if (!portfolioLoaded) {
            return <span className="text-muted-foreground text-sm">—</span>;
          }
          const data = portfolioMap.get(address);
          if (!data) {
            return <span className="text-muted-foreground text-sm">—</span>;
          }
          return (
            <span className="text-sm">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(data.totalUsdValue)}
            </span>
          );
        },
      }),
      columnHelper.accessor("wallets", {
        id: "tokens",
        header: "Tokens",
        cell: (cell) => {
          const address = cell.getValue()[0]?.address;
          if (!address) return "N/A";
          if (!portfolioLoaded) {
            return <span className="text-muted-foreground text-sm">—</span>;
          }
          const data = portfolioMap.get(address);
          if (!data || data.tokens.length === 0) {
            return <span className="text-muted-foreground text-sm">None</span>;
          }

          const topTokens = data.tokens
            .sort((a, b) => (b.usdValue || 0) - (a.usdValue || 0))
            .slice(0, 3)
            .map((t) => t.symbol)
            .join(", ");

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="text-sm">
                  {topTokens}
                  {data.tokens.length > 3 ? "..." : ""}
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-col gap-1">
                    {data.tokens.map((t) => (
                      <div
                        key={`${t.tokenAddress}-${t.chainId}`}
                        className="flex justify-between gap-4 text-xs"
                      >
                        <span>{t.symbol}</span>
                        <span>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(t.usdValue || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
      }),
      columnHelper.accessor("linkedAccounts", {
        cell: (cell) => {
          const email = getPrimaryEmail(cell.getValue());

          if (!email) {
            return <span className="text-muted-foreground text-sm">N/A</span>;
          }

          return (
            <CopyTextButton
              textToShow={email}
              textToCopy={email}
              tooltip="Copy Email"
              copyIconPosition="left"
              variant="ghost"
            />
          );
        },
        header: "Email",
        id: "email",
      }),
      columnHelper.accessor("wallets", {
        cell: (cell) => {
          const value = cell.getValue()[0]?.createdAt;

          if (!value) {
            return;
          }
          return (
            <ToolTipLabel
              label={format(new Date(value), "MMM dd, yyyy 'at' h:mm:ss a zzz")}
              hoverable
            >
              <span className="text-sm">
                {format(new Date(value), "MMM dd, yyyy")}
              </span>
            </ToolTipLabel>
          );
        },
        header: "Created",
        id: "created_at",
      }),
      columnHelper.accessor("linkedAccounts", {
        cell: (cell) => {
          const value = cell.getValue();
          const loginMethodsDisplay = value.reduce((acc, curr) => {
            if (acc.length === 2) {
              acc.push("...");
            }
            if (acc.length < 2) {
              acc.push(curr.type);
            }
            return acc;
          }, [] as string[]);
          const loginMethods = value.map((v) => v.type).join(", ");
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="text-sm">
                  {loginMethodsDisplay.join(", ")}
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-sm">{loginMethods}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
        header: "Login Methods",
        id: "login_methods",
      }),
    ];
  }, [props.client, portfolioMap, portfolioLoaded]);

  const handleSearch = async (searchType: SearchType, query: string) => {
    setIsSearching(true);
    try {
      const results = await searchUsers(
        props.authToken,
        props.projectClientId,
        props.ecosystemSlug,
        props.teamId,
        searchType,
        query,
      );
      setSearchResults(results);
      setHasSearchResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
      setHasSearchResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setHasSearchResults(false);
  };

  const downloadCSV = useCallback(async () => {
    if (wallets.length === 0 || !getAllEmbeddedWallets) {
      return;
    }
    const usersWallets = await getAllEmbeddedWallets({
      clientId: props.projectClientId,
      ecosystemSlug: props.ecosystemSlug,
      teamId: props.teamId,
    });
    const csv = Papa.unparse(
      usersWallets.map((row) => {
        const email = getPrimaryEmail(row.linkedAccounts);

        return {
          address: row.wallets[0]?.address || "Uninitialized",
          created: row.wallets[0]?.createdAt
            ? new Date(row.wallets[0].createdAt).toISOString()
            : "Wallet not created yet",
          email: email || "N/A",
          login_methods: row.linkedAccounts.map((acc) => acc.type).join(", "),
          auth_identifier: getAuthIdentifier(row.linkedAccounts) || "N/A",
          user_identifier: row.id || "N/A",
        };
      }),
    );
    const csvUrl = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const tempLink = document.createElement("a");
    tempLink.href = csvUrl;
    tempLink.setAttribute("download", "download.csv");
    tempLink.click();
  }, [
    wallets,
    props.projectClientId,
    getAllEmbeddedWallets,
    props.teamId,
    props.ecosystemSlug,
  ]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-col lg:flex-row lg:justify-between p-4 lg:px-6 py-5 lg:items-center gap-5">
        <div>
          <div className="flex mb-3">
            <div className="p-2 rounded-full bg-background border border-border">
              <UserIcon className="size-5 text-muted-foreground" />
            </div>
          </div>
          <h2 className="font-semibold text-2xl tracking-tight">
            User Wallets
          </h2>
          <p className="text-muted-foreground text-sm">
            View and manage your project's users
          </p>
        </div>

        <div className="flex flex-col items-start lg:items-end gap-2.5 border-t lg:border-t-0 pt-5 lg:pt-0 border-dashed">
          <div className="w-full lg:w-auto lg:min-w-[320px]">
            <AdvancedSearchInput
              onSearch={handleSearch}
              onClear={handleClearSearch}
              isLoading={isSearching}
              hasResults={hasSearchResults}
            />
          </div>
          <Button
            className="gap-2 bg-background rounded-full"
            disabled={wallets.length === 0 || isLoadingAllWallets}
            onClick={downloadCSV}
            variant="outline"
          >
            {isLoadingAllWallets && <Spinner className="size-4" />}
            Download as .csv
          </Button>
        </div>
      </div>

      <div>
        {hasSearchResults ? (
          <SearchResults results={searchResults} client={props.client} />
        ) : (
          <>
            {/* Chain Selector and Fetch Button */}
            <div className="flex items-center gap-3 px-4 lg:px-6 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <MultiNetworkSelector
                  client={props.client}
                  selectedChainIds={selectedChains}
                  onChange={setSelectedChains}
                  disableChainId
                  hideTestnets
                  popoverContentClassName="max-h-[300px]"
                />
                <Button
                  onClick={() => handleFetchBalances()}
                  disabled={
                    isFetchingBalances ||
                    selectedChains.length === 0 ||
                    walletsQuery.isPending
                  }
                  className="gap-2"
                >
                  {isFetchingBalances ? (
                    <Spinner className="size-4" />
                  ) : (
                    <RefreshCwIcon className="size-4" />
                  )}
                  {isFetchingBalances
                    ? `Fetching... ${fetchProgress.total > 0 ? Math.round((fetchProgress.completed / fetchProgress.total) * 100) : 0}%`
                    : "Fetch All Balances"}
                </Button>
              </div>

              {isFetchingBalances && (
                <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
                  {fetchProgress.total > 0 && (
                    <Progress
                      value={
                        (fetchProgress.completed / fetchProgress.total) * 100
                      }
                      className="h-2"
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    This may take a few minutes
                  </p>
                </div>
              )}

              {portfolioLoaded && !isFetchingBalances && (
                <Badge variant="success" className="ml-auto">
                  Balances loaded for {portfolioMap.size} wallets
                </Badge>
              )}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-4 px-4 lg:px-6 py-4">
              <StatCard
                label="Funded Wallets"
                value={portfolioLoaded ? aggregatedStats.fundedWallets : 0}
                icon={WalletIcon}
                isPending={isFetchingBalances}
                emptyText={!portfolioLoaded ? "—" : undefined}
              />
              <StatCard
                label="Total Value"
                value={portfolioLoaded ? aggregatedStats.totalValue : 0}
                icon={DollarSignIcon}
                formatter={(value) =>
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(value)
                }
                isPending={isFetchingBalances}
                emptyText={!portfolioLoaded ? "—" : undefined}
              />
            </div>
            <TWTable
              columns={columns}
              data={wallets}
              isFetched={walletsQuery.isFetched}
              isPending={walletsQuery.isPending}
              tableContainerClassName="rounded-none border-x-0 border-b-0"
              title="User wallets"
            />

            <div className="flex justify-center gap-3 border-t bg-card p-6">
              <Button
                className="gap-2 bg-background"
                disabled={activePage === 1 || walletsQuery.isPending}
                onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                size="sm"
                variant="outline"
              >
                <ArrowLeftIcon className="size-4" />
                Previous
              </Button>
              <Button
                className="gap-2 bg-background"
                disabled={wallets.length === 0 || walletsQuery.isPending}
                onClick={() => setActivePage((p) => p + 1)}
                size="sm"
                variant="outline"
              >
                Next
                <ArrowRightIcon className="size-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
