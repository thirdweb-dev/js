import { DAppMetaData } from "../types/dAppMeta";
import { SupportedWallet } from "../types/wallet";
import { timeoutPromise } from "../utils";
import { ThirdwebThemeContext } from "./theme-context";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
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
type WalletConnectParams<W extends SupportedWallet> = NonNullable<
  Parameters<InstanceType<W>["connect"]>[0]
>;

type ConnectionStatus = "unknown" | "connected" | "disconnected" | "connecting";

type ThirdwebWalletContextData = {
  wallets: SupportedWallet[];
  signer?: Signer;
  activeWallet?: InstanceType<SupportedWallet>;
  connect: <W extends SupportedWallet>(
    wallet: W,
    connectParams: WalletConnectParams<W>,
  ) => Promise<void>;
  disconnect: () => Promise<void>;
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;
  createWalletInstance: (
    Wallet: SupportedWallet,
  ) => InstanceType<SupportedWallet>;
  createWalletStorage: CreateAsyncStorage;
  switchChain: (chain: number) => Promise<void>;
  activeChainId?: number;
  chainIdToConnect?: number;
  handleWalletConnect: (walletId: InstanceType<SupportedWallet>) => void;
};

const ThirdwebWalletContext = createContext<
  ThirdwebWalletContextData | undefined
>(undefined);

export function ThirdwebWalletProvider(
  props: PropsWithChildren<{
    activeChain: Chain;
    supportedWallets: SupportedWallet[];
    shouldAutoConnect?: boolean;
    createWalletStorage: CreateAsyncStorage;
    dAppMeta: DAppMetaData;
    chains: Chain[];
  }>,
) {
  const [signer, setSigner] = useState<Signer | undefined>(undefined);
  const [activeChainId, setActiveChainId] = useState<number | undefined>();
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("unknown");

  const [activeWallet, setActiveWallet] = useState<
    InstanceType<SupportedWallet> | undefined
  >();

  if (!coordinatorStorage) {
    coordinatorStorage = props.createWalletStorage("coordinatorStorage");
  }

  // connect to this chain when wallet is connected
  const chainIdToConnect = props.activeChain.chainId;

  const theme = useContext(ThirdwebThemeContext);

  const createWalletInstance = useCallback(
    (Wallet: SupportedWallet) => {
      const walletChains = props.chains || defaultChains;

      let walletOptions = {
        chains: walletChains,
        shouldAutoConnect: props.shouldAutoConnect,
        dappMetadata: props.dAppMeta,
      };

      return new Wallet({
        ...walletOptions,
        chain: props.activeChain,
        coordinatorStorage,
        theme: theme || "dark",
      });
    },
    [props, theme],
  );

  const handleWalletConnect = useCallback(
    async (wallet: InstanceType<SupportedWallet>) => {
      const _signer = await wallet.getSigner();
      const _chainId = await _signer.getChainId();
      setSigner(_signer);
      setActiveChainId(_chainId);
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
      const _chainId = await _signer.getChainId();

      setActiveChainId(_chainId);
      setSigner(_signer);
    },
    [activeWallet],
  );

  const autoConnectTriggered = useRef(false);

  // Auto Connect
  // TODO - Can't do auto connect for Device Wallet right now
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
      const lastConnectedWallet = await coordinatorStorage.getItem(
        "lastConnectedWallet",
      );

      const Wallet = lastConnectedWallet
        ? props.supportedWallets.find((W) => {
            return W.name
              .toLowerCase()
              .includes(lastConnectedWallet?.toLowerCase() || "");
          })
        : undefined;

      if (Wallet && Wallet.id !== "deviceWallet") {
        const wallet = createWalletInstance(Wallet);
        try {
          setConnectionStatus("connecting");
          // give up auto connect if it takes more than 3 seconds
          // this is to handle the edge case when trying to auto-connect to wallet that does not exist anymore (extension is uninstalled)
          await timeoutPromise(
            3000,
            wallet.autoConnect(),
            `AutoConnect timeout`,
          );
          handleWalletConnect(wallet);
        } catch (e) {
          setConnectionStatus("disconnected");
          throw e;
        }
      } else {
        setConnectionStatus("disconnected");
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
    async <W extends SupportedWallet>(
      Wallet: W,
      connectParams: Parameters<InstanceType<W>["connect"]>[0],
    ) => {
      const _connectedParams = {
        chainId: chainIdToConnect,
        ...connectParams,
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
    [createWalletInstance, handleWalletConnect, chainIdToConnect],
  );

  const onWalletDisconnect = useCallback(() => {
    setConnectionStatus("disconnected");
    setSigner(undefined);
    setActiveChainId(undefined);
    setActiveWallet(undefined);
  }, []);

  const disconnectWallet = useCallback(async () => {
    // get the connected wallet
    if (!activeWallet) {
      return Promise.resolve();
    }

    return activeWallet.disconnect().then(() => {
      onWalletDisconnect();
    });
  }, [activeWallet, onWalletDisconnect]);

  // when wallet's network or account is changed using the extension, update UI
  useEffect(() => {
    if (!activeWallet) {
      return;
    }

    const update = async () => {
      const _signer = await activeWallet.getSigner();
      const _chainId = await _signer.getChainId();
      setSigner(_signer);
      setActiveChainId(_chainId);
    };

    activeWallet.addListener("change", () => {
      update();
    });

    activeWallet.addListener("disconnect", () => {
      onWalletDisconnect();
    });
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
        activeChainId,
        handleWalletConnect,
        chainIdToConnect,
      }}
    >
      {props.children}
    </ThirdwebWalletContext.Provider>
  );
}

export function useThirdwebWallet() {
  return useContext(ThirdwebWalletContext);
}
