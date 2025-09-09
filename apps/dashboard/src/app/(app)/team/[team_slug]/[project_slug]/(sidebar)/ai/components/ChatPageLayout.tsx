import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/project/projects";
import { cn } from "@/lib/utils";
import type { TruncatedSessionInfo } from "../api/types";
import { ChatSidebar } from "./ChatSidebar";
import { MobileNav } from "./NebulaMobileNav";

export function ChatPageLayout(props: {
  team_slug: string;
  authToken: string;
  project: Project;
  client: ThirdwebClient;
  accountAddress: string;
  sessions: TruncatedSessionInfo[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-[calc(100vh-125px)] lg:h-[calc(100vh-72px)] flex flex-col overflow-hidden bg-background lg:flex-row",
        props.className,
      )}
    >
      <MobileNav
        project={props.project}
        authToken={props.authToken}
        sessions={props.sessions}
        client={props.client}
        team_slug={props.team_slug}
      />

      {props.children}

      <aside className="hidden w-[300px] shrink-0 border-border border-l bg-background lg:block">
        <ChatSidebar
          project={props.project}
          team_slug={props.team_slug}
          client={props.client}
          sessions={props.sessions}
          type="desktop"
        />
      </aside>
    </div>
  );
}
