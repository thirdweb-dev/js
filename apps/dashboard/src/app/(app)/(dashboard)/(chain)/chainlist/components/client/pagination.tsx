"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
import { useDashboardRouter } from "@/lib/DashboardRouter";

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
  const router = useDashboardRouter();

  const createPageURL = useCallback(
    (pageNumber: number) => {
      const params = new URLSearchParams(searchParams || undefined);
      params.set("page", pageNumber.toString());
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );

  return (
    <PaginationButtons
      activePage={activePage}
      onPageClick={(page) => router.push(createPageURL(page))}
      totalPages={totalPages}
    />
  );
};
