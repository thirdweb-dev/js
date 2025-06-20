"use client";

import { cn } from "@/lib/utils";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavButtonProps = {
  className?: string;
  activeClassName?: string;
  href: string;
  exactMatch?: boolean;
  onClick?: () => void;
  isActive?: (pathname: string) => boolean;
};

export function NavLink(props: React.PropsWithChildren<NavButtonProps>) {
  const pathname = usePathname();
  const isActive = props.isActive
    ? props.isActive(pathname)
    : pathname
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
      onClick={props.onClick}
    >
      {props.children}
    </Link>
  );
}
