"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export type NavLinkProps = {
  className?: string;
  activeClassName?: string;
  href: string;
  exactMatch?: boolean;
  onClick?: () => void;
};

export function NavLink(
  props: React.PropsWithChildren<NavLinkProps> & {
    fullPath: string;
  },
) {
  const isActive = props.exactMatch
    ? props.fullPath === props.href
    : props.fullPath.startsWith(props.href);

  return (
    <Link
      className={cn(props.className, isActive && props.activeClassName)}
      href={props.href}
      onClick={props.onClick}
      prefetch={false}
      target={props.href.startsWith("http") ? "_blank" : undefined}
    >
      {props.children}
    </Link>
  );
}
