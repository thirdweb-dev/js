"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "../../components/ClientOnly/ClientOnly";
import { Skeleton } from "./ui/skeleton";

export function ColorModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
      aria-label="Toggle theme"
    >
      <ClientOnly ssr={<Skeleton className="size-6 bg-accent border" />}>
        {theme === "light" ? (
          <Sun strokeWidth={1} className="size-6" />
        ) : (
          <Moon strokeWidth={1} className="size-6" />
        )}
      </ClientOnly>
    </Button>
  );
}
