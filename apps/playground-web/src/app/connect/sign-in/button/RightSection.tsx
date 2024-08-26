import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ethereum } from "thirdweb/chains";
import {
  ConnectButton,
  type ConnectButtonProps,
  ConnectEmbed,
  darkTheme,
  lightTheme,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
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
}) {
  const [previewTab, setPreviewTab] = useState<"modal" | "button" | "code">(
    "modal",
  );
  const { connectOptions } = props;
  const wallet = useActiveWallet();
  const account = useActiveAccount();

  // fake login for playground
  const playgroundAuth: ConnectButtonProps["auth"] = {
    async doLogin() {
      localStorage.setItem("playground-loggedin", "true");
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
      return !!localStorage.getItem("playground-loggedin");
    },
  };

  const { isLoggedIn, doLogout } = useSiweAuth(wallet, account, playgroundAuth);

  const { disconnect } = useDisconnect();
  useEffect(() => {
    if (wallet && previewTab === "modal") {
      if (connectOptions.enableAuth) {
        if (isLoggedIn) {
          disconnect(wallet);
          doLogout();
        }
      } else {
        disconnect(wallet);
        doLogout();
      }
    }
  }, [
    wallet,
    disconnect,
    previewTab,
    isLoggedIn,
    connectOptions.enableAuth,
    doLogout,
  ]);

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

  return (
    <div className="flex flex-col xl:w-[764px] gap-4 shrink-0 xl:max-h-[100vh] xl:sticky xl:top-0">
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
          "flex justify-center grow rounded-lg relative min-h-[300px]",
          previewTab === "modal" && "scale-75 lg:scale-100",
          previewTab !== "code" && "items-center",
        )}
      >
        <BackgroundPattern />

        {previewTab === "modal" && (
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
              accountAbstraction={
                connectOptions.enableAccountAbstraction
                  ? {
                      chain: ethereum,
                      sponsorGas: true,
                    }
                  : undefined
              }
              termsOfServiceUrl={connectOptions.termsOfServiceLink}
              privacyPolicyUrl={connectOptions.privacyPolicyLink}
              showThirdwebBranding={connectOptions.ShowThirdwebBranding}
            />
            {/* Fake X icon to make it looks exactly like a modal  */}
            <XIcon
              className="absolute top-6 right-6 cursor-not-allowed size-6"
              style={{
                color: themeObj.colors.secondaryIconColor,
              }}
            />
          </div>
        )}

        {previewTab === "button" && (
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
            }}
            wallets={wallets}
            auth={connectOptions.enableAuth ? playgroundAuth : undefined}
            accountAbstraction={
              connectOptions.enableAccountAbstraction
                ? {
                    chain: ethereum,
                    sponsorGas: true,
                  }
                : undefined
            }
          />
        )}

        {previewTab === "code" && <CodeGen connectOptions={connectOptions} />}
      </div>
    </div>
  );
}

/**
 * @internal
 */
export function getWallets(connectOptions: ConnectPlaygroundOptions) {
  const wallets = [...connectOptions.walletIds.map((id) => createWallet(id))];

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
      <div className="flex justify-start md:inline-flex p-2 rounded-lg gap-1 border bg-muted shadow-md">
        {props.tabs.map((tab) => (
          <Button
            key={tab.name}
            onClick={tab.onClick}
            variant="ghost"
            className={cn(
              "gap-2 px-4 text-base",
              tab.isActive
                ? "text-foreground bg-accent"
                : "text-muted-foreground bg-transparent",
            )}
          >
            {tab.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
