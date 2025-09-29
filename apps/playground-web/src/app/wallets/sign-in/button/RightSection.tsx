import { abstractWallet } from "@abstract-foundation/agw-react/thirdweb";
import { XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  abstract,
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  ethereum,
  optimism,
  optimismSepolia,
  polygon,
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
  useSiweAuth,
} from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { Button } from "../../../../components/ui/button";
import { THIRDWEB_CLIENT } from "../../../../lib/client";
import { cn } from "../../../../lib/utils";
import { CodeGen } from "../components/CodeGen";
import type { ConnectPlaygroundOptions } from "../components/types";

type Tab = "modal" | "button" | "code";

export function RightSection(props: {
  connectOptions: ConnectPlaygroundOptions;
  tab?: string;
}) {
  const pathname = usePathname();
  const [previewTab, _setPreviewTab] = useState<Tab>(() => {
    return props.tab === "code"
      ? "code"
      : props.tab === "button"
        ? "button"
        : "modal";
  });

  function setPreviewTab(tab: "modal" | "button" | "code") {
    _setPreviewTab(tab);
    window.history.replaceState({}, "", `${pathname}?tab=${tab}`);
  }

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
        address: params.address,
        domain: "",
        expiration_time: "",
        invalid_before: "",
        issued_at: "",
        nonce: "",
        statement: "",
        version: "",
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
      accountAbstraction={
        connectOptions.enableAccountAbstraction
          ? {
              chain: sepolia,
              sponsorGas: true,
            }
          : undefined
      }
      auth={connectOptions.enableAuth ? playgroundAuth : undefined}
      autoConnect={false}
      chains={[
        base,
        ethereum,
        polygon,
        optimism,
        arbitrum,
        abstract,
        sepolia,
        baseSepolia,
        optimismSepolia,
        arbitrumSepolia,
      ]}
      client={THIRDWEB_CLIENT}
      connectButton={{
        label: connectOptions.buttonLabel,
      }}
      connectModal={{
        privacyPolicyUrl: connectOptions.privacyPolicyLink,
        requireApproval: connectOptions.requireApproval,
        showThirdwebBranding: connectOptions.ShowThirdwebBranding,
        size: connectOptions.modalSize,
        termsOfServiceUrl: connectOptions.termsOfServiceLink,
        title: connectOptions.modalTitle,
        titleIcon: connectOptions.modalTitleIcon,
      }}
      locale={connectOptions.localeId}
      theme={themeObj}
      wallets={wallets}
    />
  );

  return (
    <div className="flex shrink-0 flex-col gap-4 xl:sticky xl:top-0 xl:max-h-[100vh] xl:w-[734px]">
      <TabButtons
        tabs={[
          {
            isActive: previewTab === "modal",
            name: "Modal",
            onClick: () => setPreviewTab("modal"),
          },
          {
            isActive: previewTab === "button",
            name: "Button",
            onClick: () => setPreviewTab("button"),
          },
          {
            isActive: previewTab === "code",
            name: "Code",
            onClick: () => setPreviewTab("code"),
          },
        ]}
      />

      <div
        className={cn(
          "relative flex min-h-[300px] grow justify-center rounded-lg",
          previewTab !== "code" && "items-center",
        )}
      >
        <BackgroundPattern />

        {previewTab === "modal" &&
          (account && (!connectOptions.enableAuth || isLoggedIn) ? (
            // TODO: should show the expanded connected modal here instead
            connectButton
          ) : (
            <div className="relative overflow-hidden">
              <ConnectEmbed
                accountAbstraction={
                  connectOptions.enableAccountAbstraction
                    ? {
                        chain: sepolia,
                        sponsorGas: true,
                      }
                    : undefined
                }
                auth={connectOptions.enableAuth ? playgroundAuth : undefined}
                autoConnect={false}
                className="shadow-xl"
                client={THIRDWEB_CLIENT}
                header={{
                  title: connectOptions.modalTitle,
                  titleIcon: connectOptions.modalTitleIcon,
                }}
                locale={connectOptions.localeId}
                modalSize={connectOptions.modalSize}
                privacyPolicyUrl={connectOptions.privacyPolicyLink}
                requireApproval={connectOptions.requireApproval}
                showThirdwebBranding={connectOptions.ShowThirdwebBranding}
                termsOfServiceUrl={connectOptions.termsOfServiceLink}
                theme={themeObj}
                wallets={wallets}
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
function getWallets(connectOptions: ConnectPlaygroundOptions) {
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
      <div className="flex justify-start gap-1 rounded-lg border bg-card p-1 md:inline-flex">
        {props.tabs.map((tab) => (
          <Button
            className={cn(
              "gap-2 px-4",
              tab.isActive
                ? "bg-accent text-foreground"
                : "bg-transparent text-muted-foreground",
            )}
            key={tab.name}
            onClick={tab.onClick}
            variant="ghost"
            size="sm"
          >
            {tab.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
