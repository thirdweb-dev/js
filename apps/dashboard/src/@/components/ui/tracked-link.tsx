"use client";

import Link from "next/link";
import type React from "react";
import { cn } from "../../lib/utils";

export type TrackedLinkProps = React.ComponentProps<typeof Link> & {
  category: string;
  label?: string;
  trackingProps?: Record<string, string>;
};

export function TrackedLinkTW(props: TrackedLinkProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const trackEvent = (..._args: unknown[]) => {};
  const { category, label, trackingProps, ...restProps } = props;

  return (
    <Link
      onClick={(e) => {
        trackEvent({ category, action: "click", label, ...trackingProps });
        props.onClick?.(e);
      }}
      {...restProps}
    />
  );
}

export function TrackedUnderlineLink(props: TrackedLinkProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const trackEvent = (..._args: unknown[]) => {};
  const { category, label, trackingProps, ...restProps } = props;

  return (
    <Link
      {...restProps}
      onClick={(e) => {
        trackEvent({ category, action: "click", label, ...trackingProps });
        props.onClick?.(e);
      }}
      className={cn(
        "underline decoration-muted-foreground/50 decoration-dotted underline-offset-[5px] hover:text-foreground hover:decoration-foreground hover:decoration-solid",
        restProps.className,
      )}
    />
  );
}
