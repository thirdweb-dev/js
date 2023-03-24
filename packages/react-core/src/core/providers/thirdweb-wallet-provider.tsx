import { DAppMetaData } from "../types/dAppMeta";
import { SupportedWallet, SupportedWalletInstance } from "../types/wallet";
import { timeoutPromise } from "../utils/timeoutPromise";
import { ThirdwebThemeContext } from "./theme-context";
import { Chain } from "@thirdweb-dev/chains";
import { AsyncStorage, CreateAsyncStorage } from "@thirdweb-dev/wallets";
import { Signer } from "ethers";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

let coordinatorStorage: AsyncStorage;

type NonNullable<T> = T extends null | undefined ? never : T;
type WalletConnectParams<I extends SupportedWalletInstance> = Parameters<
  I["connect"]
>[0];

type ConnectionStatus = "unknown" | "connected" | "disconnected" | "connecting";

type ConnectFnArgs<I extends SupportedWalletInstance> =
  // if second argument is optional
  undefined extends WalletConnectParams<I>
    ? [
        wallet: SupportedWallet<I>,
        connectParams?: NonNullable<WalletConnectParams<I>>,
      ]
    : // if second argument is required
      [
        wallet: SupportedWallet<I>,
        connectParams: NonNullable<WalletConnectParams<I>>,
      ];

type ThirdwebWalletContextData = {
  wallets: SupportedWallet[];
  signer?: Signer;
  activeWallet?: InstanceType<SupportedWallet>;
  connect: <I extends SupportedWalletInstance>(
    ...args: ConnectFnArgs<I>
  ) => Promise<void>;
  disconnect: () => Promise<void>;
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;
  createWalletInstance: (
    Wallet: SupportedWallet,
  ) => InstanceType<SupportedWallet>;
  createWalletStorage: CreateAsyncStorage;
  switchChain: (chain: number) => Promise<void>;
  chainToConnect?: Chain;
  activeChain?: Chain;
  handleWalletConnect: (walletId: InstanceType<SupportedWallet>) => void;
};

const ThirdwebWalletContext = createContext<
  ThirdwebWalletContextData | undefined
>(undefined);

export function ThirdwebWalletProvider(
  props: PropsWithChildren<{
    activeChain?: Chain;
    supportedWallets: SupportedWallet[];
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
    InstanceType<SupportedWallet> | undefined
  >();

  if (!coordinatorStorage) {
    coordinatorStorage = props.createWalletStorage("coordinatorStorage");
  }

  // if autoSwitch is enabled - enforce connection to activeChain
  const chainToConnect = props.autoSwitch ? props.activeChain : undefined;

  const theme = useContext(ThirdwebThemeContext);

  const createWalletInstance = useCallback(
    (Wallet: SupportedWallet) => {
      const walletChains = props.chains;

      let walletOptions = {
        chains: walletChains,
        shouldAutoConnect: props.shouldAutoConnect,
        dappMetadata: props.dAppMeta,
      };

      return new Wallet({
        ...walletOptions,
        chain: props.activeChain || props.chains[0],
        coordinatorStorage,
        theme: theme || "dark",
      });
    },
    [
      props.chains,
      props.shouldAutoConnect,
      props.dAppMeta,
      props.activeChain,
      theme,
    ],
  );

  // if props.chains is updated, update the active wallet's chains
  useEffect(() => {
    if (activeWallet) {
      activeWallet.updateChains(props.chains);
    }
  }, [activeWallet, props.chains]);

  const handleWalletConnect = useCallback(
    async (wallet: InstanceType<SupportedWallet>) => {
      const _signer = await wallet.getSigner();
      setSigner(_signer);
      setActiveWallet(wallet);
      setConnectionStatus("connected");
    },
    [],
  );

  const switchChain = useCallback(
    async (chainId: number) => {
      if (!activeWallet) {
        throw new Error("No active wallet");
      }

      await activeWallet.switchChain(chainId);
      const _signer = await activeWallet.getSigner();

      setSigner(_signer);
    },
    [activeWallet],
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
      const lastConnectedWalletId = await coordinatorStorage.getItem(
        "lastConnectedWallet",
      );

      if (!lastConnectedWalletId) {
        setConnectionStatus("disconnected");
        return;
      }

      let Wallet = props.supportedWallets.find(
        (W) => W.id === lastConnectedWalletId,
      );

      if (!Wallet) {
        setConnectionStatus("disconnected");
        return;
      }

      const wallet = createWalletInstance(Wallet);
      try {
        setConnectionStatus("connecting");
        // give up auto connect if it takes more than 10 seconds
        // this is to handle the edge case when trying to auto-connect to wallet that does not exist anymore (extension is uninstalled)
        await timeoutPromise(
          10000,
          wallet.autoConnect(),
          `AutoConnect timeout`,
        );
        handleWalletConnect(wallet);
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
    async <I extends SupportedWalletInstance>(...args: ConnectFnArgs<I>) => {
      const [Wallet, connectParams] = args;

      const _connectedParams = {
        chainId: chainToConnect?.chainId,
        ...(connectParams || {}),
      };

      const wallet = createWalletInstance(Wallet);
      setConnectionStatus("connecting");
      try {
        await wallet.connect(_connectedParams);
        handleWalletConnect(wallet);
      } catch (e: any) {
        console.error(e);
        setConnectionStatus("disconnected");
        throw e;
      }
    },
    [createWalletInstance, handleWalletConnect, chainToConnect],
  );

  const onWalletDisconnect = useCallback(() => {
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
