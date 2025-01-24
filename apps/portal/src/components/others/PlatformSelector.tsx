"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { connectLinks } from "../../app/Header";

export type Platform = (typeof connectLinks)[number]["name"];

export function PlatformSelector(props: {
  selected: Platform;
}) {
  // biome-ignore lint/style/noNonNullAssertion: guaranteed
  const platform = connectLinks.find((p) => p.name === props.selected)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="inline-flex cursor-pointer gap-2 font-semibold text-base text-foreground">
          <platform.icon className="size-5" />
          {platform.name}
          <ChevronDownIcon className="w-4 text-muted-foreground opacity-70" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="flex flex-col gap-1 bg-card p-3"
        style={{
          minWidth: "150px",
        }}
      >
        {connectLinks.map((platform) => {
          return (
            <DropdownMenuItem asChild key={platform.name}>
              <div
                className={clsx(
                  "relative flex cursor-pointer font-medium text-foreground text-lg",
                  "hover:bg-accent",
                  props.selected === platform.name &&
                    "bg-muted text-foreground",
                )}
              >
                <div className="flex gap-2">
                  <platform.icon className="size-5 text-foreground" />
                  <Link
                    href={platform.href}
                    className="before:absolute before:inset-0"
                  >
                    {platform.name}
                  </Link>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
