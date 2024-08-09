"use client";

import { TabLinks } from "@/components/ui/tabs";
import { useSelectedLayoutSegment } from "next/navigation";

const links: {
  name: string;
  segment: string;
}[] = [
  { name: "Transaction Simulator", segment: "transaction-simulator" },
  { name: "Wei Converter", segment: "wei-converter" },
  { name: "Hex Converter", segment: "hex-converter" },
  { name: "Unix Time Converter", segment: "unixtime-converter" },
  { name: "Keccak-256 Converter", segment: "keccak256-converter" },
];

export function ToolsTabs() {
  const layoutSegment = useSelectedLayoutSegment() || "";

  return (
    <TabLinks
      links={links.map((tab) => ({
        name: tab.name,
        href: `/tools/${tab.segment}`,
        isActive: layoutSegment === tab.segment,
        isEnabled: true,
      }))}
    />
  );
}
