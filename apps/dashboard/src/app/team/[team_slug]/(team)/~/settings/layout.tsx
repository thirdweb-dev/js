"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { TeamSettingsSidebar } from "./_components/sidebar/TeamSettingsSidebar";
import { TeamSettingsMobileNav } from "./_components/sidebar/TeamsMobileNav";
import { getTeamSettingsLinks } from "./_components/sidebar/getTeamSettingsLinks";

// on the /~/settings page
// - On desktop: show the general settings as usual
// - On mobile: show the full nav instead of page content and when user clicks on the "General Settings" ( first link ) - hide the full nav and show the page content

export default function Layout(props: {
  params: {
    team_slug: string;
  };
  children: React.ReactNode;
}) {
  const [_showFullNavOnMobile, setShowFullNavOnMobile] = useState(true);
  const pathname = usePathname();
  const isSettingsOverview = (pathname || "").endsWith("/~/settings");
  const showFullNavOnMobile = _showFullNavOnMobile && isSettingsOverview;
  const links = getTeamSettingsLinks(props.params.team_slug);
  const activeLink = links.find((link) => pathname === link.href);

  return (
    <div>
      {/* Huge page title  */}
      <div className="py-10 border-b">
        <div className="container max-w-[1200px]">
          <h1 className="text-3xl tracking-tight font-semibold">
            Team Settings
          </h1>
        </div>
      </div>

      <div className="md:hidden">
        <TeamSettingsMobileNav
          teamSlug={props.params.team_slug}
          showFull={showFullNavOnMobile}
          setShowFull={setShowFullNavOnMobile}
          activeLink={activeLink}
        />
      </div>

      <div className="flex gap-8 container max-w-[1200px] grow [&>*]:py-8 lg:[&>*]:py-10 lg:min-h-[900px]">
        <TeamSettingsSidebar teamSlug={props.params.team_slug} />
        <div
          className={cn(
            "grow",
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
