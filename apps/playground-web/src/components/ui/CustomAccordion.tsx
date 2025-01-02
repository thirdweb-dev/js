"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { DynamicHeight } from "./DynamicHeight";

type CustomAccordionProps = {
  chevronPosition?: "left" | "right";
  trigger: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  triggerContainerClassName?: string;
  containerClassName?: string;
  chevronClassName?: string;
  activeTriggerClassName?: string;
};

export function CustomAccordion(props: CustomAccordionProps) {
  const [isOpen, setIsOpen] = useState(props.defaultOpen || false);
  const elRef = useRef<HTMLDivElement>(null);
  const contentId = useId();
  const buttonId = useId();

  // when another accordion is opened, close this one
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const selfEl = elRef.current;

    if (!selfEl) {
      return;
    }

    const allAccordions = selfEl.parentElement?.querySelectorAll(
      "[data-custom-accordion]",
    );

    if (!allAccordions) {
      return;
    }

    for (const accordion of allAccordions) {
      if (!(accordion instanceof HTMLElement)) {
        continue;
      }

      if (accordion === selfEl) {
        continue;
      }

      accordion.addEventListener("click", () => {
        if (isOpen) {
          setIsOpen(false);
        }
      });
    }
  }, [isOpen]);

  return (
    <div
      className={cn("border-b", props.containerClassName)}
      data-custom-accordion
      ref={elRef}
    >
      <button
        type="button"
        data-open={isOpen}
        id={buttonId}
        aria-controls={contentId}
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((c) => !c);
        }}
        className={cn(
          "flex w-full flex-1 cursor-pointer items-center gap-3",
          props.triggerContainerClassName,
          isOpen && props.activeTriggerClassName,
          props.chevronPosition === "right"
            ? "flex-row-reverse justify-between"
            : "",
        )}
      >
        <ChevronDown
          className={cn(
            "ease size-4 shrink-0 transition-transform duration-300",
            isOpen && "rotate-180",
            props.chevronClassName,
          )}
        />

        {props.trigger}
      </button>

      <DynamicHeight>
        <div
          id={contentId}
          aria-labelledby={buttonId}
          data-open={isOpen}
          className="overflow-hidden"
        >
          <div
            className={cn(
              "fade-in-0 animate-in duration-500",
              !isOpen && "hidden",
            )}
          >
            <div className="pt-1 pb-2">{props.children}</div>
          </div>
        </div>
      </DynamicHeight>
    </div>
  );
}
