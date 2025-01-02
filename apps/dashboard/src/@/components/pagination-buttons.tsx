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

export const PaginationButtons = (props: {
  activePage: number;
  totalPages: number;
  onPageClick: (page: number) => void;
}) => {
  const { activePage, totalPages, onPageClick: setPage } = props;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={activePage === 1}
            onClick={() => {
              setPage(activePage - 1);
            }}
          />
        </PaginationItem>
        {activePage - 3 > 0 && (
          <PaginationItem className="max-sm:hidden">
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {activePage - 2 > 0 && (
          <PaginationItem className="max-sm:hidden">
            <PaginationLink
              onClick={() => {
                setPage(activePage - 2);
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
                setPage(activePage - 1);
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
                setPage(activePage + 1);
              }}
            >
              {activePage + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {activePage + 2 <= totalPages && (
          <PaginationItem className="max-sm:hidden">
            <PaginationLink
              onClick={() => {
                setPage(activePage + 2);
              }}
            >
              {activePage + 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {activePage + 3 <= totalPages && (
          <PaginationItem className="max-sm:hidden">
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            disabled={activePage === totalPages}
            onClick={() => {
              setPage(activePage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
