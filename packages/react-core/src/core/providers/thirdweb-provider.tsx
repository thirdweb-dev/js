import { ThirdwebAuthProvider } from "../../evm/contexts/ThirdwebAuthProvider";
import { useUpdateChainsWithClientId } from "../../evm/hooks/chain-hooks";
import { ThirdwebSDKProvider } from "../../evm/providers/thirdweb-sdk-provider";
import { ThirdwebSDKProviderProps } from "../../evm/providers/types";
import { WalletConfig } from "../types/wallet";
import { ThirdwebThemeContext } from "./theme-context";
import { ThirdwebWalletProvider } from "./thirdweb-wallet-provider";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import {
  createAsyncLocalStorage,
  CreateAsyncStorage,
  DAppMetaData,
  SignerWallet,
} from "@thirdweb-dev/wallets";
import { PropsWithChildren, useMemo } from "react";
import { useWalletContext } from "./wallet-context";

/**
 * The possible props for the ThirdwebProvider.
 */
export interface ThirdwebProviderCoreProps<TChains extends Chain[]>
  extends Omit<ThirdwebSDKProviderProps<TChains>, "signer"> {
  /**
   * An array of wallets that the dApp supports
   * If not provided, will default to Metamask (injected), Coinbase wallet and Device wallet
   *
   * @example
   * You can Import the wallets you want to support from `@thirdweb-dev/wallets` and pass them to `supportedWallets`
   *
   * ```jsx title="App.jsx"
   * import { ThirdwebProvider } from "@thirdweb-dev/react";
   *
   * const App = () => {
   *   return (
   *     <ThirdwebProvider>
   *       <YourApp />
   *     </ThirdwebProvider>
   *   );
   * };
   * ```
   */
  supportedWallets: WalletConfig[];

  /**
   * Metadata to pass to wallet connect and walletlink wallet connect. (Used to show *which* dApp is being connected to in mobile wallets that support it)
   * Defaults to just the name being passed as `thirdweb powered dApp`.
   */
  dAppMeta?: DAppMetaData;

  /**
   * Whether or not to attempt auto-connect to a wallet.
   */
  autoConnect?: boolean;

  theme?: "light" | "dark";

  createWalletStorage?: CreateAsyncStorage;

  /**
   * Whether or not to automatically switch to wallet's network to active chain
   */
  autoSwitch?: boolean;

  /**
   * Timeout for auto-connecting wallet in milliseconds
   *
   * If wallet fails to connect in this time, it will stop trying to connect and user will have to manually connect
   *
   * @defaultValue 15000
   */
  autoConnectTimeout?: number;

  signerWallet?: WalletConfig<SignerWallet>;
}

export const ThirdwebProviderCore = <TChains extends Chain[]>({
  createWalletStorage = createAsyncLocalStorage,
  ...props
}: PropsWithChildren<ThirdwebProviderCoreProps<TChains>>) => {
  const { activeChain } = props;

  const supportedChains = (props.supportedChains || defaultChains) as Chain[];

  const supportedChainsNonNull: Chain[] = useMemo(() => {
    const isActiveChainObject =
      typeof activeChain === "object" && activeChain !== null;

    if (!isActiveChainObject) {
      return supportedChains;
    }

    const isActiveChainInSupportedChains = supportedChains.find(
      (c) => c.chainId === activeChain.chainId,
    );

    // if activeChain is not in supportedChains - add it
    if (!isActiveChainInSupportedChains) {
      return [...supportedChains, activeChain];
    }

    // if active chain is in supportedChains - replace it with object in activeChain
    return supportedChains.map((c) =>
      c.chainId === activeChain.chainId ? activeChain : c,
    );
  }, [supportedChains, activeChain]);

  const [supportedChainsWithKey, activeChainIdOrObjWithKey] =
    useUpdateChainsWithClientId(
      supportedChainsNonNull,
      props.activeChain || supportedChainsNonNull[0],
      props.clientId,
    );

  const activeChainWithKey = useMemo(() => {
    if (typeof activeChainIdOrObjWithKey === "number") {
      const resolveChain = supportedChainsWithKey.find(
        (chain) => chain.chainId === activeChainIdOrObjWithKey,
      );
      if (!resolveChain) {
        throw new Error(
          `Invalid chainId: ${activeChainIdOrObjWithKey}. It is not one of supportedChains`,
        );
      }
      return resolveChain;
    }

    if (typeof activeChainIdOrObjWithKey === "string") {
      const resolvedChain = supportedChainsWithKey.find(
        (chain) => chain.slug === activeChainIdOrObjWithKey,
      );
      if (!resolvedChain) {
        throw new Error(
          `Invalid chain: "${activeChainIdOrObjWithKey}". It is not one of supportedChains`,
        );
      }
      return resolvedChain;
    }

    return activeChainIdOrObjWithKey;
  }, [activeChainIdOrObjWithKey, supportedChainsWithKey]);

  const dAppMeta = props.dAppMeta;

  return (
    <ThirdwebThemeContext.Provider value={props.theme}>
      <ThirdwebWalletProvider
        chains={supportedChainsWithKey}
        supportedWallets={props.supportedWallets}
        shouldAutoConnect={props.autoConnect}
        createWalletStorage={createWalletStorage}
        dAppMeta={dAppMeta}
        activeChain={activeChainWithKey}
        autoSwitch={props.autoSwitch}
        autoConnectTimeout={props.autoConnectTimeout}
        clientId={props.clientId}
        activeChainSetExplicitly={!!props.activeChain}
        signerWallet={props.signerWallet}
      >
        <ThirdwebSDKProviderWrapper
          queryClient={props.queryClient}
          sdkOptions={props.sdkOptions}
          supportedChains={supportedChainsWithKey}
          activeChain={activeChainWithKey}
          storageInterface={props.storageInterface}
          authConfig={props.authConfig}
          clientId={props.clientId}
          secretKey={props.secretKey}
        >
          <ThirdwebAuthProvider value={props.authConfig}>
            {props.children}
          </ThirdwebAuthProvider>
        </ThirdwebSDKProviderWrapper>
      </ThirdwebWalletProvider>
    </ThirdwebThemeContext.Provider>
  );
};

const ThirdwebSDKProviderWrapper = <TChains extends Chain[]>({
  children,
  ...props
}: PropsWithChildren<Omit<ThirdwebSDKProviderProps<TChains>, "signer">>) => {
  const signer = useWalletContext()?.signer;

  return (
    <ThirdwebSDKProvider signer={signer} {...props}>
      {children}
    </ThirdwebSDKProvider>
  );
};
