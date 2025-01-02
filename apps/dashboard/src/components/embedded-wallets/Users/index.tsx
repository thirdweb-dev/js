"use client";

import { WalletAddress } from "@/components/blocks/wallet-address";
import { PaginationButtons } from "@/components/pagination-buttons";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useAllEmbeddedWallets,
  useEmbeddedWallets,
} from "@3rdweb-sdk/react/hooks/useEmbeddedWallets";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { format } from "date-fns/format";
import Papa from "papaparse";
import { useCallback, useState } from "react";
import type { WalletUser } from "thirdweb/wallets";

const getUserIdentifier = (accounts: WalletUser["linkedAccounts"]) => {
  const mainDetail = accounts[0]?.details;
  return (
    mainDetail?.email ??
    mainDetail?.phone ??
    mainDetail?.address ??
    mainDetail?.id
  );
};

const columnHelper = createColumnHelper<WalletUser>();
const columns = [
  columnHelper.accessor("linkedAccounts", {
    header: "User Identifier",
    enableColumnFilter: true,
    cell: (cell) => {
      const identifier = getUserIdentifier(cell.getValue());
      return <span className="text-sm">{identifier}</span>;
    },
    id: "user_identifier",
  }),
  columnHelper.accessor("wallets", {
    header: "Address",
    cell: (cell) => {
      const address = cell.getValue()[0]?.address;
      return address ? <WalletAddress address={address} /> : null;
    },
    id: "address",
  }),
  columnHelper.accessor("wallets", {
    header: "Created",
    cell: (cell) => {
      const value = cell.getValue()[0]?.createdAt;

      if (!value) {
        return;
      }
      return (
        <span className="text-sm">
          {format(new Date(value), "MMM dd, yyyy")}
        </span>
      );
    },
    id: "created_at",
  }),
  columnHelper.accessor("linkedAccounts", {
    header: "Login Methods",
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
    id: "login_methods",
  }),
];

export const InAppWalletUsersPageContent = (props: {
  clientId: string;
  trackingCategory: string;
  authToken: string;
}) => {
  const [activePage, setActivePage] = useState(1);
  const walletsQuery = useEmbeddedWallets({
    authToken: props.authToken,
    clientId: props.clientId,
    page: activePage,
  });
  const { users: wallets, totalPages } = walletsQuery?.data || {
    users: [],
    totalPages: 1,
  };
  const { mutateAsync: getAllEmbeddedWallets, isPending } =
    useAllEmbeddedWallets({
      authToken: props.authToken,
    });

  const downloadCSV = useCallback(async () => {
    if (wallets.length === 0 || !getAllEmbeddedWallets) {
      return;
    }
    const usersWallets = await getAllEmbeddedWallets({
      clientId: props.clientId,
      totalPages,
    });
    const csv = Papa.unparse(
      usersWallets.map((row) => {
        return {
          user_identifier: getUserIdentifier(row.linkedAccounts),
          address: row.wallets[0]?.address || "Uninitialized",
          created: row.wallets[0]?.createdAt
            ? format(new Date(row.wallets[0].createdAt), "MMM dd, yyyy")
            : "Wallet not created yet",
          login_methods: row.linkedAccounts.map((acc) => acc.type).join(", "),
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
  }, [wallets, props.clientId, totalPages, getAllEmbeddedWallets]);

  return (
    <div>
      <div className="flex flex-col gap-6">
        {/* Top section */}
        <div className="flex items-center justify-between">
          <Button
            disabled={wallets.length === 0 || isPending}
            variant="outline"
            onClick={downloadCSV}
            size="sm"
            className="gap-2"
          >
            {isPending && <Spinner className="size-4" />}
            Download as .csv
          </Button>

          <div className="flex items-center justify-end gap-2">
            {walletsQuery.isPlaceholderData && (
              <>
                <Spinner className="size-4" />
                <p className="text-muted-foreground text-sm">
                  Loading page {activePage} of {totalPages}
                </p>
              </>
            )}
          </div>
        </div>

        <TWTable
          title="in-app wallets"
          data={wallets}
          columns={columns}
          isPending={walletsQuery.isPending}
          isFetched={walletsQuery.isFetched}
        />

        {totalPages > 1 && (
          <PaginationButtons
            activePage={activePage}
            onPageClick={setActivePage}
            totalPages={totalPages}
          />
        )}
      </div>
    </div>
  );
};
