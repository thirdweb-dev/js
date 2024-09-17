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
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { WebhooksPage } from "./webhooks.client";

export function PayUI(props: {
  apiKeys: ApiKey[];
}) {
  const searchParams = useSearchParams();
  const selectedKeyFromUrl = searchParams?.get("clientId");
  const defaultSelectedKey =
    props.apiKeys.find((key) => key.key === selectedKeyFromUrl) ||
    props.apiKeys[0];

  const [selectedKey, setSelectedKey] = useState<ApiKey>(defaultSelectedKey);

  const [activeTab, setActiveTab] = useState<
    "settings" | "analytics" | "webhooks"
  >("analytics");

  return (
    <>
      <div className="flex-col gap-4 flex lg:flex-row w-full relative">
        <div className="max-sm:w-full lg:min-w-[200px] lg:absolute right-0 bottom-3 z-10">
          <Select
            value={selectedKey.key}
            onValueChange={(keyId) => {
              const newKey = props.apiKeys.find((x) => x.key === keyId);
              if (newKey) {
                setSelectedKey(newKey);
                // append the key search param without reloading the page
                window.history.pushState({}, "", `?clientId=${keyId}`);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue>{selectedKey?.name}</SelectValue>
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
