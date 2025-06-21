"use client";

import { useEns } from "components/contract-components/hooks";
import {
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  UserRoundIcon,
  WalletIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useLayoutEffect, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ThirdwebMiniLogo } from "./ThirdwebMiniLogo";

export function MobileBurgerMenuButton(
  props:
    | {
        type: "loggedIn";
        email: string | undefined;
        logout: () => void;
        accountAddress: string;
        connectButton: React.ReactNode;
        client: ThirdwebClient;
      }
    | {
        type: "loggedOut";
        client: ThirdwebClient;
      },
) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const ensQuery = useEns({
    addressOrEnsName:
      props.type === "loggedIn" ? props.accountAddress : undefined,
    client: props.client,
  });
  // const [isCMDSearchModalOpen, setIsCMDSearchModalOpen] = useState(false);

  useLayoutEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "initial";
    }

    return () => {
      document.body.style.overflow = "initial";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* <CmdKSearchModal
        open={isCMDSearchModalOpen}
        setOpen={setIsCMDSearchModalOpen}
      /> */}
      <Button
        className="flex size-10 items-center justify-center rounded-full bg-background p-0"
        onClick={() => setIsMenuOpen(true)}
        variant="outline"
      >
        <MenuIcon className="size-4 text-muted-foreground" />
      </Button>

      {isMenuOpen && (
        <div className="fade-in-0 fixed inset-0 z-50 flex animate-in flex-col bg-background p-6 duration-200">
          <Button
            className="!h-auto absolute top-4 right-4 p-1"
            onClick={() => setIsMenuOpen(false)}
            variant="ghost"
          >
            <XIcon className="size-7 text-muted-foreground" />
          </Button>

          <Link href="/team">
            <ThirdwebMiniLogo className="h-5" />
          </Link>

          <div className="h-6" />

          {props.type === "loggedIn" && (
            <>
              <SkeletonContainer
                className="inline-block self-start"
                loadedData={props.email}
                render={(email) => <p className="text-foreground">{email}</p>}
                skeletonData="someone@example.com"
              />

              <div className="h-3" />

              <div className="[&>button]:!w-full">{props.connectButton}</div>

              <div className="h-6" />

              <div className="flex flex-col gap-3">
                <Link
                  className="flex items-center gap-2 py-1 text-base text-muted-foreground hover:text-foreground"
                  href="/account"
                >
                  <UserRoundIcon className="size-4" />
                  My Account
                </Link>

                <Link
                  className="flex items-center gap-2 py-1 text-base text-muted-foreground hover:text-foreground"
                  href={`/${ensQuery.data?.ensName || props.accountAddress}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <WalletIcon className="size-4" />
                  My Wallet
                </Link>

                <Button
                  className="!h-auto hover:!no-underline justify-start gap-2 px-0 py-1 text-start text-base text-muted-foreground hover:text-foreground"
                  onClick={props.logout}
                  variant="link"
                >
                  <LogOutIcon className="size-4" />
                  Log Out
                </Button>
              </div>

              <div className="h-6" />
              <Separator />
              <div className="h-6" />
            </>
          )}

          <div className="flex flex-col gap-5">
            {/* This will be enabled later */}
            {/* <Button
              variant="link"
              className="!p-0 !h-auto hover:!no-underline justify-between gap-2 text-left text-base text-muted-foreground hover:text-foreground"
              onClick={() => {
                setIsCMDSearchModalOpen(true);
                setIsMenuOpen(false);
              }}
            >
              Search Contracts
            </Button> */}

            <Link
              className="text-muted-foreground hover:text-foreground "
              href="/chainlist"
            >
              Chainlist
            </Link>

            <Link
              className="text-muted-foreground hover:text-foreground "
              href="https://playground.thirdweb.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Playground
            </Link>

            <Link
              className="text-muted-foreground hover:text-foreground "
              href="/explore"
            >
              Explore Contracts
            </Link>

            <Link
              className="text-base text-muted-foreground hover:text-foreground"
              href="/home"
            >
              Home Page
            </Link>
          </div>

          <div className="mt-auto">
            <div className="flex flex-col gap-5">
              <Link
                className="text-muted-foreground hover:text-foreground "
                href="https://portal.thirdweb.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                Docs
              </Link>

              <Link
                className="text-muted-foreground hover:text-foreground "
                href="/support"
                rel="noopener noreferrer"
                target="_blank"
              >
                Support
              </Link>

              <Link
                className="text-muted-foreground hover:text-foreground"
                href="https://feedback.thirdweb.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                Feedback
              </Link>
            </div>

            <div className="h-6" />

            <Separator />
            <div className="h-6" />

            {/* Theme */}
            <Button
              className="flex w-full items-center justify-between gap-2 px-0"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              variant="ghost"
            >
              <span className="text-base text-muted-foreground">Theme</span>
              <div className="ml-auto flex items-center gap-2 rounded-lg border px-2 py-1">
                <SunIcon
                  className={cn(
                    "size-4",
                    theme === "light"
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                />
                <MoonIcon
                  className={cn(
                    "size-4",
                    theme === "dark"
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                />
              </div>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
