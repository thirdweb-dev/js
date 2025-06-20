"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ThemeSwitcher(props: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const hasMounted = useIsClientMounted();

  return (
    <Button
      aria-label="Toggle theme"
      className={cn("p-2", props.className)}
      onClick={() => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
      }}
      variant="outline"
    >
      {!hasMounted ? (
        <Skeleton className="size-6 lg:size-5" />
      ) : theme === "light" ? (
        <SunIcon className="size-6 lg:size-5" />
      ) : (
        <MoonIcon className="size-6 lg:size-5" />
      )}
    </Button>
  );
}

function useIsClientMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}
