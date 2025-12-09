"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { MoonIcon, SunIcon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { lazy, Suspense, useEffect, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  ConnectEmbed,
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { getRawAccountAction } from "@/actions/account/getAccount";
import {
  doLogin,
  doLogout,
  getLoginPayload,
  isLoggedIn,
} from "@/actions/auth-actions";
import { resetAnalytics } from "@/analytics/reset";
import { ClientOnly } from "@/components/blocks/client-only";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { DotsBackgroundPattern } from "@/components/ui/background-patterns";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { LAST_USED_PROJECT_ID, LAST_USED_TEAM_ID } from "@/constants/cookie";
import { NEXT_PUBLIC_TURNSTILE_SITE_KEY } from "@/constants/public-envs";
import type { Account } from "@/hooks/useApi";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { isAccountOnboardingComplete } from "@/utils/account-onboarding";
import { deleteCookie } from "@/utils/cookie";
import { getSDKTheme } from "@/utils/sdk-component-theme";
import { isVercel } from "@/utils/vercel";
import { ThirdwebMiniLogo } from "../(app)/components/ThirdwebMiniLogo";
import { LAST_VISITED_TEAM_PAGE_PATH } from "../(app)/team/components/last-visited-page/consts";

const LazyAccountOnboarding = lazy(
  () => import("./onboarding/account-onboarding"),
);

const loginOptions = [
  inAppWallet({
    auth: {
      options: ["google", "apple", "facebook", "github", "email", "passkey"],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("io.rabby"),
  createWallet("me.rainbow"),
  createWallet("io.zerion.wallet"),
  createWallet("com.okex.wallet"),
];

const inAppWalletLoginOptions = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "apple",
        "facebook",
        "github",
        "email",
        "passkey",
        "wallet",
      ],
    },
  }),
];

export function LoginAndOnboardingPage(props: {
  account: Account | undefined;
  redirectPath: string;
  loginWithInAppWallet: boolean;
  client: ThirdwebClient;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <div className="bg-background backdrop-blur-lg">
        <header className="container flex w-full flex-row items-center justify-between px-6 py-5 max-w-5xl">
          <div className="flex shrink-0 items-center gap-2">
            <ThirdwebMiniLogo className="size-7 md:size-8" />
            <p className="text-2xl font-semibold tracking-tight hidden md:block">
              thirdweb
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Link
                className="px-2 text-muted-foreground text-sm hover:text-foreground"
                href="https://portal.thirdweb.com/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Docs
              </Link>

              <Link
                className="px-2 text-muted-foreground text-sm hover:text-foreground"
                href="https://feedback.thirdweb.com"
                rel="noopener noreferrer"
                target="_blank"
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
        client={props.client}
        loginWithInAppWallet={props.loginWithInAppWallet}
        redirectPath={props.redirectPath}
      />

      <DotsBackgroundPattern />
      <ResetLastUsedCookies />
    </div>
  );
}

function LoginPageContainer(props: { children: React.ReactNode }) {
  return (
    <main className="container z-10 flex grow flex-col items-center justify-center gap-6 py-24 px-2">
      {props.children}
    </main>
  );
}

function ResetLastUsedCookies() {
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    deleteCookie(LAST_USED_PROJECT_ID);
    deleteCookie(LAST_USED_TEAM_ID);
    deleteCookie(LAST_VISITED_TEAM_PAGE_PATH);
  }, []);
  return null;
}

function LoginAndOnboardingPageContent(props: {
  redirectPath: string;
  account: Account | undefined;
  loginWithInAppWallet: boolean;
  client: ThirdwebClient;
}) {
  const accountAddress = useActiveAccount()?.address;
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

    if (!isAccountOnboardingComplete(account)) {
      setScreen({
        account,
        id: "onboarding",
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

  if (screen.id === "complete") {
    return <GenericLoadingPage className="border-none" />;
  }

  if (connectionStatus === "connecting") {
    return (
      <LoginPageContainer>
        <ConnectEmbedSizedLoadingCard />
      </LoginPageContainer>
    );
  }

  if (
    connectionStatus !== "connected" ||
    screen.id === "login" ||
    !accountAddress
  ) {
    return (
      <LoginPageContainer>
        <CustomConnectEmbed
          client={props.client}
          loginWithInAppWallet={props.loginWithInAppWallet}
          onLogin={onLogin}
        />
      </LoginPageContainer>
    );
  }

  if (screen.id === "onboarding") {
    return (
      <Suspense fallback={<GenericLoadingPage className="border-none" />}>
        <LazyAccountOnboarding
          accountAddress={accountAddress}
          onComplete={onComplete}
          onLogout={() => {
            setScreen({ id: "login" });
          }}
        />
      </Suspense>
    );
  }

  return (
    <LoginPageContainer>
      <CustomConnectEmbed
        client={props.client}
        loginWithInAppWallet={props.loginWithInAppWallet}
        onLogin={onLogin}
      />
    </LoginPageContainer>
  );
}

function CustomConnectEmbed(props: {
  onLogin: () => void;
  loginWithInAppWallet: boolean;
  client: ThirdwebClient;
}) {
  const { theme } = useTheme();
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>(
    undefined,
  );
  const [alwaysShowTurnstile, setAlwaysShowTurnstile] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <Turnstile
        onSuccess={(token) => setTurnstileToken(token)}
        options={{
          // only show if interaction is required
          appearance: alwaysShowTurnstile ? "always" : "interaction-only",
          // match the theme of the rest of the app
          theme: theme === "light" ? "light" : "dark",
        }}
        siteKey={NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      />
      <ClientOnly ssr={<ConnectEmbedSizedLoadingCard />}>
        <ConnectEmbed
          auth={{
            doLogin: async (params) => {
              if (isVercel() && !turnstileToken) {
                setAlwaysShowTurnstile(true);
                throw new Error("Please complete the captcha.");
              }

              try {
                const result = await doLogin(params, turnstileToken);
                if (result.error) {
                  console.error(
                    "Failed to login",
                    result.error,
                    result.context,
                  );
                  throw new Error(result.error);
                }
                props.onLogin();
              } catch (e) {
                console.error("Failed to login", e);
                throw e;
              }
            },
            doLogout: async () => {
              await doLogout();
              resetAnalytics();
            },
            getLoginPayload,
            isLoggedIn: async (x) => {
              const isLoggedInResult = await isLoggedIn(x);
              if (isLoggedInResult) {
                props.onLogin();
              }
              return isLoggedInResult;
            },
          }}
          className="shadow-lg !w-[calc(100vw-2rem)] lg:!w-[728px]"
          client={props.client}
          modalSize="wide"
          privacyPolicyUrl="/privacy-policy"
          autoConnect={false}
          termsOfServiceUrl="/terms"
          theme={getSDKTheme(theme === "light" ? "light" : "dark")}
          wallets={
            props.loginWithInAppWallet ? inAppWalletLoginOptions : loginOptions
          }
        />
      </ClientOnly>
    </div>
  );
}

function ConnectEmbedSizedCard(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[522px] w-full items-center justify-center rounded-xl border border-border bg-card shadow-lg max-sm:max-w-[358px] lg:min-h-[568px] lg:w-[728px]">
      {props.children}
    </div>
  );
}

function ConnectEmbedSizedLoadingCard() {
  return (
    <ConnectEmbedSizedCard>
      <Spinner className="size-10" />
    </ConnectEmbedSizedCard>
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
