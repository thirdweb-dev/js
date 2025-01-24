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
import { ArrowUpRightIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const PaginationButtons = (props: {
  activePage: number;
  totalPages: number;
  onPageClick: (page: number) => void;
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

  // just render all the page buttons directly
  if (totalPages <= 6) {
    const pages = [...Array(totalPages)].map((_, i) => i + 1);
    return (
      <Pagination>
        <PaginationContent>
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
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

        {/* First page + ... */}
        {activePage - 3 > 0 && (
          <>
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  setPage(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationEllipsis className="max-sm:w-3" />
            </PaginationItem>
          </>
        )}

        {activePage - 1 > 0 && (
          <PaginationItem className="max-sm:hidden">
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
          <PaginationItem className="max-sm:hidden">
            <PaginationLink
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
              <PaginationEllipsis className="max-sm:w-3" />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
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
            disabled={activePage === totalPages}
            onClick={() => {
              setPage(activePage + 1);
            }}
          />
        </PaginationItem>

        <div className="relative flex items-center">
          <Input
            value={pageNumberInput}
            onChange={(e) => {
              setInputHasError(false);
              setPageNumberInput(e.target.value);
            }}
            type="number"
            placeholder="Page"
            className={cn(
              "w-[60px] bg-transparent [appearance:textfield] max-sm:placeholder:text-sm lg:w-[100px] lg:pr-8 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              inputHasError && "text-red-500",
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlePageInputSubmit();
              }
            }}
          />
          <Button
            variant="ghost"
            className="absolute right-1 h-auto w-auto p-2 max-sm:hidden"
            onClick={handlePageInputSubmit}
          >
            <ArrowUpRightIcon className="size-4" />
          </Button>
        </div>
      </PaginationContent>
    </Pagination>
  );
};
