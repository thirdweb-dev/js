"use client";

import { ColorModeToggle } from "@/components/color-mode-toggle";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ConnectEmbed } from "thirdweb/react";
import { ThirdwebMiniLogo } from "../components/ThirdwebMiniLogo";
import { getSDKTheme } from "../components/sdk-component-theme";
import { doLogin, doLogout, getLoginPayload, isLoggedIn } from "./auth-actions";

export default function LoginPage() {
  return (
    <div className="bg-muted/30 h-screen relative grid place-items-center">
      <nav className="fixed top-0 w-full flex flex-row justify-between items-center px-6 py-4 z-20">
        <ThirdwebMiniLogo className="max-h-7" />
        <ColorModeToggle />
      </nav>
      <main className="flex flex-col gap-6 z-10">
        <h1 className="font-semibold text-2xl lg:text-3xl tracking-tight text-center">
          Get started with thirdweb
        </h1>
        <Suspense>
          <CustomConnectEmmbed />
        </Suspense>
      </main>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        src="/assets/login/background.svg"
        className="fixed -bottom-12 -right-12 lg:bottom-0 lg:right-0"
      />
    </div>
  );
}

function CustomConnectEmmbed() {
  const isLG = useMediaQuery("(min-width: 1024px)");
  const searchParams = useSearchParams();
  const router = useDashboardRouter();
  const { theme } = useTheme();
  const nextSearchParam = searchParams?.get("next");
  const client = useThirdwebClient();

  function onLoginSuccessful() {
    if (nextSearchParam && isValidRedirectPath(nextSearchParam)) {
      router.replace(nextSearchParam);
    } else {
      router.replace("/dashboard");
    }
  }

  return (
    <ConnectEmbed
      auth={{
        getLoginPayload,
        doLogin: async (params) => {
          try {
            await doLogin(params);
            onLoginSuccessful();
          } catch (e) {
            console.error("Failed to login", e);
            throw e;
          }
        },
        doLogout,
        isLoggedIn: async (x) => {
          const isLoggedInResult = await isLoggedIn(x);
          if (isLoggedInResult) {
            onLoginSuccessful();
          }
          return isLoggedInResult;
        },
      }}
      client={client}
      modalSize={isLG ? "wide" : "compact"}
      theme={getSDKTheme(theme === "light" ? "light" : "dark")}
      className="shadow-lg"
    />
  );
}

function isValidRedirectPath(encodedPath: string): boolean {
  try {
    // Decode the URI component
    const decodedPath = decodeURIComponent(encodedPath);
    // ensure the path always starts with a _single_ slash
    // dobule slash could be interpreted as `//example.com` which is not allowed
    return decodedPath.startsWith("/") && !decodedPath.startsWith("//");
  } catch {
    // If decoding fails, return false
    return false;
  }
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
