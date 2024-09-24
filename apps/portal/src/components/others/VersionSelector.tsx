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
import { Button } from "../ui/button";

export function VersionSelector<T extends string>(props: {
  selected: T;
  versions: { name: T; href: string }[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="inline-flex gap-1 pr-1 pl-2 font-medium text-f-300 text-lg hover:text-f-100"
        >
          {props.selected}
          <ChevronDownIcon className="w-4 text-f-300 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="flex flex-col gap-1 bg-b-800 p-3"
        style={{
          minWidth: "150px",
        }}
      >
        {props.versions.map((version) => {
          return (
            <DropdownMenuItem asChild key={version.name}>
              <Link
                href={version.href}
                className={clsx(
                  "flex cursor-pointer font-medium text-f-200 text-lg",
                  "hover:bg-b-600 hover:text-f-100",
                  props.selected === version.name && "bg-b-600 text-f-100",
                )}
              >
                {version.name}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TypeScriptVersionSelector(props: { selected: "v4" | "v5" }) {
  return (
    <div className="flex items-center gap-1">
      <p className="py-5 font-semibold text-f-100 text-lg">TypeScript SDK</p>
      <VersionSelector
        versions={[
          {
            name: "v4",
            href: "/typescript/v4/",
          },
          {
            name: "v5",
            href: "/typescript/v5/",
          },
        ]}
        selected={props.selected}
      />
    </div>
  );
}
