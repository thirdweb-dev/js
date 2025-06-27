"use client";

import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Team } from "@/api/team";
import type { Account } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

export function SupportLayout(props: {
  team: Team;
  children: React.ReactNode;
  account: Account;
  client: ThirdwebClient;
  authToken?: string;
}) {
  const [_showFullNavOnMobile] = useState(true);
  const showFullNavOnMobile = _showFullNavOnMobile;

  return (
    <div className="flex grow flex-col">
      {/* Page content */}
      <div className="container flex grow gap-8 lg:min-h-[900px] [&>*]:py-8 lg:[&>*]:py-10">
        <div
          className={cn(
            "flex max-w-full grow flex-col",
            showFullNavOnMobile && "max-sm:hidden",
          )}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}
