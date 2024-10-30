"use client";

import { NavLink } from "@/components/ui/NavLink";
import { Button } from "@/components/ui/button";
import { accountPlan, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { usePathname } from "next/navigation";

export const UpgradeButton = () => {
  const { isLoggedIn } = useLoggedInUser();
  const meQuery = useAccount();
  const pathname = usePathname();

  if (
    !isLoggedIn ||
    meQuery.isPending ||
    !meQuery.data ||
    pathname?.startsWith("/dashboard/settings/billing") ||
    meQuery.data?.plan !== accountPlan.free
  ) {
    return null;
  }

  return (
    <Button
      asChild
      size="sm"
      variant="outline"
      className="h-full rounded-2xl bg-background py-1 text-muted-foreground text-xs hover:text-foreground"
    >
      <NavLink
        href="/dashboard/settings/billing"
        tracking={{
          label: "upgrade",
          category: "header",
          action: "click",
        }}
      >
        Upgrade
      </NavLink>
    </Button>
  );
};
