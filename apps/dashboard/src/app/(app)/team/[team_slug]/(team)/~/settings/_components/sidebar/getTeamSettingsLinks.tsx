export function getTeamSettingsLinks(teamSlug: string) {
  const prefix = `/team/${teamSlug}/~/settings`;

  const teamLinks: Array<{
    name: string;
    href: string;
    group: "team" | "account";
  }> = [
    {
      group: "team",
      href: `${prefix}`,
      name: "General",
    },
    {
      group: "team",
      href: `${prefix}/billing`,
      name: "Billing",
    },
    {
      group: "team",
      href: `${prefix}/invoices`,
      name: "Invoices",
    },
    {
      group: "team",
      href: `${prefix}/members`,
      name: "Members",
    },
    {
      group: "team",
      href: `${prefix}/credits`,
      name: "Credits",
    },
    {
      group: "account",
      href: `${prefix}/notifications`,
      name: "My Notifications",
    },
  ];

  return teamLinks;
}
