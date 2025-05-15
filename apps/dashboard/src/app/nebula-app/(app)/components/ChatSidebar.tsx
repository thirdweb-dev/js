"use client";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabButtons } from "@/components/ui/tabs";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileCode2Icon,
  LogOutIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  AccountAvatar,
  AccountBlobbie,
  AccountProvider,
  useActiveWallet,
} from "thirdweb/react";
import { WalletIcon, WalletName, WalletProvider } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { useIsClientMounted } from "../../../../components/ClientOnly/ClientOnly";
import { doNebulaLogout } from "../../login/auth-actions";
import type { TruncatedSessionInfo } from "../api/types";
import { useNewChatPageLink } from "../hooks/useNewChatPageLink";
import { useSessionsWithLocalOverrides } from "../hooks/useSessionsWithLocalOverrides";
import { NebulaIcon } from "../icons/NebulaIcon";
import { nebulaAppThirdwebClient } from "../utils/nebulaThirdwebClient";
import { AssetsSection } from "./AssetsSection/AssetsSection";
import { ChatSidebarLink } from "./ChatSidebarLink";
import { NebulaConnectWallet } from "./NebulaConnectButton";
import { TransactionsSection } from "./TransactionsSection/TransactionsSection";

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
          Beta
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
                  title={session.title || "Untitled Chat"}
                  key={session.id}
                  authToken={props.authToken}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-auto">
        <WalletDetails />
      </div>

      <div className="flex items-center justify-center gap-2 border-t px-4 py-3">
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
    </div>
  );
}

function WalletDetails() {
  const [tab, setTab] = useState<"assets" | "transactions">("assets");
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <DynamicHeight transition="height 220ms ease">
      <div className="flex items-center justify-between gap-2 border-t px-2 py-1.5">
        <CustomConnectButton />
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-auto w-auto p-1.5 transition-transform duration-300",
            isExpanded ? "rotate-180" : "",
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronDownIcon className="size-4" />
        </Button>
      </div>

      {isExpanded && (
        <div className="border-t border-dashed">
          <TabButtons
            tabContainerClassName="px-2 pt-2"
            tabClassName="!text-sm py-1.5"
            tabs={[
              {
                name: "Assets",
                onClick: () => setTab("assets"),
                isActive: tab === "assets",
              },
              {
                name: "Recent Activity",
                onClick: () => setTab("transactions"),
                isActive: tab === "transactions",
              },
            ]}
          />

          {isExpanded && (
            <div className="h-[230px] overflow-y-auto py-4 pr-1 pl-2">
              {tab === "assets" && (
                <AssetsSection client={nebulaAppThirdwebClient} />
              )}

              {tab === "transactions" && (
                <TransactionsSection client={nebulaAppThirdwebClient} />
              )}
            </div>
          )}
        </div>
      )}
    </DynamicHeight>
  );
}

function CustomConnectButton() {
  const activeWallet = useActiveWallet();
  const accountBlobbie = <AccountBlobbie className="size-8 rounded-full" />;
  const accountAvatarFallback = (
    <WalletIcon
      className="size-8 rounded-lg"
      fallbackComponent={accountBlobbie}
      loadingComponent={accountBlobbie}
    />
  );

  return (
    <div className="[&>*]:!w-full grow">
      <NebulaConnectWallet
        detailsButtonClassName="!bg-background hover:!border-active-border"
        customDetailsButton={
          activeWallet
            ? (address) => {
                return (
                  <WalletProvider id={activeWallet.id}>
                    <AccountProvider
                      address={address}
                      client={nebulaAppThirdwebClient}
                    >
                      <Button
                        variant="ghost"
                        className="flex h-auto w-full items-center justify-start gap-2.5 rounded-lg px-2 hover:bg-accent"
                      >
                        <AccountAvatar
                          className="size-8 rounded-full"
                          fallbackComponent={accountAvatarFallback}
                          loadingComponent={accountAvatarFallback}
                        />
                        <div className="flex flex-col items-start justify-start">
                          <div className="text-sm">
                            {shortenAddress(address)}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {activeWallet.id === "smart" ? (
                              <span> Smart Wallet </span>
                            ) : (
                              <WalletName
                                fallbackComponent={<span>Wallet</span>}
                                loadingComponent={<span>Wallet</span>}
                              />
                            )}
                          </div>
                        </div>
                      </Button>
                    </AccountProvider>
                  </WalletProvider>
                );
              }
            : undefined
        }
      />
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
      label="Toggle Theme"
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
    <ToolTipLabel label={props.label}>
      <Button
        asChild
        variant="ghost"
        className="size-10 rounded-full p-0 text-muted-foreground hover:text-foreground"
      >
        <Link
          href={props.href}
          target={props.target}
          prefetch={false}
          aria-label={props.label}
        >
          <props.icon className="size-5" />
        </Link>
      </Button>
    </ToolTipLabel>
  );
}

function SidebarIconButton(props: {
  icon: React.FC<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <ToolTipLabel label={props.label}>
      <Button
        variant="ghost"
        onClick={props.onClick}
        aria-label={props.label}
        className="size-10 rounded-full p-0 text-muted-foreground hover:text-foreground"
      >
        <props.icon className="size-5" />
      </Button>
    </ToolTipLabel>
  );
}
