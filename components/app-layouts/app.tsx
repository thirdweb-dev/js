import { Providers } from "./providers";
import { useAddress } from "@thirdweb-dev/react";
import { AppShell } from "components/layout/app-shell";
import { NightlyNotice } from "components/notices/NightlyNotice";
import posthog from "posthog-js";
import React, { useEffect } from "react";
import { ComponentWithChildren } from "types/component-with-children";

export const AppLayout: ComponentWithChildren = ({ children }) => {
  return (
    <Providers>
      <PHIdentifier />
      <NightlyNotice />
      <AppShell>{children}</AppShell>
    </Providers>
  );
};

const PHIdentifier: React.FC = () => {
  const address = useAddress();
  useEffect(() => {
    if (address) {
      posthog.identify(address);
    }
  }, [address]);
  return null;
};
