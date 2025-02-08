"use client";

import { cn } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useRef } from "react";
import { ClientOnly } from "../ClientOnly";
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
    <ul className="transform-gpu">
      {props.links.map((link, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <li key={i}>
          <Suspense fallback={null}>
            <SidebarItem link={link} onLinkClick={props.onLinkClick} />
          </Suspense>
        </li>
      ))}
    </ul>
  );
}

function SidebarItem(props: { link: SidebarLink; onLinkClick?: () => void }) {
  const href = useCurrentHref();

  if ("separator" in props.link) {
    return <hr className="my-2 border-t" />;
  }

  const isActive = props.link.href ? isSamePage(href, props.link.href) : false;

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
  const currentHref = useCurrentHref();
  const { href, name, links } = props.linkGroup;
  const isCategoryActive = href ? isSamePage(currentHref, href) : false;

  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center gap-2">
        {href ? (
          <Link
            className={cn(
              "block font-medium text-muted-foreground hover:text-foreground lg:text-base",
              isCategoryActive && "!text-foreground",
            )}
            href={href}
          >
            {name}
          </Link>
        ) : (
          <div className="font-medium text-lg">{name}</div>
        )}
      </div>
      <ul className="mb-8 flex flex-col">
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

function useCurrentHref() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return decodeURIComponent(
    `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
  );
}

function SidebarCategory(props: {
  linkGroup: LinkGroup;
  onLinkClick?: () => void;
}) {
  const currentPageHref = useCurrentHref();
  const { href, name, links, expanded } = props.linkGroup;
  const isCategoryActive = href ? isSamePage(currentPageHref, href) : false;

  const hasActiveHref = containsActiveHref(
    {
      name: name,
      links: links,
      href: href,
    },
    currentPageHref,
  );

  const defaultOpen = isCategoryActive || !!(hasActiveHref || expanded);

  const triggerRef = useRef<HTMLDivElement>(null);

  const triggerElContent = (
    <div
      className={cn(
        isCategoryActive && "!font-semibold !text-foreground",
        "group-hover:!text-foreground text-muted-foreground",
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
    <ClientOnly ssr={triggerEl}>
      <CustomAccordion
        defaultOpen={defaultOpen}
        containerClassName="border-none"
        triggerContainerClassName="lg:text-base group"
        trigger={triggerEl}
        chevronPosition="right"
      >
        <ul className="flex flex-col border-l pl-4">
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
    </ClientOnly>
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

function isSamePage(currentPageHref: string, testHref: string): boolean {
  return currentPageHref === testHref;
}
