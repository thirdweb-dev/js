"use client";

import { use, useState } from "react";
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

export default function Page(props: {
  searchParams: Promise<{ tab: string }>;
}) {
  const searchParams = use(props.searchParams);
  const [connectOptions, setConnectOptions] =
    useState<ConnectPlaygroundOptions>(defaultConnectOptions);

  return (
    <ThirdwebProvider>
      <PageLayout
        description={
          <>
            A fully featured wallet connection component that allows to Connect
            to 500+ external wallets, connect via email, phone number, passkey
            or social logins, Convert any wallet to a ERC4337 smart wallet for
            gasless transactions and provides SIWE (Sign In With Ethereum)
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/sign-in/overview?utm_source=playground"
        title="ConnectButton"
      >
        <div className="relative flex flex-col-reverse gap-6 xl:min-h-[900px] xl:flex-row xl:gap-6">
          <div className="grow border-b pb-10 xl:mb-0 xl:border-r xl:border-b-0 xl:pr-6">
            <LeftSection
              connectOptions={connectOptions}
              setConnectOptions={setConnectOptions}
            />
          </div>

          <RightSection
            connectOptions={connectOptions}
            tab={searchParams.tab}
          />
        </div>
      </PageLayout>
    </ThirdwebProvider>
  );
}
