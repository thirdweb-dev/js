"use client";

import { Button } from "@/components/ui/button";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type OnrampProvider = "stripe" | "coinbase" | "transak";

export const ProviderSelector: React.FC<{ activeProvider: OnrampProvider }> = ({
  activeProvider,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useDashboardRouter();

  const createPageURL = useCallback(
    (provider: OnrampProvider) => {
      const params = new URLSearchParams(searchParams || undefined);
      params.set("provider", provider);
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );

  const providers: OnrampProvider[] = ["coinbase", "stripe", "transak"];

  return (
    <div className="flex flex-row gap-2">
      {providers.map((p) => (
        <Button
          key={p}
          size="sm"
          variant={activeProvider === p ? "default" : "outline"}
          onClick={() => router.replace(createPageURL(p))}
          className="capitalize"
        >
          {p}
        </Button>
      ))}
    </div>
  );
};
