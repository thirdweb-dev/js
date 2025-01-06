"use client";

import { useDashboardRouter } from "@/lib/DashboardRouter";
import { Flex, IconButton, Select, Skeleton } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { useChainSlug } from "hooks/chains/chainSlug";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import { getAccounts, totalAccounts } from "thirdweb/extensions/erc4337";
import { useReadContract } from "thirdweb/react";
import { Text, TrackedCopyButton } from "tw-components";

const columnHelper = createColumnHelper<{ account: string }>();

const columns = [
  columnHelper.accessor("account", {
    header: "Account",
    cell: (info) => (
      <Flex gap={2} align="center">
        <Text fontFamily="mono">{info.getValue()}</Text>
        <TrackedCopyButton
          value={info.getValue()}
          category="accounts"
          aria-label="Copy account address"
          colorScheme="primary"
        />
      </Flex>
    ),
  }),
];

type AccountsTableProps = {
  contract: ThirdwebContract;
};

export const AccountsTable: React.FC<AccountsTableProps> = ({ contract }) => {
  const router = useDashboardRouter();
  const chainSlug = useChainSlug(contract.chain.id);

  const [currentPage, setCurrentPage] = useState(0);
  // default page size of 25
  const [pageSize, setPageSize] = useState(25);

  const totalAccountsQuery = useReadContract(totalAccounts, { contract });

  // the total size should never be more than max int size (that would be hella wallets!)
  // so converting the totalAccounts to a number should be safe here
  const totalAccountsNum = useMemo(
    () => Number(totalAccountsQuery.data || 0),
    [totalAccountsQuery.data],
  );

  // we need to limit the end value to the total accounts (if we know the total accounts)
  const maxQueryEndValue = useMemo(() => {
    if (totalAccountsQuery.data) {
      return Math.min(
        currentPage * pageSize + pageSize,
        Number(totalAccountsQuery.data),
      );
    }
    return currentPage * pageSize + pageSize;
  }, [currentPage, pageSize, totalAccountsQuery.data]);

  const accountsQuery = useReadContract(getAccounts, {
    contract,
    start: BigInt(currentPage * pageSize),
    // of we have the total accounts, limit the end to the total accounts
    end: BigInt(maxQueryEndValue),
  });

  const totalPages = Math.ceil(totalAccountsNum / pageSize);

  const canNextPage = currentPage < totalPages - 1;
  const canPreviousPage = currentPage > 0;

  const data = accountsQuery.data || [];

  return (
    <Flex direction="column" gap={4}>
      {/* TODO add a skeleton when loading*/}
      <TWTable
        title="account"
        columns={columns}
        data={data.map((account) => ({ account }))}
        isPending={accountsQuery.isPending}
        isFetched={accountsQuery.isFetched}
        onRowClick={(row) => {
          router.push(`/${chainSlug}/${row.account}`);
        }}
      />
      {/* pagination */}
      <div className="flex w-full items-center justify-center">
        <Flex gap={2} direction="row" align="center">
          <IconButton
            isDisabled={totalAccountsQuery.isPending}
            aria-label="first page"
            icon={<ChevronFirstIcon className="size-4" />}
            onClick={() => setCurrentPage(0)}
          />
          <IconButton
            isDisabled={totalAccountsQuery.isPending || !canPreviousPage}
            aria-label="previous page"
            icon={<ChevronLeftIcon className="size-4" />}
            onClick={() => {
              setCurrentPage((curr) => {
                if (curr > 0) {
                  return curr - 1;
                }
                return curr;
              });
            }}
          />
          <Text whiteSpace="nowrap">
            Page <strong>{currentPage + 1}</strong> of{" "}
            <Skeleton
              as="span"
              display="inline"
              isLoaded={totalAccountsQuery.isSuccess}
            >
              <strong>{totalPages}</strong>
            </Skeleton>
          </Text>
          <IconButton
            isDisabled={totalAccountsQuery.isPending || !canNextPage}
            aria-label="next page"
            icon={<ChevronRightIcon className="size-4" />}
            onClick={() =>
              setCurrentPage((curr) => {
                if (curr < totalPages - 1) {
                  return curr + 1;
                }
                return curr;
              })
            }
          />
          <IconButton
            isDisabled={totalAccountsQuery.isPending || !canNextPage}
            aria-label="last page"
            icon={<ChevronLastIcon className="size-4" />}
            onClick={() => setCurrentPage(totalPages - 1)}
          />

          <Select
            onChange={(e) => {
              const newPageSize = Number.parseInt(e.target.value as string, 10);
              // compute the new page number based on the new page size
              const newPage = Math.floor(
                (currentPage * pageSize) / newPageSize,
              );
              setCurrentPage(newPage);
              setPageSize(newPageSize);
            }}
            value={pageSize}
            isDisabled={totalAccountsQuery.isPending}
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="250">250</option>
            <option value="500">500</option>
          </Select>
        </Flex>
      </div>
    </Flex>
  );
};
//
