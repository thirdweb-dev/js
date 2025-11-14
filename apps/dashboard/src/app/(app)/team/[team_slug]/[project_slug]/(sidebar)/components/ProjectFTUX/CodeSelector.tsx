"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CodeShowcase(props: {
  title: string;
  tabs: Array<{
    label: string;
    code: React.ReactNode;
  }>;
}) {
  const [selectedTab, setSelectedTab] = useState(props.tabs[0]?.label || "");

  return (
    <div>
      <div className="flex items-center gap-2 justify-between border px-5 py-3 rounded-t-xl bg-card">
        <h3 className="text-sm font-mono">{props.title}</h3>
        <Select
          value={selectedTab}
          onValueChange={(val) => setSelectedTab(val)}
        >
          <SelectTrigger className="w-[160px] rounded-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {props.tabs.map((tab) => (
              <SelectItem key={tab.label} value={tab.label}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {props.tabs.find((tab) => tab.label === selectedTab)?.code}
    </div>
  );
}
