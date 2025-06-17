"use client";

import { ClientOnly } from "@/components/blocks/client-only";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { nebulaAAOptions } from "@/config/nebula-aa";
import { getSDKTheme } from "@/config/sdk-component-theme";
import { nebulaAppThirdwebClient } from "@/constants/nebula-client";
import { NEXT_PUBLIC_TURNSTILE_SITE_KEY } from "@/constants/public-envs";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { isVercel } from "@/utils/vercel-utils";
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
import {
  doNebulaLogin,
  doNebulaLogout,
  getNebulaLoginPayload,
  isNebulaLoggedIn,
} from "./auth-actions";

export function NebulaLoginPage(props: {
  redirectPath: string;
}) {
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

function NebulaLoginPageContent(props: {
  redirectPath: string;
}) {
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
      <CustomConnectEmbed onLogin={onLogin} client={nebulaAppThirdwebClient} />
    );
  }

  return (
    <CustomConnectEmbed onLogin={onLogin} client={nebulaAppThirdwebClient} />
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
            getLoginPayload: getNebulaLoginPayload,
            doLogin: async (loginPayload) => {
              if (isVercel() && !turnstileToken) {
                setAlwaysShowTurnstile(true);
                throw new Error("Please complete the captcha.");
              }

              try {
                const result = await doNebulaLogin({
                  type: "nebula-app",
                  loginPayload: loginPayload,
                  turnstileToken,
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
            isLoggedIn: async (x) => {
              const isLoggedInResult = await isNebulaLoggedIn(x);
              if (isLoggedInResult) {
                props.onLogin();
              }
              return isLoggedInResult;
            },
          }}
          wallets={loginOptions}
          client={props.client}
          modalSize="wide"
          theme={getSDKTheme(theme === "light" ? "light" : "dark")}
          className="shadow-lg"
          privacyPolicyUrl="/privacy-policy"
          termsOfServiceUrl="/terms"
          accountAbstraction={nebulaAAOptions}
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
