import posthog from "posthog-js";
import {
  useAddress,
  useBalance,
  useChainId,
  useWallet,
} from "@thirdweb-dev/react";
import React, { useEffect } from "react";

const walletIdToPHName: Record<string, string> = {
  metamask: "metamask",
  walletConnectV1: "WalletConnect",
  walletConnectV2: "WalletConnect",
  "paper-wallet": "Paper Wallet",
  coinbaseWallet: "Coinbase Wallet",
  injected: "Injected",
};

export const PosthogIdentifier: React.FC = () => {
  const address = useAddress();
  const chainId = useChainId();
  const balance = useBalance();
  const wallet = useWallet();

  useEffect(() => {
    if (wallet) {
      const connector = walletIdToPHName[wallet.walletId] || wallet.walletId;
      posthog.register({ connector });
      posthog.capture("wallet_connected", { connector });
    }
  }, [wallet]);

  useEffect(() => {
    if (address) {
      posthog.identify(address);
    }
  }, [address]);

  useEffect(() => {
    if (chainId) {
      posthog.unregister("network");
      posthog.register({ chain_id: chainId, ecosystem: "evm" });
    }
  }, [chainId]);

  useEffect(() => {
    if (balance?.data?.displayValue) {
      posthog.register({ balance: balance.data.displayValue });
    }
  }, [balance]);

  return null;
};
