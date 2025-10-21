"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowLeftIcon, ArrowRightIcon, UserIcon } from "lucide-react";
import Papa from "papaparse";
import { useCallback, useMemo, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { WalletUser } from "thirdweb/wallets";
import { TWTable } from "@/components/blocks/TWTable";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Button } from "@/components/ui/button";
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

export function InAppWalletUsersPageContent(
  props: {
    authToken: string;
    client: ThirdwebClient;
    teamId: string;
  } & (
    | { projectClientId: string; ecosystemSlug?: never }
    | { ecosystemSlug: string; projectClientId?: never }
  ),
) {
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
  }, [props.client]);

  const [activePage, setActivePage] = useState(1);
  const [searchResults, setSearchResults] = useState<WalletUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearchResults, setHasSearchResults] = useState(false);
  const walletsQuery = useEmbeddedWallets({
    authToken: props.authToken,
    clientId: props.projectClientId,
    ecosystemSlug: props.ecosystemSlug,
    teamId: props.teamId,
    page: activePage,
  });
  const wallets = walletsQuery?.data?.users || [];
  const { mutateAsync: getAllEmbeddedWallets, isPending } =
    useAllEmbeddedWallets({
      authToken: props.authToken,
    });

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
    <div>
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
              disabled={wallets.length === 0 || isPending}
              onClick={downloadCSV}
              variant="outline"
            >
              {isPending && <Spinner className="size-4" />}
              Download as .csv
            </Button>
          </div>
        </div>

        <div>
          {hasSearchResults ? (
            <SearchResults results={searchResults} client={props.client} />
          ) : (
            <>
              <TWTable
                columns={columns}
                data={wallets}
                isFetched={walletsQuery.isFetched}
                isPending={walletsQuery.isPending}
                tableContainerClassName="rounded-none border-x-0 border-b-0"
                title="in-app wallets"
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
    </div>
  );
}
