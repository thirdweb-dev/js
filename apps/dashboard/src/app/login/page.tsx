"use client";

import { ColorModeToggle } from "@/components/color-mode-toggle";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { getAccountPreferences } from "lib/onboarding";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ConnectEmbed } from "thirdweb/react";
import { getCookie } from "../../stores/SyncStoreToCookies";
import { ThirdwebMiniLogo } from "../components/ThirdwebMiniLogo";
import { getSDKTheme } from "../components/sdk-component-theme";
import { doLogin, doLogout, getLoginPayload, isLoggedIn } from "./auth-actions";
import { getProfiles } from "thirdweb/wallets";

export default function LoginPage() {
  return (
    <div className="relative grid h-screen place-items-center bg-muted/30">
      <nav className="absolute top-0 z-20 flex w-full flex-row items-center justify-between px-6 py-4">
        <ThirdwebMiniLogo className="max-h-7" />
        <ColorModeToggle />
      </nav>
      <main className="z-10 flex flex-col gap-6">
        <h1 className="text-center font-semibold text-2xl tracking-tight lg:text-3xl">
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
        className="-bottom-12 -right-12 fixed lg:right-0 lg:bottom-0"
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
  const accountQuery = useAccount();

  async function onLoginSuccessful() {
    const account = await accountQuery.refetch();
    if (!account.data) throw new Error("No account found.");
    const existingAccountPreferences = await getAccountPreferences({
      accountId: account.data.id,
    });

    if (!existingAccountPreferences) {
      const profiles = await getProfiles({ client });

      const email = profiles.find((profile) => profile.details.email)?.details
        .email;
      const params = new URLSearchParams();
      if (email) {
        params.append("email", email);
      }
      if (nextSearchParam) {
        params.append("next", nextSearchParam);
      }
      router.replace(`/onboarding?${params.toString()}`);
      return;
    }

    if (nextSearchParam && isValidRedirectPath(nextSearchParam)) {
      router.replace(nextSearchParam);
      return;
    }

    const dashboardType = getCookie("x-dashboard-type");
    if (dashboardType === "team") {
      router.replace("/team");
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
      privacyPolicyUrl="/privacy"
      termsOfServiceUrl="/tos"
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
