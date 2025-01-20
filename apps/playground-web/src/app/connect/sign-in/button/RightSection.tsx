import { abstractWallet } from "@abstract-foundation/agw-react/thirdweb";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
  sepolia,
} from "thirdweb/chains";
import {
  ConnectButton,
  type ConnectButtonProps,
  ConnectEmbed,
  darkTheme,
  lightTheme,
  useActiveAccount,
  useActiveWallet,
} from "thirdweb/react";
import { useSiweAuth } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { Button } from "../../../../components/ui/button";
import { THIRDWEB_CLIENT } from "../../../../lib/client";
import { cn } from "../../../../lib/utils";
import { CodeGen } from "../components/CodeGen";
import type { ConnectPlaygroundOptions } from "../components/types";

export function RightSection(props: {
  connectOptions: ConnectPlaygroundOptions;
  tab?: string;
}) {
  const router = useRouter();
  const previewTab = useMemo(
    () =>
      ["modal", "button", "code"].includes(props.tab || "")
        ? (props.tab as "modal" | "button" | "code")
        : "modal",
    [props.tab],
  );
  const setPreviewTab = (tab: "modal" | "button" | "code") => {
    router.push(`/connect/sign-in?tab=${tab}`);
  };
  const { connectOptions } = props;
  const wallet = useActiveWallet();
  const account = useActiveAccount();

  // fake login for playground
  const playgroundAuth: ConnectButtonProps["auth"] = {
    async doLogin() {
      try {
        localStorage.setItem("playground-loggedin", "true");
      } catch {
        // ignore
      }
    },
    async doLogout() {
      localStorage.removeItem("playground-loggedin");
    },
    async getLoginPayload(params) {
      return {
        domain: "",
        address: params.address,
        statement: "",
        version: "",
        nonce: "",
        issued_at: "",
        expiration_time: "",
        invalid_before: "",
      };
    },
    async isLoggedIn() {
      try {
        return !!localStorage.getItem("playground-loggedin");
      } catch {
        return false;
      }
    },
  };

  const { isLoggedIn, doLogout } = useSiweAuth(wallet, account, playgroundAuth);

  const wallets = getWallets(props.connectOptions);

  const themeObj =
    connectOptions.theme.type === "dark"
      ? darkTheme({
          colors: connectOptions.theme.darkColorOverrides,
        })
      : lightTheme({
          colors: connectOptions.theme.lightColorOverrides,
        });

  useEffect(() => {
    if (!connectOptions.enableAuth) {
      doLogout();
    }
  }, [connectOptions.enableAuth, doLogout]);

  const connectButton = (
    <ConnectButton
      client={THIRDWEB_CLIENT}
      autoConnect={false}
      theme={themeObj}
      locale={connectOptions.localeId}
      connectButton={{
        label: connectOptions.buttonLabel,
      }}
      connectModal={{
        size: connectOptions.modalSize,
        title: connectOptions.modalTitle,
        titleIcon: connectOptions.modalTitleIcon,
        termsOfServiceUrl: connectOptions.termsOfServiceLink,
        privacyPolicyUrl: connectOptions.privacyPolicyLink,
        showThirdwebBranding: connectOptions.ShowThirdwebBranding,
        requireApproval: connectOptions.requireApproval,
      }}
      chains={[sepolia, baseSepolia, optimismSepolia, arbitrumSepolia]}
      wallets={wallets}
      auth={connectOptions.enableAuth ? playgroundAuth : undefined}
      accountAbstraction={
        connectOptions.enableAccountAbstraction
          ? {
              chain: sepolia,
              sponsorGas: true,
            }
          : undefined
      }
    />
  );

  return (
    <div className="flex shrink-0 flex-col gap-4 xl:sticky xl:top-0 xl:max-h-[100vh] xl:w-[764px]">
      <TabButtons
        tabs={[
          {
            name: "Modal",
            isActive: previewTab === "modal",
            onClick: () => setPreviewTab("modal"),
          },
          {
            name: "Button",
            isActive: previewTab === "button",
            onClick: () => setPreviewTab("button"),
          },
          {
            name: "Code",
            isActive: previewTab === "code",
            onClick: () => setPreviewTab("code"),
          },
        ]}
      />

      <div
        className={cn(
          "relative flex min-h-[300px] grow justify-center rounded-lg",
          previewTab === "modal" && "scale-75 lg:scale-100",
          previewTab !== "code" && "items-center",
        )}
      >
        <BackgroundPattern />

        {previewTab === "modal" &&
          (account && (!connectOptions.enableAuth || isLoggedIn) ? (
            // TODO: should show the expanded connected modal here instead
            connectButton
          ) : (
            <div className="relative">
              <ConnectEmbed
                client={THIRDWEB_CLIENT}
                autoConnect={false}
                modalSize={connectOptions.modalSize}
                theme={themeObj}
                className="shadow-xl"
                wallets={wallets}
                header={{
                  title: connectOptions.modalTitle,
                  titleIcon: connectOptions.modalTitleIcon,
                }}
                locale={connectOptions.localeId}
                auth={connectOptions.enableAuth ? playgroundAuth : undefined}
                chains={[
                  sepolia,
                  baseSepolia,
                  optimismSepolia,
                  arbitrumSepolia,
                ]}
                accountAbstraction={
                  connectOptions.enableAccountAbstraction
                    ? {
                        chain: sepolia,
                        sponsorGas: true,
                      }
                    : undefined
                }
                termsOfServiceUrl={connectOptions.termsOfServiceLink}
                privacyPolicyUrl={connectOptions.privacyPolicyLink}
                showThirdwebBranding={connectOptions.ShowThirdwebBranding}
                requireApproval={connectOptions.requireApproval}
              />
              {/* Fake X icon to make it looks exactly like a modal  */}
              <XIcon
                className="absolute top-6 right-6 size-6 cursor-not-allowed"
                style={{
                  color: themeObj.colors.secondaryIconColor,
                }}
              />
            </div>
          ))}

        {previewTab === "button" && connectButton}

        {previewTab === "code" && <CodeGen connectOptions={connectOptions} />}
      </div>
    </div>
  );
}

/**
 * @internal
 */
export function getWallets(connectOptions: ConnectPlaygroundOptions) {
  const wallets = [
    ...connectOptions.walletIds.map((id) => {
      if (id === "xyz.abs") {
        return abstractWallet();
      }
      return createWallet(id);
    }),
  ];

  if (
    connectOptions.inAppWallet.enabled &&
    connectOptions.inAppWallet.methods.length > 0
  ) {
    wallets.push(
      createWallet("inApp", {
        auth: {
          options: connectOptions.inAppWallet.methods,
        },
      }),
    );
  }

  return wallets;
}

function BackgroundPattern() {
  const color = "hsl(var(--foreground)/15%)";
  return (
    <div
      className="absolute inset-0 z-[-1]"
      style={{
        backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        maskImage:
          "radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 60%)",
      }}
    />
  );
}

function TabButtons(props: {
  tabs: Array<{
    name: string;
    isActive: boolean;
    onClick: () => void;
  }>;
}) {
  return (
    <div>
      <div className="flex justify-start gap-1 rounded-lg border bg-muted p-2 shadow-md md:inline-flex">
        {props.tabs.map((tab) => (
          <Button
            key={tab.name}
            onClick={tab.onClick}
            variant="ghost"
            className={cn(
              "gap-2 px-4 text-base",
              tab.isActive
                ? "bg-accent text-foreground"
                : "bg-transparent text-muted-foreground",
            )}
          >
            {tab.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
