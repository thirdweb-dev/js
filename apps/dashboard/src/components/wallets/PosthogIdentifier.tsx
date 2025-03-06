"use client";

import { useThirdwebClient } from "@/constants/thirdweb.client";
import posthog from "posthog-js";
import { useEffect } from "react";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useWalletBalance,
} from "thirdweb/react";

const walletIdToPHName: Record<string, string> = {
  metamask: "metamask",
  walletConnectV1: "WalletConnect",
  walletConnectV2: "WalletConnect",
  "paper-wallet": "Paper Wallet",
  coinbaseWallet: "Coinbase Wallet",
  injected: "Injected",
};

export const PosthogIdentifierClient: React.FC<{
  accountId: string | undefined;
  accountAddress: string | undefined;
}> = ({ accountId, accountAddress }) => {
  const client = useThirdwebClient();
  const account = useActiveAccount();
  const chain = useActiveWalletChain();
  const balance = useWalletBalance({
    address: account?.address,
    chain,
    client,
  });
  const wallet = useActiveWallet();

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (wallet) {
      const connector = walletIdToPHName[wallet.id] || wallet.id;
      posthog.register({ connector });
      posthog.capture("wallet_connected", { connector });
    }
  }, [wallet]);

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (accountAddress) {
      posthog.identify(accountAddress);
    }
  }, [accountAddress]);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (accountId) {
      posthog.identify(accountId);
    }
  }, [accountId]);

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (chain?.id) {
      posthog.unregister("network");
      posthog.register({ chain_id: chain?.id, ecosystem: "evm" });
    }
  }, [chain?.id]);

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (balance?.data?.displayValue) {
      posthog.register({ balance: balance.data.displayValue });
    }
  }, [balance]);

  return null;
};
