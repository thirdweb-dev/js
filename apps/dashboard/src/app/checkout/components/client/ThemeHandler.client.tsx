"use client";

import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function ThemeHandler() {
  const searchParams = useSearchParams();
  const { setTheme } = useTheme();

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    const theme = searchParams.get("theme");
    if (theme === "light") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [searchParams, setTheme]);

  return null;
}
