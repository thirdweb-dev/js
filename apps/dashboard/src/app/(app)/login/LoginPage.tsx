"use client";

import { getRawAccountAction } from "@/actions/getAccount";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { ToggleThemeButton } from "@/components/color-mode-toggle";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { NEXT_PUBLIC_TURNSTILE_SITE_KEY } from "@/constants/public-envs";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { Turnstile } from "@marsidev/react-turnstile";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { isVercel } from "lib/vercel-utils";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Suspense, lazy, useEffect, useState } from "react";
import {
  ConnectEmbed,
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { ThirdwebMiniLogo } from "../components/ThirdwebMiniLogo";
import { getSDKTheme } from "../components/sdk-component-theme";
import { doLogin, doLogout, getLoginPayload, isLoggedIn } from "./auth-actions";
import { isAccountOnboardingComplete } from "./onboarding/isOnboardingRequired";

const LazyAccountOnboarding = lazy(
  () => import("./onboarding/account-onboarding"),
);

const loginOptions = [
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

const inAppWalletLoginOptions = [
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
        "wallet",
      ],
    },
  }),
];

export function LoginAndOnboardingPage(props: {
  account: Account | undefined;
  redirectPath: string;
  loginWithInAppWallet: boolean;
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
        loginWithInAppWallet={props.loginWithInAppWallet}
      />
    </div>
  );
}

function LoginPageContainer(props: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="container z-10 flex grow flex-col items-center justify-center gap-6 py-12">
        {props.children}
      </main>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        src="/assets/login/background.svg"
        className="-bottom-12 -right-12 pointer-events-none fixed lg:right-0 lg:bottom-0"
      />
    </>
  );
}

function LoginAndOnboardingPageContent(props: {
  redirectPath: string;
  account: Account | undefined;
  loginWithInAppWallet: boolean;
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
          onLogin={onLogin}
          loginWithInAppWallet={props.loginWithInAppWallet}
        />
      </LoginPageContainer>
    );
  }

  if (screen.id === "onboarding") {
    return (
      <Suspense fallback={<GenericLoadingPage className="border-none" />}>
        <LazyAccountOnboarding
          onComplete={onComplete}
          onLogout={() => {
            setScreen({ id: "login" });
          }}
          accountAddress={accountAddress}
        />
      </Suspense>
    );
  }

  return (
    <LoginPageContainer>
      <CustomConnectEmbed
        onLogin={onLogin}
        loginWithInAppWallet={props.loginWithInAppWallet}
      />
    </LoginPageContainer>
  );
}

function CustomConnectEmbed(props: {
  onLogin: () => void;
  loginWithInAppWallet: boolean;
}) {
  const { theme } = useTheme();
  const client = useThirdwebClient();
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>(
    undefined,
  );
  const [alwaysShowTurnstile, setAlwaysShowTurnstile] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <Turnstile
        options={{
          // only show if interaction is required
          appearance: alwaysShowTurnstile ? "always" : "interaction-only",
          // match the theme of the rest of the app
          theme: theme === "light" ? "light" : "dark",
        }}
        siteKey={NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        onSuccess={(token) => setTurnstileToken(token)}
      />
      <ClientOnly ssr={<ConnectEmbedSizedLoadingCard />}>
        <ConnectEmbed
          auth={{
            getLoginPayload,
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
            doLogout,
            isLoggedIn: async (x) => {
              const isLoggedInResult = await isLoggedIn(x);
              if (isLoggedInResult) {
                props.onLogin();
              }
              return isLoggedInResult;
            },
          }}
          wallets={
            props.loginWithInAppWallet ? inAppWalletLoginOptions : loginOptions
          }
          client={client}
          modalSize="wide"
          theme={getSDKTheme(theme === "light" ? "light" : "dark")}
          className="shadow-lg"
          privacyPolicyUrl="/privacy-policy"
          termsOfServiceUrl="/terms"
        />
      </ClientOnly>
    </div>
  );
}

function ConnectEmbedSizedCard(props: {
  children: React.ReactNode;
}) {
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
