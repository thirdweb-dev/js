import { EmbeddedWalletUser } from "@3rdweb-sdk/react/hooks/useEmbeddedWallets";
import { Flex, Switch } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { format } from "date-fns/format";
import { useCallback, useMemo, useState } from "react";
import { Button, Text } from "tw-components";
import { withinDays } from "utils/date-utils";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { Analytics } from "./Analytics";
import Papa from "papaparse";

const ACTIVE_THRESHOLD_DAYS = 30;

interface UsersProps {
  wallets: EmbeddedWalletUser[];
  isLoading: boolean;
  isFetched: boolean;
  trackingCategory: string;
}

const columnHelper = createColumnHelper<EmbeddedWalletUser>();

const columns = [
  columnHelper.accessor("ews_authed_user", {
    header: "Email",
    enableColumnFilter: true,
    cell: (cell) => <Text>{cell.getValue()?.[0]?.email}</Text>,
  }),
  columnHelper.accessor("embedded_wallet", {
    header: "Address",
    cell: (cell) => {
      const address = cell.getValue()?.[0]?.address;
      return address ? <AddressCopyButton address={address} /> : null;
    },
  }),
  columnHelper.accessor("created_at", {
    header: "Created",
    cell: (cell) => {
      const value = cell.getValue();

      if (!value) {
        return;
      }
      return <Text>{format(new Date(value), "MMM dd, yyyy")}</Text>;
    },
  }),
  columnHelper.accessor("last_accessed_at", {
    header: "Last login",
    cell: (cell) => {
      const value = cell.getValue();

      if (!value) {
        return;
      }
      return <Text>{format(new Date(value), "MMM dd, yyyy")}</Text>;
    },
  }),
];

export const Users: React.FC<UsersProps> = ({
  wallets,
  isLoading,
  isFetched,
  trackingCategory,
}) => {
  const [onlyActive, setOnlyActive] = useState(true);

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
        address: row.embedded_wallet[0].address,
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

  return (
    <Flex flexDir="column" gap={10}>
      <Flex flexDir="column" gap={6}>
        <Flex dir="row" justify="space-between" align="center">
          <Button
            isDisabled={theWalletsWeWant.length === 0}
            variant="outline"
            onClick={downloadCSV}
            size="sm"
          >
            Download as .csv
          </Button>

          <Flex gap={2} alignItems="center" justifyContent="flex-end">
            <Text>Active last {ACTIVE_THRESHOLD_DAYS} days</Text>
            <Switch
              isChecked={onlyActive}
              onChange={() => setOnlyActive(!onlyActive)}
              disabled={wallets.length === 0}
            />
          </Flex>
        </Flex>

        <TWTable
          title="active embedded wallets"
          data={theWalletsWeWant}
          columns={columns}
          isLoading={isLoading}
          isFetched={isFetched}
        />
      </Flex>

      <Analytics trackingCategory={trackingCategory} />
    </Flex>
  );
};
