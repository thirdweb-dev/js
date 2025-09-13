"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { reportProductFeedback } from "@/analytics/report";
import { NotificationsButton } from "@/components/notifications/notification-button";
import { NavLink } from "@/components/ui/NavLink";
import type { Account } from "@/hooks/useApi";
import { AccountButton } from "./account-button.client";
import { ResourcesDropdownButton } from "./ResourcesDropdownButton";

export function SecondaryNav(props: {
  account: Pick<Account, "email" | "id">;
  logout: () => void;
  connectButton: React.ReactNode;
  client: ThirdwebClient;
  accountAddress: string;
}) {
  return (
    <div className="flex items-center gap-6">
      <SecondaryNavLinks />
      <div className="flex items-center gap-3">
        <NotificationsButton accountId={props.account.id} />
        <AccountButton
          account={props.account}
          accountAddress={props.accountAddress}
          client={props.client}
          connectButton={props.connectButton}
          logout={props.logout}
        />
      </div>
    </div>
  );
}

export function SecondaryNavLinks() {
  const [showFeedbackDropdown, setShowFeedbackDropdown] = useState(false);
  const [modalFeedback, setModalFeedback] = useState("");

  const handleModalSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    // Report feedback to PostHog
    reportProductFeedback({
      feedback: modalFeedback,
      source: "desktop",
    });

    // Show success notification
    toast.success("Feedback submitted successfully!", {
      description: "Thank you for your feedback. We'll review it shortly.",
    });

    setModalFeedback("");
    setShowFeedbackDropdown(false);
  };

  const handleModalCancel = () => {
    setModalFeedback("");
    setShowFeedbackDropdown(false);
  };

  return (
    <div className="flex items-center gap-6">
      <ResourcesDropdownButton />

      <Link
        className="text-muted-foreground text-sm hover:text-foreground"
        href="https://portal.thirdweb.com"
        rel="noopener noreferrer"
        target="_blank"
      >
        Docs
      </Link>

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowFeedbackDropdown(!showFeedbackDropdown)}
          className="text-muted-foreground text-sm hover:text-foreground border border-border px-3 py-1.5 rounded-full hover:bg-muted transition-colors"
        >
          Feedback
        </button>

        {showFeedbackDropdown && (
          <div
            id="feedback-dropdown"
            role="dialog"
            aria-labelledby="feedback-heading"
            className="absolute top-full right-0 mt-2 bg-background border border-border rounded-2xl p-3 w-96 z-50"
          >
            <h2
              id="feedback-heading"
              className="text-foreground text-base font-sans mb-2"
            >
              Share your feedback with us:
            </h2>
            <form onSubmit={handleModalSubmit} className="contents">
              <label htmlFor="feedback-text" className="sr-only">
                Feedback
              </label>
              <textarea
                id="feedback-text"
                value={modalFeedback}
                onChange={(e) => setModalFeedback(e.target.value)}
                maxLength={1000}
                aria-describedby="feedback-help"
                className="w-full bg-background text-foreground rounded-lg p-4 min-h-[120px] resize-none border border-border focus:border-border focus:outline-none placeholder-muted-foreground font-sans mb-4 text-sm"
                placeholder="Tell us what you think..."
              />

              <div className="flex items-start justify-between gap-4">
                <div className="text-muted-foreground text-xs font-sans">
                  <div>Have a technical issue?</div>
                  <div>
                    <NavLink
                      href="/team/~/support"
                      className="underline hover:text-foreground transition-colors"
                    >
                      Contact support
                    </NavLink>
                    .
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleModalCancel}
                    className="bg-transparent text-foreground px-4 py-1.5 rounded-full font-sans text-sm border border-border hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!modalFeedback.trim()}
                    aria-disabled={!modalFeedback.trim()}
                    className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full font-sans text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
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
  );
}
