"use client";

import { useState } from "react";
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
    "facebook",
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
};

export default function Page() {
  const [connectOptions, setConnectOptions] =
    useState<ConnectPlaygroundOptions>(defaultConnectOptions);

  return (
    <div className="">
      <APIHeader
        title="Connect Button"
        description={
          <>
            A fully featured wallet connection component that allows to Connect
            to 350+ external wallets, connect via email, phone number, passkey
            or social logins, Convert any wallet to a ERC4337 smart wallet for
            gasless transactions and provides SIWE (Sign In With Ethereum)
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/sign-in/overview"
        heroLink="/connectors.png"
      />

      <div className="flex flex-col-reverse xl:flex-row xl:min-h-[900px] gap-6 xl:gap-6 relative">
        <div className="grow xl:border-r xl:pr-6 pb-10 border-b xl:border-b-0 xl:mb-0">
          <LeftSection
            connectOptions={connectOptions}
            setConnectOptions={setConnectOptions}
          />
        </div>

        <RightSection connectOptions={connectOptions} />
      </div>
    </div>
  );
}
