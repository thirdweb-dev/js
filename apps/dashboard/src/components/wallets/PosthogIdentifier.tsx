import { thirdwebClient } from "@/constants/client";
import posthog from "posthog-js-opensource";
import { useEffect } from "react";
import {
  useActiveAccount,
  useActiveWallet,
  useWalletBalance,
} from "thirdweb/react";
import { useDashboardActiveWalletChain } from "../../lib/v5-adapter";

const walletIdToPHName: Record<string, string> = {
  metamask: "metamask",
  walletConnectV1: "WalletConnect",
  walletConnectV2: "WalletConnect",
  "paper-wallet": "Paper Wallet",
  coinbaseWallet: "Coinbase Wallet",
  injected: "Injected",
};

export const PosthogIdentifier: React.FC = () => {
  const account = useActiveAccount();
  const chain = useDashboardActiveWalletChain();
  const balance = useWalletBalance({
    address: account?.address,
    chain,
    client: thirdwebClient,
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
    if (account?.address) {
      posthog.identify(account.address);
    }
  }, [account?.address]);

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
