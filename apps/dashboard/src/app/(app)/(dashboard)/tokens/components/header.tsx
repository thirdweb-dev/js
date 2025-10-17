"use client";
import { BookOpenIcon, MoonIcon, SunIcon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ClientOnly } from "@/components/blocks/client-only";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ThirdwebMiniLogo } from "../../../components/ThirdwebMiniLogo";
import { PublicPageConnectButton } from "../../(chain)/[chain_id]/[contractAddress]/public-pages/_components/PublicPageConnectButton";

export function PageHeader(props: { containerClassName?: string }) {
  return (
    <div className="border-b">
      <header
        className={cn(
          "container flex max-w-7xl justify-between py-4",
          props.containerClassName,
        )}
      >
        <div className="flex items-center gap-4">
          <Link className="flex items-center gap-2" href="/team">
            <ThirdwebMiniLogo className="h-5" />
            <span className="hidden font-bold text-2xl tracking-tight lg:block">
              thirdweb
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 lg:gap-2">
            <Link
              href="https://portal.thirdweb.com/bridge"
              target="_blank"
              aria-label="View Documentation"
              className="text-sm text-muted-foreground hover:text-foreground p-2 hover:bg-accent rounded-full transition-all duration-100"
            >
              <BookOpenIcon className="size-5" />
            </Link>
            <ToggleThemeButton />
          </div>
          <PublicPageConnectButton connectButtonClassName="!rounded-full" />
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
