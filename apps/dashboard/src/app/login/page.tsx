"use client";

import { ColorModeToggle } from "@/components/color-mode-toggle";
import { thirdwebClient } from "@/constants/client";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ConnectEmbed } from "thirdweb/react";
import { ThirdwebMiniLogo } from "../components/ThirdwebMiniLogo";
import { doLogin, doLogout, getLoginPayload, isLoggedIn } from "./auth-actions";

export default function LoginPage() {
  return (
    <div className="h-full bg-gradient-to-br from-[#F213A4] to-[#5204BF] p-2 md:p-4 xl:p-6">
      <main className="h-full grid grid-cols-2 xl:grid-cols-3 rounded-2xl">
        <div className="col-span-1 hidden xl:grid bg-card place-items-center rounded-l-3xl my-6 shadow-2xl">
          <ThirdwebLogo key="logo-xl" />
        </div>
        <div className="relative col-span-2 grid place-items-center bg-background rounded-3xl shadow-2xl">
          <div className="absolute top-4 right-4">
            <ColorModeToggle />
          </div>
          <div className="flex flex-col gap-8 items-center ">
            <ThirdwebLogo key="logo-sm" className="flex xl:hidden" />
            <Suspense>
              <CustomConnectEmmbed />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

function CustomConnectEmmbed() {
  const isLG = useMediaQuery("(min-width: 1024px)");
  const searchParams = useSearchParams();
  return (
    <ConnectEmbed
      auth={{
        getLoginPayload,
        doLogin: (params) => doLogin(params, searchParams?.get("next")),
        doLogout,
        isLoggedIn,
      }}
      client={thirdwebClient}
      modalSize={isLG ? "wide" : "compact"}
    />
  );
}

function ThirdwebLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-row items-center gap-4", className)}>
      <ThirdwebMiniLogo
        key="foo"
        className="size-16 md:size-24 flex-shrink-0"
      />
      <h1 className="text-4xl md:text-5xl font-bold">thirdweb</h1>
    </div>
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  // required here
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
