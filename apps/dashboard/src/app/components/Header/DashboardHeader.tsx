import { NavLink } from "@/components/ui/NavLink";
import { Button } from "@/components/ui/button";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { CmdKSearch } from "components/cmd-k-search";
import { ColorModeToggle } from "components/color-mode/color-mode-toggle";
import { Logo } from "components/logo";
import { CreditsButton } from "components/settings/Account/Billing/CreditsButton";
import { UpgradeButton } from "components/settings/Account/Billing/UpgradeButton";
import { CircleHelpIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { DashboardHeaderTabs } from "./DashboardHeaderTabs";

export const DashboardHeader: React.FC = () => {
  return (
    <div className="bg-muted/50">
      <header className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* left */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Logo hideWordmark />
          </Link>
          <CmdKSearch />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <div className="hidden gap-2 md:flex">
            <Suspense fallback={null}>
              <CreditsButton />
            </Suspense>
            <UpgradeButton />
          </div>

          <HeaderNavLink
            trackingLabel="chainlist"
            href="/chainlist"
            label="Chainlist"
          />

          <HeaderNavLink
            trackingLabel="docs"
            href="https://portal.thirdweb.com"
            label="Docs"
          />

          <HeaderNavLink
            trackingLabel="support"
            href="/support"
            label="Support"
          />

          <div className="md:hidden">
            <Button asChild variant="ghost">
              <NavLink
                className="fade-in-0 !h-auto !w-auto p-2"
                href="/support"
                tracking={{
                  category: "header",
                  action: "click",
                  label: "support",
                }}
              >
                <CircleHelpIcon className="size-5" />
              </NavLink>
            </Button>
          </div>

          <ColorModeToggle />

          <div className="md:ml-2">
            <CustomConnectWallet />
          </div>
        </div>
      </header>

      <DashboardHeaderTabs />
    </div>
  );
};

function HeaderNavLink(props: {
  label: string;
  trackingLabel: string;
  href: string;
}) {
  return (
    <NavLink
      href={props.href}
      tracking={{
        category: "header",
        action: "click",
        label: props.trackingLabel,
      }}
      className="hidden px-2.5 text-muted-foreground text-sm hover:text-foreground md:block"
      activeClassName="text-foreground"
    >
      {props.label}
    </NavLink>
  );
}
