"use client";

import { cn } from "@/lib/utils";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";

export type NavLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  Omit<LinkProps, "href"> & {
    href: string;
    activeClassName: string;
  };

export const NavLink: React.FC<React.PropsWithChildren<NavLinkProps>> = ({
  children,
  className,
  activeClassName,
  ...props
}) => {
  const pathname = usePathname();
  const isActive = !!pathname?.startsWith(props.href);
  return (
    <Link {...props} className={cn(className, isActive && activeClassName)}>
      {children}
    </Link>
  );
};
