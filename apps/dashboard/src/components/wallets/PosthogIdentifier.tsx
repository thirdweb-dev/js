"use client";

import { useThirdwebClient } from "@/constants/thirdweb.client";
import { usePostHog } from "posthog-js/react";
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
  const posthog = usePostHog();

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (wallet && posthog && posthog.__loaded) {
      const connector = walletIdToPHName[wallet.id] || wallet.id;
      posthog.register({ connector });
      posthog.capture("wallet_connected", { connector });
    }
  }, [wallet, posthog]);

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (accountAddress && posthog && posthog.__loaded) {
      posthog.identify(accountAddress);
    }
  }, [accountAddress, posthog]);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (accountId && posthog && posthog.__loaded) {
      posthog.identify(accountId);
    }
  }, [accountId, posthog]);

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (chain?.id && posthog && posthog.__loaded) {
      posthog.unregister("network");
      posthog.register({ chain_id: chain?.id, ecosystem: "evm" });
    }
  }, [chain?.id, posthog]);

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (balance?.data?.displayValue && posthog && posthog.__loaded) {
      posthog.register({ balance: balance.data.displayValue });
    }
  }, [balance, posthog]);

  return null;
};
