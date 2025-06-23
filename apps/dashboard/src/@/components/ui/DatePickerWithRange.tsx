"use client";

import { format, isBefore } from "date-fns";
import { CalendarIcon, CalendarX2Icon, ChevronDownIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DynamicHeight } from "./DynamicHeight";
import { TabButtons } from "./tabs";

export function DatePickerWithRange(props: {
  from: Date;
  to: Date;
  setFrom: (from: Date) => void;
  setTo: (to: Date) => void;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  labelOverride?: string;
  popoverAlign?: "start" | "end" | "center";
}) {
  const [screen, setScreen] = React.useState<"from" | "to">("from");
  const { from, to, setFrom, setTo } = props;

  const isValid = React.useMemo(() => isBefore(from, to), [from, to]);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover
      onOpenChange={(v) => {
        if (!v) {
          setScreen("from");
        }
        setIsOpen(v);
      }}
      open={isOpen}
    >
      {/* Button */}
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "justify-start gap-2 text-left font-normal",
            props.className,
          )}
          variant="outline"
        >
          <CalendarIcon className="h-4 w-4" />
          {props.labelOverride || (
            <>
              {format(from, "LLL dd, y")} - {format(to, "LLL dd, y")}
            </>
          )}
          <ChevronDownIcon className="ml-auto h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      {/* Popover */}
      <PopoverContent
        align={props.popoverAlign || "start"}
        className="w-auto p-0"
        sideOffset={10}
      >
        <DynamicHeight>
          <div>
            {!isValid && (
              <p className="flex items-center justify-center gap-2 py-2 text-center text-destructive-text text-sm">
                <CalendarX2Icon className="h-4 w-4" />
                Invalid date range
              </p>
            )}
            {props.header}

            <div className={cn("px-4", !props.header && "py-4")}>
              <TabButtons
                activeTabClassName="!bg-inverted !text-inverted-foreground"
                tabClassName="!text-sm"
                tabContainerClassName="gap-2"
                tabs={[
                  {
                    isActive: screen === "from",
                    name: "From",
                    onClick: () => setScreen("from"),
                  },
                  {
                    isActive: screen === "to",
                    name: "To",
                    onClick: () => setScreen("to"),
                  },
                ]}
              />
            </div>

            {screen === "from" && (
              <Calendar
                classNames={{
                  day_range_end:
                    "!bg-inverted/50 !text-inverted-foreground pointer-events-none",
                  day_range_start: "!bg-inverted !text-inverted-foreground",
                }}
                defaultMonth={from}
                key={from.toString()}
                mode="range"
                onDayClick={(newFrom) => {
                  if (isBefore(newFrom, to)) {
                    setFrom(newFrom);
                  }
                }}
                selected={{
                  from,
                  to,
                }}
              />
            )}

            {screen === "to" && (
              <Calendar
                classNames={{
                  day_range_end: "!bg-inverted !text-inverted-foreground",
                  day_range_start:
                    "!bg-inverted/50 !text-inverted-foreground pointer-events-none",
                }}
                defaultMonth={to}
                key={to.toString()}
                mode="range"
                onDayClick={(newTo) => {
                  if (isBefore(from, newTo)) {
                    setTo(newTo);
                  }
                }}
                selected={{
                  from,
                  to,
                }}
              />
            )}
            {props.footer}
          </div>
        </DynamicHeight>
      </PopoverContent>
    </Popover>
  );
}
