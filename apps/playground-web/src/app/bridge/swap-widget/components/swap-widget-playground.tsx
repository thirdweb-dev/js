"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { TabButtons } from "@/components/ui/tab-buttons";
import { LeftSection } from "./left-section";
import { RightSection } from "./right-section";
import type { SwapWidgetPlaygroundOptions } from "./types";

const defaultOptions: SwapWidgetPlaygroundOptions = {
  integrationType: "react",
  prefill: undefined,
  currency: "USD",
  showThirdwebBranding: true,
  theme: {
    darkColorOverrides: {},
    lightColorOverrides: {},
    type: "dark",
  },
};

function updatePageUrl(tab: SwapWidgetPlaygroundOptions["integrationType"]) {
  const url = new URL(window.location.href);
  if (tab === defaultOptions.integrationType) {
    url.searchParams.delete("tab");
  } else {
    url.searchParams.set("tab", tab || "");
  }

  window.history.replaceState({}, "", url.toString());
}

export function SwapWidgetPlayground(props: {
  defaultTab?: "iframe" | "react";
}) {
  const { theme } = useTheme();

  const [options, setOptions] = useState<SwapWidgetPlaygroundOptions>(() => ({
    ...defaultOptions,
    integrationType: props.defaultTab || defaultOptions.integrationType,
  }));

  // change theme on global theme change
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
          <LeftSection options={options} setOptions={setOptions} />
        </div>
        <RightSection options={options} />
      </div>
    </div>
  );
}
