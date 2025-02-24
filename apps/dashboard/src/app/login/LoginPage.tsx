"use client";

import { redirectToCheckout } from "@/actions/billing";
import { getRawAccountAction } from "@/actions/getAccount";
import { ToggleThemeButton } from "@/components/color-mode-toggle";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { TURNSTILE_SITE_KEY } from "@/constants/env";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { Turnstile } from "@marsidev/react-turnstile";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Suspense, lazy, useEffect, useState } from "react";
import { ConnectEmbed, useActiveWalletConnectionStatus } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { ClientOnly } from "../../components/ClientOnly/ClientOnly";
import { ThirdwebMiniLogo } from "../components/ThirdwebMiniLogo";
import { getSDKTheme } from "../components/sdk-component-theme";
import { doLogin, doLogout, getLoginPayload, isLoggedIn } from "./auth-actions";
import { isOnboardingComplete } from "./onboarding/isOnboardingRequired";

const LazyOnboardingUI = lazy(
  () => import("./onboarding/on-boarding-ui.client"),
);

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "apple",
        "facebook",
        "github",
        "email",
        "phone",
        "passkey",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("io.rabby"),
  createWallet("me.rainbow"),
  createWallet("io.zerion.wallet"),
];

export function LoginAndOnboardingPage(props: {
  account: Account | undefined;
  redirectPath: string;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <div className="border-b bg-card">
        <header className="container flex w-full flex-row items-center justify-between px-6 py-4">
          <div className="flex shrink-0 items-center gap-3">
            <ThirdwebMiniLogo className="size-7 md:size-8" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Link
                href="https://portal.thirdweb.com/"
                className="px-2 text-muted-foreground text-sm hover:text-foreground"
                target="_blank"
              >
                Docs
              </Link>

              <Link
                href="/support"
                target="_blank"
                className="px-2 text-muted-foreground text-sm hover:text-foreground"
              >
                Support
              </Link>

              <Link
                target="_blank"
                href="https://feedback.thirdweb.com"
                className="px-2 text-muted-foreground text-sm hover:text-foreground"
              >
                Feedback
              </Link>
            </div>
            <ToggleThemeButton />
          </div>
        </header>
      </div>

      <LoginAndOnboardingPageContent
        account={props.account}
        redirectPath={props.redirectPath}
      />
    </div>
  );
}

export function LoginAndOnboardingPageContent(props: {
  account: Account | undefined;
  redirectPath: string;
}) {
  return (
    <div className="relative flex grow flex-col">
      <main className="container z-10 flex grow flex-col justify-center gap-6 py-12">
        <ClientOnly
          ssr={
            <div className="flex justify-center">
              <LoadingCard />
            </div>
          }
          className="flex justify-center"
        >
          <PageContent
            redirectPath={props.redirectPath}
            account={props.account}
          />
        </ClientOnly>
      </main>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        src="/assets/login/background.svg"
        className="-bottom-12 -right-12 pointer-events-none fixed lg:right-0 lg:bottom-0"
      />
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="flex min-h-[522px] w-full items-center justify-center rounded-xl border border-border bg-card shadow-lg max-sm:max-w-[358px] lg:min-h-[568px] lg:w-[728px]">
      <Spinner className="size-10" />
    </div>
  );
}

function PageContent(props: {
  redirectPath: string;
  account: Account | undefined;
}) {
  const [screen, setScreen] = useState<
    | { id: "login" }
    | {
        id: "onboarding";
        account: Account;
      }
    | {
        id: "complete";
      }
  >({ id: "login" });

  const router = useDashboardRouter();
  const connectionStatus = useActiveWalletConnectionStatus();

  function onComplete() {
    setScreen({ id: "complete" });
    router.replace(props.redirectPath);
  }

  async function onLogin() {
    const account = await getRawAccountAction();

    // shouldn't happen - but if account is not found, stay on login page
    if (!account) {
      return;
    }

    if (!isOnboardingComplete(account)) {
      setScreen({
        id: "onboarding",
        account,
      });
    } else {
      onComplete();
    }
  }

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // if suddenly disconnected
    if (connectionStatus !== "connected" && screen.id !== "login") {
      setScreen({ id: "login" });
    }
  }, [connectionStatus, screen.id]);

  if (connectionStatus === "connecting") {
    return <LoadingCard />;
  }

  if (connectionStatus !== "connected" || screen.id === "login") {
    return <CustomConnectEmbed onLogin={onLogin} />;
  }

  if (screen.id === "onboarding") {
    return (
      <Suspense fallback={<LoadingCard />}>
        <LazyOnboardingUI
          account={screen.account}
          onComplete={onComplete}
          redirectPath={props.redirectPath}
          redirectToCheckout={redirectToCheckout}
          onLogout={() => {
            setScreen({ id: "login" });
          }}
          skipShowingPlans={props.redirectPath.startsWith("/join/team")}
        />
      </Suspense>
    );
  }

  return <LoadingCard />;
}

function CustomConnectEmbed(props: {
  onLogin: () => void;
}) {
  const { theme } = useTheme();
  const client = useThirdwebClient();
  const [turnstileToken, setTurnstileToken] = useState("");

  return (
    <div className="flex flex-col items-center gap-4">
      <ConnectEmbed
        auth={{
          getLoginPayload,
          doLogin: async (params) => {
            try {
              const result = await doLogin(params, turnstileToken);
              if (result.error) {
                console.error("Failed to login", result.error, result.context);
                throw new Error(result.error);
              }
              props.onLogin();
            } catch (e) {
              console.error("Failed to login", e);
              throw e;
            }
          },
          doLogout,
          isLoggedIn: async (x) => {
            const isLoggedInResult = await isLoggedIn(x);
            if (isLoggedInResult) {
              props.onLogin();
            }
            return isLoggedInResult;
          },
        }}
        wallets={wallets}
        client={client}
        modalSize="wide"
        theme={getSDKTheme(theme === "light" ? "light" : "dark")}
        className="shadow-lg"
        privacyPolicyUrl="/privacy-policy"
        termsOfServiceUrl="/terms"
      />
      <Turnstile
        options={{
          // only show if interaction is required
          appearance: "interaction-only",
          // match the theme of the rest of the app
          theme: theme === "light" ? "light" : "dark",
        }}
        siteKey={TURNSTILE_SITE_KEY}
        onSuccess={(token) => setTurnstileToken(token)}
      />
    </div>
  );
}
