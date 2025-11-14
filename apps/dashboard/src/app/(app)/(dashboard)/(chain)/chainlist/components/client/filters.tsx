"use client";

import { ChevronDownIcon, FilterIcon, XIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import type React from "react";
import { type PropsWithChildren, useCallback, useId, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { services } from "../../../components/server/products";

function cleanUrl(url: string) {
  if (url.endsWith("?")) {
    return url.slice(0, -1);
  }
  return url;
}

export function AllFilters(props: { hideChainType?: boolean }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="h-10 w-auto gap-2 p-2 lg:h-10 lg:border-0 lg:px-4 lg:py-2"
          variant="outline"
        >
          <FilterIcon className="lg:size-4" strokeWidth={1} />
          <span className="hidden lg:inline">All Filters</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="mt-0.5 flex max-w-full flex-col gap-4"
      >
        <h3 className="font-bold">Filters</h3>

        {/* Chain Type */}
        {!props.hideChainType && <ChainTypeFilter sectionOnly />}

        <Separator />

        {/* Options */}
        <ChainOptionsFilter sectionOnly />

        <Separator />

        {/* Services */}
        <ChainServiceFilter sectionOnly />

        <Separator />

        {/* Reset */}
        <FilterResetButton filters={["includeDeprecated", "service", "type"]}>
          Reset all filters
        </FilterResetButton>
      </PopoverContent>
    </Popover>
  );
}

type FilterResetButtonProps = {
  filters: ("service" | "type" | "includeDeprecated")[];
};

const FilterResetButton: React.FC<
  PropsWithChildren<FilterResetButtonProps>
> = ({ filters, children }) => {
  const router = useDashboardRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mutableSearchParams = useMemo(() => {
    return new URLSearchParams(searchParams ?? undefined);
  }, [searchParams]);

  return (
    <Button
      className="font-semibold"
      onClick={() => {
        // delete every filter (however keep the search term)
        for (const f of filters) {
          mutableSearchParams.delete(f);
        }
        // always delete page since we're changing filters
        mutableSearchParams.delete("page");
        const url = cleanUrl(`${pathname}?${mutableSearchParams.toString()}`);
        router.push(url);
      }}
      size="sm"
      variant="outline"
    >
      {children}
    </Button>
  );
};

type FilterSectionProps = {
  title: string;
};

const FilterSection: React.FC<PropsWithChildren<FilterSectionProps>> = ({
  title,
  children,
}) => {
  return (
    <section className="flex flex-col">
      <h4 className="mb-2 font-semibold text-muted-foreground text-sm">
        {title}
      </h4>
      {children}
    </section>
  );
};

type ChainTypeFilterProps = { sectionOnly?: boolean };

export const ChainTypeFilter: React.FC<ChainTypeFilterProps> = ({
  sectionOnly,
}) => {
  const router = useDashboardRouter();
  const searchParams = useSearchParams();

  const value = useMemo(
    () => searchParams?.get("type") || "all",
    [searchParams],
  );

  const makeUrl = useCallback((newValue: string) => {
    switch (newValue) {
      case "mainnets": {
        return "/chainlist/mainnets";
      }
      case "testnets": {
        return "/chainlist/testnets";
      }
      default: {
        return "";
      }
    }
  }, []);

  const allId = useId();
  const mainnetsId = useId();
  const testnetsId = useId();

  const section = (
    <FilterSection title="Chain Type">
      <RadioGroup
        onValueChange={(newValue) => {
          const url = makeUrl(newValue);
          router.replace(url);
        }}
        value={value}
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem id={allId} value="all" />
          <Label htmlFor={allId}>All Chains</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem id={mainnetsId} value="mainnets" />
          <Label htmlFor={mainnetsId}>Mainnets Only</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem id={testnetsId} value="testnets" />
          <Label htmlFor={testnetsId}>Testnets Only</Label>
        </div>
      </RadioGroup>
    </FilterSection>
  );

  if (sectionOnly) {
    return section;
  }

  return (
    <Popover>
      <div className="relative">
        <PopoverTrigger asChild>
          <Button
            className={
              value === "all" ? "bg-card" : "border-active-border bg-card pr-11"
            }
            variant="outline"
          >
            {value === "mainnets"
              ? "Mainnets Only"
              : value === "testnets"
                ? "Testnets Only"
                : "Chain Type"}
            {value === "all" && <ChevronDownIcon className="ml-2 size-4" />}
          </Button>
        </PopoverTrigger>
        {value !== "all" && (
          <Button
            className="absolute top-[1px] right-[1px] bottom-[1px] h-auto w-10 bg-card"
            onClick={() => {
              const url = makeUrl("all");
              router.replace(url);
            }}
            size="icon"
            variant="ghost"
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </div>
      <PopoverContent
        align="end"
        className="mt-0.5 flex max-w-full flex-col gap-4"
      >
        {section}
      </PopoverContent>
    </Popover>
  );
};

// chain options filter
type ChainOptionsFilterProps = { sectionOnly?: boolean };

export const ChainOptionsFilter: React.FC<ChainOptionsFilterProps> = ({
  sectionOnly,
}) => {
  const router = useDashboardRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mutableSearchParams = useMemo(() => {
    return new URLSearchParams(searchParams ?? undefined);
  }, [searchParams]);

  const hasDeprecated = useMemo(() => {
    return searchParams?.has("includeDeprecated") || false;
  }, [searchParams]);

  const deprecatedId = useId();

  const section = (
    <FilterSection title="Options">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={hasDeprecated}
          id={deprecatedId}
          onClick={() => {
            if (!hasDeprecated) {
              mutableSearchParams.set("includeDeprecated", "true");
            } else {
              mutableSearchParams.delete("includeDeprecated");
            }
            mutableSearchParams.delete("page");
            const url = cleanUrl(
              `${pathname}?${mutableSearchParams.toString()}`,
            );
            router.replace(url);
          }}
        />
        <Label
          className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor={deprecatedId}
        >
          Include Deprecated
        </Label>
      </div>
    </FilterSection>
  );

  if (sectionOnly) {
    return section;
  }

  // TODO: later more filters
  const hasFilters = hasDeprecated;

  return (
    <Popover>
      <div className="relative">
        <PopoverTrigger asChild>
          <Button
            className={
              hasFilters ? "border-active-border bg-card pr-11" : "bg-card"
            }
            variant="outline"
          >
            Chain Options
            {!hasFilters && <ChevronDownIcon className="ml-2 size-4" />}
          </Button>
        </PopoverTrigger>
        {hasFilters && (
          <Button
            className="absolute top-[1px] right-[1px] bottom-[1px] h-auto w-10 bg-card"
            onClick={() => {
              mutableSearchParams.delete("includeDeprecated");
              mutableSearchParams.delete("page");
              const url = cleanUrl(
                `${pathname}?${mutableSearchParams.toString()}`,
              );
              router.replace(url);
            }}
            size="icon"
            variant="ghost"
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </div>
      <PopoverContent
        align="end"
        className="mt-0.5 flex max-w-full flex-col gap-4"
      >
        {section}
      </PopoverContent>
    </Popover>
  );
};

function isServiceActive(searchParams: URLSearchParams, service: string) {
  return searchParams.getAll("service").includes(service);
}

function toggleService(searchParams: URLSearchParams, service: string) {
  if (searchParams.getAll("service").includes(service)) {
    searchParams.delete("service", service);
  } else {
    searchParams.append("service", service);
  }
}

type ChainServiceFilterProps = { sectionOnly?: boolean };

export const ChainServiceFilter: React.FC<ChainServiceFilterProps> = ({
  sectionOnly,
}) => {
  const router = useDashboardRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mutableSearchParams = useMemo(() => {
    return new URLSearchParams(searchParams ?? undefined);
  }, [searchParams]);

  const section = (
    <FilterSection title="Services">
      {services.map((product) => (
        <div className="group flex items-center gap-2" key={product.id}>
          <Checkbox
            checked={isServiceActive(mutableSearchParams, product.id)}
            id={product.id}
            onClick={() => {
              toggleService(mutableSearchParams, product.id);
              mutableSearchParams.delete("page");
              const url = cleanUrl(
                `${pathname}?${mutableSearchParams.toString()}`,
              );
              router.push(url);
            }}
          />
          <Label
            className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor={product.id}
          >
            {product.name}
          </Label>
          <Button
            className="ml-auto rounded-full group-hover:opacity-100 lg:opacity-0"
            onClick={() => {
              mutableSearchParams.delete("service");
              mutableSearchParams.append("service", product.id);
              mutableSearchParams.delete("page");
              const url = cleanUrl(
                `${pathname}?${mutableSearchParams.toString()}`,
              );
              router.push(url);
            }}
            size="sm"
            variant="ghost"
          >
            Only
          </Button>
        </div>
      ))}
    </FilterSection>
  );

  const [buttonTitle, hasActiveFilter] = useMemo(() => {
    const allFilters = searchParams?.getAll("service") || [];
    if (allFilters.length === 0) {
      return ["Services", false];
    }

    const firstFilter = allFilters[0];
    const name = services.find((p) => p.id === firstFilter)?.name;
    const plus = allFilters.length > 1 ? ` +${allFilters.length - 1}` : "";

    return [`${name}${plus}`, true];
  }, [searchParams]);

  if (sectionOnly) {
    return section;
  }

  return (
    <Popover>
      <div className="relative">
        <PopoverTrigger asChild>
          <Button
            className={
              hasActiveFilter ? "border-active-border bg-card pr-11" : "bg-card"
            }
            variant="outline"
          >
            {buttonTitle}
            {!hasActiveFilter && <ChevronDownIcon className="ml-2 size-4" />}
          </Button>
        </PopoverTrigger>
        {hasActiveFilter && (
          <Button
            className="absolute top-[1px] right-[1px] bottom-[1px] h-auto w-10"
            onClick={() => {
              mutableSearchParams.delete("service");
              mutableSearchParams.delete("page");
              const url = cleanUrl(
                `${pathname}?${mutableSearchParams.toString()}`,
              );
              router.replace(url);
            }}
            size="icon"
            variant="ghost"
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </div>
      <PopoverContent
        align="end"
        className="mt-0.5 flex max-w-full flex-col gap-4"
      >
        {section}
      </PopoverContent>
    </Popover>
  );
};
