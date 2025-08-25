"use client";

import Link from "next/link";
import type React from "react";
import type { ThirdwebClient } from "thirdweb";
import { NotificationsButton } from "@/components/notifications/notification-button";
import type { Account } from "@/hooks/useApi";
import { AccountButton } from "./account-button.client";
import { ResourcesDropdownButton } from "./ResourcesDropdownButton";

export function SecondaryNav(props: {
  account: Pick<Account, "email" | "id">;
  logout: () => void;
  connectButton: React.ReactNode;
  client: ThirdwebClient;
  accountAddress: string;
}) {
  return (
    <div className="flex items-center gap-6">
      <SecondaryNavLinks />
      <div className="flex items-center gap-3">
        <NotificationsButton accountId={props.account.id} />
        <AccountButton
          account={props.account}
          accountAddress={props.accountAddress}
          client={props.client}
          connectButton={props.connectButton}
          logout={props.logout}
        />
      </div>
    </div>
  );
}

export function SecondaryNavLinks() {
  return (
    <div className="flex items-center gap-6">
      <ResourcesDropdownButton />

      <Link
        className="text-muted-foreground text-sm hover:text-foreground"
        href="https://portal.thirdweb.com"
        rel="noopener noreferrer"
        target="_blank"
      >
        Docs
      </Link>

      <Link
        className="text-muted-foreground text-sm hover:text-foreground"
        href="https://feedback.thirdweb.com"
        rel="noopener noreferrer"
        target="_blank"
      >
        Feedback
      </Link>
    </div>
  );
}
