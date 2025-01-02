import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { GradientAvatar } from "@/components/blocks/Avatars/GradientAvatar";
import { cn } from "@/lib/utils";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import Link from "next/link";
import type { ThirdwebClient } from "thirdweb";
import { SecondaryNav } from "../../components/Header/SecondaryNav/SecondaryNav";
import { MobileBurgerMenuButton } from "../../components/MobileBurgerMenuButton";
import { ThirdwebMiniLogo } from "../../components/ThirdwebMiniLogo";
import { TeamAndProjectSelectorPopoverButton } from "../../team/components/TeamHeader/TeamAndProjectSelectorPopoverButton";
import { TeamSelectorMobileMenuButton } from "../../team/components/TeamHeader/TeamSelectorMobileMenuButton";

export type AccountHeaderCompProps = {
  className?: string;
  logout: () => void;
  connectButton: React.ReactNode;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
  createProject: (team: Team) => void;
  account: Pick<Account, "email" | "id"> | undefined;
  client: ThirdwebClient;
};

export function AccountHeaderDesktopUI(props: AccountHeaderCompProps) {
  return (
    <header
      className={cn(
        "flex flex-row items-center justify-between gap-2 px-6 py-4 text-foreground",
        props.className,
      )}
    >
      <div className="flex items-center gap-2">
        <Link href="/team">
          <ThirdwebMiniLogo className="h-5" />
        </Link>

        <SlashSeparator />

        <div className="flex items-center gap-1">
          <Link
            href="/account"
            className="flex flex-row items-center gap-2 font-normal text-sm"
          >
            {/* TODO - set account Image  */}
            <GradientAvatar
              id={props.account?.id || "default"}
              src={""}
              className="size-6"
              client={props.client}
            />
            <span> My Account </span>
          </Link>

          {props.teamsAndProjects.length > 0 && (
            <TeamAndProjectSelectorPopoverButton
              currentProject={undefined}
              currentTeam={undefined}
              teamsAndProjects={props.teamsAndProjects}
              focus="team-selection"
              createProject={props.createProject}
              account={props.account}
            />
          )}
        </div>
      </div>

      <SecondaryNav
        account={props.account}
        logout={props.logout}
        connectButton={props.connectButton}
        client={props.client}
      />
    </header>
  );
}

export function AccountHeaderMobileUI(props: AccountHeaderCompProps) {
  return (
    <header
      className={cn(
        "flex flex-row items-center justify-between gap-2 px-4 py-4 text-foreground",
        props.className,
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Link
            href="/account"
            className={cn(
              "flex flex-row items-center gap-2 font-normal text-foreground text-sm",
            )}
          >
            {/* TODO - set account image */}
            <GradientAvatar
              id={props.account?.id}
              src={props.account ? "" : undefined}
              className="size-6"
              client={props.client}
            />
            <span> My Account </span>
          </Link>

          {props.teamsAndProjects.length > 0 && (
            <TeamSelectorMobileMenuButton
              currentTeam={undefined}
              teamsAndProjects={props.teamsAndProjects}
              upgradeTeamLink={undefined}
              account={props.account}
            />
          )}
        </div>
      </div>

      <MobileBurgerMenuButton
        type="loggedIn"
        email={props.account?.email}
        logout={props.logout}
        connectButton={props.connectButton}
      />
    </header>
  );
}

function SlashSeparator() {
  return <div className="mx-2 h-5 w-[1.5px] rotate-[25deg] bg-foreground/30" />;
}
