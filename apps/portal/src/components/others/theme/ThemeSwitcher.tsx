"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";

export function ThemeSwitcher(props: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("website-theme");
      if (storedTheme === "dark" || storedTheme === "light") {
        setTheme(storedTheme);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <Button
      aria-label="Toggle theme"
      onClick={() => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.body.dataset.theme = newTheme;
        try {
          localStorage.setItem("website-theme", newTheme);
        } catch {
          // ignore
        }
      }}
      variant="outline"
      className={cn("p-2", props.className)}
    >
      {theme === "light" ? (
        <SunIcon className="size-6" />
      ) : (
        <MoonIcon className="size-6" />
      )}
    </Button>
  );
}
