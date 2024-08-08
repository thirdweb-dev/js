import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ScrollShadow } from "./ScrollShadow/ScrollShadow";
import { Button } from "./button";

export function TabLinks(props: {
  links: {
    name: string;
    href: string;
    isActive: boolean;
    isEnabled?: boolean;
  }[];
}) {
  const { containerRef, lineRef, activeTabRef } =
    useUnderline<HTMLAnchorElement>();

  return (
    <div className="relative">
      <ScrollShadow scrollableClassName="pb-[8px] relative">
        <div className="flex" ref={containerRef}>
          {props.links.map((tab) => {
            return (
              <Button
                asChild
                key={tab.name}
                disabled={!tab.isEnabled}
                variant="ghost"
              >
                <Link
                  data-active={tab.isActive}
                  ref={tab.isActive ? activeTabRef : undefined}
                  href={tab.href}
                  aria-disabled={!tab.isEnabled}
                  className={cn(
                    "rounded-lg hover:bg-muted px-3 font-medium text-sm lg:text-base relative h-auto",
                    !tab.isActive &&
                      tab.isEnabled &&
                      "opacity-50 hover:opacity-100",
                    !tab.isEnabled && "opacity-50 pointer-events-none",
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
          className="absolute left-0 bottom-0 h-[2px] bg-foreground rounded-lg fade-in-0 animate-in"
        />
      </ScrollShadow>
      {/* Bottom line */}
      <div className="h-[1px] bg-border -translate-y-[2px]" />
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
}) {
  const { containerRef, lineRef, activeTabRef } =
    useUnderline<HTMLButtonElement>();

  return (
    <div className={cn("relative", props.containerClassName)}>
      <ScrollShadow scrollableClassName="pb-[8px] relative">
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
                  "rounded-lg hover:bg-accent px-2 lg:px-3 font-medium text-sm lg:text-base relative h-auto inline-flex gap-1.5 items-center",
                  !tab.isActive &&
                    "text-muted-foreground hover:text-foreground",
                  !tab.isEnabled && "cursor-not-allowed opacity-50",
                  props.tabClassName,
                  tab.isActive && props.activeTabClassName,
                )}
                onClick={tab.isEnabled ? tab.onClick : undefined}
              >
                {tab.icon && <tab.icon className="size-6" />}
                {tab.name}
              </Button>
            );
          })}
        </div>

        {/* Active line */}
        <div
          ref={lineRef}
          className="absolute left-0 bottom-0 h-[2px] bg-foreground rounded-lg fade-in-0 animate-in"
        />
      </ScrollShadow>
      {/* Bottom line */}
      <div className="h-[1px] bg-border -translate-y-[2px]" />
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

  useLayoutEffect(() => {
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

      activeTabEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTabEl]);

  return { containerRef, lineRef, activeTabRef };
}
