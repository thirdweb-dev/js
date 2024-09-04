"use client";

import { PaginationButtons } from "@/components/pagination-buttons";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  type EmbeddedWalletUser,
  useEmbeddedWallets,
} from "@3rdweb-sdk/react/hooks/useEmbeddedWallets";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { format } from "date-fns/format";
import Papa from "papaparse";
import { useCallback, useMemo, useState } from "react";
import { withinDays } from "utils/date-utils";

const ACTIVE_THRESHOLD_DAYS = 30;

const columnHelper = createColumnHelper<EmbeddedWalletUser>();

const columns = [
  columnHelper.accessor("ews_authed_user", {
    header: "Email",
    enableColumnFilter: true,
    cell: (cell) => (
      <span className="text-sm">{cell.getValue()?.[0]?.email}</span>
    ),
  }),
  columnHelper.accessor("embedded_wallet", {
    header: "Address",
    cell: (cell) => {
      const address = cell.getValue()?.[0]?.address;
      return address ? (
        <CopyAddressButton
          address={address}
          copyIconPosition="left"
          variant="ghost"
          className="-translate-x-2"
        />
      ) : null;
    },
  }),
  columnHelper.accessor("created_at", {
    header: "Created",
    cell: (cell) => {
      const value = cell.getValue();

      if (!value) {
        return;
      }
      return (
        <span className="text-sm">
          {format(new Date(value), "MMM dd, yyyy")}
        </span>
      );
    },
  }),
  columnHelper.accessor("last_accessed_at", {
    header: "Last login",
    cell: (cell) => {
      const value = cell.getValue();

      if (!value) {
        return;
      }
      return (
        <span className="text-sm">
          {format(new Date(value), "MMM dd, yyyy")}
        </span>
      );
    },
  }),
];

export const Users = (props: {
  clientId: string;
  trackingCategory: string;
}) => {
  const [onlyActive, setOnlyActive] = useState(true);
  const walletsQuery = useEmbeddedWallets(props.clientId);
  const wallets = walletsQuery?.data || [];

  const activeWallets = useMemo(() => {
    if (!wallets) {
      return [];
    }

    return wallets.filter((w) => {
      const lastAccessedAt = w.last_accessed_at;
      return (
        lastAccessedAt && withinDays(lastAccessedAt, ACTIVE_THRESHOLD_DAYS)
      );
    });
  }, [wallets]);

  const theWalletsWeWant = useMemo(() => {
    return (onlyActive ? activeWallets : wallets) ?? [];
  }, [activeWallets, onlyActive, wallets]);

  const downloadCSV = useCallback(() => {
    if (theWalletsWeWant.length === 0) {
      return;
    }
    const csv = Papa.unparse(
      theWalletsWeWant.map((row) => ({
        email: row.ews_authed_user[0].email,
        address: row.embedded_wallet?.[0]?.address || "",
        created: format(new Date(row.created_at), "MMM dd, yyyy"),
        last_login: format(new Date(row.last_accessed_at), "MMM dd, yyyy"),
      })),
    );
    const csvUrl = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const tempLink = document.createElement("a");
    tempLink.href = csvUrl;
    tempLink.setAttribute("download", "download.csv");
    tempLink.click();
  }, [theWalletsWeWant]);

  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 20;
  const totalPages =
    theWalletsWeWant.length <= itemsPerPage
      ? 1
      : Math.ceil(theWalletsWeWant.length / itemsPerPage);

  const itemsToShow = useMemo(() => {
    const startIndex = (activePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return theWalletsWeWant.slice(startIndex, endIndex);
  }, [activePage, theWalletsWeWant]);

  return (
    <div>
      <div className="flex flex-col gap-6">
        {/* Top section */}
        <div className="flex justify-between items-center">
          <Button
            disabled={theWalletsWeWant.length === 0}
            variant="outline"
            onClick={downloadCSV}
            size="sm"
          >
            Download as .csv
          </Button>

          <div className="flex gap-2 items-center justify-end">
            <p className="text-sm text-muted-foreground">
              Active last {ACTIVE_THRESHOLD_DAYS} days
            </p>
            <Switch
              checked={onlyActive}
              onCheckedChange={(v) => setOnlyActive(v)}
              disabled={wallets.length === 0}
            />
          </div>
        </div>

        <TWTable
          title="active in-app wallets"
          data={itemsToShow}
          columns={columns}
          isLoading={walletsQuery.isLoading}
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
