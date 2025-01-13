import { cn } from "@/lib/utils";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type { TruncatedSessionInfo } from "../api/types";
import { ChatSidebar } from "./ChatSidebar";
import { MobileNav } from "./NebulaMobileNav";

export function ChatPageLayout(props: {
  authToken: string;
  accountAddress: string;
  sessions: TruncatedSessionInfo[];
  children: React.ReactNode;
  className?: string;
  account: Account;
}) {
  return (
    <div
      className={cn(
        "flex h-dvh flex-col overflow-hidden bg-background lg:flex-row",
        props.className,
      )}
    >
      <aside className="hidden w-[280px] shrink-0 border-border border-r bg-muted/50 lg:block">
        <ChatSidebar
          sessions={props.sessions}
          authToken={props.authToken}
          type="desktop"
          account={props.account}
        />
      </aside>

      <MobileNav
        sessions={props.sessions}
        authToken={props.authToken}
        account={props.account}
      />

      {props.children}
    </div>
  );
}
