"use client";

import { TabLinks } from "@/components/ui/tabs";
import { useSelectedLayoutSegment } from "next/navigation";
import { useMemo } from "react";
import { products } from "../../../../components/server/products";
import type { ChainSupportedService } from "../../../../types/chain";

export function getEnabledTabs(enabledServices: ChainSupportedService[]) {
  return products
    .map((p) => ({
      name: p.name,
      segment: p.id === "contracts" ? "" : p.id,
      serviceId: p.id,
      icon: p.icon,
      isEnabled: enabledServices.includes(p.id) ?? false,
    }))
    .sort((a, b) => {
      if (a.isEnabled && !b.isEnabled) {
        return -1;
      }
      if (!a.isEnabled && b.isEnabled) {
        return 1;
      }
      return 0;
    });
}

export function ChainPageTabs(props: {
  chainSlug: string;
  enabledServices: ChainSupportedService[];
}) {
  const layoutSegment = useSelectedLayoutSegment() || "";

  const links = useMemo(() => {
    return getEnabledTabs(props.enabledServices);
  }, [props.enabledServices]);

  return (
    <TabLinks
      links={links.map((tab) => ({
        name: tab.name,
        href: `/${props.chainSlug}/${tab.segment}`,
        isActive: layoutSegment === tab.segment,
        isEnabled: tab.isEnabled,
        icon: tab.icon,
      }))}
    />
  );
}
