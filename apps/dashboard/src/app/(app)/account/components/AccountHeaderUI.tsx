import Link from "next/link";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { GradientAvatar } from "@/components/blocks/avatar/gradient-avatar";
import { NotificationsButton } from "@/components/notifications/notification-button";
import type { Account } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
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
  createTeam: () => void;
  account: Pick<Account, "email" | "id" | "image">;
  client: ThirdwebClient;
  accountAddress: string;
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
            className="flex flex-row items-center gap-2 font-normal text-sm"
            href="/account"
          >
            <GradientAvatar
              className="size-6"
              client={props.client}
              id={props.account?.id || "default"}
              src={props.account?.image || ""}
            />
            <span> My Account </span>
          </Link>

          {props.teamsAndProjects.length > 0 && (
            <TeamAndProjectSelectorPopoverButton
              account={props.account}
              client={props.client}
              createProject={props.createProject}
              createTeam={props.createTeam}
              currentProject={undefined}
              currentTeam={undefined}
              focus="team-selection"
              teamsAndProjects={props.teamsAndProjects}
            />
          )}
        </div>
      </div>

      <SecondaryNav
        account={props.account}
        accountAddress={props.accountAddress}
        client={props.client}
        connectButton={props.connectButton}
        logout={props.logout}
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
            className={cn(
              "flex flex-row items-center gap-2 font-normal text-foreground text-sm",
            )}
            href="/account"
          >
            <GradientAvatar
              className="size-6"
              client={props.client}
              id={props.account?.id}
              src={props.account?.image || ""}
            />
            <span> My Account </span>
          </Link>

          {props.teamsAndProjects.length > 0 && (
            <TeamSelectorMobileMenuButton
              account={props.account}
              client={props.client}
              createTeam={props.createTeam}
              currentTeam={undefined}
              isOnProjectPage={false}
              teamsAndProjects={props.teamsAndProjects}
              upgradeTeamLink={undefined}
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationsButton accountId={props.account.id} />

        <MobileBurgerMenuButton
          accountAddress={props.accountAddress}
          client={props.client}
          connectButton={props.connectButton}
          email={props.account?.email}
          logout={props.logout}
          type="loggedIn"
        />
      </div>
    </header>
  );
}

function SlashSeparator() {
  return <div className="mx-2 h-5 w-[1.5px] rotate-[25deg] bg-foreground/30" />;
}
