import { DAppMetaData } from "../types/dAppMeta";
import type {
  WalletConfig,
  WalletInstance,
  WalletOptions,
} from "../types/wallet";
import { Chain } from "@thirdweb-dev/chains";
import {
  AbstractClientWallet,
  AsyncStorage,
  ConnectParams,
  CreateAsyncStorage,
  SignerWallet,
  WalletConnectHandler,
  WalletConnectReceiverConfig,
  WalletConnectV2Handler,
  walletIds,
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
import { isWalletConnectReceiverEnabled } from "../utils/receiver";

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

export type ConnectionStatus =
  | "unknown"
  | "connected"
  | "disconnected"
  | "connecting";

type ConnectFnArgs<I extends WalletInstance> =
  // if second argument is optional
  undefined extends WalletConnectParams<I>
    ? [
        wallet: WalletConfig<I>,
        connectParams?: NonNullable<WalletConnectParams<I>>,
      ]
    : // if second argument is required
      [
        wallet: WalletConfig<I>,
        connectParams: NonNullable<WalletConnectParams<I>>,
      ];

// maps wallet instance to it's wallet config
const walletInstanceToConfig: Map<
  WalletInstance,
  WalletConfig<any>
> = new Map();

/**
 * Maps a personal wallet instance to it's wrapper wallet instance ( like smartWallet or safeWallet ) to know it's "wrapper" wallet
 *
 * This is used to implement the "switch to personal wallet" and "switch to smart wallet" feature
 */
const personalWalletToWrapperWallet: Map<WalletInstance, WalletInstance> =
  new Map();

type WalletSetupData = {
  chains: Chain[];
  dAppMeta?: DAppMetaData;
  activeChain?: Chain;
  clientId?: string;
  chainToConnect?: Chain;
};

type ThirdwebWalletContextData = {
  address: string | undefined;
  chainId: number | undefined;
  wallets: WalletConfig[];
  signer?: Signer;
  activeWallet?: WalletInstance;
  activeWalletConfig?: WalletConfig;
  connect: <I extends WalletInstance>(...args: ConnectFnArgs<I>) => Promise<I>;
  disconnect: () => Promise<void>;
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;
  createWalletInstance: <I extends WalletInstance>(
    Wallet: WalletConfig<I>,
  ) => I;
  createdWalletInstance?: WalletInstance;
  createWalletStorage: CreateAsyncStorage;
  switchChain: (chain: number) => Promise<void>;
  chainToConnect?: Chain;
  activeChain: Chain;
  setConnectedWallet: (
    wallet: WalletInstance,
    params?: ConnectParams<Record<string, any>>,
  ) => Promise<void>;
  /**
   * Get wallet config object from wallet instance
   */
  getWalletConfig: (walletInstance: WalletInstance) => WalletConfig | undefined;
  /**
   * Get the "wrapper wallet" ( safe/smart wallet ) of the given personal wallet instance
   */
  getWrapperWallet: (
    walletInstance: WalletInstance,
  ) => WalletInstance | undefined;
  activeChainSetExplicitly: boolean;
  clientId?: string;
  walletConnectHandler: WalletConnectHandler | undefined;
  personalWalletConnection: WalletConnectionSetup;
  isAutoConnecting: boolean;
};

export const ThirdwebWalletContext = /* @__PURE__ */ createContext<
  ThirdwebWalletContextData | undefined
>(undefined);

export type WalletConnectionSetup = {
  signer: Signer | undefined;
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;
  activeWallet: WalletInstance | undefined;
  createdWalletInstance: WalletInstance | undefined;
  activeWalletConfig: WalletConfig | undefined;
  createWalletInstance: <I extends WalletInstance>(
    walletConfig: WalletConfig<I>,
  ) => I;
  setConnectedWallet: (
    WalletInstance: WalletInstance,
    connectParams?: ConnectParams<Record<string, any>>,
    isAutoConnect?: boolean,
  ) => Promise<void>;
  switchChain: (chainId: number) => Promise<void>;
  connectWallet: <I extends WalletInstance>(
    ...args: ConnectFnArgs<I>
  ) => Promise<I>;
  disconnectWallet: () => Promise<void>;
  chainId: number | undefined;
  address: string | undefined;
};

/**
 * setup states and methods for wallet connection
 */
function useWalletConnectionSetup(
  data: WalletSetupData,
  initialValue: {
    connectionStatus: ConnectionStatus;
  },
): WalletConnectionSetup {
  const { chains, chainToConnect, dAppMeta, clientId, activeChain } = data;

  const [signer, setSigner] = useState<Signer | undefined>(undefined);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    initialValue.connectionStatus,
  );

  const [activeWallet, setActiveWallet] = useState<
    WalletInstance | undefined
  >();

  const [createdWalletInstance, setCreatedWalletInstance] = useState<
    WalletInstance | undefined
  >();

  const [activeWalletConfig, setActiveWalletConfig] = useState<
    WalletConfig | undefined
  >();

  const [chainId, setChainId] = useState<number | undefined>(undefined);

  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    undefined,
  );

  const walletParams: WalletOptions = useMemo(() => {
    return {
      chains: chains,
      dappMetadata: dAppMeta,
      chain: activeChain || chains[0],
      clientId: clientId,
    };
  }, [chains, dAppMeta, activeChain, clientId]);

  const createWalletInstance = useCallback(
    <I extends WalletInstance>(walletConfig: WalletConfig<I>): I => {
      const walletInstance = walletConfig.create(walletParams);
      if (walletInstance.walletId === walletIds.magicLink) {
        // NOTE: removing this if statement causes the component to re-render
        // Patch for magic link wallet in react native
        // needed because we need to add a component to the view tree
        // from the instance, right before calling connect.
        // Check it out in RN's DappContextProvider.
        setCreatedWalletInstance(walletInstance);
      }
      walletInstanceToConfig.set(walletInstance, walletConfig);
      return walletInstance;
    },
    [walletParams],
  );

  const setConnectedWallet = useCallback(
    async (
      wallet: WalletInstance,
      connectParams?: ConnectParams<Record<string, any>>,
      isAutoConnect = false,
    ) => {
      const walletConfig = walletInstanceToConfig.get(wallet);
      if (!walletConfig) {
        throw new Error(
          "Wallet config not found for given wallet instance. Do not create a wallet instance manually - use the useCreateWalletInstance() hook instead",
        );
      }

      const [_signer, _chainId, _address] = await Promise.all([
        wallet.getSigner(),
        wallet.getChainId(),
        wallet.getAddress(),
      ]);

      // set states for the connected wallet
      setActiveWallet(wallet);
      setChainId(_chainId);
      setWalletAddress(_address);
      setSigner(_signer);
      setActiveWalletConfig(walletConfig);
      setConnectionStatus("connected");

      // if personal wallet exists, we need to replace the connectParams.personalWallet to a stringifiable version
      const personalWallet = wallet.getPersonalWallet() as AbstractClientWallet;
      personalWalletToWrapperWallet.set(personalWallet, wallet);

      // it autoconnected, then the details is already saved in storage, no need to store again
      if (isAutoConnect) {
        return;
      }

      // save to storage

      const walletInfo: LastConnectedWalletInfo = {
        walletId: walletConfig.id,
        connectParams: connectParams || wallet.getConnectParams(),
      };

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

  const storeLastActiveChainId = useCallback(async (_chainId: number) => {
    const lastConnectedWallet = await lastConnectedWalletStorage.getItem(
      LAST_CONNECTED_WALLET_STORAGE_KEY,
    );

    if (!lastConnectedWallet) {
      return;
    }

    try {
      const parsedWallet = JSON.parse(lastConnectedWallet as string);
      if (parsedWallet.connectParams) {
        parsedWallet.connectParams.chainId = _chainId;
      } else {
        parsedWallet.connectParams = { chainId: _chainId };
      }
      await lastConnectedWalletStorage.setItem(
        LAST_CONNECTED_WALLET_STORAGE_KEY,
        JSON.stringify(parsedWallet),
      );
    } catch (error) {
      console.error(`Error saving the last active chain: ${error}`);
    }
  }, []);

  const switchChain = useCallback(
    async (_chainId: number) => {
      if (!activeWallet) {
        throw new Error("No active wallet");
      }

      await activeWallet.switchChain(_chainId);
      const _signer = await activeWallet.getSigner();
      await storeLastActiveChainId(_chainId);

      setSigner(_signer);
    },
    [activeWallet, storeLastActiveChainId],
  );

  const connectWallet = useCallback(
    async <I extends WalletInstance>(...args: ConnectFnArgs<I>): Promise<I> => {
      const [WalletObj, connectParams] = args;

      const _connectedParams = {
        chainId: chainToConnect?.chainId,
        ...(connectParams || {}),
      };

      const wallet = createWalletInstance(WalletObj);
      setConnectionStatus("connecting");
      try {
        // if magic is using social login - it will redirect the page - so need to save walletInfo before connecting
        // TODO: find a better way to handle this
        if (WalletObj.id === walletIds.magicLink) {
          saveLastConnectedWalletInfo({
            walletId: WalletObj.id,
            connectParams: _connectedParams,
          });
        }
        await wallet.connect(_connectedParams);
        setConnectedWallet(wallet, _connectedParams);
      } catch (e: any) {
        console.error(`Error connecting to wallet: ${e}`);
        setConnectionStatus("disconnected");
        throw e;
      }

      return wallet;
    },
    [createWalletInstance, setConnectedWallet, chainToConnect],
  );

  const onWalletDisconnect = useCallback(() => {
    setConnectionStatus("disconnected");
    setSigner(undefined);
    setActiveWallet(undefined);
    setActiveWalletConfig(undefined);
    setChainId(undefined);
    setWalletAddress(undefined);
    lastConnectedWalletStorage.removeItem(LAST_CONNECTED_WALLET_STORAGE_KEY);
  }, []);

  const disconnectWallet = useCallback(async () => {
    // if disconnect is called before the wallet is connected
    if (!activeWallet) {
      onWalletDisconnect();
      return;
    }

    onWalletDisconnect();
    const personalWallet = activeWallet.getPersonalWallet();
    await activeWallet.disconnect();

    if (personalWallet) {
      await (personalWallet as AbstractClientWallet)?.disconnect();
    }
  }, [activeWallet, onWalletDisconnect]);

  // handle wallet change event
  useEffect(() => {
    if (!activeWallet) {
      setSigner(undefined);
      setChainId(undefined);
      setWalletAddress(undefined);
      return;
    }

    const update = async () => {
      Promise.all([
        activeWallet.getSigner(),
        activeWallet.getChainId(),
        activeWallet.getAddress(),
      ]).then(([_signer, _chainId, _address]) => {
        setSigner(_signer);
        setChainId(_chainId);
        setWalletAddress(_address);
      });
    };

    update();
    activeWallet.addListener("change", update);
    activeWallet.addListener("disconnect", onWalletDisconnect);

    return () => {
      activeWallet.removeListener("change", update);
      activeWallet.removeListener("disconnect", onWalletDisconnect);
    };
  }, [activeWallet, onWalletDisconnect]);

  // if props.chains is updated, update the active wallet's chains
  useEffect(() => {
    if (activeWallet) {
      activeWallet.updateChains(chains);
    }
  }, [activeWallet, chains]);

  return {
    signer,
    connectionStatus,
    setConnectionStatus,
    activeWallet,
    createdWalletInstance,
    activeWalletConfig,
    createWalletInstance,
    setConnectedWallet,
    switchChain,
    connectWallet,
    disconnectWallet,
    chainId,
    address: walletAddress,
  };
}

export function ThirdwebWalletProvider(
  props: PropsWithChildren<{
    activeChain: Chain;
    supportedWallets: WalletConfig[];
    shouldAutoConnect?: boolean;
    createWalletStorage: CreateAsyncStorage;
    dAppMeta?: DAppMetaData;
    chains: Chain[];
    autoSwitch?: boolean;
    autoConnectTimeout?: number;
    clientId?: string;
    activeChainSetExplicitly: boolean;
    signerWallet?: WalletConfig<SignerWallet>;
  }>,
) {
  // if autoSwitch is enabled - enforce connection to activeChain
  const chainToConnect = props.autoSwitch ? props.activeChain : undefined;

  const autoConnectTimeout = props.autoConnectTimeout || 15000;

  const walletSetupData: WalletSetupData = {
    chains: props.chains,
    dAppMeta: props.dAppMeta,
    activeChain: props.activeChain,
    clientId: props.clientId,
    chainToConnect,
  };

  const {
    signer,
    connectionStatus,
    setConnectionStatus,
    activeWallet,
    createdWalletInstance,
    activeWalletConfig,
    createWalletInstance,
    setConnectedWallet,
    switchChain,
    connectWallet,
    disconnectWallet,
    address,
    chainId,
  } = useWalletConnectionSetup(walletSetupData, {
    connectionStatus: "unknown",
  });

  const personalWalletConnection = useWalletConnectionSetup(walletSetupData, {
    connectionStatus: "disconnected",
  });

  /**
   * This is used to know if auto connect is in progress
   */
  const [isAutoConnecting, setIsAutoConnecting] = useState(false);

  const [walletConnectHandler, setWalletConnectHandler] =
    useState<WalletConnectHandler>();

  if (!lastConnectedWalletStorage) {
    lastConnectedWalletStorage =
      props.createWalletStorage("coordinatorStorage");
  }

  useEffect(() => {
    if (!activeWallet) {
      return;
    }

    const initWCHandler = async () => {
      const wcReceiverOptions =
        activeWallet?.getOptions() as WalletConnectReceiverConfig;

      const handler = new WalletConnectV2Handler(
        {
          walletConnectReceiver: {
            ...(wcReceiverOptions?.walletConnectReceiver === true
              ? {}
              : wcReceiverOptions?.walletConnectReceiver),
          },
        },
        activeWallet,
      );
      await handler.init();
      setWalletConnectHandler(handler);
    };

    if (isWalletConnectReceiverEnabled(activeWallet)) {
      initWCHandler();
    }
  }, [activeWallet]);

  const autoConnectTriggered = useRef(false);

  // Auto Connect
  useEffect(() => {
    if (autoConnectTriggered.current) {
      return;
    }

    autoConnectTriggered.current = true;

    // do not auto connect if signerWallet is given
    if (props.signerWallet) {
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

    // if explicitly set to false, don't auto connect
    // by default, auto connect
    if (props.shouldAutoConnect === false) {
      setConnectionStatus("disconnected");
      return;
    }

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

      let _personalWalletInfo = walletInfo.connectParams?.personalWallet;

      let shouldSetPersonalWalletAsActive = false;

      // if the wallet requires a personal wallet (like smartWallet), but the saved data does not have it
      // this can happen when user clicks on "switch to personal wallet" and reloads the page
      // OR when user clicks on magic link social login
      if (walletObj.personalWallets && !_personalWalletInfo) {
        // for magicLink social login - don't switch to personal wallet because smartWallet did not have a chance to connect because of page change
        if (
          walletInfo.walletId === walletIds.magicLink &&
          walletInfo.connectParams &&
          "oauthProvider" in walletInfo.connectParams
        ) {
          shouldSetPersonalWalletAsActive = false;
        } else {
          shouldSetPersonalWalletAsActive = true;
        }

        // fix the connectParams by adding the personal wallet info
        _personalWalletInfo = {
          walletId: walletInfo.walletId,
          connectParams: walletInfo.connectParams,
        };
      }

      const personalWalletInfo = _personalWalletInfo;
      let personalWalletInstance: WalletInstance | undefined;

      if (personalWalletInfo) {
        const personalWallets = walletObj.personalWallets || [];

        const personalWalletObj = personalWallets.find(
          (W) => W.id === personalWalletInfo.walletId,
        );
        if (personalWalletObj) {
          // create a personal wallet instance and auto connect it
          personalWalletInstance = createWalletInstance(personalWalletObj);

          try {
            await timeoutPromise(
              personalWalletInstance.autoConnect(
                personalWalletInfo.connectParams,
              ),
              {
                ms: autoConnectTimeout,
                message: autoConnectTimeoutErrorMessage,
              },
            );

            if (shouldSetPersonalWalletAsActive) {
              setConnectedWallet(
                personalWalletInstance,
                personalWalletInfo.connectParams,
                true,
              );
            }
          } catch (e) {
            console.error("Failed to auto connect personal wallet");
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
        setIsAutoConnecting(true);
        setConnectionStatus("connecting");

        if (personalWalletInstance) {
          personalWalletToWrapperWallet.set(personalWalletInstance, wallet);
        }

        await timeoutPromise(wallet.autoConnect(walletInfo.connectParams), {
          ms: autoConnectTimeout,
          message: autoConnectTimeoutErrorMessage,
        });

        if (!shouldSetPersonalWalletAsActive) {
          setConnectedWallet(wallet, walletInfo.connectParams, true);
        }
      } catch (e) {
        console.error("Failed to auto connect wallet");
        console.error(e);
        if (
          e instanceof Error &&
          e.message === autoConnectTimeoutErrorMessage
        ) {
          lastConnectedWalletStorage.removeItem(
            LAST_CONNECTED_WALLET_STORAGE_KEY,
          );
        }
        setConnectionStatus("disconnected");
      }

      setIsAutoConnecting(false);
    }

    autoconnect();
  }, [
    createWalletInstance,
    props.supportedWallets,
    setConnectedWallet,
    props.shouldAutoConnect,
    activeWallet,
    connectionStatus,
    props.signerWallet,
    setConnectionStatus,
    autoConnectTimeout,
  ]);

  // connect signerWallet immediately if it's passed
  // and disconnect it if it's not passed
  const signerConnected = useRef<typeof props.signerWallet>();
  useEffect(() => {
    if (!props.signerWallet) {
      if (signerConnected.current) {
        disconnectWallet();
        signerConnected.current = undefined;
      }
      return;
    }

    if (signerConnected.current === props.signerWallet) {
      return;
    }

    const wallet = createWalletInstance(props.signerWallet);
    setConnectedWallet(wallet);
    signerConnected.current = props.signerWallet;
  }, [
    createWalletInstance,
    props.supportedWallets,
    setConnectedWallet,
    props.signerWallet,
    disconnectWallet,
  ]);

  return (
    <ThirdwebWalletContext.Provider
      value={{
        address,
        chainId,
        disconnect: disconnectWallet,
        wallets: props.supportedWallets,
        connect: connectWallet,
        signer,
        activeWallet,
        activeWalletConfig,
        connectionStatus,
        setConnectionStatus,
        createWalletInstance: createWalletInstance,
        createdWalletInstance: createdWalletInstance,
        createWalletStorage: props.createWalletStorage,
        switchChain,
        setConnectedWallet: setConnectedWallet,
        activeChain: props.activeChain,
        chainToConnect,
        getWalletConfig: (walletInstance: WalletInstance) => {
          return walletInstanceToConfig.get(walletInstance);
        },
        getWrapperWallet: (personalWallet: WalletInstance) => {
          return personalWalletToWrapperWallet.get(personalWallet);
        },
        activeChainSetExplicitly: props.activeChainSetExplicitly,
        clientId: props.clientId,
        walletConnectHandler: walletConnectHandler,
        personalWalletConnection,
        isAutoConnecting,
      }}
    >
      {props.children}
    </ThirdwebWalletContext.Provider>
  );
}

/**
 * @internal
 */
export function useWalletContext() {
  const ctx = useContext(ThirdwebWalletContext);
  if (!ctx) {
    throw new Error(
      `useWalletContext() can only be used inside <ThirdwebProvider />`,
    );
  }
  return ctx;
}

/**
 * Get WalletConnect handler instance
 */
export function useWalletConnectHandler() {
  const ctx = useWalletContext();
  if (!ctx) {
    throw new Error(
      `useWalletConnectHandler() can only be used inside <ThirdwebProvider />`,
    );
  }
  return ctx.walletConnectHandler;
}

async function getLastConnectedWalletInfo() {
  const str = await lastConnectedWalletStorage.getItem(
    LAST_CONNECTED_WALLET_STORAGE_KEY,
  );
  if (!str) {
    return null;
  }

  try {
    return JSON.parse(str) as LastConnectedWalletInfo;
  } catch {
    await lastConnectedWalletStorage.removeItem(
      LAST_CONNECTED_WALLET_STORAGE_KEY,
    );
    return null;
  }
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

/**
 * Timeout a promise with a given Error message if the promise does not resolve in given time
 *
 * @param promise - Promise to track for timeout
 * @param option - timeout options
 * @returns
 */
function timeoutPromise<T>(
  promise: Promise<T>,
  option: { ms: number; message: string },
) {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(option.message));
    }, option.ms);

    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      },
    );
  });
}

const autoConnectTimeoutErrorMessage = `Failed to Auto connect. Auto connect timed out. You can increase the timeout duration using the autoConnectTimeout prop on <ThirdwebProvider />`;
