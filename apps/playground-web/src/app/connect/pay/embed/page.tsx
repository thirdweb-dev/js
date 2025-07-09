"use client";
import { use, useState } from "react";
import { arbitrum } from "thirdweb/chains";
import type { BridgeComponentsPlaygroundOptions } from "../components/types";
import { LeftSection } from "./LeftSection";
import { RightSection } from "./RightSection";

// NOTE: Only set the values that are actually the default values used by PayEmbed component
const defaultConnectOptions: BridgeComponentsPlaygroundOptions = {
  payOptions: {
    buyTokenAddress: undefined,
    buyTokenAmount: "0.002",
    buyTokenChain: arbitrum,
    description: "",
    image: "",
    paymentMethods: ["crypto", "card"],
    sellerAddress: "0x0000000000000000000000000000000000000000",
    title: "",
    transactionData: "",
    widget: "buy",
    showThirdwebBranding: true,
  },
  theme: {
    darkColorOverrides: {},
    lightColorOverrides: {},
    type: "dark",
  },
};

export default function BridgeComponentsPlayground(props: {
  searchParams: Promise<{ tab: string }>;
}) {
  const searchParams = use(props.searchParams);
  const [options, setOptions] = useState<BridgeComponentsPlaygroundOptions>(
    defaultConnectOptions,
  );

  return (
    <div className="relative flex flex-col-reverse gap-6 xl:min-h-[900px] xl:flex-row xl:gap-6">
      <div className="grow border-b pb-10 xl:mb-0 xl:border-r xl:border-b-0 xl:pr-6">
        <LeftSection options={options} setOptions={setOptions} />
      </div>

      <RightSection options={options} tab={searchParams.tab} />
    </div>
  );
}
