"use client";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TabButtons } from "@/components/ui/tabs";

export function WaitingForIntegrationCard(props: {
  title: string;
  codeTabs: {
    code: React.ReactNode;
    label: string;
  }[];
  ctas: {
    label: string;
    href: string;
  }[];
  children?: React.ReactNode;
}) {
  const [selectedTab, setSelectedTab] = useState(props.codeTabs[0]?.label);
  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b px-4 py-4 lg:px-6 lg:py-5 border-dashed">
        <h2 className="font-semibold text-xl tracking-tight">{props.title}</h2>
      </div>

      <div className="px-4 py-6 lg:p-6">
        {props.children}
        {/* Code */}
        <div>
          {props.codeTabs.length > 1 && (
            <>
              <TabButtons
                tabs={props.codeTabs.map((tab) => ({
                  isActive: tab.label === selectedTab,
                  name: tab.label,
                  onClick: () => setSelectedTab(tab.label),
                }))}
              />
              <div className="h-2" />
            </>
          )}

          {props.codeTabs.find((tab) => tab.label === selectedTab)?.code}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t p-4 lg:flex-row lg:items-center lg:justify-between lg:p-6">
        <div className="flex gap-3">
          {props.ctas.map((cta) => (
            <Button asChild key={cta.label} size="sm" variant="outline">
              <Link
                className="gap-2"
                href={cta.href}
                key={cta.label}
                rel="noopener noreferrer"
                target="_blank"
              >
                {cta.label}
                <ExternalLinkIcon className="size-4 text-muted-foreground" />
              </Link>
            </Button>
          ))}
        </div>

        <p className="flex items-center gap-2 rounded-full border bg-background px-3.5 py-1.5 text-sm">
          <span className="!pointer-events-auto relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Waiting for integration
        </p>
      </div>
    </div>
  );
}
