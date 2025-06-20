"use client";

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
import { Legacy_CopyButton, Text } from "tw-components";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../../_utils/contract-page-path";

const columnHelper = createColumnHelper<{ account: string }>();

const columns = [
  columnHelper.accessor("account", {
    cell: (info) => (
      <Flex align="center" gap={2}>
        <Text fontFamily="mono">{info.getValue()}</Text>
        <Legacy_CopyButton
          aria-label="Copy account address"
          colorScheme="primary"
          value={info.getValue()}
        />
      </Flex>
    ),
    header: "Account",
  }),
];

type AccountsTableProps = {
  contract: ThirdwebContract;
  projectMeta: ProjectMeta | undefined;
};

export const AccountsTable: React.FC<AccountsTableProps> = ({
  contract,
  projectMeta,
}) => {
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
    // of we have the total accounts, limit the end to the total accounts
    end: BigInt(maxQueryEndValue),
    start: BigInt(currentPage * pageSize),
  });

  const totalPages = Math.ceil(totalAccountsNum / pageSize);

  const canNextPage = currentPage < totalPages - 1;
  const canPreviousPage = currentPage > 0;

  const data = accountsQuery.data || [];

  return (
    <Flex direction="column" gap={4}>
      {/* TODO add a skeleton when loading*/}
      <TWTable
        columns={columns}
        data={data.map((account) => ({ account }))}
        isFetched={accountsQuery.isFetched}
        isPending={accountsQuery.isPending}
        onRowClick={(row) => {
          const accountContractPagePath = buildContractPagePath({
            chainIdOrSlug: chainSlug.toString(),
            contractAddress: row.account,
            projectMeta,
          });

          router.push(accountContractPagePath);
        }}
        title="account"
      />
      {/* pagination */}
      <div className="flex w-full items-center justify-center">
        <Flex align="center" direction="row" gap={2}>
          <IconButton
            aria-label="first page"
            icon={<ChevronFirstIcon className="size-4" />}
            isDisabled={totalAccountsQuery.isPending}
            onClick={() => setCurrentPage(0)}
          />
          <IconButton
            aria-label="previous page"
            icon={<ChevronLeftIcon className="size-4" />}
            isDisabled={totalAccountsQuery.isPending || !canPreviousPage}
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
            aria-label="next page"
            icon={<ChevronRightIcon className="size-4" />}
            isDisabled={totalAccountsQuery.isPending || !canNextPage}
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
            aria-label="last page"
            icon={<ChevronLastIcon className="size-4" />}
            isDisabled={totalAccountsQuery.isPending || !canNextPage}
            onClick={() => setCurrentPage(totalPages - 1)}
          />

          <Select
            isDisabled={totalAccountsQuery.isPending}
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
