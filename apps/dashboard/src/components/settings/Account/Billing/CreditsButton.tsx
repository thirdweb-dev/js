"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAccount, useAccountCredits } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useTrack } from "hooks/analytics/useTrack";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CreditsItem } from "./CreditsItem";

export const formatToDollars = (cents: number) => {
  const dollars = cents / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(dollars);
};

export const CreditsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const trackEvent = useTrack();
  const searchParams = useSearchParams();
  const fromOpCreditsQuery = searchParams?.get("fromOpCredits");
  const shouldShowTooltip = fromOpCreditsQuery !== null;

  const [shouldClose, setShouldClose] = useState(false);

  const { isLoggedIn } = useLoggedInUser();
  const { data: credits } = useAccountCredits();
  const meQuery = useAccount();
  const totalCreditBalance = credits?.reduce(
    (acc, credit) => acc + credit.remainingValueUsdCents,
    0,
  );

  if (!isLoggedIn || meQuery.isPending || !meQuery.data) {
    return null;
  }

  const opCredit = credits?.find((crd) => crd.name.startsWith("OP -"));
  const restCredits = credits?.filter((crd) => !crd.name.startsWith("OP -"));

  return (
    <div className="relative">
      <Button
        onClick={() => {
          setIsOpen(true);
          trackEvent({
            category: "credits",
            action: "button",
            label: "view-credits",
          });
        }}
        variant="outline"
        className="h-full rounded-2xl bg-background py-1 text-muted-foreground text-xs hover:text-foreground"
        size="sm"
      >
        Credits: {formatToDollars(totalCreditBalance || 0)}
      </Button>

      <div
        className={cn(
          "absolute z-10 mt-2 w-[300px] rounded-lg border border-border bg-background p-4",
          shouldShowTooltip && !shouldClose ? "block" : "hidden",
        )}
      >
        <p className="mb-4 text-muted-foreground text-sm">
          You can view how many credits you have here at any time.
        </p>

        <Button
          onClick={() => setShouldClose(true)}
          variant="outline"
          size="sm"
        >
          Got it
        </Button>
      </div>

      {/* Credits Modal  */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent dialogOverlayClassName="z-[10000]" className="z-[10001]">
          <DialogHeader>
            <DialogTitle className="font-semibold text-2xl tracking-tight">
              Credits
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <CreditsItem
              credit={opCredit}
              isOpCreditDefault={true}
              onClickApply={() => {
                setIsOpen(false);
              }}
            />

            {restCredits?.map((credit) => (
              <CreditsItem key={credit.couponId} credit={credit} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
