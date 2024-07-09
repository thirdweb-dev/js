"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabButtons } from "@/components/ui/tabs";
import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { PayAnalytics } from "components/pay/PayAnalytics/PayAnalytics";
import { PayConfig } from "components/pay/PayConfig";
import { useMemo, useState } from "react";

export function PayUI(props: {
  apiKeys: ApiKey[];
}) {
  const [selectedKeyId, setSelectedKeyId] = useState<string>(
    props.apiKeys[0].key,
  );
  const [activeTab, setActiveTab] = useState<"settings" | "analytics">(
    "analytics",
  );

  const selectedKey = useMemo(() => {
    // biome-ignore lint/style/noNonNullAssertion: This is a valid use case for non-null assertion
    return props.apiKeys.find((key) => key.key === selectedKeyId)!;
  }, [props.apiKeys, selectedKeyId]);

  return (
    <>
      <div className="flex flex-row w-full">
        <TabButtons
          containerClassName="w-full"
          tabs={[
            {
              name: "Analytics",
              isActive: activeTab === "analytics",
              onClick: () => setActiveTab("analytics"),
              isEnabled: true,
            },
            {
              name: "Settings",
              isActive: activeTab === "settings",
              onClick: () => setActiveTab("settings"),
              isEnabled: true,
            },
          ]}
        />
        <div className="flex-shrink-0 flex-grow-0 relative md:min-w-[200px]">
          <Select defaultValue={selectedKeyId} onValueChange={setSelectedKeyId}>
            <SelectTrigger>
              <SelectValue>{selectedKey?.name || selectedKeyId}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {props.apiKeys.map((key) => (
                <SelectItem key={key.key} value={key.key}>
                  {key.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border -translate-y-[2px]" />
        </div>
      </div>

      {/* TODO: split this into sub-pages */}
      {activeTab === "analytics" && <PayAnalytics apiKey={selectedKey} />}
      {activeTab === "settings" && <PayConfig apiKey={selectedKey} />}
    </>
  );
}
