import {
  useAddress,
  useBalance,
  useChainId,
  useWallet,
} from "@thirdweb-dev/react";
import posthog from "posthog-js-opensource";
import { useEffect } from "react";

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

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (wallet) {
      const connector = walletIdToPHName[wallet.walletId] || wallet.walletId;
      posthog.register({ connector });
      posthog.capture("wallet_connected", { connector });
    }
  }, [wallet]);

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (address) {
      posthog.identify(address);
    }
  }, [address]);

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (chainId) {
      posthog.unregister("network");
      posthog.register({ chain_id: chainId, ecosystem: "evm" });
    }
  }, [chainId]);

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (balance?.data?.displayValue) {
      posthog.register({ balance: balance.data.displayValue });
    }
  }, [balance]);

  return null;
};
