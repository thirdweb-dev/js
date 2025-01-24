"use client";

import { GradientAvatar } from "@/components/blocks/Avatars/GradientAvatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { LogOutIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";

export function AccountButton(props: {
  logout: () => void;
  connectButton: React.ReactNode;
  account?: Pick<Account, "email" | "id">;
  client: ThirdwebClient;
}) {
  const { setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          asChild
          className="size-10 cursor-pointer rounded-full hover:ring-2 hover:ring-offset-2"
          variant="ghost"
        >
          {/* Don't remove the div */}
          <div>
            {/* TODO - set account image */}
            <GradientAvatar
              id={props.account?.id || "default"}
              src={""}
              className="size-9"
              client={props.client}
            />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[300px] rounded-lg p-0"
        align="end"
        onClick={(e) => {
          if (e.target instanceof HTMLAnchorElement) {
            setIsOpen(false);
          }
        }}
      >
        <div className="border-border border-b p-4 pb-5">
          {props.account?.email && (
            <p className="text-muted-foreground text-sm">
              {props.account.email}
            </p>
          )}

          <div className="h-3" />
          <div className="[&>*]:!w-full">{props.connectButton}</div>
        </div>

        <div className="flex flex-col gap-1 p-2">
          <Button
            asChild
            variant="ghost"
            className="justify-start px-3 text-muted-foreground text-sm hover:text-foreground"
          >
            <Link href="/team/~/~/settings/billing">Manage Billing</Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="justify-start px-3 text-muted-foreground text-sm hover:text-foreground"
          >
            <Link href="/account">My Account</Link>
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
            asChild
            variant="ghost"
            className="justify-start px-3 text-muted-foreground text-sm hover:text-foreground"
          >
            <Link href="/home">Home Page</Link>
          </Button>

          {props.account && (
            <Button
              variant="ghost"
              onClick={() => {
                props.logout();
                setIsOpen(false);
              }}
              className="justify-between gap-2 px-3 text-muted-foreground hover:text-foreground"
            >
              Log Out
              <LogOutIcon className="size-4" />
            </Button>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
