"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { ClientOnly } from "@/components/blocks/client-only";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export function ToggleThemeButton(props: { className?: string }) {
  const { setTheme, theme } = useTheme();

  return (
    <ClientOnly
      ssr={<Skeleton className="size-[34px] rounded-full border bg-accent" />}
    >
      <Button
        aria-label="Toggle theme"
        className={cn(
          "h-auto w-auto rounded-full border border-border bg-background p-2",
          props.className,
        )}
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }}
        variant="outline"
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
