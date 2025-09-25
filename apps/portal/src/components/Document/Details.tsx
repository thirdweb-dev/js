"use client";

import { cn } from "@/lib/utils";
import { CustomAccordion } from "../others/CustomAccordion";

export function Details(props: {
  summary: React.ReactNode;
  children: React.ReactNode;
  level?: number;
  headingClassName?: string;
  anchorId?: string;
  tags?: string[];
  noIndex?: boolean;
  startExpanded?: boolean;
  accordionItemClassName?: string;
  accordionTriggerClassName?: string;
}) {
  const id =
    props.anchorId || (typeof props.summary === "string" ? props.summary : "");

  return (
    <CustomAccordion
      anchorId={id ? `${id}` : undefined}
      containerClassName={cn(
        "group/details border-b-0 border-l transition-colors hover:border-active-border my-2",
        props.accordionItemClassName,
      )}
      defaultOpen={props.startExpanded}
      trigger={
        <div className="flex gap-3">
          <span
            className={cn(
              "break-all text-foreground text-lg",
              "flex w-full gap-3 text-left font-semibold text-foreground group-hover:underline",
              props.headingClassName,
            )}
          >
            {props.summary}
          </span>
          {props.tags && props.tags.length > 0 && (
            <div className="ml-auto flex items-center gap-2">
              {props.tags?.map((flag) => {
                return (
                  <span
                    className="rounded-lg border bg-card px-2 py-1 text-foreground text-xs"
                    key={flag}
                  >
                    {flag}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      }
      triggerContainerClassName={cn(
        "flex px-3 py-1 text-foreground group",
        props.accordionTriggerClassName,
      )}
    >
      <div className="pl-4 [&>:first-child]:mt-0 [&>*:last-child]:mb-0">
        {props.children}
      </div>
    </CustomAccordion>
  );
}
