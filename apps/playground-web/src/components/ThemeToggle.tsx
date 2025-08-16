"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { ClientOnly } from "@/components/ClientOnly";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          aria-label="Toggle theme"
          className="w-full text-muted-foreground hover:text-foreground px-2 py-1.5 text-left justify-start gap-2 capitalize h-auto font-normal"
          onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark");
          }}
        >
          <ClientOnly ssr={<Skeleton className="size-4" />}>
            {theme === "light" ? (
              <SunIcon className="size-4" />
            ) : (
              <MoonIcon className="size-4" />
            )}
          </ClientOnly>

          <ClientOnly ssr={<Skeleton className="w-16 h-4" />}>
            <span>{theme}</span>
          </ClientOnly>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
