"use client";

import { LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { GradientAvatar } from "@/components/blocks/avatar/gradient-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEns } from "@/hooks/contract-hooks";
import type { Account } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

export function AccountButton(props: {
  logout: () => void;
  connectButton: React.ReactNode;
  account: Pick<Account, "email" | "id" | "image"> | undefined;
  client: ThirdwebClient;
  accountAddress: string;
}) {
  const { setTheme, theme } = useTheme();
  const ensQuery = useEns({
    addressOrEnsName: props.accountAddress,
    client: props.client,
  });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          asChild
          className="size-10 cursor-pointer rounded-full hover:ring-2 hover:ring-ring hover:ring-offset-1"
          size="icon"
          variant="ghost"
        >
          {/* Don't remove the div */}
          <div>
            <GradientAvatar
              className="size-9 border"
              client={props.client}
              id={props.account?.id || "default"}
              src={props.account?.image || ""}
            />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[300px] rounded-lg p-0"
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
            className="justify-start px-3 text-muted-foreground text-sm hover:text-foreground"
            variant="ghost"
          >
            <Link href="/team/~/~/billing">Manage Billing</Link>
          </Button>

          <Button
            asChild
            className="justify-start px-3 text-muted-foreground text-sm hover:text-foreground"
            variant="ghost"
          >
            <Link href="/account">My Account</Link>
          </Button>

          <Button
            asChild
            className="justify-start px-3 text-muted-foreground text-sm hover:text-foreground"
            variant="ghost"
          >
            <Link
              href={`/${ensQuery.data?.ensName || props.accountAddress}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              My Wallet
            </Link>
          </Button>

          <Button
            className="flex items-center justify-between gap-2 px-3 text-muted-foreground text-sm hover:text-foreground"
            onClick={() => {
              setTheme(theme === "light" ? "dark" : "light");
            }}
            variant="ghost"
          >
            <p className="text-sm">Theme</p>

            <div className="ml-auto flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-foreground">
              <SunIcon
                className={cn(
                  "size-4",
                  theme === "light" ? "opacity-100" : "opacity-30",
                )}
              />
              <MoonIcon
                className={cn(
                  "size-4",
                  theme === "dark" ? "opacity-100" : "opacity-30",
                )}
              />
            </div>
          </Button>

          <Button
            asChild
            className="justify-start px-3 text-muted-foreground text-sm hover:text-foreground"
            variant="ghost"
          >
            <Link href="/home">Home Page</Link>
          </Button>

          {props.account && (
            <Button
              className="justify-between gap-2 px-3 text-muted-foreground hover:text-foreground"
              onClick={() => {
                props.logout();
                setIsOpen(false);
              }}
              variant="ghost"
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
