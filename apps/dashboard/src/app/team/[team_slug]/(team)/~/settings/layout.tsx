import { SidebarLink } from "./sidebar";

export default function Layout(props: {
  params: {
    team_slug: string;
  };
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex gap-2 container grow">
      <TeamSettingsSidebar teamSlug={props.params.team_slug} />
      <div className="grow"> {props.children} </div>
    </div>
  );
}

function getLinks(teamSlug: string) {
  const prefix = `/team/${teamSlug}/~/settings`;
  const teamLinks: Array<{
    name: string;
    href: string;
  }> = [
    {
      name: "General",
      href: `${prefix}`,
    },
    {
      name: "Members",
      href: `${prefix}/members`,
    },
    {
      name: "Billing",
      href: `${prefix}/billing`,
    },
    {
      name: "Credits",
      href: `${prefix}/credits`,
    },
  ];

  return teamLinks;
}

export function TeamSettingsSidebar(props: {
  teamSlug: string;
}) {
  const teamLinks = getLinks(props.teamSlug);

  return (
    <aside className="w-[250px] hidden lg:flex py-8 flex-col gap-6">
      <div className="flex items-center gap-1.5 px-4">
        <div className="size-5 bg-border rounded-full" />
        <p className="text-muted-foreground text-sm">Team</p>
      </div>

      <ul className="flex flex-col gap-2">
        {teamLinks.map((link) => (
          <li key={link.href}>
            <SidebarLink href={link.href} label={link.name} />
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-1.5 px-4">
        {/* TODO - account image - using placeholder for now */}
        <div className="size-5 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full" />
        <p className="text-muted-foreground text-sm">Account</p>
      </div>

      <ul>
        <li>
          <SidebarLink
            href={`/team/${props.teamSlug}/~/settings/notifications`}
            label="My Notifications"
          />
        </li>
      </ul>
    </aside>
  );
}
