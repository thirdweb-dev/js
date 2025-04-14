"use client";
import { use, useState } from "react";
import { NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { base } from "thirdweb/chains";
import type { PayEmbedPlaygroundOptions } from "../components/types";
import { LeftSection } from "./LeftSection";
import { RightSection } from "./RightSection";

// NOTE: Only set the values that are actually the default values used by PayEmbed component
const defaultConnectOptions: PayEmbedPlaygroundOptions = {
  theme: {
    type: "dark",
    darkColorOverrides: {},
    lightColorOverrides: {},
  },
  payOptions: {
    mode: "fund_wallet",
    title: "",
    image: "",
    buyTokenAddress: NATIVE_TOKEN_ADDRESS,
    buyTokenAmount: "0.01",
    buyTokenChain: base,
    sellerAddress: "",
    transactionData: "",
    buyTokenInfo: undefined,
    buyWithCrypto: true,
    buyWithFiat: true,
  },
  connectOptions: {
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
  },
};

export default function PayEmbedPlayground(props: {
  searchParams: Promise<{ tab: string }>;
}) {
  const searchParams = use(props.searchParams);
  const [options, setOptions] = useState<PayEmbedPlaygroundOptions>(
    defaultConnectOptions,
  );

  return (
    <div className="relative flex flex-col-reverse gap-6 xl:min-h-[900px] xl:flex-row xl:gap-6">
      <div className="grow border-b pb-10 xl:mb-0 xl:border-r xl:border-b-0 xl:pr-6">
        <LeftSection options={options} setOptions={setOptions} />
      </div>

      <RightSection tab={searchParams.tab} options={options} />
    </div>
  );
}
