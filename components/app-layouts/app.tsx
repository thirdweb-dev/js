import { useAddress, useBalance, useChainId } from "@thirdweb-dev/react";
import { AppShell, AppShellProps } from "components/layout/app-shell";
import { PrivacyNotice } from "components/notices/PrivacyNotice";
import posthog from "posthog-js";
import React, { useEffect } from "react";
import { ComponentWithChildren } from "types/component-with-children";

export const AppLayout: ComponentWithChildren<AppShellProps> = (props) => {
  return (
    <>
      <PHIdentifier />
      <PrivacyNotice />
      <AppShell {...props} />
    </>
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
      posthog.register({ chain_id: chainId });
    }
  }, [chainId]);

  useEffect(() => {
    if (balance?.data?.displayValue) {
      posthog.register({ balance: balance.data.displayValue });
    }
  }, [balance]);

  return null;
};
