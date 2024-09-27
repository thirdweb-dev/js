"use client";

import { GradientAvatar } from "@/components/blocks/Avatars/GradientAvatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { LogOutIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export function AccountButton(props: {
  logout: () => void;
  connectButton: React.ReactNode;
  account?: Pick<Account, "email" | "id">;
}) {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="!p-0 !h-auto size-10 rounded-full hover:ring-2 hover:ring-offset-2"
          variant="ghost"
        >
          {/* TODO - set account image */}
          <GradientAvatar id={props.account?.id} src={""} className="size-9" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] rounded-lg p-0" align="end">
        <div className="border-border border-b p-4 pb-5">
          <SkeletonContainer
            skeletonData="user@example.com"
            loadedData={props.account?.email}
            render={(v) => <p className="text-muted-foreground text-sm">{v}</p>}
          />

          <div className="h-3" />
          <div className="[&>*]:!w-full">{props.connectButton}</div>
        </div>

        <div className="flex flex-col gap-4 px-4 py-5">
          <Link
            href="/account"
            className="text-muted-foreground text-sm hover:text-foreground"
          >
            Account Settings
          </Link>

          <div className="flex items-center justify-between gap-2">
            <p className="text-muted-foreground text-sm">Theme</p>

            <div className="ml-auto flex items-center gap-1 rounded-lg border border-border px-2 py-0.5">
              <Button
                size="icon"
                onClick={() => setTheme("light")}
                variant="ghost"
                aria-label="Light theme"
                className={cn(
                  "!p-1 !h-auto !w-auto",
                  theme === "light" ? "opacity-100" : "opacity-30",
                )}
              >
                <Sun className="size-4" />
              </Button>
              <Button
                size="icon"
                onClick={() => setTheme("dark")}
                variant="ghost"
                aria-label="Dark theme"
                className={cn(
                  "!p-1 !h-auto !w-auto",
                  theme === "dark" ? "opacity-100" : "opacity-30",
                )}
              >
                <Moon className="size-4" />
              </Button>
            </div>
          </div>

          <Link
            href="/"
            className="text-muted-foreground text-sm hover:text-foreground"
          >
            Home Page
          </Link>

          <Button
            variant="link"
            className="!h-auto hover:!no-underline justify-start gap-2 px-0 py-1 text-start text-muted-foreground hover:text-foreground"
            onClick={props.logout}
          >
            <LogOutIcon className="size-4" />
            Log Out
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
