"use client";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useMutation } from "@tanstack/react-query";
import {
  ChevronRightIcon,
  FileCode2Icon,
  LogOutIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { toast } from "sonner";
import { useIsClientMounted } from "../../../../components/ClientOnly/ClientOnly";
import { doNebulaLogout } from "../../login/auth-actions";
import type { TruncatedSessionInfo } from "../api/types";
import { useNewChatPageLink } from "../hooks/useNewChatPageLink";
import { useSessionsWithLocalOverrides } from "../hooks/useSessionsWithLocalOverrides";
import { NebulaIcon } from "../icons/NebulaIcon";
import { ChatSidebarLink } from "./ChatSidebarLink";
import { NebulaConnectWallet } from "./NebulaConnectButton";

export function ChatSidebar(props: {
  sessions: TruncatedSessionInfo[];
  authToken: string;
  type: "desktop" | "mobile";
}) {
  const sessions = useSessionsWithLocalOverrides(props.sessions);
  const sessionsToShow = sessions.slice(0, 10);
  const newChatPage = useNewChatPageLink();
  const router = useDashboardRouter();
  const logoutMutation = useMutation({
    mutationFn: doNebulaLogout,
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-start gap-3 p-4 lg:justify-between">
        <Link href="/" className="flex items-center gap-1">
          <NebulaIcon className="size-6 text-foreground" aria-label="Nebula" />
          <span className="font-medium text-lg">Nebula</span>
        </Link>

        <Badge variant="secondary" className="gap-1 py-1">
          Alpha
        </Badge>
      </div>

      <div className="h-1" />

      <div className="flex flex-col gap-2 px-4">
        <Button
          asChild
          variant="pink"
          className="w-full gap-2 rounded-lg border-nebula-pink-foreground"
        >
          <Link href={newChatPage}>
            <PlusIcon className="size-4" />
            New Chat
          </Link>
        </Button>
      </div>

      <div className="h-5" />

      {sessionsToShow.length > 0 && (
        <div className="flex-1 overflow-auto border-t border-dashed p-2 pt-2">
          <div className="flex items-center justify-between px-2 py-3">
            <h3 className="text-muted-foreground text-xs">Recent Chats</h3>
            {sessionsToShow.length < sessions.length && (
              <Link
                href="/chat/history"
                className="flex items-center gap-1 rounded-full text-foreground text-xs hover:underline"
              >
                View All
                <ChevronRightIcon className="size-3.5 text-muted-foreground" />
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-1">
            {sessionsToShow.map((session) => {
              return (
                <ChatSidebarLink
                  sessionId={session.id}
                  title={session.title || session.id}
                  key={session.id}
                  authToken={props.authToken}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-auto space-y-1 border-y border-dashed px-2 py-4">
        <SidebarIconLink
          href="https://portal.thirdweb.com/nebula"
          icon={FileCode2Icon}
          label="Documentation"
          target="_blank"
        />

        <ToggleThemeButton />

        <SidebarIconButton
          onClick={async () => {
            try {
              await logoutMutation.mutateAsync();
              router.replace("/login");
            } catch {
              toast.error("Failed to log out");
            }
          }}
          icon={logoutMutation.isPending ? Spinner : LogOutIcon}
          label="Log Out"
        />
      </div>

      <div className="[&>*]:!w-full p-4">
        <NebulaConnectWallet detailsButtonClassName="!bg-background hover:!border-active-border" />
      </div>
    </div>
  );
}

function ToggleThemeButton() {
  const { theme, setTheme } = useTheme();
  const isClientMounted = useIsClientMounted();

  return (
    <SidebarIconButton
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light");
      }}
      icon={
        isClientMounted ? (theme === "light" ? SunIcon : MoonIcon) : Spinner
      }
      label="Theme"
    />
  );
}

function SidebarIconLink(props: {
  icon: React.FC<{ className?: string }>;
  label: string;
  target?: "_blank";
  href: string;
}) {
  return (
    <Button
      asChild
      variant="ghost"
      className="h-auto w-full justify-start gap-2.5 rounded-lg px-2 py-2 text-left text-sm"
    >
      <Link href={props.href} target={props.target} prefetch={false}>
        <props.icon className="size-4" />
        {props.label}
      </Link>
    </Button>
  );
}

function SidebarIconButton(props: {
  icon: React.FC<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      className="h-auto w-full justify-start gap-2.5 rounded-lg px-2 py-2 text-left text-sm"
      onClick={props.onClick}
    >
      <props.icon className="size-4" />
      {props.label}
    </Button>
  );
}
