"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 animate-in overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-popover-foreground text-sm shadow-md data-[state=closed]:animate-out",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

export function ToolTipLabel(props: {
  children: React.ReactNode;
  label: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  hoverable?: boolean;
  contentClassName?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "center" | "start" | "end";
}) {
  if (!props.label) {
    return props.children;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100} disableHoverableContent={!props.hoverable}>
        <TooltipTrigger asChild className="!pointer-events-auto">
          {props.children}
        </TooltipTrigger>
        <TooltipContent
          side={props.side}
          align={props.align}
          sideOffset={10}
          className={cn(
            "max-w-[400px] whitespace-normal leading-relaxed",
            props.contentClassName,
          )}
        >
          <div className="flex items-center gap-1.5 p-2 text-sm">
            {props.leftIcon}
            {props.label}
            {props.rightIcon}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
