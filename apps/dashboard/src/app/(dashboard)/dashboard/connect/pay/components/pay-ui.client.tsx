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
import { WebhooksPage } from "./webhooks.client";

export function PayUI(props: {
  apiKeys: ApiKey[];
}) {
  const [selectedKeyId, setSelectedKeyId] = useState<string>(
    props.apiKeys[0].key,
  );
  const [activeTab, setActiveTab] = useState<
    "settings" | "analytics" | "webhooks"
  >("analytics");

  const selectedKey = useMemo(() => {
    // biome-ignore lint/style/noNonNullAssertion: This is a valid use case for non-null assertion
    return props.apiKeys.find((key) => key.key === selectedKeyId)!;
  }, [props.apiKeys, selectedKeyId]);

  return (
    <>
      <div className="flex-col gap-4 flex lg:flex-row w-full relative">
        <div className="max-sm:w-full lg:min-w-[200px] lg:absolute right-0 bottom-3 z-10">
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
        </div>

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
              name: "Webhooks",
              isActive: activeTab === "webhooks",
              onClick: () => setActiveTab("webhooks"),
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
      </div>

      {/* TODO: split this into sub-pages */}
      {activeTab === "analytics" && <PayAnalytics clientId={selectedKey.key} />}
      {activeTab === "settings" && <PayConfig apiKey={selectedKey} />}
      {activeTab === "webhooks" && <WebhooksPage clientId={selectedKey.key} />}
    </>
  );
}
