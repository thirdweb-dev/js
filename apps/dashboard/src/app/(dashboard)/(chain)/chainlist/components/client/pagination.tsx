"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { PaginationButtons } from "../../../../../../@/components/pagination-buttons";

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
    <PaginationButtons
      activePage={activePage}
      totalPages={totalPages}
      onPageClick={(page) => router.push(createPageURL(page))}
    />
  );
};
