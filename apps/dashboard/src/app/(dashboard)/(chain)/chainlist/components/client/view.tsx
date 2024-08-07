"use client";

import { Button } from "@/components/ui/button";
import { Grid2X2Icon, ListIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type hainListViewProps = {
  activeView: "grid" | "table";
};

export const ChainListView: React.FC<hainListViewProps> = ({ activeView }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

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
        size="icon"
        variant={activeView === "table" ? "default" : "outline"}
        onClick={() => {
          router.replace(createPageURL("table"));
        }}
        className="rounded-r-none"
      >
        <ListIcon strokeWidth={1} />
      </Button>
      <Button
        variant={activeView === "grid" ? "default" : "outline"}
        size="icon"
        onClick={() => {
          router.replace(createPageURL("grid"));
        }}
        className="rounded-l-none"
      >
        <Grid2X2Icon strokeWidth={1} />
      </Button>
    </div>
  );
};
