"use client";

import { ClientOnly } from "@/components/blocks/client-only";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Skeleton } from "./ui/skeleton";

export function ToggleThemeButton() {
  const { setTheme, theme } = useTheme();

  return (
    <ClientOnly
      ssr={<Skeleton className="size-[34px] rounded-full border bg-accent" />}
    >
      <Button
        variant="outline"
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }}
        aria-label="Toggle theme"
        className="h-auto w-auto rounded-full border border-border bg-background p-2"
      >
        {theme === "light" ? (
          <SunIcon className="size-4" />
        ) : (
          <MoonIcon className="size-4" />
        )}
      </Button>
    </ClientOnly>
  );
}
