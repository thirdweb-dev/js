import type { Team } from "@/api/team";
import { GradientAvatar } from "@/components/blocks/Avatars/GradientAvatar";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { SidebarLink } from "./SidebarLink";
import { getTeamSettingsLinks } from "./getTeamSettingsLinks";

export function TeamSettingsSidebar(props: {
  team: Team;
  account: Pick<Account, "id"> | undefined;
}) {
  const teamLinks = getTeamSettingsLinks(props.team.slug);
  const teamGroupLinks = teamLinks.filter((link) => link.group === "team");
  const accountGroupLinks = teamLinks.filter(
    (link) => link.group === "account",
  );

  return (
    <aside className="lg:-ml-2 sticky top-0 hidden w-[250px] shrink-0 grow-0 flex-col gap-4 self-start lg:flex">
      <RenderLinkGroup
        links={teamGroupLinks}
        title="Team"
        team={props.team}
        titleAvatarIcon={{
          id: props.team.id,
          src: props.team.image || "",
        }}
      />
      <RenderLinkGroup
        links={accountGroupLinks}
        title="Account"
        team={props.team}
        titleAvatarIcon={{
          id: props.account?.id,
          src: props.team.image || "",
        }}
      />
    </aside>
  );
}

function RenderLinkGroup(props: {
  links: Array<{
    name: string;
    href: string;
  }>;
  title: string;
  team: Team;
  titleAvatarIcon: {
    id: string | undefined;
    src: string;
  };
}) {
  return (
    <>
      <div className="flex items-center gap-1.5 px-4">
        <GradientAvatar
          src={props.titleAvatarIcon.src}
          className="size-4"
          id={props.titleAvatarIcon.id}
        />
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
