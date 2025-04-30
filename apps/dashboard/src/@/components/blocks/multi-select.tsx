/* eslint-disable no-restricted-syntax */
"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDown, SearchIcon, XIcon } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useShowMore } from "../../lib/useShowMore";
import { ScrollShadow } from "../ui/ScrollShadow/ScrollShadow";
import { Input } from "../ui/input";

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

  popoverContentClassName?: string;
  customTrigger?: React.ReactNode;
  renderOption?: (option: { value: string; label: string }) => React.ReactNode;
  align?: "center" | "start" | "end";
  side?: "left" | "right" | "top" | "bottom";
  showSelectedValuesInModal?: boolean;
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
      searchPlaceholder,
      popoverContentClassName,
      showSelectedValuesInModal = false,
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
          {props.customTrigger || (
            <Button
              ref={ref}
              {...props}
              onClick={handleTogglePopover}
              className={cn(
                "flex h-auto min-h-10 w-full items-center justify-between rounded-md border border-border bg-inherit p-3 hover:bg-inherit",
                className,
              )}
            >
              {selectedValues.length > 0 ? (
                <div className="flex w-full items-center justify-between">
                  <SelectedChainsBadges
                    selectedValues={selectedValues}
                    options={options}
                    maxCount={maxCount}
                    onClose={handleClear}
                    toggleOption={toggleOption}
                    clearExtraOptions={clearExtraOptions}
                  />
                  <div className="flex items-center justify-between gap-2">
                    {/* Clear All */}
                    {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                    {/* biome-ignore lint/a11y/useFocusableInteractive: <explanation> */}
                    <div
                      role="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleClear();
                      }}
                      className="rounded p-1 hover:bg-accent"
                    >
                      <XIcon className="h-4 cursor-pointer text-muted-foreground" />
                    </div>

                    <Separator
                      orientation="vertical"
                      className="flex h-full min-h-6"
                    />
                    <ChevronDown className="h-4 cursor-pointer text-muted-foreground" />
                  </div>
                </div>
              ) : (
                <div className="flex w-full items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    {placeholder}
                  </span>
                  <ChevronDown className="h-4 cursor-pointer text-muted-foreground" />
                </div>
              )}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "flex max-h-[500px] flex-col p-0",
            popoverContentClassName,
          )}
          align={props.align}
          side={props.side}
          sideOffset={10}
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
          style={{
            width: "var(--radix-popover-trigger-width)",
            height:
              "calc(var(--radix-popover-content-available-height) - 40px)",
          }}
          ref={popoverElRef}
        >
          {/* Search */}
          <div className="relative">
            <Input
              placeholder={searchPlaceholder || "Search"}
              value={searchValue}
              // do not focus on the input when the popover opens to avoid opening the keyboard
              tabIndex={-1}
              onChange={(e) => setSearchValue(e.target.value)}
              className="!h-auto rounded-b-none border-0 border-border border-b py-4 pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
              onKeyDown={handleInputKeyDown}
            />
            <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-4 size-4 text-muted-foreground" />
          </div>

          {optionsToShow.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center py-10 text-sm">
              No results found
            </div>
          )}

          {optionsToShow.length > 0 && (
            <ScrollShadow
              scrollableClassName="p-1 h-full"
              className="flex-1 rounded"
            >
              {/* List */}
              <div>
                {optionsToShow.map((option, i) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <Button
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => toggleOption(option.value)}
                      variant="ghost"
                      className="flex w-full cursor-pointer justify-start gap-3 rounded-sm px-3 py-2 text-left"
                      ref={
                        i === optionsToShow.length - 1 ? lastItemRef : undefined
                      }
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
          )}

          {showSelectedValuesInModal && selectedValues.length > 0 && (
            <div className="border-t px-3 py-3">
              <SelectedChainsBadges
                selectedValues={selectedValues}
                options={options}
                maxCount={maxCount}
                onClose={handleClear}
                toggleOption={toggleOption}
                clearExtraOptions={clearExtraOptions}
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  },
);

function ClosableBadge(props: {
  label: string;
  onClose: () => void;
}) {
  return (
    <span className="flex items-center gap-3 rounded-xl border border-border bg-muted px-2 py-1 text-foreground text-xs">
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

function SelectedChainsBadges(props: {
  selectedValues: string[];
  options: {
    label: string;
    value: string;
  }[];
  maxCount: number;
  onClose: () => void;
  toggleOption: (value: string) => void;
  clearExtraOptions: () => void;
}) {
  const { selectedValues, options, maxCount, toggleOption, clearExtraOptions } =
    props;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {selectedValues.slice(0, maxCount).map((value) => {
        const option = options.find((o) => o.value === value);
        if (!option) {
          return null;
        }

        return (
          <ClosableBadge
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
  );
}
