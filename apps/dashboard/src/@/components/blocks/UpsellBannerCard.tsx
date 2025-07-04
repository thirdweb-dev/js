"use client";

import Link from "next/link";
import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCENT = {
  blue: {
    bgFrom: "from-blue-50 dark:from-blue-900/20",
    blur: "bg-blue-600",
    border: "border-blue-600 dark:border-blue-700",
    btn: "bg-blue-600 text-white hover:bg-blue-700",
    desc: "text-blue-800 dark:text-blue-300",
    iconBg: "bg-blue-600 text-white",
    title: "text-blue-900 dark:text-blue-200",
  },
  green: {
    bgFrom: "from-green-50 dark:from-green-900/20",
    blur: "bg-green-600",
    border: "border-green-600 dark:border-green-700",
    btn: "bg-green-600 text-white hover:bg-green-700",
    desc: "text-green-800 dark:text-green-300",
    iconBg: "bg-green-600 text-white",
    title: "text-green-900 dark:text-green-200",
  },
  purple: {
    bgFrom: "from-purple-50 dark:from-purple-900/20",
    blur: "bg-purple-600",
    border: "border-purple-600 dark:border-purple-700",
    btn: "bg-purple-600 text-white hover:bg-purple-700",
    desc: "text-purple-800 dark:text-purple-300",
    iconBg: "bg-purple-600 text-white",
    title: "text-purple-900 dark:text-purple-200",
  },
} as const;

type UpsellBannerCardProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  cta?:
    | {
        text: React.ReactNode;
        icon?: React.ReactNode;
        target?: "_blank";
        link: string;
      }
    | {
        text: React.ReactNode;
        icon?: React.ReactNode;
        onClick: () => void;
      };
  accentColor?: keyof typeof ACCENT;
  icon?: React.ReactNode;
};

export function UpsellBannerCard(props: UpsellBannerCardProps) {
  const color = ACCENT[props.accentColor || "green"];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-gradient-to-r p-4 lg:p-6",
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
                "mt-0.5 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full lg:flex",
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
            <p className={cn("text-sm", color.desc)}>{props.description}</p>
          </div>
        </div>

        {props.cta && "target" in props.cta ? (
          <Button
            asChild
            className={cn(
              "mt-2 gap-2 hover:translate-y-0 hover:shadow-inner sm:mt-0",
              color.btn,
            )}
            size="sm"
          >
            <Link
              href={props.cta.link}
              rel={
                props.cta.target === "_blank"
                  ? "noopener noreferrer"
                  : undefined
              }
              target={props.cta.target}
            >
              {props.cta.text}
              {props.cta.icon && <span className="ml-2">{props.cta.icon}</span>}
            </Link>
          </Button>
        ) : props.cta && "onClick" in props.cta ? (
          <Button
            className={cn(
              "mt-2 gap-2 hover:translate-y-0 hover:shadow-inner sm:mt-0",
              color.btn,
            )}
            onClick={props.cta.onClick}
            size="sm"
          >
            {props.cta.text}
            {props.cta.icon && <span className="ml-2">{props.cta.icon}</span>}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
