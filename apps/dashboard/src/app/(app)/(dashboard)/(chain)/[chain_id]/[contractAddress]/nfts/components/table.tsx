/** biome-ignore-all lint/nursery/noNestedComponentDefinitions: FIXME */
/** biome-ignore-all lint/a11y/useSemanticElements: FIXME */
"use client";

import * as Sentry from "@sentry/nextjs";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import type { ThirdwebContract } from "thirdweb";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import { useReadContract } from "thirdweb/react";
import { UnexpectedValueErrorMessage } from "@/components/blocks/error-fallbacks/unexpect-value-error-message";
import { NFTMediaWithEmptyState } from "@/components/blocks/nft-media";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
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
import { cn } from "@/lib/utils";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../../_utils/contract-page-path";

interface ContractOverviewNFTGetAllProps {
  contract: ThirdwebContract;
  isErc721: boolean;
  tokenByIndex: boolean;
  projectMeta: ProjectMeta | undefined;
}

export function NFTGetAllTable({
  contract,
  isErc721,
  tokenByIndex,
  projectMeta,
}: ContractOverviewNFTGetAllProps) {
  const isErc1155 = !isErc721;

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;

  const getNFTsQuery = useReadContract(
    isErc1155 ? ERC1155Ext.getNFTs : ERC721Ext.getNFTs,
    {
      contract,
      count: pageSize,
      includeOwners: true,
      start: currentPage * pageSize,
      tokenByIndex,
    },
  );

  // TODO: Add support for ERC1155 total circulating supply
  const nextTokenIdToMintQuery = useReadContract(
    isErc1155 ? ERC1155Ext.nextTokenIdToMint : ERC721Ext.nextTokenIdToMint,
    {
      contract,
    },
  );
  const totalSupplyQuery = useReadContract(ERC721Ext.totalSupply, {
    contract,
  });

  // Anything bigger and the table breaks
  const safeTotalCount = useMemo(() => {
    const computedSupply = (() => {
      const nextTokenIdToMint = nextTokenIdToMintQuery.data;
      const totalSupply = totalSupplyQuery.data;
      if (nextTokenIdToMint === undefined && totalSupply === undefined) {
        return 0n;
      }
      if ((nextTokenIdToMint || 0n) > (totalSupply || 0n)) {
        return nextTokenIdToMint || 0n;
      }

      return totalSupply || 0n;
    })();

    if (computedSupply > 1_000_000n) {
      return 1_000_000;
    }
    return Number(computedSupply);
  }, [totalSupplyQuery?.data, nextTokenIdToMintQuery?.data]);

  const totalPages = Math.max(Math.ceil(safeTotalCount / pageSize), 1);

  const chainSlug = useChainSlug(contract.chain.id);

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <TableContainer className="border-0">
        {getNFTsQuery.isFetching && (
          <div className="absolute right-4 top-2">
            <Spinner className="h-4 w-4" />
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token Id</TableHead>
              <TableHead>Media</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              {isErc721 && <TableHead>Owner</TableHead>}
              {isErc1155 && <TableHead>Circulating Supply</TableHead>}
              {/* Need to add an empty header for the drawer button */}
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {getNFTsQuery.isFetching &&
              Array.from({ length: pageSize }).map((_, index) => (
                <SkeletonRow
                  // biome-ignore lint/suspicious/noArrayIndexKey: ok
                  key={index}
                  isErc721={isErc721}
                  isErc1155={isErc1155}
                />
              ))}

            {!getNFTsQuery.isFetching &&
              (getNFTsQuery.data || []).map((row, _rowIndex) => {
                const failedToLoad = !row.tokenURI;

                const path = buildContractPagePath({
                  chainIdOrSlug: chainSlug.toString(),
                  contractAddress: contract.address,
                  projectMeta,
                  subpath: `/nfts/${row.id.toString()}`,
                });

                return (
                  <TableRow
                    key={row.id}
                    linkBox
                    className={cn(
                      "bg-card hover:bg-accent/50 cursor-pointer",
                      failedToLoad && "opacity-30 pointer-events-none",
                    )}
                  >
                    {/* Token Id */}
                    <TableCell className="max-w-sm">
                      <Link
                        href={path}
                        className="before:absolute before:inset-0"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {row.id?.toString().length > 8
                          ? `${row.id.toString().slice(0, 4)}...${row.id.toString().slice(-4)}`
                          : row.id?.toString()}
                      </Link>
                    </TableCell>

                    {/* Media */}
                    <TableCell className="max-w-sm">
                      <NFTMediaWithEmptyState
                        className="pointer-events-none"
                        client={contract.client}
                        height="120px"
                        metadata={row.metadata}
                        requireInteraction
                        width="120px"
                      />
                    </TableCell>

                    {/* Name */}
                    <TableCell className="max-w-sm">
                      <ErrorBoundary FallbackComponent={NFTCellErrorBoundary}>
                        {typeof row.metadata.name !== "string" ? (
                          <UnexpectedValueErrorMessage
                            className="w-[300px] py-3"
                            description="Name is not a string"
                            title="Invalid Name"
                            value={row.metadata.name}
                          />
                        ) : (
                          <p className="line-clamp-1 text-muted-foreground text-sm">
                            {row.metadata.name}
                          </p>
                        )}
                      </ErrorBoundary>
                    </TableCell>

                    {/* Description */}
                    <TableCell className="max-w-sm">
                      <ErrorBoundary FallbackComponent={NFTCellErrorBoundary}>
                        {row.metadata.description &&
                        typeof row.metadata.description !== "string" ? (
                          <UnexpectedValueErrorMessage
                            className="w-[300px] py-3"
                            description="Description is not a string"
                            title="Invalid description"
                            value={row.metadata.description}
                          />
                        ) : (
                          <p
                            className={cn(
                              "line-clamp-4 max-w-[200px] whitespace-normal text-muted-foreground text-sm",
                              { italic: !row.metadata.description },
                            )}
                          >
                            {row.metadata.description || "No description"}
                          </p>
                        )}
                      </ErrorBoundary>
                    </TableCell>

                    {/* Owner (ERC721 only) */}
                    {isErc721 && (
                      <TableCell className="max-w-sm">
                        {row.owner ? (
                          <WalletAddress
                            address={row.owner}
                            client={contract.client}
                          />
                        ) : (
                          <p className="text-muted-foreground">Not owned</p>
                        )}
                      </TableCell>
                    )}

                    {/* Circulating Supply (ERC1155 only) */}
                    {isErc1155 && (
                      <TableCell className="max-w-sm">
                        {row.type === "ERC1155" && (
                          <p className="line-clamp-4 font-mono text-base">
                            {row.supply.toString()}
                          </p>
                        )}
                      </TableCell>
                    )}

                    {/* arrow  */}
                    <TableCell>
                      <ArrowUpRightIcon className="size-4" />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

        {!getNFTsQuery.isFetching && getNFTsQuery.data?.length === 0 && (
          <div className="flex items-center justify-center py-20 text-muted-foreground w-full text-sm">
            No NFTs found
          </div>
        )}
      </TableContainer>
      <div className="p-6 border-t bg-card">
        <PaginationButtons
          activePage={currentPage + 1}
          totalPages={totalPages}
          onPageClick={handlePageChange}
        />
      </div>
    </div>
  );
}

function SkeletonRow({
  isErc721,
  isErc1155,
}: {
  isErc721: boolean;
  isErc1155: boolean;
}) {
  return (
    <TableRow>
      {/* Token Id */}
      <TableCell className="max-w-sm">
        <Skeleton className="h-6 w-16" />
      </TableCell>
      {/* Media */}
      <TableCell className="max-w-sm">
        <Skeleton className="size-[120px]" />
      </TableCell>
      {/* Name */}
      <TableCell className="max-w-sm">
        <Skeleton className="h-6 w-24" />
      </TableCell>
      {/* Description */}
      <TableCell className="max-w-sm">
        <Skeleton className="h-6 w-32" />
      </TableCell>
      {/* Owner (ERC721 only) */}
      {isErc721 && (
        <TableCell className="max-w-sm">
          <Skeleton className="h-6 w-40" />
        </TableCell>
      )}
      {/* Circulating Supply (ERC1155 only) */}
      {isErc1155 && (
        <TableCell className="max-w-sm">
          <Skeleton className="h-6 w-20" />
        </TableCell>
      )}
      {/* Drawer button */}
      <TableCell>
        <Skeleton className="h-4 w-4" />
      </TableCell>
    </TableRow>
  );
}

function NFTCellErrorBoundary(errorProps: FallbackProps) {
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    Sentry.withScope((scope) => {
      scope.setTag("component-crashed", "true");
      scope.setTag("component-crashed-boundary", "NFTCellErrorBoundary");
      scope.setLevel("fatal");
      Sentry.captureException(errorProps.error);
    });
  }, [errorProps.error]);

  return (
    <CopyTextButton
      className="max-w-[250px] truncate text-destructive-text"
      copyIconPosition="left"
      textToCopy={errorProps.error.message}
      textToShow={errorProps.error.message}
      tooltip={errorProps.error.message}
    />
  );
}
