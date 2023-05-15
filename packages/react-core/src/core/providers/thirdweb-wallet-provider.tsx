import { DAppMetaData } from "../types/dAppMeta";
import type { ConfiguredWallet, WalletInstance } from "../types/wallet";
import { ThirdwebThemeContext } from "./theme-context";
import { Chain } from "@thirdweb-dev/chains";
import {
  AbstractClientWallet,
  AsyncStorage,
  ConnectParams,
  CreateAsyncStorage,
} from "@thirdweb-dev/wallets";
import { Signer } from "ethers";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const LAST_CONNECTED_WALLET_STORAGE_KEY = "lastConnectedWallet";

let lastConnectedWalletStorage: AsyncStorage;

type LastConnectedWalletInfo = {
  walletId: string;
  connectParams?: ConnectParams & {
    personalWallet?: {
      walletId: string;
      connectParams?: ConnectParams;
    };
  };
};

type NonNullable<T> = T extends null | undefined ? never : T;
type WalletConnectParams<I extends WalletInstance> = Parameters<
  I["connect"]
>[0];

type ConnectionStatus = "unknown" | "connected" | "disconnected" | "connecting";

type ConnectFnArgs<
  I extends WalletInstance,
  Config extends Record<string, any> | undefined = undefined,
> =
  // if second argument is optional
  undefined extends WalletConnectParams<I>
    ? [
        wallet: ConfiguredWallet<I, Config>,
        connectParams?: NonNullable<WalletConnectParams<I>>,
      ]
    : // if second argument is required
      [
        wallet: ConfiguredWallet<I, Config>,
        connectParams: NonNullable<WalletConnectParams<I>>,
      ];

// maps wallet instance to it's wallet config
const walletInstanceToConfig: Map<
  WalletInstance,
  ConfiguredWallet<any, any>
> = new Map();

type ThirdwebWalletContextData = {
  wallets: ConfiguredWallet[];
  signer?: Signer;
  activeWallet?: WalletInstance;
  activeWalletConfig?: ConfiguredWallet;
  connect: <
    I extends WalletInstance,
    Config extends Record<string, any> | undefined = undefined,
  >(
    ...args: ConnectFnArgs<I, Config>
  ) => Promise<void>;
  disconnect: () => Promise<void>;
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;
  createWalletInstance: <
    I extends WalletInstance,
    Config extends Record<string, any> | undefined,
  >(
    Wallet: ConfiguredWallet<I, Config>,
  ) => I;
  createWalletStorage: CreateAsyncStorage;
  switchChain: (chain: number) => Promise<void>;
  chainToConnect?: Chain;
  activeChain: Chain;
  setConnectedWallet: (
    wallet: WalletInstance,
    params?: ConnectParams<Record<string, any>>,
  ) => void;
  /**
   * Get wallet config object from wallet instance
   */
  getWalletConfig: (
    walletInstance: WalletInstance,
  ) => ConfiguredWallet | undefined;
};

const ThirdwebWalletContext = createContext<
  ThirdwebWalletContextData | undefined
>(undefined);

export function ThirdwebWalletProvider(
  props: PropsWithChildren<{
    activeChain: Chain;
    supportedWallets: ConfiguredWallet[];
    shouldAutoConnect?: boolean;
    createWalletStorage: CreateAsyncStorage;
    dAppMeta?: DAppMetaData;
    chains: Chain[];
    autoSwitch?: boolean;
  }>,
) {
  const [signer, setSigner] = useState<Signer | undefined>(undefined);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("unknown");

  const [activeWallet, setActiveWallet] = useState<
    WalletInstance | undefined
  >();

  const [activeWalletConfig, setActiveWalletConfig] = useState<
    ConfiguredWallet | undefined
  >();

  if (!lastConnectedWalletStorage) {
    lastConnectedWalletStorage =
      props.createWalletStorage("coordinatorStorage");
  }

  // if autoSwitch is enabled - enforce connection to activeChain
  const chainToConnect = props.autoSwitch ? props.activeChain : undefined;

  const theme = useContext(ThirdwebThemeContext);

  const walletParams = useMemo(() => {
    const walletChains = props.chains;
    const walletOptions = {
      chains: walletChains,
      dappMetadata: props.dAppMeta,
    };

    return {
      ...walletOptions,
      chain: props.activeChain || props.chains[0],
      theme: theme || "dark",
    };
  }, [props.chains, props.dAppMeta, props.activeChain, theme]);

  const createWalletInstance = useCallback(
    <I extends WalletInstance, Config extends Record<string, any> | undefined>(
      walletConfig: ConfiguredWallet<I, Config>,
    ): I => {
      const walletInstance = walletConfig.create(walletParams);
      walletInstanceToConfig.set(walletInstance, walletConfig);
      return walletInstance;
    },
    [walletParams],
  );

  // if props.chains is updated, update the active wallet's chains
  useEffect(() => {
    if (activeWallet) {
      activeWallet.updateChains(props.chains);
    }
  }, [activeWallet, props.chains]);

  const setConnectedWallet = useCallback(
    async (
      wallet: WalletInstance,
      connectParams?: ConnectParams<Record<string, any>>,
      isAutoConnect = false,
    ) => {
      setActiveWallet(wallet);
      const walletConfig = walletInstanceToConfig.get(wallet);
      if (!walletConfig) {
        throw new Error("Wallet config not found for wallet instance");
      }
      setActiveWalletConfig(walletConfig);
      setConnectionStatus("connected");
      const _signer = await wallet.getSigner();
      setSigner(_signer);

      // it autoconnected, then the details is already saved in storage, no need to store again
      if (isAutoConnect) {
        return;
      }

      // save to storage

      const walletInfo: LastConnectedWalletInfo = {
        walletId: walletConfig.id,
        connectParams,
      };

      // if personal wallet exists, we need to replace the connectParams.personalWallet to a stringifiable version
      const personalWallet = wallet.getPersonalWallet() as AbstractClientWallet;
      const personalWalletConfig = walletInstanceToConfig.get(personalWallet);

      if (personalWallet && personalWalletConfig) {
        walletInfo.connectParams = {
          ...walletInfo.connectParams,
          personalWallet: {
            walletId: personalWalletConfig.id,
            connectParams: personalWallet.getConnectParams(),
          },
        };

        saveLastConnectedWalletInfo(walletInfo);
      } else {
        saveLastConnectedWalletInfo(walletInfo);
      }
    },
    [],
  );

  const storeLastActiveChainId = useCallback(async (chainId: number) => {
    const lastConnectedWallet = await lastConnectedWalletStorage.getItem(
      LAST_CONNECTED_WALLET_STORAGE_KEY,
    );

    if (!lastConnectedWallet) {
      return;
    }

    try {
      const parsedWallet = JSON.parse(lastConnectedWallet as string);
      parsedWallet.connectParams.chainId = chainId;
      await lastConnectedWalletStorage.setItem(
        LAST_CONNECTED_WALLET_STORAGE_KEY,
        JSON.stringify(parsedWallet),
      );
    } catch (error) {
      console.error(`Error saving the last active chain: ${error}`);
    }
  }, []);

  const switchChain = useCallback(
    async (chainId: number) => {
      if (!activeWallet) {
        throw new Error("No active wallet");
      }

      await activeWallet.switchChain(chainId);
      const _signer = await activeWallet.getSigner();
      await storeLastActiveChainId(chainId);

      setSigner(_signer);
    },
    [activeWallet, storeLastActiveChainId],
  );

  const autoConnectTriggered = useRef(false);

  // Auto Connect
  useEffect(() => {
    if (autoConnectTriggered.current) {
      return;
    }
    // if explicitly set to false, don't auto connect
    // by default, auto connect
    if (props.shouldAutoConnect === false) {
      setConnectionStatus("disconnected");
      return;
    }

    if (activeWallet) {
      // there's already an active wallet, don't auto connect
      return;
    }

    if (connectionStatus !== "unknown") {
      // only try to auto connect if we're in the unknown state
      return;
    }

    autoConnectTriggered.current = true;

    async function autoconnect() {
      const walletInfo = await getLastConnectedWalletInfo();

      if (!walletInfo) {
        setConnectionStatus("disconnected");
        return;
      }

      const walletObj = props.supportedWallets.find(
        (W) => W.id === walletInfo.walletId,
      );

      if (!walletObj) {
        // last connected wallet is no longer present in the supported wallets
        setConnectionStatus("disconnected");
        return;
      }

      const personalWalletInfo = walletInfo.connectParams?.personalWallet;

      if (personalWalletInfo) {
        type Config = {
          personalWallets: ConfiguredWallet[];
        };

        const personalWallets =
          "config" in walletObj
            ? (walletObj.config as Config).personalWallets
            : [];

        const personalWalleObj = personalWallets.find(
          (W) => W.id === personalWalletInfo.walletId,
        );
        if (personalWalleObj) {
          // create a personal wallet instance and auto connect it
          const personalWalletInstance = createWalletInstance(personalWalleObj);

          try {
            await personalWalletInstance.autoConnect(
              personalWalletInfo.connectParams,
            );
          } catch (e) {
            console.error(e);
            setConnectionStatus("disconnected");
            return;
          }

          // set the personal wallet instance to the connectParams
          walletInfo.connectParams = {
            ...walletInfo.connectParams,
            personalWallet: personalWalletInstance,
          };
        } else {
          // last used personal wallet is no longer present in the supported wallets
          setConnectionStatus("disconnected");
          return;
        }
      }

      // create a wallet instance and auto connect it
      const wallet = createWalletInstance(walletObj);

      try {
        setConnectionStatus("connecting");
        await wallet.autoConnect(walletInfo.connectParams);
        setConnectedWallet(wallet, walletInfo.connectParams, true);
      } catch (e) {
        lastConnectedWalletStorage.removeItem(
          LAST_CONNECTED_WALLET_STORAGE_KEY,
        );
        setConnectionStatus("disconnected");
        throw e;
      }
    }

    autoconnect();
  }, [
    createWalletInstance,
    props.supportedWallets,
    setConnectedWallet,
    props.shouldAutoConnect,
    activeWallet,
    connectionStatus,
  ]);

  const connectWallet = useCallback(
    async <
      I extends WalletInstance,
      Config extends Record<string, any> | undefined = undefined,
    >(
      ...args: ConnectFnArgs<I, Config>
    ) => {
      const [WalletObj, connectParams] = args;

      const _connectedParams = {
        chainId: chainToConnect?.chainId,
        ...(connectParams || {}),
      };

      const wallet = createWalletInstance(WalletObj);
      setConnectionStatus("connecting");
      try {
        await wallet.connect(_connectedParams);
        setConnectedWallet(wallet, _connectedParams);
      } catch (e: any) {
        console.error(`Error connecting to wallet: ${e}`);
        setConnectionStatus("disconnected");
        throw e;
      }
    },
    [createWalletInstance, setConnectedWallet, chainToConnect],
  );

  const onWalletDisconnect = useCallback(async () => {
    await lastConnectedWalletStorage.removeItem(
      LAST_CONNECTED_WALLET_STORAGE_KEY,
    );
    setConnectionStatus("disconnected");
    setSigner(undefined);
    setActiveWallet(undefined);
    setActiveWalletConfig(undefined);
  }, []);

  const disconnectWallet = useCallback(async () => {
    // if disconnect is called before the wallet is connected
    if (!activeWallet) {
      onWalletDisconnect();
      return;
    }

    const personalWallet = activeWallet.getPersonalWallet();
    await activeWallet.disconnect();

    if (personalWallet) {
      await (personalWallet as AbstractClientWallet)?.disconnect();
    }

    onWalletDisconnect();
  }, [activeWallet, onWalletDisconnect]);

  // when wallet's network or account is changed using the extension, update UI
  useEffect(() => {
    if (!activeWallet) {
      return;
    }

    const update = async () => {
      const _signer = await activeWallet.getSigner();
      setSigner(_signer);
    };

    activeWallet.addListener("change", () => {
      update();
    });

    activeWallet.addListener("disconnect", () => {
      onWalletDisconnect();
    });

    return () => {
      activeWallet.removeListener("change");
      activeWallet.removeListener("disconnect");
    };
  }, [activeWallet, onWalletDisconnect]);

  return (
    <ThirdwebWalletContext.Provider
      value={{
        disconnect: disconnectWallet,
        wallets: props.supportedWallets,
        connect: connectWallet,
        signer,
        activeWallet,
        activeWalletConfig,
        connectionStatus,
        setConnectionStatus,
        createWalletInstance: createWalletInstance,
        createWalletStorage: props.createWalletStorage,
        switchChain,
        setConnectedWallet: setConnectedWallet,
        activeChain: props.activeChain,
        chainToConnect,
        getWalletConfig: (walletInstance: WalletInstance) => {
          return walletInstanceToConfig.get(walletInstance);
        },
      }}
    >
      {props.children}
    </ThirdwebWalletContext.Provider>
  );
}

export function useWalletContext() {
  const ctx = useContext(ThirdwebWalletContext);
  if (!ctx) {
    throw new Error(
      `useWalletContext() can only be used inside <ThirdwebProvider />`,
    );
  }
  return ctx;
}

async function getLastConnectedWalletInfo() {
  const str = await lastConnectedWalletStorage.getItem(
    LAST_CONNECTED_WALLET_STORAGE_KEY,
  );
  if (!str) {
    return null;
  }

  return JSON.parse(str) as LastConnectedWalletInfo;
}

async function saveLastConnectedWalletInfo(
  walletInfo: LastConnectedWalletInfo,
) {
  try {
    await lastConnectedWalletStorage.setItem(
      LAST_CONNECTED_WALLET_STORAGE_KEY,
      JSON.stringify(walletInfo),
    );
  } catch (e) {
    console.error("Error saving the last connected wallet info", e);
  }
}
