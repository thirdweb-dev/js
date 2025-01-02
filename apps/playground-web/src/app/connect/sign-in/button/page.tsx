"use client";

import ThirdwebProvider from "@/components/thirdweb-provider";
import { use, useState } from "react";
import { APIHeader } from "../../../../components/blocks/APIHeader";
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
  modalSize: "compact",
  theme: {
    type: "dark",
    darkColorOverrides: {},
    lightColorOverrides: {},
  },
  inAppWallet: {
    methods: defaultInAppLoginMethods,
    enabled: true,
  },
  walletIds: [
    "io.metamask",
    "com.coinbase.wallet",
    "me.rainbow",
    "io.rabby",
    "io.zerion.wallet",
  ],
  modalTitle: undefined,
  modalTitleIcon: undefined,
  localeId: "en_US",
  enableAuth: false,
  termsOfServiceLink: undefined,
  privacyPolicyLink: undefined,
  enableAccountAbstraction: false,
  buttonLabel: undefined,
  ShowThirdwebBranding: true,
  requireApproval: false,
};

export default function Page(props: {
  searchParams: Promise<{ tab: string }>;
}) {
  const searchParams = use(props.searchParams);
  const [connectOptions, setConnectOptions] =
    useState<ConnectPlaygroundOptions>(defaultConnectOptions);

  return (
    <ThirdwebProvider>
      <div className="">
        <APIHeader
          title="Connect Button"
          description={
            <>
              A fully featured wallet connection component that allows to
              Connect to 500+ external wallets, connect via email, phone number,
              passkey or social logins, Convert any wallet to a ERC4337 smart
              wallet for gasless transactions and provides SIWE (Sign In With
              Ethereum)
            </>
          }
          docsLink="https://portal.thirdweb.com/connect/sign-in/overview"
          heroLink="/connectors.png"
        />

        <div className="relative flex flex-col-reverse gap-6 xl:min-h-[900px] xl:flex-row xl:gap-6">
          <div className="grow border-b pb-10 xl:mb-0 xl:border-r xl:border-b-0 xl:pr-6">
            <LeftSection
              connectOptions={connectOptions}
              setConnectOptions={setConnectOptions}
            />
          </div>

          <RightSection
            tab={searchParams.tab}
            connectOptions={connectOptions}
          />
        </div>
      </div>
    </ThirdwebProvider>
  );
}
