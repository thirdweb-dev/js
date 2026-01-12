"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { arbitrum } from "thirdweb/chains";
import { TabButtons } from "@/components/ui/tab-buttons";
import { LeftSection } from "../components/LeftSection";
import { RightSection } from "../components/RightSection";
import type { BridgeComponentsPlaygroundOptions } from "../components/types";

const defaultOptions: BridgeComponentsPlaygroundOptions = {
  integrationType: "react",
  payOptions: {
    buyTokenAddress: undefined,
    buyTokenAmount: "0.002",
    buyTokenChain: arbitrum,
    description: "",
    image: "",
    buttonLabel: "",
    paymentMethods: ["crypto", "card"],
    sellerAddress: "0x0000000000000000000000000000000000000000",
    title: "",
    receiverAddress: undefined,
    transactionData: "",
    currency: "USD",
    showThirdwebBranding: true,
    amountEditable: true,
    tokenEditable: true,
  },
  theme: {
    darkColorOverrides: {},
    lightColorOverrides: {},
    type: "dark",
  },
};

function updatePageUrl(
  tab: BridgeComponentsPlaygroundOptions["integrationType"],
) {
  const url = new URL(window.location.href);
  if (tab === defaultOptions.integrationType) {
    url.searchParams.delete("tab");
  } else {
    url.searchParams.set("tab", tab || "");
  }

  window.history.replaceState({}, "", url.toString());
}

export function BuyPlayground(props: { defaultTab?: "iframe" | "react" }) {
  const { theme } = useTheme();

  const [options, setOptions] = useState<BridgeComponentsPlaygroundOptions>(
    () => ({
      ...defaultOptions,
      integrationType: props.defaultTab || defaultOptions.integrationType,
    }),
  );

  // Change theme on global theme change
  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        type: theme === "dark" ? "dark" : "light",
      },
    }));
  }, [theme]);

  useEffect(() => {
    updatePageUrl(options.integrationType);
  }, [options.integrationType]);

  return (
    <div>
      <TabButtons
        tabs={[
          {
            name: "React",
            onClick: () => setOptions({ ...options, integrationType: "react" }),
            isActive: options.integrationType === "react",
          },
          {
            name: "Iframe",
            onClick: () =>
              setOptions({ ...options, integrationType: "iframe" }),
            isActive: options.integrationType === "iframe",
          },
        ]}
      />

      <div className="h-6" />

      <div className="relative flex flex-col-reverse gap-6 xl:min-h-[900px] xl:flex-row xl:gap-6">
        <div className="grow border-b pb-10 xl:mb-0 xl:border-r xl:border-b-0 xl:pr-6">
          <LeftSection widget="buy" options={options} setOptions={setOptions} />
        </div>
        <RightSection widget="buy" options={options} />
      </div>
    </div>
  );
}
