"use client";

import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { ArrowDownLeftIcon, ArrowUpRightIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type QueryTypeProps = {
  activeType: "origin" | "destination";
};

export const QueryType: React.FC<QueryTypeProps> = ({ activeType }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useDashboardRouter();

  const createPageURL = useCallback(
    (type: "origin" | "destination") => {
      const params = new URLSearchParams(searchParams || undefined);
      params.set("type", type);
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );
  return (
    <div className="flex flex-row">
      <ToolTipLabel label="Origin" contentClassName="w-full">
        <Button
          size="icon"
          variant={activeType === "origin" ? "default" : "outline"}
          onClick={() => {
            router.replace(createPageURL("origin"));
          }}
          className="rounded-r-none"
        >
          <ArrowUpRightIcon strokeWidth={1} />
        </Button>
      </ToolTipLabel>
      <ToolTipLabel label="Destination" contentClassName="w-full">
        <Button
          variant={activeType === "destination" ? "default" : "outline"}
          size="icon"
          onClick={() => {
            router.replace(createPageURL("destination"));
          }}
          className="rounded-l-none"
        >
          <ArrowDownLeftIcon strokeWidth={1} />
        </Button>
      </ToolTipLabel>
    </div>
  );
};
