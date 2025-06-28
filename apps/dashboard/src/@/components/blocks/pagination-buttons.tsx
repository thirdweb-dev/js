"use client";

import { ArrowUpRightIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export const PaginationButtons = (props: {
  activePage: number;
  totalPages: number;
  onPageClick: (page: number) => void;
  className?: string;
}) => {
  const { activePage, totalPages, onPageClick: setPage } = props;
  const [inputHasError, setInputHasError] = useState(false);
  const [pageNumberInput, setPageNumberInput] = useState("");

  if (totalPages === 1) {
    return null;
  }

  function handlePageInputSubmit() {
    const page = Number(pageNumberInput);

    setInputHasError(false);
    if (Number.isInteger(page) && page > 0 && page <= totalPages) {
      setPage(page);
      setPageNumberInput("");
    } else {
      setInputHasError(true);
    }
  }

  // if only two pages, show "prev" and "next"
  if (totalPages === 2) {
    return (
      <Pagination className={props.className}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="rounded-full lg:min-w-[38px]"
              disabled={activePage === 1}
              onClick={() => {
                setPage(activePage - 1);
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className="rounded-full lg:min-w-[38px]"
              disabled={activePage === totalPages}
              onClick={() => {
                setPage(activePage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }

  // just render all the page buttons directly
  if (totalPages <= 6) {
    const pages = [...Array(totalPages)].map((_, i) => i + 1);
    return (
      <Pagination className={props.className}>
        <PaginationContent>
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                className="rounded-full lg:min-w-[38px]"
                isActive={activePage === page}
                onClick={() => {
                  setPage(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
      </Pagination>
    );
  }

  return (
    <Pagination className={props.className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="rounded-full lg:min-w-[38px]"
            disabled={activePage === 1}
            onClick={() => {
              setPage(activePage - 1);
            }}
          />
        </PaginationItem>

        {/* First page + ... */}
        {activePage - 3 > 0 && (
          <>
            <PaginationItem>
              <PaginationLink
                className="rounded-full lg:min-w-[38px]"
                onClick={() => {
                  setPage(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationEllipsis className="max-sm:w-3 rounded-full" />
            </PaginationItem>
          </>
        )}

        {activePage - 1 > 0 && (
          <PaginationItem className="max-sm:hidden">
            <PaginationLink
              className="rounded-full lg:min-w-[38px]"
              onClick={() => {
                setPage(activePage - 1);
              }}
            >
              {activePage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink className="rounded-full lg:min-w-[38px]" isActive>
            {activePage}
          </PaginationLink>
        </PaginationItem>

        {activePage + 1 <= totalPages && (
          <PaginationItem className="max-sm:hidden">
            <PaginationLink
              className="rounded-full lg:min-w-[38px]"
              onClick={() => {
                setPage(activePage + 1);
              }}
            >
              {activePage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* ... + Last page */}
        {activePage + 3 <= totalPages && (
          <>
            <PaginationItem>
              <PaginationEllipsis className="max-sm:w-3 rounded-full" />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                className="rounded-full lg:min-w-[38px]"
                onClick={() => {
                  setPage(totalPages);
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            className="rounded-full lg:min-w-[38px]"
            disabled={activePage === totalPages}
            onClick={() => {
              setPage(activePage + 1);
            }}
          />
        </PaginationItem>

        <div className="relative flex items-center">
          <Input
            className={cn(
              "w-[60px] bg-transparent [appearance:textfield] max-sm:placeholder:text-sm lg:w-[100px] lg:pr-8 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none rounded-full",
              inputHasError && "text-red-500",
            )}
            onChange={(e) => {
              setInputHasError(false);
              setPageNumberInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlePageInputSubmit();
              }
            }}
            placeholder="Page"
            type="number"
            value={pageNumberInput}
          />
          <Button
            className="absolute right-1 h-auto w-auto rounded-full p-2 max-sm:hidden"
            onClick={handlePageInputSubmit}
            variant="ghost"
          >
            <ArrowUpRightIcon className="size-4" />
          </Button>
        </div>
      </PaginationContent>
    </Pagination>
  );
};
