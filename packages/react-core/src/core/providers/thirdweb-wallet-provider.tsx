import { DAppMetaData } from "../types/dAppMeta";
import type { Wallet, WalletInstance } from "../types/wallet";
import { timeoutPromise } from "../utils/timeoutPromise";
import { ThirdwebThemeContext } from "./theme-context";
import { Chain } from "@thirdweb-dev/chains";
import {
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
let coordinatorStorage: AsyncStorage;

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
    dAppMeta: DAppMetaData;
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

  if (!coordinatorStorage) {
    coordinatorStorage = props.createWalletStorage("coordinatorStorage");
  }

  // if autoSwitch is enabled - enforce connection to activeChain
  const chainToConnect = props.autoSwitch ? props.activeChain : undefined;

  const theme = useContext(ThirdwebThemeContext);

  const walletParams = useMemo(() => {
    const walletChains = props.chains;
    const walletOptions = {
      chains: walletChains,
      shouldAutoConnect: props.shouldAutoConnect,
      dappMetadata: props.dAppMeta,
    };

    return {
      ...walletOptions,
      chain: props.activeChain || props.chains[0],
      theme: theme || "dark",
    };
  }, [
    props.chains,
    props.shouldAutoConnect,
    props.dAppMeta,
    props.activeChain,
    theme,
  ]);

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
      params?: ConnectParams<Record<string, any>>,
    ) => {
      const connectParams = params || walletParams;
      const lastConnectedWallet = {
        walletId: wallet.walletId,
        connectParams,
      };

      try {
        await coordinatorStorage.setItem(
          LAST_CONNECTED_WALLET_STORAGE_KEY,
          JSON.stringify(lastConnectedWallet),
        );
      } catch (e) {
        console.error(e);
      }

      const _signer = await wallet.getSigner();
      setSigner(_signer);
      setActiveWallet(wallet);
      setConnectionStatus("connected");
    },
    [walletParams],
  );

  const storeLastActiveChainId = useCallback(async (chainId: number) => {
    const lastConnectedWallet = await coordinatorStorage.getItem(
      LAST_CONNECTED_WALLET_STORAGE_KEY,
    );

    if (!lastConnectedWallet) {
      return;
    }

    try {
      const parsedWallet = JSON.parse(lastConnectedWallet as string);
      parsedWallet.connectParams.chainId = chainId;
      await coordinatorStorage.setItem(
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
    (async () => {
      const lastConnectedWalletInfo = await coordinatorStorage.getItem(
        LAST_CONNECTED_WALLET_STORAGE_KEY,
      );

      if (!lastConnectedWalletInfo) {
        setConnectionStatus("disconnected");
        return;
      }

      let parsedParams: ConnectParams<Record<string, any>> | undefined;
      let lastConnectedWalletId: string | undefined;

      try {
        const parsedWallet = JSON.parse(lastConnectedWalletInfo as string);
        parsedParams = parsedWallet.connectParams;
        lastConnectedWalletId = parsedWallet.walletId;
      } catch (error) {
        console.error(`Error parsing the last connected wallet: ${error}`);
      }

      if (!lastConnectedWalletId) {
        setConnectionStatus("disconnected");
        return;
      }

      let lastConnectedWallet = props.supportedWallets.find(
        (W) => W.id === lastConnectedWalletId,
      );

      if (!lastConnectedWallet) {
        setConnectionStatus("disconnected");
        return;
      }

      const wallet = createWalletInstance(lastConnectedWallet);
      try {
        setConnectionStatus("connecting");
        // give up auto connect if it takes more than 10 seconds
        // this is to handle the edge case when trying to auto-connect to wallet that does not exist anymore (extension is uninstalled)
        await timeoutPromise(
          10000,
          wallet.autoConnect(parsedParams),
          `AutoConnect timeout`,
        );
        handleWalletConnect(wallet, parsedParams);
      } catch (e) {
        setConnectionStatus("disconnected");
        throw e;
      }
    })();
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
    await coordinatorStorage.removeItem(LAST_CONNECTED_WALLET_STORAGE_KEY);
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
