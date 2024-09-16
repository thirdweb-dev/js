import { SidebarLink } from "./SidebarLink";
import { getTeamSettingsLinks } from "./getTeamSettingsLinks";

export function TeamSettingsSidebar(props: {
  teamSlug: string;
}) {
  const teamLinks = getTeamSettingsLinks(props.teamSlug);
  const teamGroupLinks = teamLinks.filter((link) => link.group === "team");
  const accountGroupLinks = teamLinks.filter(
    (link) => link.group === "account",
  );

  return (
    <aside className="w-[250px] hidden lg:flex flex-col gap-4 sticky top-0 self-start lg:-ml-2 grow-0 shrink-0">
      <RenderLinkGroup links={teamGroupLinks} title="Team" />
      <RenderLinkGroup links={accountGroupLinks} title="Account" />
    </aside>
  );
}

function RenderLinkGroup(props: {
  links: Array<{
    name: string;
    href: string;
  }>;
  title: string;
}) {
  return (
    <>
      <div className="flex items-center gap-1.5 px-4">
        {/* TODO - using placeholder for now */}
        <div className="size-4 bg-muted rounded-full border border-border" />
        <p className="text-muted-foreground text-xs">{props.title}</p>
      </div>

      <ul className="flex flex-col gap-0.5">
        {props.links.map((link) => (
          <li key={link.href}>
            <SidebarLink href={link.href} label={link.name} />
          </li>
        ))}
      </ul>
    </>
  );
}
