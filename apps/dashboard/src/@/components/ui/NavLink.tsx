"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavButtonProps = {
  className?: string;
  activeClassName?: string;
  href: string;
};

export function NavLink(props: React.PropsWithChildren<NavButtonProps>) {
  const pathname = usePathname();
  const isActive = pathname ? pathname.startsWith(props.href) : false;
  return (
    <Link
      href={props.href}
      className={cn(props.className, isActive && props.activeClassName)}
      target={props.href.startsWith("http") ? "_blank" : undefined}
    >
      {props.children}
    </Link>
  );
}
