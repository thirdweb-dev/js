"use client";

import { useState } from "react";
import { arbitrum } from "thirdweb/chains";
import { LeftSection } from "../components/LeftSection";
import { RightSection } from "../components/RightSection";
import type { BridgeComponentsPlaygroundOptions } from "../components/types";

const defaultOptions: BridgeComponentsPlaygroundOptions = {
  payOptions: {
    buyTokenAddress: undefined,
    buyTokenAmount: "0.01",
    buyTokenChain: arbitrum,
    description: "",
    image: "",
    buttonLabel: "",
    paymentMethods: ["crypto", "card"],
    sellerAddress: "0x0000000000000000000000000000000000000000",
    title: "",
    transactionData: "",
    widget: "checkout",
    currency: "USD",
    showThirdwebBranding: true,
  },
  theme: {
    darkColorOverrides: {},
    lightColorOverrides: {},
    type: "dark",
  },
};

export function CheckoutPlayground() {
  const [options, setOptions] =
    useState<BridgeComponentsPlaygroundOptions>(defaultOptions);

  return (
    <div className="relative flex flex-col-reverse gap-6 xl:min-h-[900px] xl:flex-row xl:gap-6">
      <div className="grow border-b pb-10 xl:mb-0 xl:border-r xl:border-b-0 xl:pr-6">
        <LeftSection
          lockedWidget="checkout"
          options={options}
          setOptions={setOptions}
        />
      </div>
      <RightSection lockedWidget="checkout" options={options} />
    </div>
  );
}
