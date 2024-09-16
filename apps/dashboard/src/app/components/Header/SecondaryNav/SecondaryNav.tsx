import Link from "next/link";
import type React from "react";
import { ResourcesDropdownButton } from "./ResourcesDropdownButton";
import { AccountButton } from "./account-button.client";

export function SecondaryNav(props: {
  email: string | undefined;
  logout: () => void;
  connectButton: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-6">
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

      <AccountButton
        email={props.email}
        logout={props.logout}
        connectButton={props.connectButton}
      />
    </div>
  );
}
