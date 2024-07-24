"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { ClientOnly } from "../../components/ClientOnly/ClientOnly";
import { Skeleton } from "./ui/skeleton";

export function ColorModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <ClientOnly ssr={<Skeleton className="size-10 bg-accent border" />}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }}
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Sun strokeWidth={1} className="size-6" />
        ) : (
          <Moon strokeWidth={1} className="size-6" />
        )}
      </Button>
    </ClientOnly>
  );
}
