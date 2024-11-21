"use client";

import { getRawAccountAction } from "@/actions/getAccount";
import { ColorModeToggle } from "@/components/color-mode-toggle";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { useTheme } from "next-themes";
import { Suspense, lazy, useState } from "react";
import { ConnectEmbed, useActiveWalletConnectionStatus } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { ClientOnly } from "../../components/ClientOnly/ClientOnly";
import { ThirdwebMiniLogo } from "../components/ThirdwebMiniLogo";
import { getSDKTheme } from "../components/sdk-component-theme";
import { doLogin, doLogout, getLoginPayload, isLoggedIn } from "./auth-actions";
import { isOnboardingComplete } from "./isOnboardingRequired";

const LazyOnboardingUI = lazy(
  () => import("../../components/onboarding/on-boarding-ui.client"),
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
  nextPath: string | undefined;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="border-b bg-background">
        <header className="container flex w-full flex-row items-center justify-between px-6 py-4">
          <div className="flex shrink-0 items-center gap-3">
            <ThirdwebMiniLogo className="size-7 md:size-8" />
            <h1 className="font-medium text-lg tracking-tight md:text-xl">
              Get started with thirdweb
            </h1>
          </div>
          <ColorModeToggle />
        </header>
      </div>

      <main className="z-10 flex grow flex-col items-center justify-center gap-6 py-12">
        <ClientOnly ssr={<LoadingCard />}>
          <PageContent nextPath={props.nextPath} account={props.account} />
        </ClientOnly>
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

function LoadingCard() {
  return (
    <div className="flex min-h-[450px] w-[calc(100vw-60px)] max-w-[500px] items-center justify-center rounded-lg border border-border bg-background">
      <Spinner className="size-10" />
    </div>
  );
}

function PageContent(props: {
  nextPath: string | undefined;
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
  >(
    props.account
      ? { id: "onboarding", account: props.account }
      : { id: "login" },
  );

  const router = useDashboardRouter();
  const connectionStatus = useActiveWalletConnectionStatus();

  function onComplete() {
    setScreen({ id: "complete" });
    if (props.nextPath && isValidRedirectPath(props.nextPath)) {
      router.replace(props.nextPath);
    } else {
      router.replace("/team");
    }
  }

  if (connectionStatus === "connecting") {
    return <LoadingCard />;
  }

  if (connectionStatus !== "connected" || screen.id === "login") {
    return <CustomConnectEmbed onLogin={onLogin} />;
  }

  if (screen.id === "onboarding") {
    return (
      <Suspense fallback={<LoadingCard />}>
        <LazyOnboardingUI account={screen.account} onComplete={onComplete} />
      </Suspense>
    );
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

  return <LoadingCard />;
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
    // double slash could be interpreted as `//example.com` which is not allowed
    return decodedPath.startsWith("/") && !decodedPath.startsWith("//");
  } catch {
    // If decoding fails, return false
    return false;
  }
}
