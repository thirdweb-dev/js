"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  LogOutIcon,
  MenuIcon,
  Moon,
  SettingsIcon,
  Sun,
  XIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { CmdKSearchModal } from "../../../../components/cmd-k-search";

export function MobileBurgerMenuButton(props: {
  email: string | undefined;
  logout: () => void;
  connectButton: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const [isCMDSearchModalOpen, setIsCMDSearchModalOpen] = useState(false);

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
      <CmdKSearchModal
        open={isCMDSearchModalOpen}
        setOpen={setIsCMDSearchModalOpen}
      />
      <Button
        variant="outline"
        className="!h-auto p-1"
        onClick={() => setIsMenuOpen(true)}
      >
        <MenuIcon className="size-6 text-muted-foreground" />
      </Button>

      {isMenuOpen && (
        <div
          className={
            "fixed p-6 inset-0 z-50 bg-background fade-in-0 animate-in duration-200 flex flex-col"
          }
        >
          <Button
            variant="ghost"
            className="!h-auto p-1 absolute top-4 right-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <XIcon className="size-7 text-muted-foreground" />
          </Button>

          <SkeletonContainer
            skeletonData="someone@example.com"
            loadedData={props.email}
            className="inline-block self-start"
            render={(email) => <p className="text-foreground">{email}</p>}
          />

          <div className="h-4" />

          <div className="[&>button]:!w-full">{props.connectButton}</div>

          <div className="h-6" />

          <div className="flex flex-col gap-4">
            <Link
              href="/account"
              className="text-muted-foreground text-base hover:text-foreground gap-2 flex items-center "
            >
              <SettingsIcon className="size-4" />
              Account Settings
            </Link>

            <Button
              variant="link"
              className="gap-2 py-1 text-base text-start justify-start text-muted-foreground px-0 !h-auto hover:!no-underline hover:text-foreground"
              onClick={props.logout}
            >
              <LogOutIcon className="size-4" />
              Log Out
            </Button>
          </div>

          <div className="h-6" />
          <Separator />
          <div className="h-6" />

          <div className="flex flex-col gap-5">
            <Button
              variant="link"
              className="text-muted-foreground text-base gap-2 !p-0 !h-auto hover:!no-underline hover:text-foreground text-left justify-between"
              onClick={() => {
                setIsCMDSearchModalOpen(true);
                setIsMenuOpen(false);
              }}
            >
              Search Contracts
            </Button>

            <Link
              href="/chainlist"
              className="text-muted-foreground hover:text-foreground "
            >
              Chainlist
            </Link>

            <Link
              href="https://playground.thirdweb.com/"
              target="_blank"
              className="text-muted-foreground hover:text-foreground "
            >
              Playground
            </Link>

            <Link
              href="/explore"
              className="text-muted-foreground hover:text-foreground "
            >
              Explore Contracts
            </Link>

            <Link
              href="/trending"
              className="text-muted-foreground hover:text-foreground "
            >
              Popular Contracts
            </Link>

            <Link
              href="/"
              className="text-muted-foreground text-base hover:text-foreground"
            >
              Home Page
            </Link>
          </div>

          <div className="mt-auto">
            <Separator />
            <div className="h-6" />

            {/* Theme */}
            <div className="flex justify-between gap-2 items-center">
              <p className="text-muted-foreground text-base">Theme</p>

              <div className="ml-auto flex items-center border px-2 py-0.5 rounded-lg gap-1">
                <Button
                  size="icon"
                  onClick={() => setTheme("light")}
                  variant="ghost"
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
                  className={cn(
                    "!p-1 !h-auto !w-auto",
                    theme === "dark" ? "opacity-100" : "opacity-30",
                  )}
                >
                  <Moon className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
