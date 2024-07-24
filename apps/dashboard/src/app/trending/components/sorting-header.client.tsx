"use client";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../../../@/components/ui/button";

export type SortingHeaderProps = {
  sortBy: string;
  title: string;
};

export function SortingHeader(props: SortingHeaderProps) {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const range = searchParams?.get("timeRange");
  const page = searchParams?.get("page");
  const currentSort = searchParams?.get("sortBy") || "transactionCount";
  const isCurrentSort = currentSort === props.sortBy;
  const justify =
    props.sortBy === "transactionCountChange" ? "justify-start" : "justify-end";
  return (
    <div className={`flex flex-row ${justify}`}>
      <Button
        className={"flex flex-row items-center gap-2 px-0 cursor-pointer"}
        variant={"link"}
        onClick={() => {
          router.replace(
            `${path}?sortBy=${props.sortBy}${range?.length ? `&timeRange=${range}` : ""}${page?.length ? `&page=${page}` : ""}`,
            {
              scroll: false,
            },
          );
        }}
      >
        {isCurrentSort && <ChevronDown className="size-sm" />}
        {props.title}
      </Button>
    </div>
  );
}
