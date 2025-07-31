"use client";

import { usePathname, useSearchParams } from "next/navigation";

export function useFullPath() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  return decodeURIComponent(
    `${pathname}${searchParamsString ? `?${searchParamsString}` : ""}`,
  );
}
