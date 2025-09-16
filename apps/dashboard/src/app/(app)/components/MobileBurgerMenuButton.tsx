"use client";

import {
  ChevronDownIcon,
  ChevronUpIcon,
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
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { reportProductFeedback } from "@/analytics/report";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/NavLink";
import { Separator } from "@/components/ui/separator";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { useEns } from "@/hooks/contract-hooks";
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
  const [showFeedbackSection, setShowFeedbackSection] = useState(false);
  const [modalFeedback, setModalFeedback] = useState("");
  const { setTheme, theme } = useTheme();
  const ensQuery = useEns({
    addressOrEnsName:
      props.type === "loggedIn" ? props.accountAddress : undefined,
    client: props.client,
  });
  // const [isCMDSearchModalOpen, setIsCMDSearchModalOpen] = useState(false);

  const handleModalSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    // Report feedback to PostHog
    reportProductFeedback({
      feedback: modalFeedback,
      source: "mobile",
    });

    // Show success notification
    toast.success("Feedback submitted successfully!", {
      description: "Thank you for your feedback. We'll review it shortly.",
    });

    setModalFeedback("");
    setShowFeedbackSection(false);
  };

  const handleModalCancel = () => {
    setModalFeedback("");
    setShowFeedbackSection(false);
  };

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
        <div className="fade-in-0 fixed inset-0 z-50 flex animate-in flex-col bg-background p-6 duration-200 overflow-y-auto">
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

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="flex items-center justify-between text-muted-foreground hover:text-foreground"
                  onClick={() => setShowFeedbackSection(!showFeedbackSection)}
                >
                  <span>Feedback</span>
                  {showFeedbackSection ? (
                    <ChevronUpIcon className="size-4" />
                  ) : (
                    <ChevronDownIcon className="size-4" />
                  )}
                </button>

                {showFeedbackSection && (
                  <div className="pl-0 pr-4 space-y-4 mb-6">
                    <h3
                      id="mobile-feedback-heading"
                      className="text-sm font-medium text-foreground mb-2"
                    >
                      Share your feedback with us:
                    </h3>
                    <form onSubmit={handleModalSubmit} className="contents">
                      <label htmlFor="mobile-feedback-text" className="sr-only">
                        Feedback
                      </label>
                      <textarea
                        id="mobile-feedback-text"
                        value={modalFeedback}
                        onChange={(e) => setModalFeedback(e.target.value)}
                        maxLength={1000}
                        aria-describedby="mobile-feedback-help"
                        className="w-full bg-background text-foreground rounded-lg p-3 min-h-[100px] resize-none border border-border focus:border-border focus:outline-none placeholder-muted-foreground font-sans text-sm"
                        placeholder="Tell us what you think..."
                      />

                      <div className="flex flex-col gap-3">
                        <p
                          id="mobile-feedback-help"
                          className="text-muted-foreground text-xs"
                        >
                          Have a technical issue?{" "}
                          <NavLink
                            href="/team/~/support"
                            className="underline hover:text-foreground transition-colors"
                          >
                            Contact support
                          </NavLink>
                          .
                        </p>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={handleModalCancel}
                            className="flex-1 bg-transparent text-foreground px-3 py-2 rounded-full font-sans text-sm border border-border hover:bg-muted transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={!modalFeedback.trim()}
                            aria-disabled={!modalFeedback.trim()}
                            className="flex-1 bg-primary text-primary-foreground px-3 py-2 rounded-full font-sans text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
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
