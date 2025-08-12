import type { ThirdwebClient } from "thirdweb";
import type { Team } from "@/api/team/get-team";
import { Badge } from "@/components/ui/badge";
import type { Account } from "@/hooks/useApi";
import { getTeamSettingsLinks } from "./getTeamSettingsLinks";
import { SidebarLink } from "./SidebarLink";

export function TeamSettingsSidebar(props: {
  team: Team;
  account: Pick<Account, "id" | "image"> | undefined;
  client: ThirdwebClient;
}) {
  const teamLinks = getTeamSettingsLinks(props.team.slug);
  const teamGroupLinks = teamLinks.filter((link) => link.group === "team");
  const accountGroupLinks = teamLinks.filter(
    (link) => link.group === "account",
  );

  return (
    <aside className="lg:-ml-2 sticky top-0 hidden w-[250px] shrink-0 grow-0 flex-col gap-4 self-start lg:flex">
      <RenderLinkGroup
        client={props.client}
        links={teamGroupLinks}
        team={props.team}
        title="Team"
        titleAvatarIcon={{
          id: props.team.id,
          src: props.team.image || "",
        }}
      />
      <RenderLinkGroup
        client={props.client}
        links={accountGroupLinks}
        team={props.team}
        title="Account"
        titleAvatarIcon={{
          id: props.account?.id,
          src: props.account?.image || "",
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
  client: ThirdwebClient;
}) {
  return (
    <>
      <div className="px-2">
        <Badge
          className="bg-card font-normal text-muted-foreground"
          variant="outline"
        >
          {props.title}
        </Badge>
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
