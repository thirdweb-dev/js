"use client";

import { BadgeCheckIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useState } from "react";
import { reportFeedback } from "@/analytics/report";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";

export function Feedback() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

  if (!isSubmitted) {
    return (
      <div className="md:h-16 flex items-center gap-4">
        <p className="text-sm text-foreground">Was this page helpful?</p>
        <div className="flex gap-2">
          <Button
            className="gap-2 bg-card rounded-lg"
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
              <Button className="gap-2 bg-card rounded-lg" variant="outline">
                No
                <ThumbsDownIcon className="size-4 text-muted-foreground" />
              </Button>
            </DialogTrigger>

            <DialogContent className="p-5">
              <DialogHeader className="mb-5">
                <DialogTitle>Apologies for any confusion.</DialogTitle>
                <DialogDescription>
                  Please provide details about the issue you encountered to help
                  us improve our documentation.
                </DialogDescription>
              </DialogHeader>

              <Textarea
                className="mb-2 h-32 w-full bg-card"
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
        <BadgeCheckIcon className="size-4" />
        <p className="font-semibold text-foreground text-sm">
          Thank you for your feedback!
        </p>
      </div>
    </div>
  );
}
