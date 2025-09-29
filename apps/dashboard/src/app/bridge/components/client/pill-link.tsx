"use client";
import { ChevronRightIcon, DollarSignIcon, TrendingUpIcon } from "lucide-react";
import Link from "next/link";
import { reportBridgePageLinkClick } from "@/analytics/report";
import { cn } from "@/lib/utils";

export function PillLink(props: {
  children: React.ReactNode;
  href: string;
  linkType: "integrate-bridge" | "trending-tokens";
}) {
  const Icon =
    props.linkType === "integrate-bridge" ? DollarSignIcon : TrendingUpIcon;
  return (
    <Link
      href={props.href}
      target="_blank"
      onClick={() => reportBridgePageLinkClick({ linkType: props.linkType })}
      className={cn(
        "shadow-sm text-center justify-center inline-flex items-center gap-4 text-foreground group",
        "text-sm bg-card/50 backdrop-blur-lg border border-border/70",
        "rounded-full px-4 py-2.5 transition-colors duration-300 text-pretty leading-5",
        "hover:bg-pink-300/20 dark:hover:bg-pink-950/30 hover:text-foreground hover:border-pink-400 dark:hover:border-pink-800",
      )}
    >
      <div className="flex items-center gap-2.5">
        <Icon className="size-4 shrink-0 text-pink-600" />
        {props.children}
      </div>
      <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground/50 group-hover:translate-x-1 transition-all duration-300 group-hover:text-foreground" />
    </Link>
  );
}
