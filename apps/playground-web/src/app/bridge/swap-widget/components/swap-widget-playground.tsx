"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LeftSection } from "./left-section";
import { RightSection } from "./right-section";
import type { SwapWidgetPlaygroundOptions } from "./types";

const defaultOptions: SwapWidgetPlaygroundOptions = {
  prefill: undefined,
  currency: "USD",
  showThirdwebBranding: true,
  theme: {
    darkColorOverrides: {},
    lightColorOverrides: {},
    type: "dark",
  },
};

export function SwapWidgetPlayground() {
  const { theme } = useTheme();

  const [options, setOptions] =
    useState<SwapWidgetPlaygroundOptions>(defaultOptions);

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
    <div className="relative flex flex-col-reverse gap-6 xl:min-h-[900px] xl:flex-row xl:gap-6">
      <div className="grow border-b pb-10 xl:mb-0 xl:border-r xl:border-b-0 xl:pr-6">
        <LeftSection options={options} setOptions={setOptions} />
      </div>
      <RightSection options={options} />
    </div>
  );
}
