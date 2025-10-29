"use client";
import { Img } from "@workspace/ui/components/img";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { ClientOnly } from "@/components/blocks/client-only";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";
import { payAppThirdwebClient } from "../constants";

export function PayIdPageHeader(props: {
  projectName: string;
  projectIcon: string | undefined;
}) {
  return (
    <div className="border-b border-border/70">
      <header className="container flex max-w-7xl justify-between py-4">
        <div className="flex items-center gap-3">
          {props.projectIcon && (
            <Img
              src={
                resolveSchemeWithErrorHandler({
                  uri: props.projectIcon,
                  client: payAppThirdwebClient,
                }) || ""
              }
              alt=""
              className="rounded-full size-6 object-cover"
            />
          )}

          <h2 className="text-xl font-semibold tracking-tight">
            {props.projectName}
          </h2>
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
