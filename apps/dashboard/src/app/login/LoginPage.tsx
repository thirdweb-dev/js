"use client";

import { redirectToCheckout } from "@/actions/billing";
import { getRawAccountAction } from "@/actions/getAccount";
import { ToggleThemeButton } from "@/components/color-mode-toggle";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import {
  type Account,
  resendEmailClient,
  updateAccountClient,
  verifyEmailClient,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Suspense, lazy, useEffect, useState } from "react";
import {
  ConnectEmbed,
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { apiServerProxy } from "../../@/actions/proxies";
import type { Team } from "../../@/api/team";
import { ClientOnly } from "../../components/ClientOnly/ClientOnly";
import { useTrack } from "../../hooks/analytics/useTrack";
import { ThirdwebMiniLogo } from "../components/ThirdwebMiniLogo";
import { getSDKTheme } from "../components/sdk-component-theme";
import { doLogin, doLogout, getLoginPayload, isLoggedIn } from "./auth-actions";
import { isOnboardingComplete } from "./onboarding/isOnboardingRequired";
import { ConnectEmbedSizedLoadingCard } from "./onboarding/onboarding-container";

const LazyOnboardingUI = lazy(() => import("./onboarding/on-boarding-ui"));

const LazyShowPlansOnboarding = lazy(
  () => import("./onboarding/ShowPlansOnboarding"),
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
              <ConnectEmbedSizedLoadingCard />
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

function PageContent(props: {
  redirectPath: string;
  account: Account | undefined;
}) {
  const accountAddress = useActiveAccount()?.address;
  const trackEvent = useTrack();
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
    return <ConnectEmbedSizedLoadingCard />;
  }

  if (
    connectionStatus !== "connected" ||
    screen.id === "login" ||
    !accountAddress
  ) {
    return <CustomConnectEmbed onLogin={onLogin} />;
  }

  if (screen.id === "onboarding") {
    // when Logging in with in-app wallet, emailConfirmedAt is filled directly
    // skip directly to showing the plans instead of going through the full onboarding flow
    if (screen.account.emailConfirmedAt) {
      return (
        <Suspense fallback={<ConnectEmbedSizedLoadingCard />}>
          <LazyShowPlansOnboarding
            accountId={screen.account.id}
            onComplete={onComplete}
            redirectPath={props.redirectPath}
            redirectToCheckout={redirectToCheckout}
          />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<ConnectEmbedSizedLoadingCard />}>
        <LazyOnboardingUI
          onComplete={onComplete}
          redirectPath={props.redirectPath}
          redirectToCheckout={redirectToCheckout}
          accountAddress={accountAddress}
          loginOrSignup={async (params) => {
            await updateAccountClient(params);
          }}
          verifyEmail={verifyEmailClient}
          resendEmailConfirmation={async () => {
            await resendEmailClient();
          }}
          skipOnboarding={() => {
            updateAccountClient({
              onboardSkipped: true,
            });
          }}
          trackEvent={trackEvent}
          requestLinkWallet={async (email) => {
            await updateAccountClient({
              email,
              linkWallet: true,
            });
          }}
          // TODO: set this to true if the account has confirmed email
          shouldSkipEmailOnboarding={false}
          sendTeamOnboardingData={async (params) => {
            const teamsRes = await apiServerProxy<{
              result: Team[];
            }>({
              pathname: "/v1/teams",
              method: "GET",
            });

            if (!teamsRes.ok) {
              throw new Error(teamsRes.error);
            }

            const team = teamsRes.data.result[0];

            if (!team) {
              throw new Error("No team found");
            }

            const teamOnboardRes = await apiServerProxy({
              pathname: `/v1/teams/${team.id}/onboard`,
              method: "PUT",
              body: JSON.stringify(params),
            });

            if (!teamOnboardRes.ok) {
              throw new Error(teamOnboardRes.error);
            }
          }}
        />
      </Suspense>
    );
  }

  return <ConnectEmbedSizedLoadingCard />;
}

function CustomConnectEmbed(props: {
  onLogin: () => void;
}) {
  const { theme } = useTheme();
  const client = useThirdwebClient();

  return (
    <ConnectEmbed
      auth={{
        getLoginPayload,
        doLogin: async (params) => {
          try {
            await doLogin(params);
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
  );
}
