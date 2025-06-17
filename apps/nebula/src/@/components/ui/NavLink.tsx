"use client";

import { cn } from "@/lib/utils";
// import { useTrack } from "hooks/analytics/useTrack";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavButtonProps = {
  className?: string;
  activeClassName?: string;
  href: string;
  exactMatch?: boolean;
  tracking?: {
    category: string;
    action: string;
    label: string;
  };
  onClick?: () => void;
};

export function NavLink(props: React.PropsWithChildren<NavButtonProps>) {
  // const track = useTrack();
  const pathname = usePathname();
  const isActive = pathname
    ? props.exactMatch
      ? pathname === props.href
      : pathname.startsWith(props.href)
    : false;
  return (
    <Link
      href={props.href}
      className={cn(props.className, isActive && props.activeClassName)}
      target={props.href.startsWith("http") ? "_blank" : undefined}
      prefetch={false}
      onClick={() => {
        props.onClick?.();
        // if (props.tracking) {
        //   track({
        //     category: props.tracking.category,
        //     action: props.tracking.action,
        //     label: props.tracking.label,
        //     url: props.href,
        //   });
        // }
      }}
    >
      {props.children}
    </Link>
  );
}
