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
    <aside className="lg:-ml-2 sticky top-0 hidden w-[250px] shrink-0 grow-0 flex-col gap-4 self-start lg:flex">
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
        <div className="size-4 rounded-full border border-border bg-muted" />
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
