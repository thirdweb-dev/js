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
      <div className="py-4 px-4 border-b flex items-center gap-2 text-muted-foreground">
        <Link
          href={teamLinks[0].href}
          className="inline-flex items-center gap-1"
          onClick={() => {
            setShowFull(true);
          }}
        >
          Team Settings
        </Link>

        {activeLink && activeLink !== teamLinks[0] && (
          <>
            <span aria-hidden className="opacity-50 font-semibold">
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
              href={link.href}
              className="p-4 border-b flex"
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
