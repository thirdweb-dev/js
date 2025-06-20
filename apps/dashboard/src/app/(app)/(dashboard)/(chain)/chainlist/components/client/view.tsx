"use client";

import { Grid2X2Icon, ListIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useDashboardRouter } from "@/lib/DashboardRouter";

type ChainListViewProps = {
  activeView: "grid" | "table";
};

export const ChainListView: React.FC<ChainListViewProps> = ({ activeView }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useDashboardRouter();

  const createPageURL = useCallback(
    (view: "grid" | "table") => {
      const params = new URLSearchParams(searchParams || undefined);
      params.set("view", view);
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );
  return (
    <div className="flex flex-row">
      <Button
        className="rounded-r-none"
        onClick={() => {
          router.replace(createPageURL("table"));
        }}
        size="icon"
        variant={activeView === "table" ? "default" : "outline"}
      >
        <ListIcon strokeWidth={1} />
      </Button>
      <Button
        className="rounded-l-none"
        onClick={() => {
          router.replace(createPageURL("grid"));
        }}
        size="icon"
        variant={activeView === "grid" ? "default" : "outline"}
      >
        <Grid2X2Icon strokeWidth={1} />
      </Button>
    </div>
  );
};
