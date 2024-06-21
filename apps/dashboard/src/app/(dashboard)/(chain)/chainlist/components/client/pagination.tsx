"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type ChainlistPaginationProps = {
  totalPages: number;
  activePage: number;
};

export const ChainlistPagination: React.FC<ChainlistPaginationProps> = ({
  activePage,
  totalPages,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const createPageURL = useCallback(
    (pageNumber: number) => {
      const params = new URLSearchParams(searchParams || undefined);
      params.set("page", pageNumber.toString());
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={activePage === 1}
            onClick={() => {
              router.push(createPageURL(activePage - 1));
            }}
          />
        </PaginationItem>
        {activePage - 3 > 0 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {activePage - 2 > 0 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => {
                router.push(createPageURL(activePage - 2));
              }}
            >
              {activePage - 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {activePage - 1 > 0 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => {
                router.push(createPageURL(activePage - 1));
              }}
            >
              {activePage - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink isActive>{activePage}</PaginationLink>
        </PaginationItem>
        {activePage + 1 <= totalPages && (
          <PaginationItem>
            <PaginationLink
              onClick={() => {
                router.push(createPageURL(activePage + 1));
              }}
            >
              {activePage + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {activePage + 2 <= totalPages && (
          <PaginationItem>
            <PaginationLink
              onClick={() => {
                router.push(createPageURL(activePage + 2));
              }}
            >
              {activePage + 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {activePage + 3 <= totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            disabled={activePage === totalPages}
            onClick={() => {
              router.push(createPageURL(activePage + 1));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
