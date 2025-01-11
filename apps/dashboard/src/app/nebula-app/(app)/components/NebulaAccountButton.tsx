"use client";

import { GradientAvatar } from "@/components/blocks/Avatars/GradientAvatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { LogOutIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useActiveWallet, useDisconnect } from "thirdweb/react";
import { doLogout } from "../../../login/auth-actions";

export function NebulaAccountButton(props: {
  account: Account;
  className?: string;
  type: "compact" | "full";
}) {
  const { setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const client = useThirdwebClient();
  const router = useDashboardRouter();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  const logout = useCallback(async () => {
    try {
      await doLogout();
      if (wallet) {
        disconnect(wallet);
      }
      router.replace("/");
    } catch (e) {
      console.error("Failed to log out", e);
    }
  }, [router, disconnect, wallet]);

  const nebulaOrigin =
    typeof window !== "undefined" ? window.location.origin : "";
  const baseOrigin = nebulaOrigin.replace("nebula.", "");

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {props.type === "full" ? (
          <Button
            variant="ghost"
            className={cn(
              "flex h-auto w-full items-center justify-start gap-3 p-2",
              props.className,
            )}
          >
            <div className="shrink-0">
              <GradientAvatar
                id={props.account?.id || "default"}
                src={""}
                className="size-9 rounded-lg"
                client={client}
              />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <div className="text-foreground text-sm">
                {props.account.name}
              </div>
              {props.account.email && (
                <div className="truncate text-muted-foreground text-sm lowercase">
                  {props.account.email}
                </div>
              )}
            </div>
          </Button>
        ) : (
          <Button
            variant="ghost"
            className={cn(
              "flex h-auto w-full items-center justify-start gap-3 rounded-full p-1",
              props.className,
            )}
          >
            <div className="shrink-0">
              <GradientAvatar
                id={props.account?.id || "default"}
                src={""}
                className="size-9 rounded-full"
                client={client}
              />
            </div>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="ml-2 w-[300px] rounded-lg p-0"
        align="end"
        sideOffset={10}
        onClick={(e) => {
          if (e.target instanceof HTMLAnchorElement) {
            setIsOpen(false);
          }
        }}
      >
        <div className="border-border border-b p-4 pb-5">
          <div>
            <p className="text-foreground text-sm">{props.account.name}</p>
            {props.account.email && (
              <p className="text-muted-foreground text-sm">
                {props.account.email}
              </p>
            )}
          </div>

          <div className="h-3" />
          <div className="[&>*]:!w-full">
            <CustomConnectWallet
              signInLinkButtonClassName="!w-full"
              connectButtonClassName="!w-full"
              detailsButtonClassName="!w-full"
              isLoggedIn={true}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 p-2">
          <Button
            asChild
            variant="ghost"
            className="justify-start px-3 text-muted-foreground text-sm hover:text-foreground"
          >
            <Link href={`${baseOrigin}/account`} target="_blank">
              My Account
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="flex items-center justify-between gap-2 px-3 text-muted-foreground text-sm hover:text-foreground"
            onClick={() => {
              setTheme(theme === "light" ? "dark" : "light");
            }}
          >
            <p className="text-sm">Theme</p>

            <div className="ml-auto flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-foreground">
              <Sun
                className={cn(
                  "size-4",
                  theme === "light" ? "opacity-100" : "opacity-30",
                )}
              />
              <Moon
                className={cn(
                  "size-4",
                  theme === "dark" ? "opacity-100" : "opacity-30",
                )}
              />
            </div>
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="justify-between gap-2 px-3 text-muted-foreground hover:text-foreground"
          >
            Log Out
            <LogOutIcon className="size-4" />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
