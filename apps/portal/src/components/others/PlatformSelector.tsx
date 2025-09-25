"use client";

import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { connectLinks } from "../../app/Header";

type Platform = (typeof connectLinks)[number]["name"];

export function PlatformSelector(props: { selected: Platform }) {
  // biome-ignore lint/style/noNonNullAssertion: guaranteed
  const platform = connectLinks.find((p) => p.name === props.selected)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex gap-2 font-medium text-sm text-foreground hover:bg-accent justify-between items-center py-1.5 px-2.5 rounded-lg">
          <div className="flex gap-2 items-center">
            <platform.icon className="size-4 text-foreground" />
            {platform.name}
          </div>
          <ChevronDownIcon className="w-4 text-muted-foreground opacity-70" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="flex flex-col gap-1 bg-card p-3 min-w-[200px] rounded-xl"
        sideOffset={6}
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
                  <platform.icon className="size-4 text-foreground" />
                  <Link
                    className="before:absolute before:inset-0 text-sm"
                    href={platform.href}
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
