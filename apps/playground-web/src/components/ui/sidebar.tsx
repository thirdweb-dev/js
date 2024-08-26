"use client";

import { cn } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { CustomAccordion } from "./CustomAccordion";

export type LinkMeta = {
  name: string;
  href: string;
};

export type LinkGroup = {
  name: string;
  href?: string;
  links: SidebarLink[];
  expanded?: boolean;
  /**
   * If set to false, the group will not be rendered as an accordion
   * @defaultValue true
   */
  isCollapsible?: boolean;
};

export type SidebarLink = LinkMeta | LinkGroup | { separator: true };

type ReferenceSideBarProps = {
  links: SidebarLink[];
  onLinkClick?: () => void;
};

export function Sidebar(props: ReferenceSideBarProps) {
  return (
    <ul className="transform-gpu pb-10">
      {props.links.map((link, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <li key={i}>
          <SidebarItem link={link} onLinkClick={props.onLinkClick} />
        </li>
      ))}
    </ul>
  );
}

function SidebarItem(props: { link: SidebarLink; onLinkClick?: () => void }) {
  const pathname = usePathname();

  if ("separator" in props.link) {
    return <hr className="my-2 border-t" />;
  }

  const isActive = props.link.href
    ? isSamePage(pathname, props.link.href)
    : false;

  const { link } = props;
  if ("links" in link) {
    if (link.isCollapsible === false) {
      return (
        <DocSidebarNonCollapsible
          key={link.name}
          linkGroup={link}
          onLinkClick={props.onLinkClick}
        />
      );
    }
    return (
      <SidebarCategory
        key={link.name}
        linkGroup={link}
        onLinkClick={props.onLinkClick}
      />
    );
  }

  return (
    <Link
      href={link.href}
      onClick={props.onLinkClick}
      className={clsx(
        "block overflow-hidden text-ellipsis py-1 font-medium transition-colors duration-300 hover:text-foreground lg:text-base",
        isActive ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {link.name}
    </Link>
  );
}

function DocSidebarNonCollapsible(props: {
  linkGroup: LinkGroup;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const { href, name, links } = props.linkGroup;
  const isCategoryActive = href ? isSamePage(pathname, href) : false;

  return (
    <div className="my-4">
      <div className="mb-2 flex items-center gap-2">
        {href ? (
          <Link
            className={cn(
              "block lg:text-base text-muted-foreground hover:text-foreground font-medium",
              isCategoryActive && "!text-foreground",
            )}
            href={href}
          >
            {name}
          </Link>
        ) : (
          <div className="lg:text-base font-semibold">{name}</div>
        )}
      </div>

      <ul className="flex flex-col">
        {links.map((link, i) => {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <li key={i}>
              <SidebarItem link={link} onLinkClick={props.onLinkClick} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SidebarCategory(props: {
  linkGroup: LinkGroup;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const { href, name, links, expanded } = props.linkGroup;
  const isCategoryActive = href ? isSamePage(pathname, href) : false;

  const hasActiveHref = containsActiveHref(
    {
      name: name,
      links: links,
      href: href,
    },
    pathname,
  );
  const defaultOpen = isCategoryActive || !!(hasActiveHref || expanded);

  const triggerRef = useRef<HTMLDivElement>(null);

  const triggerElContent = (
    <div
      className={cn(
        isCategoryActive && "!font-semibold !text-foreground",
        "text-muted-foreground",
      )}
    >
      <div className="flex gap-2 py-1 font-medium" ref={triggerRef}>
        {name}
      </div>
    </div>
  );

  const triggerEl = href ? (
    <Link href={href} className={cn("block w-full text-left font-medium")}>
      {triggerElContent}
    </Link>
  ) : (
    triggerElContent
  );

  return (
    <CustomAccordion
      defaultOpen={defaultOpen}
      containerClassName="border-none"
      triggerContainerClassName="lg:text-base"
      trigger={triggerEl}
      chevronPosition="right"
    >
      <ul className="flex flex-col border-l-2 pl-4">
        {links.map((link, i) => {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <li key={i}>
              <SidebarItem link={link} onLinkClick={props.onLinkClick} />
            </li>
          );
        })}
      </ul>
    </CustomAccordion>
  );
}

function containsActiveHref(
  sidebarlink: SidebarLink,
  pathname: string,
): boolean {
  if ("links" in sidebarlink) {
    return sidebarlink.links.some((link) => containsActiveHref(link, pathname));
  }

  if ("separator" in sidebarlink) {
    return false;
  }

  if (isSamePage(pathname, sidebarlink.href)) {
    return true;
  }

  return false;
}

function isSamePage(pathname: string, pathOrHref: string): boolean {
  try {
    if (pathOrHref === pathname) {
      return true;
    }

    const u1 = new URL(pathname, window.location.href);
    const u2 = new URL(pathOrHref, window.location.href);
    if (u1.pathname === u2.pathname && u1.origin === u2.origin) {
      return true;
    }
  } catch {
    // ignore
  }

  return false;
}
