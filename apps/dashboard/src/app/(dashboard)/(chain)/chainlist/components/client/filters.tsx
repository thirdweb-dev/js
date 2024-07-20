"use client";

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
import { ChevronDownIcon, Filter, XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { type PropsWithChildren, useCallback, useMemo } from "react";
import { products } from "../../../components/server/products";

function cleanUrl(url: string) {
  if (url.endsWith("?")) {
    return url.slice(0, -1);
  }
  return url;
}

export function AllFilters() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-auto h-10 gap-2 p-2 lg:px-4 lg:py-2 lg:h-10 lg:border-0"
        >
          <Filter strokeWidth={1} className="lg:size-4" />
          <span className="hidden lg:inline">All Filters</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="flex flex-col gap-4 mt-0.5 max-w-full"
      >
        <h3 className="font-bold">Filters</h3>

        {/* Chain Type */}
        <ChainTypeFilter sectionOnly />

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mutableSearchParams = useMemo(() => {
    return new URLSearchParams(searchParams ?? undefined);
  }, [searchParams]);

  return (
    <Button
      variant="outline"
      size="sm"
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
      <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = useMemo(
    () => searchParams?.get("type") || "all",
    [searchParams],
  );

  const makeUrl = useCallback(
    (newValue: string) => {
      const params = new URLSearchParams(searchParams || undefined);
      switch (newValue) {
        case "mainnet":
        case "testnet": {
          params.set("type", newValue);
          break;
        }
        default: {
          params.delete("type");
        }
      }
      // reset page alway
      params.delete("page");
      return cleanUrl(`${pathname}?${params.toString()}`);
    },
    [pathname, searchParams],
  );

  const section = (
    <FilterSection title="Chain Type">
      <RadioGroup
        value={value}
        onValueChange={(newValue) => {
          const url = makeUrl(newValue);
          router.replace(url);
        }}
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all">All Chains</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="mainnet" id="mainnet" />
          <Label htmlFor="mainnet">Mainnets Only</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="testnet" id="testnet" />
          <Label htmlFor="testnet">Testnets Only</Label>
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
            variant="outline"
            className={value === "all" ? undefined : "pr-11 border-primary"}
          >
            {value === "mainnet"
              ? "Mainnets Only"
              : value === "testnet"
                ? "Testnets Only"
                : "Chain Type"}
            {value === "all" && <ChevronDownIcon className="ml-2 size-4" />}
          </Button>
        </PopoverTrigger>
        {value !== "all" && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute h-auto w-10 right-[1px] top-[1px] bottom-[1px]"
            onClick={() => {
              const url = makeUrl("all");
              router.replace(url);
            }}
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </div>
      <PopoverContent
        align="end"
        className="flex flex-col gap-4 mt-0.5 max-w-full"
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mutableSearchParams = useMemo(() => {
    return new URLSearchParams(searchParams ?? undefined);
  }, [searchParams]);

  const hasDeprecated = useMemo(() => {
    return searchParams?.has("includeDeprecated") || false;
  }, [searchParams]);

  const section = (
    <FilterSection title="Options">
      <div className="flex items-center gap-2">
        <Checkbox
          id="deprecated"
          checked={hasDeprecated}
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
          htmlFor="deprecated"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
            variant="outline"
            className={hasFilters ? "pr-11 border-primary" : undefined}
          >
            Chain Options
            {!hasFilters && <ChevronDownIcon className="ml-2 size-4" />}
          </Button>
        </PopoverTrigger>
        {hasFilters && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute h-auto w-10 right-[1px] top-[1px] bottom-[1px]"
            onClick={() => {
              mutableSearchParams.delete("includeDeprecated");
              mutableSearchParams.delete("page");
              const url = cleanUrl(
                `${pathname}?${mutableSearchParams.toString()}`,
              );
              router.replace(url);
            }}
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </div>
      <PopoverContent
        align="end"
        className="flex flex-col gap-4 mt-0.5 max-w-full"
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mutableSearchParams = useMemo(() => {
    return new URLSearchParams(searchParams ?? undefined);
  }, [searchParams]);

  const section = (
    <FilterSection title="Services">
      {products.map((product) => (
        <div className="flex items-center gap-2 group" key={product.id}>
          <Checkbox
            id={product.id}
            checked={isServiceActive(mutableSearchParams, product.id)}
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
            htmlFor={product.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {product.name}
          </Label>
          <Button
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
            className="ml-auto rounded-full lg:opacity-0 group-hover:opacity-100"
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
    const name = products.find((p) => p.id === firstFilter)?.name;
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
            variant="outline"
            className={hasActiveFilter ? "pr-11 border-primary" : undefined}
          >
            {buttonTitle}
            {!hasActiveFilter && <ChevronDownIcon className="ml-2 size-4" />}
          </Button>
        </PopoverTrigger>
        {hasActiveFilter && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute h-auto w-10 right-[1px] top-[1px] bottom-[1px]"
            onClick={() => {
              mutableSearchParams.delete("service");
              mutableSearchParams.delete("page");
              const url = cleanUrl(
                `${pathname}?${mutableSearchParams.toString()}`,
              );
              router.replace(url);
            }}
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </div>
      <PopoverContent
        align="end"
        className="flex flex-col gap-4 mt-0.5 max-w-full"
      >
        {section}
      </PopoverContent>
    </Popover>
  );
};
