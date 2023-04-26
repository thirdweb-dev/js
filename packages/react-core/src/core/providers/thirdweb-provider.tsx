import { ThirdwebAuthProvider } from "../../evm/contexts/thirdweb-auth";
import { useUpdateChainsWithApiKeys } from "../../evm/hooks/chain-hooks";
import { ThirdwebSDKProvider } from "../../evm/providers/thirdweb-sdk-provider";
import { ThirdwebSDKProviderProps } from "../../evm/providers/types";
import { Wallet } from "../types/wallet";
import { ThirdwebThemeContext } from "./theme-context";
import {
  ThirdwebWalletProvider,
  useThirdwebWallet,
} from "./thirdweb-wallet-provider";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import {
  createAsyncLocalStorage,
  CreateAsyncStorage,
  DAppMetaData,
} from "@thirdweb-dev/wallets";
import React, { useMemo } from "react";

/**
 * The possible props for the ThirdwebProvider.
 */
export interface ThirdwebProviderCoreProps<TChains extends Chain[]>
  extends ThirdwebSDKProviderProps<TChains> {
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
  supportedWallets: Wallet[];

  /**
   * Metadata to pass to wallet connect and walletlink wallet connect. (Used to show *which* dApp is being connected to in mobile wallets that support it)
   * Defaults to just the name being passed as `thirdweb powered dApp`.
   */
  dAppMeta?: DAppMetaData;

  /**
   * Whether or not to attempt auto-connect to a wallet.
   */
  autoConnect?: boolean;

  /**
   * Whether or not to show a "Join as Guest" option in the wallet modal.
   *
   * Join as guest will connect the user to the dApp using a guess wallet users can export.
   */
  guestMode?: boolean;

  theme?: "light" | "dark";

  createWalletStorage?: CreateAsyncStorage;

  /**
   * Whether or not to automatically switch to wallet's network to active chain
   */
  autoSwitch?: boolean;
}

export const ThirdwebProviderCore = <TChains extends Chain[]>({
  createWalletStorage = createAsyncLocalStorage,
  ...props
}: React.PropsWithChildren<ThirdwebProviderCoreProps<TChains>>) => {
  const { activeChain } = props;

  const supportedChainsNonNull: Chain[] = useMemo(() => {
    const isActiveChainObject =
      typeof activeChain === "object" && activeChain !== null;

    if (!isActiveChainObject) {
      return props.supportedChains || defaultChains;
    }

    if (!props.supportedChains) {
      return [...defaultChains, activeChain];
    }

    const isActiveChainInSupportedChains = props.supportedChains.find(
      (c) => c.chainId === activeChain.chainId,
    );

    // if activeChain is not in supportedChains - add it
    if (!isActiveChainInSupportedChains) {
      return [...props.supportedChains, activeChain];
    }

    // if active chain is in supportedChains - replace it with object in activeChain
    return props.supportedChains.map((c) =>
      c.chainId === activeChain.chainId ? activeChain : c,
    );
  }, [props.supportedChains, activeChain]);

  const [supportedChainsWithKey, activeChainIdOrObjWithKey] =
    useUpdateChainsWithApiKeys(
      supportedChainsNonNull,
      props.activeChain || supportedChainsNonNull[0],
      props.thirdwebApiKey,
      props.alchemyApiKey,
      props.infuraApiKey,
    );

  const activeChainWithKey = useMemo(() => {
    if (typeof activeChainIdOrObjWithKey === "number") {
      const resolveChain = supportedChainsWithKey.find(
        (chain) => chain.chainId === activeChainIdOrObjWithKey,
      );
      if (!resolveChain) {
        throw new Error(`Invalid chainId: ${activeChainIdOrObjWithKey}`);
      }
      return resolveChain;
    }

    if (typeof activeChainIdOrObjWithKey === "string") {
      const resolvedChain = supportedChainsWithKey.find(
        (chain) => chain.slug === activeChainIdOrObjWithKey,
      );
      if (!resolvedChain) {
        throw new Error(`Invalid chain: ${activeChainIdOrObjWithKey}`);
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
        guestMode={props.guestMode}
      >
        <ThirdwebSDKProviderWrapper
          queryClient={props.queryClient}
          sdkOptions={props.sdkOptions}
          supportedChains={supportedChainsWithKey}
          activeChain={activeChainWithKey}
          storageInterface={props.storageInterface}
          authConfig={props.authConfig}
          thirdwebApiKey={props.thirdwebApiKey}
          alchemyApiKey={props.alchemyApiKey}
          infuraApiKey={props.infuraApiKey}
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
}: React.PropsWithChildren<
  Omit<ThirdwebSDKProviderProps<TChains>, "signer">
>) => {
  const signer = useThirdwebWallet()?.signer;

  return (
    <ThirdwebSDKProvider signer={signer} {...props}>
      {children}
    </ThirdwebSDKProvider>
  );
};
