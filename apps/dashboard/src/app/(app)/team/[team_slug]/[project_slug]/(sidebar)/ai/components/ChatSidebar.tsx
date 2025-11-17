"use client";
import {
  BotIcon,
  ChartLineIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FileCode2Icon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  AccountAvatar,
  AccountBlobbie,
  AccountProvider,
  useActiveWallet,
  WalletIcon,
  WalletName,
  WalletProvider,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import type { Project } from "@/api/project/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { TabButtons } from "@/components/ui/tabs";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import type { TruncatedSessionInfo } from "../api/types";
import { useSessionsWithLocalOverrides } from "../hooks/useSessionsWithLocalOverrides";
import { AssetsSection } from "./AssetsSection/AssetsSection";
import { ChatSidebarLink } from "./ChatSidebarLink";
import { NebulaConnectWallet } from "./NebulaConnectButton";
import { TransactionsSection } from "./TransactionsSection/TransactionsSection";

export function ChatSidebar(props: {
  sessions: TruncatedSessionInfo[];
  team_slug: string;
  project: Project;
  client: ThirdwebClient;
  type: "desktop" | "mobile";
}) {
  const sessions = useSessionsWithLocalOverrides(props.sessions);
  const sessionsToShow = sessions.slice(0, 10);
  const newChatPage = `/team/${props.team_slug}/${props.project.slug}/ai`;
  const router = useDashboardRouter();
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-start gap-3 p-4 lg:justify-between">
        <div className="flex items-center gap-2">
          <BotIcon aria-label="AI" className="size-6 text-foreground" />
          <span className="font-medium text-lg">thirdweb AI</span>
        </div>

        <Badge className="gap-1 py-1" variant="secondary">
          Beta
        </Badge>
      </div>

      <div className="h-1" />

      <div className="flex flex-col gap-2 px-4">
        <Button
          className="w-full gap-2 rounded-lg"
          onClick={() => {
            if (pathname === newChatPage) {
              // TODO - make it not reload the whole page, but just the React session state of the chat component
              window.location.reload();
            } else {
              router.push(newChatPage);
            }
          }}
        >
          <PlusIcon className="size-4" />
          New Chat
        </Button>
      </div>

      <div className="h-5" />

      <div className="flex flex-col gap-3 border-t border-dashed px-4 py-4">
        <Link
          className="flex items-center gap-1 rounded-full text-foreground text-sm hover:underline justify-between"
          href={`/team/${props.team_slug}/${props.project.slug}/ai/analytics`}
        >
          <div className="flex items-center gap-2">
            <ChartLineIcon className="size-3.5 text-muted-foreground" />
            Analytics
          </div>
          <ChevronRightIcon className="size-3.5 text-muted-foreground" />
        </Link>
        <Link
          className="flex items-center gap-1 rounded-full text-foreground text-sm hover:underline justify-between"
          href={"https://portal.thirdweb.com/ai/chat"}
          target="_blank"
        >
          <div className="flex items-center gap-2">
            <FileCode2Icon className="size-3.5 text-muted-foreground" />
            Documentation
          </div>
          <ChevronRightIcon className="size-3.5 text-muted-foreground" />
        </Link>
      </div>

      {sessionsToShow.length > 0 && (
        <div className="flex-1 overflow-auto border-t border-dashed p-2 pt-2">
          <div className="flex items-center justify-between px-2 py-3">
            <h3 className="text-muted-foreground text-xs">Recent Chats</h3>
            {sessionsToShow.length < sessions.length && (
              <Link
                className="flex items-center gap-1 rounded-full text-foreground text-xs hover:underline"
                href={`/team/${props.team_slug}/${props.project.slug}/ai/chat/history`}
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
                  project={props.project}
                  team_slug={props.team_slug}
                  key={session.id}
                  sessionId={session.id}
                  title={session.title || "Untitled Chat"}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-auto">
        <WalletDetails client={props.client} />
      </div>
    </div>
  );
}

function WalletDetails(props: { client: ThirdwebClient }) {
  const [tab, setTab] = useState<"assets" | "transactions">("assets");
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <DynamicHeight transition="height 220ms ease">
      <div className="flex items-center justify-between gap-2 border-t px-2 py-1.5">
        <CustomConnectButton client={props.client} />
        <Button
          className={cn(
            "h-auto w-auto p-1.5 transition-transform duration-300",
            isExpanded ? "rotate-180" : "",
          )}
          onClick={() => setIsExpanded(!isExpanded)}
          size="sm"
          variant="ghost"
        >
          <ChevronDownIcon className="size-4" />
        </Button>
      </div>

      {isExpanded && (
        <div className="border-t border-dashed">
          <TabButtons
            tabClassName="!text-sm py-1.5"
            tabContainerClassName="px-2 pt-2"
            tabs={[
              {
                isActive: tab === "assets",
                name: "Assets",
                onClick: () => setTab("assets"),
              },
              {
                isActive: tab === "transactions",
                name: "Recent Activity",
                onClick: () => setTab("transactions"),
              },
            ]}
          />

          {isExpanded && (
            <div className="h-[230px] overflow-y-auto py-4 pr-1 pl-2">
              {tab === "assets" && <AssetsSection client={props.client} />}

              {tab === "transactions" && (
                <TransactionsSection client={props.client} />
              )}
            </div>
          )}
        </div>
      )}
    </DynamicHeight>
  );
}

function CustomConnectButton(props: { client: ThirdwebClient }) {
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
        client={props.client}
        customDetailsButton={
          activeWallet
            ? (address) => {
                return (
                  <WalletProvider id={activeWallet.id}>
                    <AccountProvider address={address} client={props.client}>
                      <Button
                        className="flex h-auto w-full items-center justify-start gap-2.5 rounded-lg px-2 hover:bg-accent"
                        variant="ghost"
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
        detailsButtonClassName="!bg-background hover:!border-active-border"
      />
    </div>
  );
}
