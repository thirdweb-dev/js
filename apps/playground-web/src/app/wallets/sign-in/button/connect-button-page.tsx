"use client";

import { RectangleHorizontalIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { PageLayout } from "../../../../components/blocks/APIHeader";
import type { ConnectPlaygroundOptions } from "../components/types";
import { LeftSection } from "./LeftSection";
import { RightSection } from "./RightSection";

const defaultInAppLoginMethods: ConnectPlaygroundOptions["inAppWallet"]["methods"] =
  [
    "google",
    "discord",
    "telegram",
    "farcaster",
    "email",
    "x",
    "passkey",
    "phone",
  ];

// NOTE: Only set the values that are actually the default values used by Connect component
const defaultConnectOptions: ConnectPlaygroundOptions = {
  buttonLabel: undefined,
  enableAccountAbstraction: false,
  enableAuth: false,
  inAppWallet: {
    enabled: true,
    methods: defaultInAppLoginMethods,
  },
  localeId: "en_US",
  modalSize: "compact",
  modalTitle: undefined,
  modalTitleIcon: undefined,
  privacyPolicyLink: undefined,
  requireApproval: false,
  ShowThirdwebBranding: true,
  termsOfServiceLink: undefined,
  theme: {
    darkColorOverrides: {},
    lightColorOverrides: {},
    type: "dark",
  },
  walletIds: [
    "io.metamask",
    "com.coinbase.wallet",
    "me.rainbow",
    "io.rabby",
    "io.zerion.wallet",
  ],
};

export function ConnectButtonPage(props: {
  title: string;
  description: string;
  tab: string;
}) {
  const { theme } = useTheme();
  const [connectOptions, setConnectOptions] =
    useState<ConnectPlaygroundOptions>(defaultConnectOptions);

  // change theme on global theme change
  useEffect(() => {
    setConnectOptions((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        type: theme === "dark" ? "dark" : "light",
      },
    }));
  }, [theme]);

  return (
    <ThirdwebProvider>
      <PageLayout
        icon={RectangleHorizontalIcon}
        description={props.description}
        docsLink="https://portal.thirdweb.com/wallets/auth?utm_source=playground"
        title={props.title}
      >
        <div className="relative flex flex-col-reverse gap-6 xl:min-h-[900px] xl:flex-row xl:gap-6">
          <div className="grow border-b pb-10 xl:mb-0 xl:border-r xl:border-b-0 xl:pr-6">
            <LeftSection
              connectOptions={connectOptions}
              setConnectOptions={setConnectOptions}
            />
          </div>

          <RightSection connectOptions={connectOptions} tab={props.tab} />
        </div>
      </PageLayout>
    </ThirdwebProvider>
  );
}
