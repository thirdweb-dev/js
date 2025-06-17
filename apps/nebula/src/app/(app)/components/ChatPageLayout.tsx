import { TWAutoConnect } from "@/components/blocks/auto-connect";
import { nebulaAAOptions } from "@/config/nebula-aa";
import { nebulaAppThirdwebClient } from "@/constants/nebula-client";
import { cn } from "@/lib/utils";
import type { TruncatedSessionInfo } from "../api/types";
import { ChatSidebar } from "./ChatSidebar";
import { MobileNav } from "./NebulaMobileNav";

export function ChatPageLayout(props: {
  authToken: string;
  accountAddress: string;
  sessions: TruncatedSessionInfo[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-dvh flex-col overflow-hidden bg-background lg:flex-row",
        props.className,
      )}
    >
      <aside className="hidden w-[300px] shrink-0 border-border border-r bg-card lg:block">
        <ChatSidebar
          sessions={props.sessions}
          authToken={props.authToken}
          type="desktop"
        />
      </aside>

      <MobileNav sessions={props.sessions} authToken={props.authToken} />

      <TWAutoConnect
        accountAbstraction={nebulaAAOptions}
        client={nebulaAppThirdwebClient}
      />

      {props.children}
    </div>
  );
}
