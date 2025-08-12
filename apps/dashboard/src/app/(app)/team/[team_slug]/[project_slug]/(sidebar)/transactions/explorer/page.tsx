"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TryItOut } from "../server-wallets/components/try-it-out";
import { Scalar } from "./components/scalar";

export default function TransactionsExplorerPage() {
  const [apiMode, setApiMode] = useState<"thirdweb" | "engine">("thirdweb");
  const useEngineAPI = apiMode === "engine";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-sm">Select API Mode</h3>
          <p className="text-muted-foreground text-xs">
            Choose between thirdweb API (recommended) or Engine API (advanced)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={apiMode}
            onValueChange={(value: "thirdweb" | "engine") => setApiMode(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thirdweb">
                thirdweb API (recommended)
              </SelectItem>
              <SelectItem value="engine">Engine API (advanced)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <TryItOut useEngineAPI={useEngineAPI} />
      <Scalar useEngineAPI={useEngineAPI} />
    </div>
  );
}
