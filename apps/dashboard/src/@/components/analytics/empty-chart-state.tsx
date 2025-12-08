"use client";
import { ArrowUpRightIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function EmptyChartState({ content }: { content?: React.ReactNode }) {
  return (
    <div className="relative z-0 h-full w-full">
      <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center text-base text-muted-foreground">
        {content || (
          <div className="flex items-center gap-3 flex-col">
            <div className="rounded-full border p-2 bg-background">
              <XIcon className="size-4" />
            </div>
            <p className="text-sm"> No data available </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function LoadingChartState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none flex h-full w-full items-center justify-center bg-card rounded-lg",
        className,
      )}
    >
      <LoadingDots />
    </div>
  );
}

export function EmptyChartStateGetStartedCTA(props: {
  link?: {
    label: string;
    href: string;
  };
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center flex-col">
      <div className="rounded-full border p-2 mb-4">
        <XIcon className="size-4 text-foreground" />
      </div>
      <div className="mb-5 space-y-1">
        <h3 className="text-base text-foreground text-center font-medium">
          {props.title}
        </h3>
        {props.description && (
          <p className="text-center text-sm text-muted-foreground">
            {props.description}
          </p>
        )}
      </div>

      {props.link && (
        <Button
          asChild
          className="rounded-full gap-2"
          variant="default"
          size="sm"
        >
          <Link href={props.link.href}>
            {props.link.label} <ArrowUpRightIcon className="size-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
