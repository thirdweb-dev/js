"use client";
import { MoonIcon, SunIcon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ClientOnly } from "@/components/blocks/client-only";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ThirdwebMiniLogo } from "../../(app)/components/ThirdwebMiniLogo";

export function PayLandingHeader(props: { containerClassName?: string }) {
  return (
    <div className="border-b border-border/70">
      <header
        className={cn(
          "container flex max-w-7xl justify-between py-4",
          props.containerClassName,
        )}
      >
        <div className="flex items-center gap-6">
          <Link className="flex items-center gap-2" href="/home">
            <ThirdwebMiniLogo className="h-5" />
            <span className="font-bold text-2xl tracking-tight">thirdweb</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:gap-5">
          <ToggleThemeButton />
        </div>
      </header>
    </div>
  );
}

function ToggleThemeButton(props: { className?: string }) {
  const { setTheme, theme } = useTheme();

  return (
    <ClientOnly
      ssr={<Skeleton className="size-[36px] rounded-full border bg-accent" />}
    >
      <Button
        aria-label="Toggle theme"
        className={cn(
          "h-auto w-auto rounded-full p-2 text-muted-foreground hover:text-foreground",
          props.className,
        )}
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }}
        variant="ghost"
      >
        {theme === "light" ? (
          <SunIcon className="size-5 " />
        ) : (
          <MoonIcon className="size-5 " />
        )}
      </Button>
    </ClientOnly>
  );
}
