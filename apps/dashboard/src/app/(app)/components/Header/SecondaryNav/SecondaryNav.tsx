import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import Link from "next/link";
import type React from "react";
import type { ThirdwebClient } from "thirdweb";
import { NotificationsButton } from "../../../../../@/components/blocks/notifications/notification-button";
import { ResourcesDropdownButton } from "./ResourcesDropdownButton";
import { AccountButton } from "./account-button.client";

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
          logout={props.logout}
          connectButton={props.connectButton}
          account={props.account}
          client={props.client}
          accountAddress={props.accountAddress}
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
        href="https://portal.thirdweb.com"
        className="text-muted-foreground text-sm hover:text-foreground"
        target="_blank"
        rel="noopener noreferrer"
      >
        Docs
      </Link>

      <Link
        target="_blank"
        href="/support"
        className="text-muted-foreground text-sm hover:text-foreground"
        rel="noopener noreferrer"
      >
        Support
      </Link>

      <Link
        target="_blank"
        href="https://feedback.thirdweb.com"
        className="text-muted-foreground text-sm hover:text-foreground"
        rel="noopener noreferrer"
      >
        Feedback
      </Link>
    </div>
  );
}
