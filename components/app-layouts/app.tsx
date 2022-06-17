import { Providers } from "./providers";
import { useAddress, useBalance, useChainId } from "@thirdweb-dev/react";
import { AppShell } from "components/layout/app-shell";
import { PrivacyNotice } from "components/notices/PrivacyNotice";
import posthog from "posthog-js";
import React, { useEffect } from "react";
import { ComponentWithChildren } from "types/component-with-children";

export const AppLayout: ComponentWithChildren = ({ children }) => {
  return (
    <Providers>
      <PHIdentifier />
      <PrivacyNotice />
      <AppShell>{children}</AppShell>
    </Providers>
  );
};

const PHIdentifier: React.FC = () => {
  const address = useAddress();
  const chainId = useChainId();
  const balance = useBalance();

  useEffect(() => {
    if (address) {
      posthog.identify(address);
    }
  }, [address]);

  useEffect(() => {
    if (chainId) {
      posthog.register({ chainId });
    }
  }, [chainId]);

  useEffect(() => {
    if (balance?.data?.displayValue) {
      posthog.register({ balance: balance.data.displayValue });
    }
  }, [balance]);

  return null;
};
