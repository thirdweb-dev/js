"use client";

import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import { getAccounts, totalAccounts } from "thirdweb/extensions/erc4337";
import { useReadContract } from "thirdweb/react";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useChainSlug } from "@/hooks/chains/chainSlug";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../../_utils/contract-page-path";

const pageSize = 10;

type AccountsTableProps = {
  contract: ThirdwebContract;
  projectMeta: ProjectMeta | undefined;
};

export function AccountsTable({ contract, projectMeta }: AccountsTableProps) {
  const chainSlug = useChainSlug(contract.chain.id);

  const [currentPage, setCurrentPage] = useState(0);

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
  }, [currentPage, totalAccountsQuery.data]);

  const accountsQuery = useReadContract(getAccounts, {
    contract,
    // of we have the total accounts, limit the end to the total accounts
    end: BigInt(maxQueryEndValue),
    start: BigInt(currentPage * pageSize),
  });

  const totalPages = Math.ceil(totalAccountsNum / pageSize);
  const showPagination = totalPages > 1;

  const data = accountsQuery.data || [];

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* TODO add a skeleton when loading*/}
      <TableContainer className="border-0 rounded-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accountsQuery.isPending &&
              new Array(pageSize).fill(0).map((_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: ok
                <SkeletonRow key={index} />
              ))}

            {!accountsQuery.isPending &&
              data.map((account) => {
                const accountContractPagePath = buildContractPagePath({
                  chainIdOrSlug: chainSlug.toString(),
                  contractAddress: account,
                  projectMeta,
                });

                return (
                  <TableRow linkBox key={account} className="hover:bg-muted/50">
                    <TableCell className="py-6">
                      <Link
                        href={accountContractPagePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="before:absolute before:inset-0"
                        aria-label="View account"
                      />

                      <div className="flex items-center justify-between gap-2">
                        <CopyTextButton
                          textToShow={account}
                          textToCopy={account}
                          variant="ghost"
                          tooltip="Copy account address"
                          copyIconPosition="right"
                          className="z-10 relative"
                        />

                        <ArrowUpRightIcon className="size-4 text-muted-foreground" />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

        {!accountsQuery.isPending && data.length === 0 && (
          <div className="px-4 text-center py-20 flex items-center justify-center text-muted-foreground">
            No accounts
          </div>
        )}
      </TableContainer>

      {showPagination && (
        <div className="py-4 border-t bg-card">
          <PaginationButtons
            activePage={currentPage + 1}
            totalPages={totalPages}
            onPageClick={(page) => setCurrentPage(page - 1)}
          />
        </div>
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell className="py-6">
        <Skeleton className="h-6 w-[364px]" />
      </TableCell>
    </TableRow>
  );
}
