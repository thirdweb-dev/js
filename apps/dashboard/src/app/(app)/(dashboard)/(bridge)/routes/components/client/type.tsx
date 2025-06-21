"use client";

import { ArrowDownLeftIcon, ArrowUpRightIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useDashboardRouter } from "@/lib/DashboardRouter";

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
      <ToolTipLabel contentClassName="w-full" label="Origin">
        <Button
          className="rounded-r-none"
          onClick={() => {
            router.replace(createPageURL("origin"));
          }}
          size="icon"
          variant={activeType === "origin" ? "default" : "outline"}
        >
          <ArrowUpRightIcon strokeWidth={1} />
        </Button>
      </ToolTipLabel>
      <ToolTipLabel contentClassName="w-full" label="Destination">
        <Button
          className="rounded-l-none"
          onClick={() => {
            router.replace(createPageURL("destination"));
          }}
          size="icon"
          variant={activeType === "destination" ? "default" : "outline"}
        >
          <ArrowDownLeftIcon strokeWidth={1} />
        </Button>
      </ToolTipLabel>
    </div>
  );
};
