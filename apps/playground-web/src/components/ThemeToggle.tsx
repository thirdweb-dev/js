"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { ClientOnly } from "@/components/ClientOnly";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="border-t pt-2">
      <ClientOnly
        ssr={<Skeleton className="size-[34px] rounded-full border bg-accent" />}
      >
        <Button
          aria-label="Toggle theme"
          className="w-full text-muted-foreground hover:text-foreground px-2 py-1.5 text-left justify-start gap-2 capitalize h-auto font-normal"
          onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark");
          }}
          size="sm"
          variant="ghost"
        >
          {theme === "light" ? (
            <SunIcon className="size-4" />
          ) : (
            <MoonIcon className="size-4" />
          )}

          {theme}
        </Button>
      </ClientOnly>
    </div>
  );
}
