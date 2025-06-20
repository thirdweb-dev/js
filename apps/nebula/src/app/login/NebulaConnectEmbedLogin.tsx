"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  ConnectEmbed,
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { ClientOnly } from "@/components/blocks/client-only";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { nebulaAAOptions } from "@/config/nebula-aa";
import { getSDKTheme } from "@/config/sdk-component-theme";
import { nebulaAppThirdwebClient } from "@/constants/nebula-client";
import { NEXT_PUBLIC_TURNSTILE_SITE_KEY } from "@/constants/public-envs";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { isVercel } from "@/utils/vercel-utils";
import {
  doNebulaLogin,
  doNebulaLogout,
  getNebulaLoginPayload,
  isNebulaLoggedIn,
} from "./auth-actions";

export function NebulaLoginPage(props: { redirectPath: string }) {
  return (
    <main className="container z-10 flex grow flex-col items-center justify-center gap-6 py-12">
      <NebulaLoginPageContent {...props} />
    </main>
  );
}

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

function NebulaLoginPageContent(props: { redirectPath: string }) {
  const accountAddress = useActiveAccount()?.address;
  const [screen, setScreen] = useState<
    | { id: "login" }
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
    onComplete();
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
    return <ConnectEmbedSizedLoadingCard />;
  }

  if (
    connectionStatus !== "connected" ||
    screen.id === "login" ||
    !accountAddress
  ) {
    return (
      <CustomConnectEmbed client={nebulaAppThirdwebClient} onLogin={onLogin} />
    );
  }

  return (
    <CustomConnectEmbed client={nebulaAppThirdwebClient} onLogin={onLogin} />
  );
}

function CustomConnectEmbed(props: {
  onLogin: () => void;
  client: ThirdwebClient;
}) {
  const { theme } = useTheme();
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>(
    undefined,
  );
  const [alwaysShowTurnstile, setAlwaysShowTurnstile] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
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
          accountAbstraction={nebulaAAOptions}
          auth={{
            doLogin: async (loginPayload) => {
              if (isVercel() && !turnstileToken) {
                setAlwaysShowTurnstile(true);
                throw new Error("Please complete the captcha.");
              }

              try {
                const result = await doNebulaLogin({
                  loginPayload: loginPayload,
                  turnstileToken,
                  type: "nebula-app",
                });
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
                throw new Error("Failed to login"); // do not show the original error - that will be masked by next.js anyway
              }
            },
            doLogout: doNebulaLogout,
            getLoginPayload: getNebulaLoginPayload,
            isLoggedIn: async (x) => {
              const isLoggedInResult = await isNebulaLoggedIn(x);
              if (isLoggedInResult) {
                props.onLogin();
              }
              return isLoggedInResult;
            },
          }}
          className="shadow-lg"
          client={props.client}
          modalSize="wide"
          privacyPolicyUrl="/privacy-policy"
          termsOfServiceUrl="/terms"
          theme={getSDKTheme(theme === "light" ? "light" : "dark")}
          wallets={loginOptions}
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
