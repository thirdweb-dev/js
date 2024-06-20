import { useRef, useState, useCallback, useLayoutEffect } from "react";
import { cn } from "../../lib/utils";
import { ScrollShadow } from "./ScrollShadow/ScrollShadow";
import { Button } from "./button";
import Link from "next/link";

export function TabLinks(props: {
  links: {
    name: string;
    href: string;
    isActive: boolean;
    isEnabled?: boolean;
    icon?: React.FC<{ className?: string }>;
  }[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [activeTabEl, setActiveTabEl] = useState<HTMLAnchorElement | null>(
    null,
  );

  const activeTabRef = useCallback((el: HTMLAnchorElement | null) => {
    setActiveTabEl(el);
  }, []);

  useLayoutEffect(() => {
    if (activeTabEl && containerRef.current && lineRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const lineEl = lineRef.current;
      const rect = activeTabEl.getBoundingClientRect();
      lineEl.style.width = `${rect.width}px`;
      lineEl.style.transform = `translateX(${rect.left - containerRect.left}px)`;
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

  return (
    <div className="relative">
      <ScrollShadow scrollableClassName="pb-[8px] relative">
        <div className="flex" ref={containerRef}>
          {props.links.map((tab) => {
            return (
              <Button asChild key={tab.name} variant="ghost">
                <Link
                  data-active={tab.isActive}
                  ref={tab.isActive ? activeTabRef : undefined}
                  href={tab.isEnabled ? tab.href : "#"}
                  className={cn(
                    "rounded-lg hover:bg-accent px-2 lg:px-3 font-medium text-sm lg:text-base relative h-auto inline-flex gap-1.5 items-center",
                    !tab.isActive &&
                      "text-muted-foreground hover:text-foreground",
                    !tab.isEnabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  {tab.icon && <tab.icon className="size-6" />}
                  {tab.name}
                </Link>
              </Button>
            );
          })}
        </div>

        {/* Active line */}
        <div
          ref={lineRef}
          className="absolute left-0 bottom-0 z-10 h-[2px] bg-foreground rounded-lg fade-in-0 animate-in"
        ></div>
      </ScrollShadow>
      {/* Bottom line */}
      <div className="h-[1px] bg-border -translate-y-[2px]"></div>
    </div>
  );
}
