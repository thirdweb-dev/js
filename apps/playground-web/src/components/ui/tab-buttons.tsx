"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollShadow } from "@/components/ui/ScrollShadow";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function TabButtons(props: {
  tabs: {
    name: React.ReactNode;
    onClick: () => void;
    isActive: boolean;
    icon?: React.FC<{ className?: string }>;
    toolTip?: string;
  }[];
  tabClassName?: string;
  activeTabClassName?: string;
  tabContainerClassName?: string;
  containerClassName?: string;
  shadowColor?: string;
  tabIconClassName?: string;
  hideBottomLine?: boolean;
  bottomLineClassName?: string;
}) {
  const { containerRef, lineRef, activeTabRef } =
    useUnderline<HTMLButtonElement>();

  return (
    <div className={cn("relative", props.containerClassName)}>
      {/* Bottom line */}
      {!props.hideBottomLine && (
        <div
          className={cn(
            "absolute right-0 bottom-0 left-0 h-[1px] bg-border",
            props.bottomLineClassName,
          )}
        />
      )}

      <ScrollShadow
        scrollableClassName="pb-[8px] relative"
        shadowColor={props.shadowColor}
      >
        <div
          className={cn("flex", props.tabContainerClassName)}
          ref={containerRef}
        >
          {props.tabs.map((tab, index) => {
            return (
              <ToolTipLabel
                key={typeof tab.name === "string" ? tab.name : index}
                label={tab.toolTip}
              >
                <Button
                  className={cn(
                    "relative inline-flex h-auto items-center gap-1.5 rounded-lg font-medium hover:bg-accent !px-3",
                    !tab.isActive &&
                      "text-muted-foreground hover:text-foreground",
                    props.tabClassName,
                    tab.isActive && props.activeTabClassName,
                  )}
                  onClick={tab.onClick}
                  ref={tab.isActive ? activeTabRef : undefined}
                  variant="ghost"
                >
                  {tab.icon && (
                    <tab.icon
                      className={cn("size-6", props.tabIconClassName)}
                    />
                  )}
                  {tab.name}
                </Button>
              </ToolTipLabel>
            );
          })}
        </div>

        {/* Active line */}
        <div
          className="fade-in-0 absolute bottom-0 left-0 h-[2px] animate-in rounded-lg bg-foreground"
          ref={lineRef}
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

  useLayoutEffect(() => {
    function update() {
      if (activeTabEl && containerRef.current && lineRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const lineEl = lineRef.current;
        const rect = activeTabEl.getBoundingClientRect();
        const containerPaddingLeft =
          containerRect.left - containerRef.current.offsetLeft;
        lineEl.style.width = `${rect.width}px`;
        lineEl.style.transform = `translateX(${
          rect.left - containerPaddingLeft
        }px)`;
        setTimeout(() => {
          lineEl.style.transition = "transform 0.3s, width 0.3s";
        }, 0);
      } else if (lineRef.current) {
        lineRef.current.style.width = "0px";
      }
    }

    update();
    let resizeObserver: ResizeObserver | undefined;

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

  return { activeTabRef, containerRef, lineRef };
}
