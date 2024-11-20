"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "@/hooks/useRouter";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React from "react";
import type { ChainMetadata } from "thirdweb/chains";
import { ChainIcon } from "./ChainIcon";

export function ChainCombobox({ chains }: { chains: ChainMetadata[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(searchParams.get("chainId") ?? "0");

  const onSelect = (value: string) => {
    setOpen(false);
    setValue(value);

    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!value || value === "0") {
      current.delete("chainId");
    } else {
      current.set("chainId", value);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`, params.ecosystem as string);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-full max-w-[250px] justify-between"
        >
          {value === "0" ? (
            "Select chain..."
          ) : (
            <div className="flex items-center truncate">
              <ChainIcon
                iconUrl={
                  chains.find((chain) => chain.chainId.toString() === value)
                    ?.icon?.url
                }
                className="mr-2 h-4 w-auto"
              />
              {value
                ? chains.find((chain) => chain.chainId.toString() === value)
                    ?.name
                : "Select chain..."}
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search chains..." />
          <CommandList>
            <CommandEmpty>No chain found.</CommandEmpty>
            <CommandGroup>
              {chains.map((chain) => (
                <CommandItem
                  className={cn(
                    "my-1",
                    value === chain.chainId.toString()
                      ? "text-medium opacity-100"
                      : "opacity-75",
                  )}
                  key={chain.chainId}
                  value={chain.name}
                  onSelect={(currentValue) => {
                    const chainId =
                      chains.find((chain) => chain.name === currentValue)
                        ?.chainId ?? "";
                    onSelect(
                      chainId.toString() === value ? "0" : chainId?.toString(),
                    );
                  }}
                >
                  <ChainIcon
                    iconUrl={chain.icon?.url}
                    className={cn("mr-3 h-4 w-auto")}
                  />
                  {chain.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
