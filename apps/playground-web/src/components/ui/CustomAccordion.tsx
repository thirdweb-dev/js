"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { createContext, useContext, useId, useState } from "react";
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
  const contentId = useId();
  const buttonId = useId();

  return (
    <AccordionContext.Provider value={{ isOpen }}>
      <div
        className={cn("border-b", props.containerClassName)}
        data-custom-accordion
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
            "flex flex-1 items-center gap-3 w-full cursor-pointer",
            props.triggerContainerClassName,
            isOpen && props.activeTriggerClassName,
            props.chevronPosition === "right"
              ? "justify-between flex-row-reverse"
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
            className={"overflow-hidden"}
          >
            <div
              className={cn(
                "duration-500 fade-in-0 animate-in",
                !isOpen && "hidden",
              )}
            >
              <div className="pb-2 pt-1">{props.children}</div>
            </div>
          </div>
        </DynamicHeight>
      </div>
    </AccordionContext.Provider>
  );
}

const AccordionContext = createContext({ isOpen: false });

export function useAccordionContext() {
  return useContext(AccordionContext);
}
