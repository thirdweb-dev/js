"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../../../@/components/ui/pagination";

import React from "react";

export function TablePagination(props: { isLandingPage?: boolean }) {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams?.get("page") || 1);
  const range = searchParams?.get("timeRange");
  const currentSort = searchParams?.get("sortBy") || "transactionCount";
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={`${props.isLandingPage && "bg-black/50"}`}
            disabled={page <= 1}
            onClick={() => {
              if (page === 1) return;
              router.replace(
                `${path}?page=${Number(page) - 1}${range?.length ? `&timeRange=${range}` : ""}${currentSort ? `&sortBy=${currentSort}` : ""}`,
                {
                  scroll: false,
                },
              );
            }}
          />
        </PaginationItem>
        <PaginationItem className="px-4">{page}</PaginationItem>
        <PaginationItem>
          <PaginationNext
            className={`${props.isLandingPage && "bg-black/50"}`}
            onClick={() => {
              router.replace(
                `${path}?page=${Number(page) + 1}${range?.length ? `&timeRange=${range}` : ""}${currentSort ? `&sortBy=${currentSort}` : ""}`,
                {
                  scroll: false,
                },
              );
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
