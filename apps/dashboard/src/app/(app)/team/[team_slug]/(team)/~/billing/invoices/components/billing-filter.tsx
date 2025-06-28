"use client";

import { useQueryStates } from "nuqs";
import { startTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchParams } from "../search-params";

export function BillingFilter() {
  const [{ status }, setStates] = useQueryStates(
    {
      cursor: searchParams.cursor,
      status: searchParams.status,
    },
    {
      history: "push",
      shallow: false,
      startTransition,
    },
  );
  return (
    <Select
      onValueChange={(v) => {
        setStates({
          cursor: null,
          // only set the status if it's "open", otherwise clear it
          status: v === "open" ? "open" : null,
        });
      }}
      value={status ?? "all"}
    >
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Invoices</SelectItem>
        <SelectItem value="open">Open Invoices</SelectItem>
      </SelectContent>
    </Select>
  );
}
