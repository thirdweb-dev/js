"use client";

import Link from "next/link";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { useFullPath } from "../../hooks/full-path";

export type NavButtonProps = {
  className?: string;
  activeClassName?: string;
  href: string;
  exactMatch?: boolean;
  onClick?: () => void;
};

export function NavLink(props: React.PropsWithChildren<NavButtonProps>) {
  return (
    <Suspense>
      <NavLinkInner {...props} />
    </Suspense>
  );
}

function NavLinkInner(props: React.PropsWithChildren<NavButtonProps>) {
  const pathname = useFullPath();

  const isActive = props.exactMatch
    ? pathname === props.href
    : pathname.startsWith(props.href);

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
