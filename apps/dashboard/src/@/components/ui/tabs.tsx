"use client";

import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { ScrollShadow } from "./ScrollShadow/ScrollShadow";
import { Button } from "./button";

export type TabLink = {
  name: string;
  href: string;
  isActive: boolean;
  isDisabled?: boolean;
};

export function TabLinks(props: {
  links: TabLink[];
  className?: string;
  tabContainerClassName?: string;
  shadowColor?: string;
}) {
  const { containerRef, lineRef, activeTabRef } =
    useUnderline<HTMLAnchorElement>();

  return (
    <div className={cn("relative", props.className)}>
      {/* Bottom line */}
      <div className="absolute right-0 bottom-0 left-0 h-[1px] bg-border" />

      <ScrollShadow
        scrollableClassName="pb-[8px] relative"
        shadowColor={props.shadowColor}
      >
        <div
          className={cn("flex", props.tabContainerClassName)}
          ref={containerRef}
        >
          {props.links.map((tab) => {
            return (
              <Button
                asChild
                key={tab.name}
                disabled={tab.isDisabled}
                variant="ghost"
              >
                <Link
                  data-active={tab.isActive}
                  ref={tab.isActive ? activeTabRef : undefined}
                  href={tab.href}
                  aria-disabled={tab.isDisabled}
                  className={cn(
                    "relative h-auto rounded-lg px-3 font-normal text-muted-foreground text-sm hover:bg-muted lg:text-sm",
                    !tab.isActive && !tab.isDisabled && "hover:text-foreground",
                    tab.isDisabled && "pointer-events-none",
                    tab.isActive && "!text-foreground",
                  )}
                >
                  {tab.name}
                </Link>
              </Button>
            );
          })}
        </div>

        {/* Active line */}
        <div
          ref={lineRef}
          className="fade-in-0 absolute bottom-0 left-0 h-[2px] animate-in rounded-lg bg-foreground"
        />
      </ScrollShadow>
    </div>
  );
}

export function TabButtons(props: {
  tabs: {
    name: string;
    onClick: () => void;
    isActive: boolean;
    isEnabled?: boolean;
    icon?: React.FC<{ className?: string }>;
  }[];
  tabClassName?: string;
  activeTabClassName?: string;
  tabContainerClassName?: string;
  containerClassName?: string;
  shadowColor?: string;
  tabIconClassName?: string;
  hideBottomLine?: boolean;
}) {
  const { containerRef, lineRef, activeTabRef } =
    useUnderline<HTMLButtonElement>();

  return (
    <div className={cn("relative", props.containerClassName)}>
      {/* Bottom line */}
      {!props.hideBottomLine && (
        <div className="absolute right-0 bottom-0 left-0 h-[1px] bg-border" />
      )}

      <ScrollShadow
        scrollableClassName="pb-[8px] relative"
        shadowColor={props.shadowColor}
      >
        <div
          className={cn("flex", props.tabContainerClassName)}
          ref={containerRef}
        >
          {props.tabs.map((tab) => {
            return (
              <Button
                key={tab.name}
                variant="ghost"
                ref={tab.isActive ? activeTabRef : undefined}
                className={cn(
                  "relative inline-flex h-auto items-center gap-1.5 rounded-lg px-2 font-medium text-sm hover:bg-accent lg:px-3 lg:text-base",
                  !tab.isActive &&
                    "text-muted-foreground hover:text-foreground",
                  !tab.isEnabled && "cursor-not-allowed opacity-50",
                  props.tabClassName,
                  tab.isActive && props.activeTabClassName,
                )}
                onClick={tab.isEnabled ? tab.onClick : undefined}
              >
                {tab.icon && (
                  <tab.icon className={cn("size-6", props.tabIconClassName)} />
                )}
                {tab.name}
              </Button>
            );
          })}
        </div>

        {/* Active line */}
        <div
          ref={lineRef}
          className="fade-in-0 absolute bottom-0 left-0 h-[2px] animate-in rounded-lg bg-foreground"
        />
      </ScrollShadow>
    </div>
  );
}

function useUnderline<El extends HTMLElement>() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [activeTabEl, setActiveTabEl] = useState<El | null>(null);

  const activeTabRef = useCallback((el: El | null) => {
    setActiveTabEl(el);
  }, []);

  useIsomorphicLayoutEffect(() => {
    function update() {
      if (activeTabEl && containerRef.current && lineRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const lineEl = lineRef.current;
        const rect = activeTabEl.getBoundingClientRect();
        lineEl.style.width = `${rect.width}px`;
        lineEl.style.transform = `translateX(${
          rect.left - containerRect.left
        }px)`;
        setTimeout(() => {
          lineEl.style.transition = "transform 0.3s, width 0.3s";
        }, 0);
      } else if (lineRef.current) {
        lineRef.current.style.width = "0px";
      }
    }

    update();
    let resizeObserver: ResizeObserver | undefined = undefined;

    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        setTimeout(() => {
          update();
        }, 100);
      });
      resizeObserver.observe(containerRef.current);
    }

    // add event listener for resize
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      resizeObserver?.disconnect();
    };
  }, [activeTabEl]);

  return { containerRef, lineRef, activeTabRef };
}

export function TabPathLinks(props: {
  links: {
    name: string;
    path: string;
    exactMatch?: boolean;
    isDisabled?: boolean;
  }[];
  className?: string;
  tabContainerClassName?: string;
  shadowColor?: string;
}) {
  const pathname = usePathname() || "";
  const { links, ...restProps } = props;
  return (
    <TabLinks
      {...restProps}
      links={links.map((l) => ({
        name: l.name,
        href: l.path,
        isActive: l.exactMatch
          ? pathname === l.path
          : pathname.startsWith(l.path),
        isDisabled: l.isDisabled,
      }))}
    />
  );
}
