import { useTrack } from "hooks/analytics/useTrack";
import Link from "next/link";
import type React from "react";

export type TrackedLinkProps = React.ComponentProps<typeof Link> & {
  category: string;
  label?: string;
  trackingProps?: Record<string, string>;
};

export function TrackedLinkTW(props: TrackedLinkProps) {
  const trackEvent = useTrack();
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
