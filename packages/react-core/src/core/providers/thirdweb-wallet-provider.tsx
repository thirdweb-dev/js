/* eslint-disable prefer-const */
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

type PersonalWalletInfo = {
  signer?: Signer;
  wallet?: WalletInstance;
  walletConfig?: WalletConfig;
  connectionStatus: ConnectionStatus;
  chainId?: number;
  disconnect: () => Promise<void>;
  switchChain: (chainId: number) => Promise<void>;
};

type ThirdwebWalletContextData = {
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
  activeChainSetExplicitly: boolean;
  clientId?: string;
  /**
   * flag indicating whether to treat any connection that happens as a personal wallet connection or not
   */
  isConnectingToPersonalWallet: boolean;
  /**
   * Set value of `isConnectingToPersonalWallet` flag
   */
  setIsConnectingToPersonalWallet: (value: boolean) => void;
  /**
   * object containing info about the connected personal wallet
   * When `isConnectingToPersonalWallet` is set to true, and a wallet is connected after that, all the info about the connected wallet will be available here instead
   */
  personalWalletInfo: PersonalWalletInfo;
};

const ThirdwebWalletContext = /* @__PURE__ */ createContext<
  ThirdwebWalletContextData | undefined
>(undefined);

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
  const autoConnectTimeout = props.autoConnectTimeout || 15000;

  if (!lastConnectedWalletStorage) {
    lastConnectedWalletStorage =
      props.createWalletStorage("coordinatorStorage");
  }

  // if autoSwitch is enabled - enforce connection to activeChain
  const chainToConnect = props.autoSwitch ? props.activeChain : undefined;

  const [isConnectingToPersonalWallet, setIsConnectingToPersonalWallet] =
    useState(false);

  const personalWalletConnection = usePersonalWalletConnection();

  const {
    wallet: personalWallet,
    setWallet: setPersonalWallet,
    setSigner: setPersonalWalletSigner,
    setConnectionStatus: setPersonalWalletConnectionStatus,
    setWalletConfig: setPersonalWalletConfig,
  } = personalWalletConnection;

  const [signer, setSigner] = useState<Signer | undefined>(undefined);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("unknown");

  const [activeWallet, setActiveWallet] = useState<
    WalletInstance | undefined
  >();

  const [createdWalletInstance, setCreatedWalletInstance] = useState<
    WalletInstance | undefined
  >();

  const [activeWalletConfig, setActiveWalletConfig] = useState<
    WalletConfig | undefined
  >();

  const walletParams: WalletOptions = useMemo(() => {
    return {
      chains: props.chains,
      dappMetadata: props.dAppMeta,
      chain: props.activeChain || props.chains[0],
      clientId: props.clientId,
    };
  }, [props.chains, props.dAppMeta, props.activeChain, props.clientId]);

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

  // if props.chains is updated, update the wallet's chains
  useEffect(() => {
    if (activeWallet) {
      activeWallet.updateChains(props.chains);
      const _personalWallet = activeWallet.getPersonalWallet();
      if (_personalWallet instanceof AbstractClientWallet) {
        _personalWallet.updateChains(props.chains);
      }
    }

    if (isConnectingToPersonalWallet && personalWallet) {
      personalWallet.updateChains(props.chains);
    }
  }, [
    activeWallet,
    props.chains,
    personalWallet,
    isConnectingToPersonalWallet,
  ]);

  const setConnectedWallet = useCallback(
    async (
      wallet: WalletInstance,
      connectParams?: ConnectParams<Record<string, any>>,
      isAutoConnect = false,
    ) => {
      if (isConnectingToPersonalWallet) {
        setPersonalWallet(wallet);
      } else {
        setActiveWallet(wallet);
      }

      const walletConfig = walletInstanceToConfig.get(wallet);
      if (!walletConfig) {
        throw new Error(
          "Wallet config not found for given wallet instance. Do not create a wallet instance manually - use the useCreateWalletInstance() hook instead",
        );
      }

      if (isConnectingToPersonalWallet) {
        setPersonalWalletConfig(walletConfig);
        setPersonalWalletConnectionStatus("connected");
      } else {
        setActiveWalletConfig(walletConfig);
        setConnectionStatus("connected");
      }

      const _signer = await wallet.getSigner();

      if (isConnectingToPersonalWallet) {
        setPersonalWalletSigner(_signer);
      } else {
        setSigner(_signer);
      }

      // it auto-connected, then the details is already saved in storage, no need to store again
      if (isAutoConnect) {
        return;
      }

      // do not save connection details for personal wallet
      if (isConnectingToPersonalWallet) {
        return;
      }

      // save to storage

      const walletInfo: LastConnectedWalletInfo = {
        walletId: walletConfig.id,
        connectParams: connectParams || wallet.getConnectParams(),
      };

      // if personal wallet exists, we need to replace the connectParams.personalWallet to a serializable version
      const _personalWallet =
        wallet.getPersonalWallet() as AbstractClientWallet;

      const _personalWalletConfig = walletInstanceToConfig.get(_personalWallet);

      if (_personalWallet && _personalWalletConfig) {
        walletInfo.connectParams = {
          ...walletInfo.connectParams,
          personalWallet: {
            walletId: _personalWalletConfig.id,
            connectParams: _personalWallet.getConnectParams(),
          },
        };

        saveLastConnectedWalletInfo(walletInfo);
      } else {
        saveLastConnectedWalletInfo(walletInfo);
      }
    },
    [
      isConnectingToPersonalWallet,
      setPersonalWallet,
      setPersonalWalletConfig,
      setPersonalWalletConnectionStatus,
      setPersonalWalletSigner,
    ],
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
      if (parsedWallet.connectParams) {
        parsedWallet.connectParams.chainId = chainId;
      } else {
        parsedWallet.connectParams = { chainId };
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
    async (chainId: number) => {
      const wallet = isConnectingToPersonalWallet
        ? personalWallet
        : activeWallet;

      if (!wallet) {
        throw new Error("No active wallet");
      }

      await wallet.switchChain(chainId);
      const _signer = await wallet.getSigner();

      if (!isConnectingToPersonalWallet) {
        await storeLastActiveChainId(chainId);
        setSigner(_signer);
      } else {
        setPersonalWalletSigner(_signer);
      }
    },
    [
      isConnectingToPersonalWallet,
      personalWallet,
      activeWallet,
      storeLastActiveChainId,
      setPersonalWalletSigner,
    ],
  );

  // Auto Connect
  const autoConnectTriggered = useRef(false);
  useEffect(() => {
    // do not auto connect if signerWallet is given
    if (props.signerWallet) {
      return;
    }

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

    async function autoConnect() {
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
        const personalWallets = walletObj.personalWallets || [];

        const personalWalletObj = personalWallets.find(
          (W) => W.id === personalWalletInfo.walletId,
        );
        if (personalWalletObj) {
          // create a personal wallet instance and auto connect it
          const personalWalletInstance =
            createWalletInstance(personalWalletObj);

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
        setConnectionStatus("connecting");
        await timeoutPromise(wallet.autoConnect(walletInfo.connectParams), {
          ms: autoConnectTimeout,
          message: autoConnectTimeoutErrorMessage,
        });
        setConnectedWallet(wallet, walletInfo.connectParams, true);
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
    }

    autoConnect();
  }, [
    createWalletInstance,
    props.supportedWallets,
    setConnectedWallet,
    props.shouldAutoConnect,
    activeWallet,
    connectionStatus,
    autoConnectTimeout,
    props.signerWallet,
    setConnectionStatus,
  ]);

  const connectWallet = useCallback(
    async <I extends WalletInstance>(...args: ConnectFnArgs<I>): Promise<I> => {
      const [WalletObj, connectParams] = args;

      const _connectedParams = {
        chainId: chainToConnect?.chainId,
        ...(connectParams || {}),
      };

      const wallet = createWalletInstance(WalletObj);
      if (isConnectingToPersonalWallet) {
        setPersonalWalletConnectionStatus("connecting");
      } else {
        setConnectionStatus("connecting");
      }

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
        if (isConnectingToPersonalWallet) {
          setPersonalWalletConnectionStatus("disconnected");
        } else {
          setConnectionStatus("disconnected");
        }
        throw e;
      }

      return wallet;
    },
    [
      chainToConnect?.chainId,
      createWalletInstance,
      isConnectingToPersonalWallet,
      setPersonalWalletConnectionStatus,
      setConnectedWallet,
    ],
  );

  const onWalletDisconnect = useCallback(async () => {
    await lastConnectedWalletStorage.removeItem(
      LAST_CONNECTED_WALLET_STORAGE_KEY,
    );
    if (isConnectingToPersonalWallet) {
      setPersonalWalletConnectionStatus("disconnected");
      setPersonalWalletSigner(undefined);
      setPersonalWallet(undefined);
      setPersonalWalletConfig(undefined);
    } else {
      setConnectionStatus("disconnected");
      setSigner(undefined);
      setActiveWallet(undefined);
      setActiveWalletConfig(undefined);
    }
  }, [
    isConnectingToPersonalWallet,
    setPersonalWallet,
    setPersonalWalletConnectionStatus,
    setPersonalWalletSigner,
    setPersonalWalletConfig,
  ]);

  const disconnectWallet = useCallback(async () => {
    const wallet = isConnectingToPersonalWallet ? personalWallet : activeWallet;

    if (wallet) {
      const _personalWallet = wallet.getPersonalWallet();
      await wallet.disconnect();
      if (_personalWallet instanceof AbstractClientWallet) {
        await _personalWallet.disconnect();
      }
    }
    console.log("disconnect the", { wallet, isConnectingToPersonalWallet });
    onWalletDisconnect();
  }, [
    activeWallet,
    isConnectingToPersonalWallet,
    onWalletDisconnect,
    personalWallet,
  ]);

  // when wallet's network or account is changed using the extension, update UI
  useEffect(() => {
    const wallet = isConnectingToPersonalWallet ? personalWallet : activeWallet;

    if (!wallet) {
      return;
    }

    const update = async () => {
      const _signer = await wallet.getSigner();
      if (isConnectingToPersonalWallet) {
        setPersonalWalletSigner(_signer);
      } else {
        setSigner(_signer);
      }
    };

    wallet.addListener("change", () => {
      update();
    });

    wallet.addListener("disconnect", () => {
      onWalletDisconnect();
    });

    return () => {
      wallet.removeListener("change");
      wallet.removeListener("disconnect");
    };
  }, [
    activeWallet,
    isConnectingToPersonalWallet,
    onWalletDisconnect,
    personalWallet,
    setPersonalWalletSigner,
    setSigner,
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
        activeChainSetExplicitly: props.activeChainSetExplicitly,
        clientId: props.clientId,
        isConnectingToPersonalWallet,
        setIsConnectingToPersonalWallet,
        personalWalletInfo: {
          wallet: personalWalletConnection.wallet,
          signer: personalWalletConnection.signer,
          walletConfig: personalWalletConnection.walletConfig,
          connectionStatus: personalWalletConnection.connectionStatus,
          chainId: personalWalletConnection.chainId,
          disconnect: personalWalletConnection.disconnect,
          switchChain: personalWalletConnection.switchChain,
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

function usePersonalWalletConnection() {
  const [signer, setSigner] = useState<Signer | undefined>(undefined);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("unknown");
  const [wallet, setWallet] = useState<WalletInstance | undefined>();
  const [walletConfig, setWalletConfig] = useState<WalletConfig | undefined>();
  const [chainId, setChainId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (wallet) {
      const update = () => {
        wallet?.getChainId().then((_chainId) => {
          setChainId(_chainId);
        });
      };

      update();
      wallet.addListener("change", update);
    } else {
      setChainId(undefined);
    }
  }, [wallet]);

  const disconnect = useCallback(async () => {
    setConnectionStatus("disconnected");
    setSigner(undefined);
    setWallet(undefined);
    setWalletConfig(undefined);
    if (wallet) {
      await wallet.disconnect();
    }
  }, [wallet]);

  const switchChain = useCallback(
    async (_chainId: number) => {
      if (!wallet) {
        throw new Error("No active wallet");
      }

      await wallet.switchChain(_chainId);
      const _signer = await wallet.getSigner();
      setSigner(_signer);
    },
    [wallet],
  );

  return {
    signer: signer,
    setSigner: setSigner,
    wallet: wallet,
    setWallet: setWallet,
    walletConfig: walletConfig,
    setWalletConfig: setWalletConfig,
    connectionStatus: connectionStatus,
    setConnectionStatus: setConnectionStatus,
    chainId: chainId,
    disconnect,
    switchChain,
  };
}
