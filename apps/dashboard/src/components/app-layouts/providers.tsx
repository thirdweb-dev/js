"use client";
import { useNativeColorMode } from "hooks/useNativeColorMode";
import { ThirdwebProvider } from "thirdweb/react";
import type { ComponentWithChildren } from "types/component-with-children";
import { SetAuthHeaderForSDK } from "../../app/components/SetAuthHeaderForSDK";

export const DashboardThirdwebProvider: ComponentWithChildren = ({
  children,
}) => {
  useNativeColorMode();

  return (
    <ThirdwebProvider>
      <SetAuthHeaderForSDK />
      {children}
    </ThirdwebProvider>
  );
};
