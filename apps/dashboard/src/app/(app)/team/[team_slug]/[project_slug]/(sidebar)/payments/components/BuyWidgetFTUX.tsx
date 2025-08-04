"use client";

import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TabButtons } from "@/components/ui/tabs";

type Tab = "embed" | "sdk" | "api";

export function BuyWidgetFTUX(props: {
  clientId: string;
  codeExamples: {
    embed: React.ReactNode;
    sdk: React.ReactNode;
    api: React.ReactNode;
  };
}) {
  const [tab, setTab] = useState<Tab>("embed");
  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b border-dashed p-4">
        <h2 className="font-semibold text-lg tracking-tight">
          Setup Payments to View Analytics
        </h2>
      </div>

      <div className="p-4 pt-2">
        <TabButtons
          tabs={[
            {
              isActive: tab === "embed",
              name: "Embed",
              onClick: () => setTab("embed"),
            },
            {
              isActive: tab === "sdk",
              name: "SDK",
              onClick: () => setTab("sdk"),
            },
            {
              isActive: tab === "api",
              name: "API",
              onClick: () => setTab("api"),
            },
          ]}
        />
        <div className="h-2" />

        {props.codeExamples[tab]}
      </div>

      <div className="flex flex-col gap-3 border-t p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-3">
          <Button asChild size="sm" variant="outline">
            <Link
              className="gap-2"
              href="https://portal.thirdweb.com/payments"
              rel="noopener noreferrer"
              target="_blank"
            >
              View Docs
              <ExternalLinkIcon className="size-4 text-muted-foreground" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
