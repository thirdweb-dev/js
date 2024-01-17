import { WallerProvider } from "./wallet-provider.js";

export const ThirdwebProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <WallerProvider>{children}</WallerProvider>;
};

export {
  useSetActiveWallet,
  useConnect,
  useActiveWallet,
  useConnectedWallets,
  useActiveWalletAddress,
  WallerProvider,
} from "./wallet-provider.js";
