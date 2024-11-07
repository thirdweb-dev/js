"use client";
import { useNativeColorMode } from "hooks/useNativeColorMode";
import { ThirdwebProvider } from "thirdweb/react";
import type { ComponentWithChildren } from "types/component-with-children";
import { TWAutoConnect } from "../../app/components/autoconnect";

export const DashboardThirdwebProvider: ComponentWithChildren = ({
  children,
}) => {
  useNativeColorMode();

  return (
    <ThirdwebProvider>
      <TWAutoConnect />
      {children}
    </ThirdwebProvider>
  );
};
