import { useDashboardSOLNetworkId } from "@3rdweb-sdk/react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useQueryClient } from "@tanstack/react-query";
import { ThirdwebSDKProvider } from "@thirdweb-dev/react/solana";
import { Network } from "@thirdweb-dev/sdk/solana";
import { getSOLRPC } from "constants/rpc";
import { useMemo } from "react";
import { ComponentWithChildren } from "types/component-with-children";

const wallets = [new PhantomWalletAdapter()];

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
