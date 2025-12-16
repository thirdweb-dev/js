"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { TabButtons } from "../../../../components/ui/tab-buttons";
import { LeftSection } from "./left-section";
import { RightSection } from "./right-section";
import type { BridgeWidgetPlaygroundOptions } from "./types";

const defaultOptions: BridgeWidgetPlaygroundOptions = {
  integrationType: "iframe",
  prefill: undefined,
  currency: "USD",
  showThirdwebBranding: true,
  theme: {
    darkColorOverrides: {},
    lightColorOverrides: {},
    type: "dark",
  },
};

export function BridgeWidgetPlayground() {
  const { theme } = useTheme();

  const [options, setOptions] =
    useState<BridgeWidgetPlaygroundOptions>(defaultOptions);

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

  return (
    <div>
      <TabButtons
        tabs={[
          {
            name: "Iframe",
            onClick: () =>
              setOptions({ ...options, integrationType: "iframe" }),
            isActive: options.integrationType === "iframe",
          },
          {
            name: "Script",
            onClick: () =>
              setOptions({ ...options, integrationType: "script" }),
            isActive: options.integrationType === "script",
          },
          {
            name: "React",
            onClick: () =>
              setOptions({ ...options, integrationType: "component" }),
            isActive: options.integrationType === "component",
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
