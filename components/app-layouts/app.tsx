import { DashboardThirdwebProvider } from "./providers";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAddress, useBalance, useChainId } from "@thirdweb-dev/react";
import { useSDK } from "@thirdweb-dev/react/solana";
import { AppShell, AppShellProps } from "components/layout/app-shell";
import { PrivacyNotice } from "components/notices/PrivacyNotice";
import { ErrorProvider } from "contexts/error-handler";
import posthog from "posthog-js";
import React, { useEffect } from "react";
import { ComponentWithChildren } from "types/component-with-children";

export const AppLayout: ComponentWithChildren<AppShellProps> = (props) => {
  return (
    <ErrorProvider>
      <DashboardThirdwebProvider>
        <PHIdentifier />
        <PrivacyNotice />
        <AppShell {...props} />
      </DashboardThirdwebProvider>
    </ErrorProvider>
  );
};

const PHIdentifier: React.FC = () => {
  const publicKey = useWallet().publicKey;
  const address = useAddress();
  const chainId = useChainId();
  const balance = useBalance();
  const solSDKNetwork = useSDK()?.network;

  useEffect(() => {
    if (address) {
      posthog.identify(address);
    } else if (publicKey) {
      posthog.identify(publicKey.toBase58());
    }
  }, [address, publicKey]);

  useEffect(() => {
    if (chainId) {
      posthog.unregister("network");
      posthog.register({ chain_id: chainId, ecosystem: "evm" });
    } else if (solSDKNetwork) {
      posthog.unregister("chain_id");
      posthog.register({
        network: solSDKNetwork || "unknown_network",
        ecosystem: "solana",
      });
    }
  }, [chainId, solSDKNetwork]);

  useEffect(() => {
    if (balance?.data?.displayValue) {
      posthog.register({ balance: balance.data.displayValue });
    }
  }, [balance]);

  return null;
};
