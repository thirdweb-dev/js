import posthog from "posthog-js";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import {
  useAddress,
  useBalance,
  useChainId,
  useWallet,
} from "@thirdweb-dev/react";
import { useSDK } from "@thirdweb-dev/react/solana";
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
  const publicKey = useSolanaWallet().publicKey;
  const address = useAddress();
  const chainId = useChainId();
  const balance = useBalance();
  const solSDKNetwork = useSDK()?.network;
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
