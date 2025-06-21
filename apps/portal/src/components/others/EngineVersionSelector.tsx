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

type Version = "v2" | "v3";
const engineLinks = [
  {
    href: "/engine/v2",
    name: "v2",
  },
  {
    href: "/engine/v3",
    name: "v3",
  },
];

export function EngineVersionSelector(props: { selected: Version }) {
  // biome-ignore lint/style/noNonNullAssertion: guaranteed
  const platform = engineLinks.find((p) => p.name === props.selected)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="inline-flex cursor-pointer gap-2 font-semibold text-base text-foreground">
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
        {engineLinks.map((version) => {
          return (
            <DropdownMenuItem asChild key={version.name}>
              <div
                className={clsx(
                  "relative flex cursor-pointer font-medium text-foreground text-lg",
                  "hover:bg-accent",
                  props.selected === version.name && "bg-muted text-foreground",
                )}
              >
                <div className="flex gap-2">
                  <Link
                    className="before:absolute before:inset-0"
                    href={version.href}
                  >
                    {version.name}
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
