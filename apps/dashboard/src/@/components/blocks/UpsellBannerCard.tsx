"use client";

import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { cn } from "@/lib/utils";
import type React from "react";

const ACCENT = {
  green: {
    border: "border-green-600 dark:border-green-700",
    bgFrom: "from-green-50 dark:from-green-900/20",
    blur: "bg-green-600",
    title: "text-green-900 dark:text-green-200",
    desc: "text-green-800 dark:text-green-300",
    iconBg: "bg-green-600 text-white",
    btn: "bg-green-600 text-white hover:bg-green-700",
  },
  blue: {
    border: "border-blue-600 dark:border-blue-700",
    bgFrom: "from-blue-50 dark:from-blue-900/20",
    blur: "bg-blue-600",
    title: "text-blue-900 dark:text-blue-200",
    desc: "text-blue-800 dark:text-blue-300",
    iconBg: "bg-blue-600 text-white",
    btn: "bg-blue-600 text-white hover:bg-blue-700",
  },
  purple: {
    border: "border-purple-600 dark:border-purple-700",
    bgFrom: "from-purple-50 dark:from-purple-900/20",
    blur: "bg-purple-600",
    title: "text-purple-900 dark:text-purple-200",
    desc: "text-purple-800 dark:text-purple-300",
    iconBg: "bg-purple-600 text-white",
    btn: "bg-purple-600 text-white hover:bg-purple-700",
  },
} as const;

type UpsellBannerCardProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  cta: {
    text: React.ReactNode;
    icon?: React.ReactNode;
    link: string;
  };
  trackingCategory: string;
  trackingLabel: string;
  accentColor?: keyof typeof ACCENT;
  icon?: React.ReactNode;
};

export function UpsellBannerCard(props: UpsellBannerCardProps) {
  const color = ACCENT[props.accentColor || "green"];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-gradient-to-r p-5",
        color.border,
        color.bgFrom,
      )}
    >
      {/* Decorative blur */}
      <div
        className={cn(
          "-right-10 -top-10 pointer-events-none absolute size-28 rounded-full opacity-20 blur-2xl",
          color.blur,
        )}
      />

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          {props.icon ? (
            <div
              className={cn(
                "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                color.iconBg,
              )}
            >
              {props.icon}
            </div>
          ) : null}

          <div>
            <h3
              className={cn(
                "font-semibold text-lg tracking-tight",
                color.title,
              )}
            >
              {props.title}
            </h3>
            <p className={cn("mt-0.5 text-sm", color.desc)}>
              {props.description}
            </p>
          </div>
        </div>

        <Button
          asChild
          size="sm"
          className={cn(
            "mt-2 gap-2 hover:translate-y-0 hover:shadow-inner sm:mt-0",
            color.btn,
          )}
        >
          <TrackedLinkTW
            href={props.cta.link}
            category={props.trackingCategory}
            label={props.trackingLabel}
          >
            {props.cta.text}
            {props.cta.icon && <span className="ml-2">{props.cta.icon}</span>}
          </TrackedLinkTW>
        </Button>
      </div>
    </div>
  );
}
