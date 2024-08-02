"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function TablePagination() {
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
        <PaginationItem className="px-4 border rounded-lg h-full flex items-center bg-secondary">
          {page}
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
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
