/* eslint-disable no-restricted-syntax */
/** biome-ignore-all lint/a11y/useSemanticElements: TODO */
"use client";

import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useShowMore } from "../../lib/useShowMore";
import { Input } from "../ui/input";
import { ScrollShadow } from "../ui/ScrollShadow/ScrollShadow";

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options: {
    label: string;
    value: string;
  }[];

  selectedValues: string[];
  onSelectedValuesChange: (value: string[]) => void;
  placeholder: string;
  searchPlaceholder?: string;
  popoverContentClassName?: string;
  selectedBadgeClassName?: string;
  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  className?: string;

  overrideSearchFn?: (
    option: { value: string; label: string },
    searchTerm: string,
  ) => boolean;

  renderOption?: (option: { value: string; label: string }) => React.ReactNode;
}

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onSelectedValuesChange,
      placeholder,
      maxCount = Number.POSITIVE_INFINITY,
      className,
      selectedValues,
      overrideSearchFn,
      renderOption,
      popoverContentClassName,
      selectedBadgeClassName,
      searchPlaceholder,
      ...props
    },
    ref,
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const handleInputKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
          setIsPopoverOpen(true);
        } else if (event.key === "Backspace" && !event.currentTarget.value) {
          const newSelectedValues = [...selectedValues];
          newSelectedValues.pop();
          onSelectedValuesChange(newSelectedValues);
        }
      },
      [selectedValues, onSelectedValuesChange],
    );

    const toggleOption = useCallback(
      (option: string) => {
        const newSelectedValues = selectedValues.includes(option)
          ? selectedValues.filter((value) => value !== option)
          : [...selectedValues, option];
        onSelectedValuesChange(newSelectedValues);
      },
      [selectedValues, onSelectedValuesChange],
    );

    const handleClear = useCallback(() => {
      onSelectedValuesChange([]);
    }, [onSelectedValuesChange]);

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = useCallback(() => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      onSelectedValuesChange(newSelectedValues);
    }, [selectedValues, onSelectedValuesChange, maxCount]);

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
    // biome-ignore lint/correctness/useExhaustiveDependencies: ok
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
      <Popover modal onOpenChange={setIsPopoverOpen} open={isPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            className={cn(
              "flex h-auto min-h-10 w-full items-center justify-between rounded-md border border-border bg-inherit p-3 hover:bg-inherit",
              className,
            )}
            onClick={handleTogglePopover}
          >
            {selectedValues.length > 0 ? (
              <div className="flex w-full justify-between">
                {/* badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedValues.slice(0, maxCount).map((value) => {
                    const option = options.find((o) => o.value === value);
                    if (!option) {
                      return null;
                    }

                    return (
                      <ClosableBadge
                        className={selectedBadgeClassName}
                        key={value}
                        label={option.label}
                        onClose={() => toggleOption(value)}
                      />
                    );
                  })}

                  {/* +X more */}
                  {selectedValues.length > maxCount && (
                    <ClosableBadge
                      label={`+ ${selectedValues.length - maxCount} more`}
                      onClose={clearExtraOptions}
                    />
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  {/* Clear All */}
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: TODO */}
                  {/* biome-ignore lint/a11y/useFocusableInteractive: TODO */}
                  <div
                    className="rounded p-1 hover:bg-accent"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClear();
                    }}
                    role="button"
                  >
                    <XIcon className="h-4 cursor-pointer text-muted-foreground" />
                  </div>

                  <Separator
                    className="flex h-full min-h-6"
                    orientation="vertical"
                  />
                  <ChevronDownIcon className="h-4 cursor-pointer text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  {placeholder}
                </span>
                <ChevronDownIcon className="h-4 cursor-pointer text-muted-foreground" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          className={cn("p-0", popoverContentClassName)}
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
          ref={popoverElRef}
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
                className="!h-auto rounded-b-none border-0 border-border border-b py-4 pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
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
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <Button
                      aria-selected={isSelected}
                      className="flex w-full cursor-pointer justify-start gap-3 rounded-sm px-3 py-2 text-left"
                      key={option.value}
                      onClick={() => toggleOption(option.value)}
                      ref={
                        i === optionsToShow.length - 1 ? lastItemRef : undefined
                      }
                      role="option"
                      variant="ghost"
                    >
                      <div
                        className={cn(
                          "flex size-4 items-center justify-center rounded-sm border border-foreground",
                          isSelected
                            ? "bg-inverted text-inverted-foreground"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <CheckIcon className="size-4" />
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

function ClosableBadge(props: {
  label: string;
  onClose: () => void;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border bg-muted px-2 py-1 text-foreground text-xs",
        props.className,
      )}
    >
      {props.label}
      <XIcon
        className="h-3 w-3 cursor-pointer text-muted-foreground"
        onClick={(e) => {
          e.stopPropagation();
          props.onClose();
        }}
      />
    </span>
  );
}

MultiSelect.displayName = "MultiSelect";
