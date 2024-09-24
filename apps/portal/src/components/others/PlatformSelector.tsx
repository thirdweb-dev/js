"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
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
        <div className="inline-flex cursor-pointer gap-2 font-semibold text-base text-f-100 hover:text-accent-500">
          {/* <div className="flex gap-2 items-center"> */}
          <Image
            src={platform.icon}
            alt=""
            className="size-6"
            width={20}
            height={20}
          />
          {platform.name}
          {/* </div> */}

          <ChevronDownIcon className="w-4 text-f-300 opacity-70" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="flex flex-col gap-1 bg-b-800 p-3"
        style={{
          minWidth: "150px",
        }}
      >
        {connectLinks.map((platform) => {
          return (
            <DropdownMenuItem asChild key={platform.name}>
              <Link
                href={platform.href}
                className={clsx(
                  "flex cursor-pointer font-medium text-f-200 text-lg",
                  "hover:bg-b-600 hover:text-f-100",
                  props.selected === platform.name && "bg-b-600 text-f-100",
                )}
              >
                <div className="flex gap-3">
                  <Image
                    src={platform.icon}
                    alt=""
                    className="size-5"
                    width={20}
                    height={20}
                  />
                  {platform.name}
                </div>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
