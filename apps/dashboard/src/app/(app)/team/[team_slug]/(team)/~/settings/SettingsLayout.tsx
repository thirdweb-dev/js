"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Team } from "@/api/team";
import type { Account } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { getTeamSettingsLinks } from "./_components/sidebar/getTeamSettingsLinks";
import { TeamSettingsSidebar } from "./_components/sidebar/TeamSettingsSidebar";
import { TeamSettingsMobileNav } from "./_components/sidebar/TeamsMobileNav";

// on the /~/settings page
// - On desktop: show the general settings as usual
// - On mobile: show the full nav instead of page content   and when user clicks on the "General Settings" ( first link ) - hide the full nav and show the page content

export function SettingsLayout(props: {
  team: Team;
  children: React.ReactNode;
  account: Account;
  client: ThirdwebClient;
}) {
  const [_showFullNavOnMobile, setShowFullNavOnMobile] = useState(true);
  const pathname = usePathname();
  const isSettingsOverview = (pathname || "").endsWith("/~/settings");
  const showFullNavOnMobile = _showFullNavOnMobile && isSettingsOverview;
  const links = getTeamSettingsLinks(props.team.slug);
  const activeLink = links.find((link) => pathname === link.href);

  return (
    <div className="flex grow flex-col">
      {/* Huge page title  */}
      <div className="border-border border-b py-10">
        <div className="container">
          <h1 className="font-semibold text-3xl tracking-tight">
            Team Settings
          </h1>
        </div>
      </div>

      <div className="md:hidden">
        <TeamSettingsMobileNav
          activeLink={activeLink}
          setShowFull={setShowFullNavOnMobile}
          showFull={showFullNavOnMobile}
          teamSlug={props.team.slug}
        />
      </div>

      <div className="container flex grow gap-8 lg:min-h-[900px] [&>*]:py-8 lg:[&>*]:py-10">
        <TeamSettingsSidebar
          account={props.account}
          client={props.client}
          team={props.team}
        />
        <div
          className={cn(
            "flex max-w-full grow flex-col",
            // if showing full nav on mobile - hide the page content
            showFullNavOnMobile && "max-sm:hidden",
          )}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}
