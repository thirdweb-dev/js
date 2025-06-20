"use client";

import { BadgeCheckIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useState } from "react";
import { reportFeedback } from "@/analytics/report";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function Feedback() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

  if (!isSubmitted) {
    return (
      <div className="flex flex-col gap-3 md:h-16 md:flex-row md:items-center md:gap-5">
        <p>Was this page helpful?</p>

        <div className="flex gap-3">
          <Button
            className="gap-2 bg-card"
            onClick={() => {
              setIsSubmitted(true);
              reportFeedback({ helpful: true });
            }}
            variant="outline"
          >
            Yes
            <ThumbsUpIcon className="size-4 text-muted-foreground" />
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-card" variant="outline">
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
                onChange={(e) => {
                  setFeedback(e.target.value);
                }}
                placeholder="Your feedback..."
                value={feedback}
              />
              <div className="mt-3 flex flex-row-reverse">
                <Button
                  onClick={() => {
                    setIsSubmitted(true);
                    reportFeedback({ feedback, helpful: false });
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
