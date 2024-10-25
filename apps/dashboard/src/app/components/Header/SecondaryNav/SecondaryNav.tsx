import { ToolTipLabel } from "@/components/ui/tooltip";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { ArrowUpDownIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { ResourcesDropdownButton } from "./ResourcesDropdownButton";
import { AccountButton } from "./account-button.client";

export function SecondaryNav(props: {
  account: Pick<Account, "email" | "id"> | undefined;
  logout: () => void;
  connectButton: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-6">
      <SecondaryNavLinks />
      <AccountButton
        logout={props.logout}
        connectButton={props.connectButton}
        account={props.account}
      />
    </div>
  );
}

export function SecondaryNavLinks() {
  return (
    <div className="flex items-center gap-6">
      <ToolTipLabel
        label={
          <span>
            You are exploring the new dashboard. <br /> Click here to go back to
            the legacy dashboard.
          </span>
        }
      >
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground"
        >
          <ArrowUpDownIcon className="size-4" />
          Switch To Legacy Dashboard
        </Link>
      </ToolTipLabel>

      <ResourcesDropdownButton />

      <Link
        href="/support"
        className="text-muted-foreground text-sm hover:text-foreground"
      >
        Support
      </Link>

      <Link
        href="https://portal.thirdweb.com/"
        className="text-muted-foreground text-sm hover:text-foreground"
      >
        Docs
      </Link>
    </div>
  );
}
