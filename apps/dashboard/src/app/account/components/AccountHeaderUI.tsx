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
import {
  NotificationButtonUI,
  type NotificationMetadata,
} from "../../team/components/NotificationButton/NotificationButton";
import { TeamAndProjectSelectorPopoverButton } from "../../team/components/TeamHeader/TeamAndProjectSelectorPopoverButton";
import { TeamSelectorMobileMenuButton } from "../../team/components/TeamHeader/TeamSelectorMobileMenuButton";

export type AccountHeaderCompProps = {
  className?: string;
  logout: () => void;
  connectButton: React.ReactNode;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
  createProject: (team: Team) => void;
  account: Pick<Account, "email" | "id" | "image">;
  client: ThirdwebClient;
  accountAddress: string;
  getChangelogNotifications: () => Promise<NotificationMetadata[]>;
  getInboxNotifications: () => Promise<NotificationMetadata[]>;
  markNotificationAsRead: (id: string) => Promise<void>;
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
            <GradientAvatar
              id={props.account?.id || "default"}
              src={props.account?.image || ""}
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
              client={props.client}
            />
          )}
        </div>
      </div>

      <SecondaryNav
        account={props.account}
        logout={props.logout}
        connectButton={props.connectButton}
        client={props.client}
        accountAddress={props.accountAddress}
        getChangelogs={props.getChangelogNotifications}
        getInboxNotifications={props.getInboxNotifications}
        markNotificationAsRead={props.markNotificationAsRead}
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
            <GradientAvatar
              id={props.account?.id}
              src={props.account?.image || ""}
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

      <div className="flex items-center gap-3">
        <NotificationButtonUI
          getChangelogs={props.getChangelogNotifications}
          getInboxNotifications={props.getInboxNotifications}
          markNotificationAsRead={props.markNotificationAsRead}
        />

        <MobileBurgerMenuButton
          type="loggedIn"
          email={props.account?.email}
          logout={props.logout}
          connectButton={props.connectButton}
          accountAddress={props.accountAddress}
        />
      </div>
    </header>
  );
}

function SlashSeparator() {
  return <div className="mx-2 h-5 w-[1.5px] rotate-[25deg] bg-foreground/30" />;
}
