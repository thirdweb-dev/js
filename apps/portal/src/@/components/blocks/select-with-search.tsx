"use client";

import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import React, { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { useShowMore } from "@/hooks/useShowMore";
import { cn } from "@/lib/utils";

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
  showCheck?: boolean;
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
      showCheck = true,
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

    return (
      <Popover modal onOpenChange={setIsPopoverOpen} open={isPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            className={cn(
              "flex w-full items-center justify-between rounded-md border border-border bg-inherit p-3 hover:bg-inherit",
              className,
            )}
            onClick={() => setIsPopoverOpen(true)}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <span
                className={cn(
                  "truncate text-muted-foreground text-sm",
                  selectedOption && "w-full text-foreground",
                )}
              >
                {renderOption && selectedOption
                  ? renderOption(selectedOption)
                  : selectedOption?.label || placeholder}
              </span>
              <ChevronDownIcon className="size-4 cursor-pointer text-muted-foreground" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align={props.align || "center"}
          className={cn("p-0", popoverContentClassName)}
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
          ref={popoverElRef}
          side={props.side}
          sideOffset={10}
          style={{
            maxHeight: "var(--radix-popover-content-available-height)",
            width: "var(--radix-popover-trigger-width)",
          }}
        >
          <div>
            {/* Search */}
            <div className="relative">
              <Input
                className="!h-auto rounded-b-none border-0 border-border border-b py-3 pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  const scrollContainer =
                    popoverElRef.current?.querySelector("[data-scrollable]");
                  if (scrollContainer) {
                    scrollContainer.scrollTo({
                      top: 0,
                    });
                  }
                }}
                placeholder={searchPlaceholder || "Search"}
                value={searchValue}
              />
              <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-4 size-4 text-muted-foreground" />
            </div>

            <ScrollShadow
              className="rounded"
              scrollableClassName="max-h-[min(calc(var(--radix-popover-content-available-height)-60px),350px)] p-1"
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
                      aria-selected={isSelected}
                      className="flex w-full cursor-pointer justify-start gap-3 rounded-sm px-3 py-2 text-left"
                      key={option.value}
                      onClick={() => {
                        onValueChange(option.value);
                        if (closeOnSelect) {
                          setIsPopoverOpen(false);
                        }
                      }}
                      ref={
                        i === optionsToShow.length - 1 ? lastItemRef : undefined
                      }
                      // biome-ignore lint/a11y/useSemanticElements: TODO
                      role="option"
                      variant="ghost"
                    >
                      {showCheck && (
                        <div className="flex size-4 items-center justify-center">
                          {isSelected && <CheckIcon className="size-4" />}
                        </div>
                      )}

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
