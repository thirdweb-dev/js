/* eslint-disable no-restricted-syntax */
"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDown, SearchIcon } from "lucide-react";
import React, { useRef, useMemo, useEffect } from "react";
import { useShowMore } from "../../lib/useShowMore";
import { ScrollShadow } from "../ui/ScrollShadow/ScrollShadow";
import { Input } from "../ui/input";

interface SelectWithSearchProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options: {
    label: string;
    value: string;
  }[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder?: string;
  className?: string;
  overrideSearchFn?: (
    option: { value: string; label: string },
    searchTerm: string,
  ) => boolean;
  renderOption?: (option: { value: string; label: string }) => React.ReactNode;
  popoverContentClassName?: string;
  side?: "left" | "right" | "top" | "bottom";
  align?: "center" | "start" | "end";
  closeOnSelect?: boolean;
}

export const SelectWithSearch = React.forwardRef<
  HTMLButtonElement,
  SelectWithSearchProps
>(
  (
    {
      options,
      onValueChange,
      placeholder,
      className,
      value,
      renderOption,
      overrideSearchFn,
      popoverContentClassName,
      searchPlaceholder,
      closeOnSelect,
      ...props
    },
    ref,
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const selectedOption = useMemo(
      () => options.find((option) => option.value === value),
      [options, value],
    );

    // show 50 initially and then 20 more when reaching the end
    const { itemsToShow, lastItemRef } = useShowMore<HTMLButtonElement>(50, 20);

    const optionsToShow = useMemo(() => {
      const filteredOptions: {
        label: string;
        value: string;
      }[] = [];

      const searchValLowercase = searchValue.toLowerCase();

      for (let i = 0; i <= options.length - 1; i++) {
        if (filteredOptions.length >= itemsToShow) {
          break;
        }
        const option = options[i];
        if (!option) {
          continue;
        }

        if (overrideSearchFn) {
          if (overrideSearchFn(option, searchValLowercase)) {
            filteredOptions.push(option);
          }
        } else {
          if (option.label.toLowerCase().includes(searchValLowercase)) {
            filteredOptions.push(option);
          }
        }
      }

      return filteredOptions;
    }, [options, searchValue, itemsToShow, overrideSearchFn]);

    // scroll to top when options change
    const popoverElRef = useRef<HTMLDivElement>(null);
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      const scrollContainer =
        popoverElRef.current?.querySelector("[data-scrollable]");
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: 0,
        });
      }
    }, [searchValue]);

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={() => setIsPopoverOpen(true)}
            className={cn(
              "flex w-full items-center justify-between rounded-md border border-border bg-inherit p-3 hover:bg-inherit",
              className,
            )}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <span
                className={cn(
                  "truncate text-muted-foreground text-sm",
                  selectedOption && "text-foreground",
                )}
              >
                {selectedOption?.label || placeholder}
              </span>
              <ChevronDown className="size-4 cursor-pointer text-muted-foreground" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={cn("z-[10001] p-0", popoverContentClassName)}
          align={props.align || "center"}
          side={props.side}
          sideOffset={10}
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
          style={{
            width: "var(--radix-popover-trigger-width)",
            maxHeight: "var(--radix-popover-content-available-height)",
          }}
          ref={popoverElRef}
        >
          <div>
            {/* Search */}
            <div className="relative">
              <Input
                placeholder={searchPlaceholder || "Search"}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="!h-auto rounded-b-none border-0 border-border border-b py-3 pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-4 size-4 text-muted-foreground" />
            </div>

            <ScrollShadow
              scrollableClassName="max-h-[min(calc(var(--radix-popover-content-available-height)-60px),350px)] p-1"
              className="rounded"
            >
              {/* List */}
              <div>
                {optionsToShow.length === 0 && (
                  <div className="flex justify-center py-10">
                    No results found
                  </div>
                )}

                {optionsToShow.map((option, i) => {
                  const isSelected = value === option.value;
                  return (
                    <Button
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onValueChange(option.value);
                        if (closeOnSelect) {
                          setIsPopoverOpen(false);
                        }
                      }}
                      variant="ghost"
                      className="flex w-full cursor-pointer justify-start gap-3 rounded-sm px-3 py-2 text-left"
                      ref={
                        i === optionsToShow.length - 1 ? lastItemRef : undefined
                      }
                    >
                      <div className="flex size-4 items-center justify-center">
                        {isSelected && <CheckIcon className="size-4" />}
                      </div>

                      <div className="min-w-0 grow">
                        {renderOption ? renderOption(option) : option.label}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </ScrollShadow>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);

SelectWithSearch.displayName = "SelectWithSearch";
