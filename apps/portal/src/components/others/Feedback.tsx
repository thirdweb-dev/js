"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BadgeCheckIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import posthog from "posthog-js";
import { useState } from "react";

export function Feedback() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const feedbackEvent = "Portal Feedback";
  const [feedback, setFeedback] = useState("");

  if (!isSubmitted) {
    return (
      <div className="flex flex-col gap-3 md:h-16 md:flex-row md:items-center md:gap-5">
        <p>Was this page helpful?</p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2 bg-card"
            onClick={() => {
              setIsSubmitted(true);
              posthog.capture(feedbackEvent, {
                response: "yes",
              });
            }}
          >
            Yes
            <ThumbsUpIcon className="size-4 text-muted-foreground" />
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-card"
                onClick={() => {
                  posthog.capture(feedbackEvent, {
                    response: "no",
                  });
                }}
              >
                No
                <ThumbsDownIcon className="size-4 text-muted-foreground" />
              </Button>
            </DialogTrigger>

            <DialogContent className="p-5">
              <h3 className="mb-3 font-semibold text-foreground text-lg">
                Apologies for any confusion.
              </h3>
              <p className="mb-5 font-medium text-muted-foreground">
                Please provide details about the issue you encountered to help
                us improve our documentation.
              </p>
              <textarea
                className="mb-2 h-32 w-full rounded-sm border bg-card p-2 font-medium text-foreground outline-none placeholder:font-semibold"
                value={feedback}
                placeholder="Your feedback..."
                onChange={(e) => {
                  setFeedback(e.target.value);
                }}
              />
              <div className="mt-3 flex flex-row-reverse">
                <Button
                  onClick={() => {
                    setIsSubmitted(true);
                    posthog.capture("Portal Feedback", {
                      feedback: feedback,
                    });
                  }}
                >
                  Submit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }
  return (
    <div className="fade-in-0 animate-in duration-500">
      <div className="flex items-center gap-2 text-foreground md:h-16">
        <BadgeCheckIcon />
        <p className="font-semibold text-foreground">
          Thank you for your feedback!
        </p>
      </div>
    </div>
  );
}
