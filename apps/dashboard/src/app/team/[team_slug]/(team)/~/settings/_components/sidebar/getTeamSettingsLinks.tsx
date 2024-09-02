export function getTeamSettingsLinks(teamSlug: string) {
  const prefix = `/team/${teamSlug}/~/settings`;

  const teamLinks: Array<{
    name: string;
    href: string;
    group: "team" | "account";
  }> = [
    {
      name: "General",
      href: `${prefix}`,
      group: "team",
    },
    {
      name: "Members",
      href: `${prefix}/members`,
      group: "team",
    },
    {
      name: "Billing",
      href: `${prefix}/billing`,
      group: "team",
    },
    {
      name: "Credits",
      href: `${prefix}/credits`,
      group: "team",
    },
    {
      name: "My Notifications",
      href: `${prefix}/notifications`,
      group: "account",
    },
  ];

  return teamLinks;
}
