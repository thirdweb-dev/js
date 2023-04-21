import { DAppMetaData } from "../types/dAppMeta";
import type { Wallet, WalletInstance } from "../types/wallet";
import { ThirdwebThemeContext } from "./theme-context";
import { Chain } from "@thirdweb-dev/chains";
import {
  AsyncStorage,
  ConnectParams,
  CreateAsyncStorage,
} from "@thirdweb-dev/wallets";
import type { DeviceWallet } from "@thirdweb-dev/wallets";
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
import { getCredentials, isCredentialsSupported } from "../utils/credentials";

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
    ? [wallet: Wallet<I>, connectParams?: NonNullable<WalletConnectParams<I>>]
    : // if second argument is required
      [wallet: Wallet<I>, connectParams: NonNullable<WalletConnectParams<I>>];

type ThirdwebWalletContextData = {
  wallets: Wallet[];
  signer?: Signer;
  activeWallet?: WalletInstance;
  connect: <I extends WalletInstance>(
    ...args: ConnectFnArgs<I>
  ) => Promise<void>;
  disconnect: () => Promise<void>;
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;
  createWalletInstance: <I extends WalletInstance>(Wallet: Wallet<I>) => I;
  createWalletStorage: CreateAsyncStorage;
  switchChain: (chain: number) => Promise<void>;
  chainToConnect?: Chain;
  activeChain?: Chain;
  handleWalletConnect: (
    wallet: WalletInstance,
    params?: ConnectParams<Record<string, any>>,
  ) => void;
};

const ThirdwebWalletContext = createContext<
  ThirdwebWalletContextData | undefined
>(undefined);

export function ThirdwebWalletProvider(
  props: PropsWithChildren<{
    activeChain?: Chain;
    supportedWallets: Wallet[];
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
    <I extends WalletInstance>(wallet: Wallet<I>): I => {
      return wallet.create(walletParams);
    },
    [walletParams],
  );

  // if props.chains is updated, update the active wallet's chains
  useEffect(() => {
    if (activeWallet) {
      activeWallet.updateChains(props.chains);
    }
  }, [activeWallet, props.chains]);

  const handleWalletConnect = useCallback(
    async (
      wallet: WalletInstance,
      connectParams?: ConnectParams<Record<string, any>>,
      isAutoConnect = false,
    ) => {
      const _signer = await wallet.getSigner();
      setSigner(_signer);
      setActiveWallet(wallet);
      setConnectionStatus("connected");

      // it autoconnected, then the details is already saved in storage, no need to store again
      if (isAutoConnect) {
        return;
      }

      // save to storage
      const walletInfo: LastConnectedWalletInfo = {
        walletId: wallet.walletId,
        connectParams,
      };

      // if personal wallet exists, we need to replace the connectParams.personalWallet to a stringifiable version
      const personalWallet = wallet.getPersonalWallet();
      if (personalWallet) {
        const personalWalletInfo = await getLastConnectedWalletInfo();
        if (personalWalletInfo) {
          walletInfo.connectParams = {
            ...walletInfo.connectParams,
            personalWallet: personalWalletInfo,
          };
          saveLastConnectedWalletInfo(walletInfo);
        } else {
          console.error("Can not save wallet info for", wallet);
        }
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

    async function autoConnectPersonalWallet(
      personalWallet: WalletInstance,
      connectParams?: ConnectParams,
    ) {
      if (personalWallet.walletId === "deviceWallet") {
        if (!isCredentialsSupported) {
          setConnectionStatus("disconnected");
          return;
        }

        const creds = await getCredentials();

        if (!creds) {
          setConnectionStatus("disconnected");
          throw new Error("No credentials");
          return;
        }

        try {
          await (personalWallet as DeviceWallet).import({
            privateKey: creds.password,
            encryption: false,
          });
        } catch (e) {
          setConnectionStatus("disconnected");
          return;
        }
      }

      await personalWallet.autoConnect(connectParams);
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

      const personalWalletInfo = walletInfo.connectParams?.personalWallet;

      if (personalWalletInfo) {
        const personalWalleObj = props.supportedWallets.find(
          (W) => W.id === personalWalletInfo.walletId,
        );
        if (personalWalleObj) {
          // create a personal wallet instance and auto connect it
          const personalWalletInstance = createWalletInstance(personalWalleObj);
          await autoConnectPersonalWallet(
            personalWalletInstance,
            personalWalletInfo.connectParams,
          );

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
        await autoConnectPersonalWallet(wallet, walletInfo.connectParams);
        handleWalletConnect(wallet, walletInfo.connectParams, true);
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
    handleWalletConnect,
    props.shouldAutoConnect,
    activeWallet,
    connectionStatus,
  ]);

  const connectWallet = useCallback(
    async <I extends WalletInstance>(...args: ConnectFnArgs<I>) => {
      const [WalletObj, connectParams] = args;

      const _connectedParams = {
        chainId: chainToConnect?.chainId,
        ...(connectParams || {}),
      };

      const wallet = createWalletInstance(WalletObj);
      setConnectionStatus("connecting");
      try {
        await wallet.connect(_connectedParams);
        handleWalletConnect(wallet, _connectedParams);
      } catch (e: any) {
        console.error(`Error connecting to wallet: ${e}`);
        setConnectionStatus("disconnected");
        throw e;
      }
    },
    [createWalletInstance, handleWalletConnect, chainToConnect],
  );

  const onWalletDisconnect = useCallback(async () => {
    await lastConnectedWalletStorage.removeItem(
      LAST_CONNECTED_WALLET_STORAGE_KEY,
    );
    setConnectionStatus("disconnected");
    setSigner(undefined);
    setActiveWallet(undefined);
  }, []);

  const disconnectWallet = useCallback(async () => {
    // if disconnect is called before the wallet is connected
    if (!activeWallet) {
      onWalletDisconnect();
      return;
    }

    await activeWallet.disconnect();
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
        connectionStatus,
        setConnectionStatus,
        createWalletInstance: createWalletInstance,
        createWalletStorage: props.createWalletStorage,
        switchChain,
        handleWalletConnect,
        activeChain: props.activeChain,
        chainToConnect,
      }}
    >
      {props.children}
    </ThirdwebWalletContext.Provider>
  );
}

export function useThirdwebWallet() {
  return useContext(ThirdwebWalletContext);
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
    console.error(e);
  }
}
