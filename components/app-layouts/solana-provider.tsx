import { useDashboardSOLNetworkId } from "@3rdweb-sdk/react";
import { Adapter } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useQueryClient } from "@tanstack/react-query";
import { ThirdwebSDKProvider } from "@thirdweb-dev/react/solana";
import { Network } from "@thirdweb-dev/sdk/solana";
import { getSOLRPC } from "constants/rpc";
import { useMemo } from "react";
import { ComponentWithChildren } from "types/component-with-children";

// just solana things - we don't actually need to pass phantom anymore but we *do* need to pass the wallets array still...
const wallets: Adapter[] = [];

export const SolanaProvider: ComponentWithChildren = ({ children }) => {
  const dashboardNetwork = useDashboardSOLNetworkId();

  const endpoint = useMemo(
    () => dashboardNetwork && getSOLRPC(dashboardNetwork),
    [dashboardNetwork],
  );

  return (
    <ConnectionProvider endpoint={endpoint || getSOLRPC("mainnet-beta")}>
      <WalletProvider wallets={wallets} autoConnect>
        <TWSolanaProvider network={endpoint}>{children}</TWSolanaProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const TWSolanaProvider: ComponentWithChildren<{ network?: Network }> = ({
  children,
  network,
}) => {
  const wallet = useWallet();
  const queryClient = useQueryClient();

  return (
    <ThirdwebSDKProvider
      queryClient={queryClient}
      network={network}
      wallet={wallet}
    >
      {children}
    </ThirdwebSDKProvider>
  );
};
