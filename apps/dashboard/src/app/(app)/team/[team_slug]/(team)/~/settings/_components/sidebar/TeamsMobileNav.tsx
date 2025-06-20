"use client";
import Link from "next/link";
import { getTeamSettingsLinks } from "./getTeamSettingsLinks";

export function TeamSettingsMobileNav(props: {
  teamSlug: string;
  showFull: boolean;
  setShowFull: (show: boolean) => void;
  activeLink: { name: string; href: string } | undefined;
}) {
  const { showFull, setShowFull, activeLink } = props;
  const teamLinks = getTeamSettingsLinks(props.teamSlug);

  if (!showFull) {
    return (
      <div className="flex items-center gap-2 border-border border-b px-4 py-4 text-muted-foreground">
        <Link
          className="inline-flex items-center gap-1"
          href={teamLinks[0]?.href || "#"}
          onClick={() => {
            setShowFull(true);
          }}
        >
          Team Settings
        </Link>

        {activeLink && activeLink !== teamLinks[0] && (
          <>
            <span aria-hidden className="font-semibold opacity-50">
              /
            </span>
            <span className="text-foreground">{activeLink.name}</span>
          </>
        )}
      </div>
    );
  }

  return (
    <aside className="flex flex-col gap-5 pb-20">
      <ul className="flex flex-col gap-1">
        {teamLinks.map((link) => (
          <li key={link.href}>
            <Link
              className="flex border-border border-b p-4"
              href={link.href}
              onClick={() => {
                if (link === teamLinks[0]) {
                  setShowFull(false);
                }
              }}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
