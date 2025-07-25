"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  getAllWalletsList,
  getWalletInfo,
  type WalletId,
} from "thirdweb/wallets";
import { DocLink } from "../Document/DocLink";
import { InlineCode } from "../Document/InlineCode";
import { Table, TBody, Td, Th, Tr } from "../Document/Table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const specialWallets: {
  [key in WalletId]?: boolean;
} = {
  inApp: true,
  smart: true,
};

const ITEMS_PER_PAGE = 20;

const queryClient = new QueryClient();

export function AllSupportedWallets() {
  return (
    <QueryClientProvider client={queryClient}>
      <AllSupportedWalletsContent />
    </QueryClientProvider>
  );
}

function AllSupportedWalletsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: wallets, isLoading: loading } = useQuery({
    queryKey: ["allWalletsList"],
    queryFn: async () => {
      const allWallets = await getAllWalletsList();
      return allWallets
        .filter((w) => !(w.id in specialWallets))
        .map((w) => ({
          id: w.id,
          name: w.name,
        }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filteredWallets = useMemo(() => {
    if (!searchQuery) return wallets || [];
    if (!wallets) return [];

    setCurrentPage(1);
    const query = searchQuery.toLowerCase();
    return wallets.filter(
      (wallet) =>
        wallet.name.toLowerCase().includes(query) ||
        wallet.id.toLowerCase().includes(query),
    );
  }, [wallets, searchQuery]);

  const totalPages = Math.ceil(filteredWallets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentWallets = filteredWallets.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading wallets...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search wallets by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {filteredWallets.length === wallets?.length
          ? `Showing ${filteredWallets.length} wallets`
          : `Found ${filteredWallets.length} of ${wallets?.length} wallets`}
      </div>

      {/* Table */}
      <Table>
        <TBody>
          <Tr>
            <Th>Wallet</Th>
            <Th>ID</Th>
          </Tr>

          {currentWallets.length === 0 ? (
            <Tr>
              <Td>
                {searchQuery
                  ? "No wallets found matching your search."
                  : "No wallets available."}
              </Td>
            </Tr>
          ) : (
            currentWallets.map((wallet) => (
              <Tr key={wallet.id}>
                <Td>
                  <DocLink
                    className="flex flex-nowrap items-center gap-4 whitespace-nowrap"
                    href={`/wallets/external-wallets/${wallet.id}`}
                  >
                    <WalletImage id={wallet.id as WalletId} />
                    {wallet.name}
                  </DocLink>
                </Td>
                <Td>
                  <InlineCode code={`"${wallet.id}"`} />
                </Td>
              </Tr>
            ))
          )}
        </TBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
            {filteredWallets.length > 0 && (
              <span className="ml-2">
                (showing {startIndex + 1}-
                {Math.min(endIndex, filteredWallets.length)} of{" "}
                {filteredWallets.length})
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="size-4" />
              Previous
            </Button>

            {/* Page numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber: number;

                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageClick(pageNumber)}
                    className="min-w-[32px]"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function WalletImage(props: { id: WalletId }) {
  const { data: img } = useQuery({
    queryKey: ["wallet-image", props.id],
    queryFn: () => getWalletInfo(props.id, true),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  if (!img) {
    return (
      <div className="rounded-lg bg-muted" style={{ width: 44, height: 44 }} />
    );
  }

  return (
    <Image alt="" className="rounded-lg" height={44} src={img} width={44} />
  );
}
