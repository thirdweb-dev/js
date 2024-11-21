import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import Link from "next/link";
import type React from "react";
import type { ThirdwebClient } from "thirdweb";
import { ResourcesDropdownButton } from "./ResourcesDropdownButton";
import { AccountButton } from "./account-button.client";

export function SecondaryNav(props: {
  account: Pick<Account, "email" | "id"> | undefined;
  logout: () => void;
  connectButton: React.ReactNode;
  client: ThirdwebClient;
}) {
  return (
    <div className="flex items-center gap-6">
      <SecondaryNavLinks />
      <AccountButton
        logout={props.logout}
        connectButton={props.connectButton}
        account={props.account}
        client={props.client}
      />
    </div>
  );
}

export function SecondaryNavLinks() {
  return (
    <div className="flex items-center gap-6">
      <ResourcesDropdownButton />

      <Link
        target="_blank"
        href="https://thirdweb.com/support"
        className="text-muted-foreground text-sm hover:text-foreground"
      >
        Support
      </Link>

      <Link
        href="https://portal.thirdweb.com/"
        className="text-muted-foreground text-sm hover:text-foreground"
        target="_blank"
      >
        Docs
      </Link>
    </div>
  );
}
