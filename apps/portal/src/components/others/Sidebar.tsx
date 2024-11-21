"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { CustomAccordion } from "./CustomAccordion";

export type LinkMeta = {
  name: string;
  href: string;
  icon?: StaticImport | React.ReactElement;
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
  icon?: StaticImport | React.ReactElement;
};

export function isStaticImport(value: unknown): value is StaticImport {
  const isObj = typeof value === "object" && value !== null;
  if (!isObj) {
    return false;
  }

  return "default" in value || "src" in value;
}

export type SidebarLink = LinkMeta | LinkGroup | { separator: true };

type ReferenceSideBarProps = {
  links: SidebarLink[];
  onLinkClick?: () => void;
  name: string;
  header?: React.ReactNode;
};

export function DocSidebar(props: ReferenceSideBarProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Side bar Name */}
      {props.header || (
        <p className="py-5 font-semibold text-f-100 text-lg">{props.name}</p>
      )}
      <ul className="styled-scrollbar transform-gpu overflow-y-scroll pr-3 pb-10">
        {props.links.map((link, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: TODO - fix this
          <li key={i}>
            <SidebarItem link={link} onLinkClick={props.onLinkClick} />
          </li>
        ))}
      </ul>
    </div>
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
      <DocSidebarCategory
        key={link.name}
        linkGroup={link}
        onLinkClick={props.onLinkClick}
      />
    );
  }

  if (link.icon) {
    return (
      <Link
        href={link.href}
        onClick={props.onLinkClick}
        className={clsx(
          "overflow-hidden text-ellipsis py-1 font-medium text-base transition-colors duration-300 hover:text-f-100",
          isActive ? "font-medium text-accent-500" : "text-f-300",
          "flex flex-row items-center gap-2",
        )}
      >
        {(link.icon as React.ReactElement) ? (
          <SidebarIcon icon={link.icon} />
        ) : null}
        {link.name}
      </Link>
    );
  }

  return (
    <Link
      href={link.href}
      onClick={props.onLinkClick}
      className={clsx(
        "block overflow-hidden text-ellipsis py-1 font-medium text-base transition-colors duration-300 hover:text-f-100",
        isActive ? "font-medium text-accent-500" : "text-f-300",
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
  const { href, name, links, icon } = props.linkGroup;
  const isCategoryActive = href ? isSamePage(pathname, href) : false;

  return (
    <div className="my-4">
      <div className="mb-2 flex items-center gap-2">
        {icon && <SidebarIcon icon={icon} />}
        {href ? (
          <Link
            className={cn(
              "block font-semibold text-base text-f-100 hover:text-accent-500",
              isCategoryActive && "!text-accent-500",
            )}
            href={href}
          >
            {name}
          </Link>
        ) : (
          <div className="font-semibold text-base">{name}</div>
        )}
      </div>
      <ul className="flex flex-col">
        {links.map((link, i) => {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: TODO - fix this
            <li key={i}>
              <SidebarItem link={link} onLinkClick={props.onLinkClick} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DocSidebarCategory(props: {
  linkGroup: LinkGroup;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const { href, name, links, expanded, icon } = props.linkGroup;
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
        isCategoryActive && "!font-semibold !text-accent-500",
        "text-f-300 hover:text-f-100",
      )}
    >
      <div className="flex gap-2 py-1 font-medium" ref={triggerRef}>
        {icon && <SidebarIcon icon={icon} />}
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
      triggerContainerClassName="text-base"
      trigger={triggerEl}
      chevronPosition="right"
    >
      <ul className="flex flex-col border-l-2 pl-4">
        {links.map((link, i) => {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: TODO - fix this
            <li key={i}>
              <SidebarItem link={link} onLinkClick={props.onLinkClick} />
            </li>
          );
        })}
      </ul>
    </CustomAccordion>
  );
}

export function DocSidebarMobile(props: ReferenceSideBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="w-full justify-between border bg-b-800 py-4 text-left font-medium text-f-100 xl:hidden">
          {props.name}
          <ChevronDown
            className={clsx(
              "size-5 text-f-300 transition-transform",
              open && "rotate-180",
            )}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent asChild sideOffset={10} align="center" side="bottom">
        <div className="max-h-[70vh] w-[calc(100vw-32px)] overflow-y-auto rounded-lg border bg-b-800 px-4">
          <DocSidebar
            {...props}
            onLinkClick={() => {
              setOpen(false);
              if (props.onLinkClick) {
                props.onLinkClick();
              }
            }}
            header={props.header}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
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

function SidebarIcon(props: { icon: StaticImport | React.ReactElement }) {
  if (isStaticImport(props.icon)) {
    return <Image src={props.icon} alt="" className="size-4" />;
  }
  return (
    <div className="flex items-center justify-center [&>*]:size-4">
      {props.icon}
    </div>
  );
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
