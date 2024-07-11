"use client";

import { ColorModeToggle } from "@/components/color-mode-toggle";
import { thirdwebClient } from "@/constants/client";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ConnectEmbed, darkTheme, lightTheme } from "thirdweb/react";
import { ThirdwebMiniLogo } from "../components/ThirdwebMiniLogo";
import { doLogin, doLogout, getLoginPayload, isLoggedIn } from "./auth-actions";

export default function LoginPage() {
  return (
    <div className="bg-background h-full">
      <nav className="fixed top-0 w-full flex flex-row justify-between items-center px-6 py-4 z-20">
        <ThirdwebMiniLogo className="max-h-7" />
        <ColorModeToggle />
      </nav>
      <main className="h-full relative grid place-items-center">
        <div className="flex flex-col gap-8 z-10">
          <h1 className="font-semibold text-2xl">Get started with thirdweb</h1>
          <Suspense>
            <CustomConnectEmmbed />
          </Suspense>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          src="/assets/login/background.svg"
          className="fixed bottom-0 right-0"
        />
      </main>
    </div>
  );
}

function CustomConnectEmmbed() {
  const isLG = useMediaQuery("(min-width: 1024px)");
  const searchParams = useSearchParams();
  const { theme } = useTheme();
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
      theme={
        theme === "light"
          ? lightTheme({
              colors: {
                primaryButtonBg: "hsl(var(--primary))",
                modalBg: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                secondaryButtonBg: "hsl(var(--secondary))",
                secondaryButtonHoverBg: "hsl(var(--accent))",
                tertiaryBg: "hsl(var(--accent))",
              },
            })
          : darkTheme({
              colors: {
                primaryButtonBg: "hsl(var(--primary))",
                modalBg: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                secondaryButtonBg: "hsl(var(--secondary))",
                secondaryButtonHoverBg: "hsl(var(--accent))",
                tertiaryBg: "hsl(var(--accent))",
              },
            })
      }
    />
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
