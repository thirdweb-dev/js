"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavButtonProps = {
  className?: string;
  activeClassName?: string;
  href: string;
  exactMatch?: boolean;
  onClick?: () => void;
};

export function NavLink(props: React.PropsWithChildren<NavButtonProps>) {
  const pathname = usePathname();
  const isActive = pathname
    ? props.exactMatch
      ? pathname === props.href
      : pathname.startsWith(props.href)
    : false;
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
