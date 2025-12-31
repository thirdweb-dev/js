"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SendIcon,
  Share2Icon,
  WalletIcon,
  ZapIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { reportRewindViewed } from "@/analytics/report";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ThirdwebMiniLogo } from "../../components/ThirdwebMiniLogo";

type YearInReviewStats = {
  totalRpcRequests: number;
  totalWalletConnections: number;
  totalMainnetSponsoredTransactions: number;
  year: number;
};

async function fetchYearInReview(): Promise<YearInReviewStats> {
  const res = await fetch(`/api/rewind`);
  if (!res.ok) {
    throw new Error("Failed to fetch year in review");
  }
  return res.json();
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

const metrics = [
  {
    key: "totalRpcRequests" as const,
    label: "RPC Requests",
    icon: ZapIcon,
    color: "bg-blue-500",
    message: (value: number) => `You sent ${formatNumber(value)} RPC requests`,
    description: "Powering your dApps with lightning-fast infrastructure",
  },
  {
    key: "totalWalletConnections" as const,
    label: "Wallet Connections",
    icon: WalletIcon,
    color: "bg-purple-500",
    message: (value: number) => `You onboarded ${formatNumber(value)} users`,
    description: "Helping users connect their wallets seamlessly",
  },
  {
    key: "totalMainnetSponsoredTransactions" as const,
    label: "Sponsored Transactions",
    icon: SendIcon,
    color: "bg-green-500",
    message: (value: number) =>
      `You sent ${formatNumber(value)} gasless transactions`,
    description: "Removing barriers with sponsored transaction fees",
  },
];

const TOTAL_SLIDES = 5; // 1 intro slide + 3 metric slides + 1 share slide

export function RewindModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const displayYear = 2025;
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ["year-in-review", displayYear],
    queryFn: () => fetchYearInReview(),
    staleTime: 60 * 60 * 1000,
    enabled: open,
  });

  const [_introPhase, setIntroPhase] = useState<"logo" | "wrapped">("logo");
  const [startAnimation, setStartAnimation] = useState(false);

  // Reset to first slide when modal opens
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (open) {
      setCurrentSlide(0);
      setIntroPhase("logo");
      setStartAnimation(false);
      // Start animation after a brief moment (300ms)
      const startTimer = setTimeout(() => {
        setStartAnimation(true);
      }, 300);
      return () => clearTimeout(startTimer);
    }
  }, [open]);

  // Animate logo to wrapped position
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (open && currentSlide === 0 && startAnimation) {
      // Phase 1: Show logo spinning and shrinking (5s), then mark as wrapped
      const timer = setTimeout(() => {
        setIntroPhase("wrapped");
      }, 5000); // Match the animation duration

      return () => clearTimeout(timer);
    } else if (open && currentSlide === 0) {
      // Reset to logo phase when modal opens
      setIntroPhase("logo");
    }
  }, [open, currentSlide, startAnimation]);

  // Report analytics when data loads
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (data && open) {
      reportRewindViewed({
        year: displayYear,
        totalRpcRequests: data.totalRpcRequests,
        totalWalletConnections: data.totalWalletConnections,
        totalMainnetSponsoredTransactions:
          data.totalMainnetSponsoredTransactions,
      });
    }
  }, [data, open]);

  const handleNext = () => {
    if (currentSlide < TOTAL_SLIDES - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleShare = () => {
    if (!data) return;
    const text = `I sent ${formatNumber(data.totalRpcRequests)} RPC requests, connected ${formatNumber(data.totalWalletConnections)} wallets, and sponsored ${formatNumber(data.totalMainnetSponsoredTransactions)} mainnet transactions on thirdweb this year! 🚀`;

    if (navigator.share) {
      navigator
        .share({
          title: `My ${displayYear} thirdweb Rewind`,
          text,
          url: window.location.href,
        })
        .catch(() => {
          navigator.clipboard.writeText(text);
        });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden bg-card border-border">
          <DialogTitle className="sr-only">
            {displayYear} Year in Review - Loading
          </DialogTitle>
          <div className="flex items-center justify-center min-h-[400px] bg-background">
            <div className="text-center">
              <div className="mb-4 inline-block animate-spin rounded-full border-4 border-foreground border-t-transparent h-8 w-8" />
              <p className="text-muted-foreground">
                Loading your year in review...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl p-0 gap-0 overflow-hidden bg-card border-border"
        dialogCloseClassName="hidden"
      >
        <DialogTitle className="sr-only">
          {displayYear} Year in Review
        </DialogTitle>

        {/* Header - only show on non-intro slides */}
        {currentSlide !== 0 && (
          <div className="px-8 pt-8 pb-6 border-b border-border bg-background">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {displayYear} wrapped
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Powered by thirdweb
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative min-h-[400px] bg-background">
          {/* Intro Slide with Logo Animation */}
          <div
            className={cn(
              "absolute inset-0 transition-all duration-500 ease-in-out",
              currentSlide === 0
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full pointer-events-none",
            )}
          >
            <div className="relative flex h-full flex-col items-center justify-center px-8 py-16 gap-8">
              {/* Close button for intro slide */}
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="absolute right-8 top-8 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {/* Top: Full thirdweb Logo */}
              <div
                className={cn(
                  "flex items-center gap-2 transition-all duration-700",
                  startAnimation
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-8 opacity-0",
                )}
              >
                <ThirdwebMiniLogo className="h-6 w-auto" />
                <span className="text-xl font-bold text-foreground">
                  thirdweb
                </span>
              </div>

              {/* Center: Year and Wrapped */}
              <div className="flex flex-col items-center gap-4">
                {/* Year - show immediately */}
                <div className="text-6xl font-bold text-foreground md:text-7xl">
                  {displayYear}
                </div>

                {/* Wrapped with animated logo as "W" */}
                <div className="flex items-center gap-1 text-4xl font-bold text-foreground md:text-5xl">
                  {/* Logo: Starts at normal size, spins */}
                  <div
                    className={cn(
                      "transition-all duration-[5000ms] ease-in-out inline-flex items-center justify-center",
                      startAnimation
                        ? "scale-100 rotate-[360deg]"
                        : "scale-100 rotate-0",
                    )}
                  >
                    <ThirdwebMiniLogo className="h-[1em] w-auto" />
                  </div>
                  {/* "rapped" text appears immediately, fades in */}
                  <span
                    className={cn(
                      "transition-all duration-2000 ease-out",
                      startAnimation
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4",
                    )}
                  >
                    rapped
                  </span>
                </div>
              </div>

              {/* Bottom: View highlights button */}
              <Button
                onClick={handleNext}
                variant="outline"
                size="lg"
                className={cn(
                  "transition-all duration-500",
                  startAnimation
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0 pointer-events-none",
                )}
                type="button"
              >
                View highlights
              </Button>
            </div>
          </div>

          {/* Individual Metric Slides */}
          {metrics.map((metric, index) => {
            const metricSlideIndex = index + 1; // Metrics start at slide 1
            const Icon = metric.icon;
            const value = data[metric.key];
            return (
              <div
                key={metric.key}
                className={cn(
                  "absolute inset-0 transition-all duration-500 ease-in-out",
                  currentSlide === metricSlideIndex
                    ? "opacity-100 translate-x-0"
                    : currentSlide < metricSlideIndex
                      ? "opacity-0 translate-x-full pointer-events-none"
                      : "opacity-0 -translate-x-full pointer-events-none",
                )}
              >
                <div className="p-8 flex flex-col items-center justify-center h-full text-center">
                  <div
                    className={cn(
                      "rounded-full p-6 mb-6 text-white",
                      metric.color,
                    )}
                  >
                    <Icon className="w-16 h-16" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-4">
                    {metric.message(value)}
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    {metric.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Share Slide */}
          <div
            className={cn(
              "absolute inset-0 transition-all duration-500 ease-in-out",
              currentSlide === TOTAL_SLIDES - 1
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-full pointer-events-none",
            )}
          >
            <div className="p-8 flex flex-col items-center justify-center h-full text-center">
              <div className="bg-muted rounded-full p-6 mb-6">
                <Share2Icon className="w-12 h-12 text-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                Share Your Year
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md">
                Show off your {displayYear} achievements with your team and the
                community!
              </p>
              <Button onClick={handleShare} size="lg" className="gap-2">
                <Share2Icon className="w-4 h-4" />
                Share Your Stats
              </Button>
            </div>
          </div>
        </div>

        {/* Footer with Navigation */}
        {currentSlide > 0 && (
          <div className="px-8 py-6 border-t border-border bg-background">
            <div className="flex items-center justify-between">
              {/* Navigation Arrows */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  disabled={currentSlide === 1}
                  className="h-9 w-9"
                  type="button"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={currentSlide === TOTAL_SLIDES - 1}
                  className="h-9 w-9"
                  type="button"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </Button>
              </div>

              {/* Slide Indicators */}
              <div className="flex gap-2">
                {Array.from({ length: TOTAL_SLIDES }, (_, i) => i).map(
                  (slideIndex) => (
                    <button
                      key={`slide-indicator-${slideIndex}`}
                      type="button"
                      onClick={() => setCurrentSlide(slideIndex)}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        currentSlide === slideIndex
                          ? "w-8 bg-foreground"
                          : "w-2 bg-border hover:bg-muted-foreground",
                      )}
                      aria-label={`Go to slide ${slideIndex + 1}`}
                    />
                  ),
                )}
              </div>

              {/* Slide Counter */}
              <div className="text-sm font-medium text-muted-foreground w-[76px] text-right">
                {currentSlide + 1} / {TOTAL_SLIDES}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
