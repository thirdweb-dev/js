"use client";

import { cn } from "@/lib/utils";
import { CustomAccordion } from "../others/CustomAccordion";

export function Details(props: {
  summary: React.ReactNode;
  children: React.ReactNode;
  level?: number;
  headingClassName?: string;
  id?: string;
  tags?: string[];
  noIndex?: boolean;
  startExpanded?: boolean;
  accordionItemClassName?: string;
  accordionTriggerClassName?: string;
}) {
  const id =
    props.id || (typeof props.summary === "string" ? props.summary : "");

  return (
    <CustomAccordion
      defaultOpen={props.startExpanded}
      containerClassName={cn(
        "group/details border-b-0 border-l-2 transition-colors hover:border-accent-500 my-4",
        props.accordionItemClassName,
      )}
      triggerContainerClassName={cn(
        "flex px-3 py-1 text-accent-500 hover:border-f-300 hover:bg-b-800",
        props.accordionTriggerClassName,
      )}
      trigger={
        <div className="flex gap-3">
          <h4
            className={cn(
              "break-all font-bold text-f-100 text-lg tracking-tight",
              "flex w-full gap-3 text-left font-semibold text-accent-500",
              props.headingClassName,
            )}
          >
            {props.summary}
          </h4>
          {props.tags && props.tags.length > 0 && (
            <div className="ml-auto flex items-center gap-2">
              {props.tags?.map((flag) => {
                return (
                  <span
                    className="rounded-lg border border-accent-700 bg-accent-900 px-2 py-1 text-accent-500 text-xs"
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
      id={id ? `${id}` : undefined}
    >
      <div className="pt-4 pl-4 [&>:first-child]:mt-0">{props.children}</div>
    </CustomAccordion>
  );
}
