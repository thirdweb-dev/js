import { TW_WC_PROJECT_ID } from "../constants/wc";
import { DAppMetaData } from "../types/dAppMeta";
import {
  CoinbaseWalletType,
  DeviceWalletType,
  MetaMaskWalletType,
  SupportedWallet,
  WalletConnectWalletType,
  WalletConnectV1WalletType,
} from "../types/wallet";
import { transformChainToMinimalWagmiChain } from "../utils";
import { ThirdwebThemeContext } from "./theme-context";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import {
  AsyncStorage,
  CreateAsyncStorage,
  WalletOptions,
} from "@thirdweb-dev/wallets";
import { Signer } from "ethers";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

let coordinatorStorage: AsyncStorage;
let deviceWalletStorage: AsyncStorage;
let connectorStorage: AsyncStorage;
const walletStorageMap: Map<string, AsyncStorage> = new Map();

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
  disconnect: () => void;
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
  displayUri?: string;
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
  const [displayUri, setDisplayUri] = useState<string | undefined>();
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("unknown");

  const [activeWallet, setActiveWallet] = useState<
    InstanceType<SupportedWallet> | undefined
  >();

  if (!coordinatorStorage) {
    coordinatorStorage = props.createWalletStorage("coordinatorStorage");
  }

  if (!connectorStorage) {
    connectorStorage = props.createWalletStorage("connector");
  }

  if (!deviceWalletStorage) {
    deviceWalletStorage = props.createWalletStorage("deviceWallet");
  }

  // connect to this chain when wallet is connected
  const chainIdToConnect = props.activeChain.chainId;

  const theme = useContext(ThirdwebThemeContext);

  const createWalletInstance = useCallback(
    <W extends SupportedWallet>(Wallet: W) => {
      let walletStorage = walletStorageMap.get(Wallet.id);

      if (!walletStorage) {
        walletStorage = props.createWalletStorage(`wallet_${Wallet.id}`);
        walletStorageMap.set(Wallet.id, walletStorage);
      }

      const walletChains =
        props.chains.map(transformChainToMinimalWagmiChain) ||
        defaultChains.map(transformChainToMinimalWagmiChain);

      let walletOptions: WalletOptions = {
        chains: walletChains,
        shouldAutoConnect: props.shouldAutoConnect,
        coordinatorStorage,
        walletStorage: walletStorage,
        dappMetadata: props.dAppMeta,
      };

      // Device wallet
      if (Wallet.id === "deviceWallet") {
        return new (Wallet as DeviceWalletType)({
          ...walletOptions,
          chain: props.activeChain,
          // can't use credentialStore right now - so use asyncStore
          storageType: "asyncStore",
          storage: deviceWalletStorage,
        });
      }

      // Metamask
      if (Wallet.id === "metamask") {
        return new (Wallet as MetaMaskWalletType)({
          ...walletOptions,
          connectorStorage,
        });
      }

      // Coinbase
      if (Wallet.id === "coinbaseWallet") {
        return new (Wallet as CoinbaseWalletType)({
          ...walletOptions,
          darkMode: theme === "dark",
        });
      }

      // WalletConnect v2
      if (Wallet.id === "walletConnect") {
        return new (Wallet as WalletConnectWalletType)({
          ...walletOptions,
          projectId: TW_WC_PROJECT_ID,
          // TODO - move this to class itself - use wrapper wallet classes
          // true for react, false for react-native
          qrcode: typeof document !== "undefined",
        });
      }

      // WalletConnectV1
      if (Wallet.id === "walletConnectV1") {
        return new (Wallet as WalletConnectV1WalletType)({
          ...walletOptions,
          // TODO - move this to class itself - use wrapper wallet classes
          // true for react, false for react-native
          qrcode: typeof document !== "undefined",
        });
      }

      throw new Error(`Unsupported wallet`);
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

  // Auto Connect
  // TODO - Can't do auto connect for Device Wallet right now
  useEffect(() => {
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

    (async () => {
      const lastConnectedWalletId = await coordinatorStorage.getItem(
        "lastConnectedWallet",
      );

      const Wallet = props.supportedWallets.find(
        (W) => W.id === lastConnectedWalletId,
      );

      if (Wallet && Wallet.id !== "deviceWallet") {
        const wallet = createWalletInstance(Wallet);
        try {
          setConnectionStatus("connecting");
          await wallet.autoConnect();
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
  ]);

  const onWCOpenWallet = useCallback((uri?: string) => {
    if (uri) {
      setDisplayUri(uri);
    }
  }, []);

  const connectWallet = useCallback(
    async <W extends SupportedWallet>(
      Wallet: W,
      connectParams: Parameters<InstanceType<W>["connect"]>[0],
    ) => {
      // Device wallet
      if (Wallet.id === "deviceWallet") {
        const _connectedParams = {
          chainId: chainIdToConnect,
          ...(connectParams as WalletConnectParams<DeviceWalletType>),
        };

        const wallet = createWalletInstance(
          Wallet as DeviceWalletType,
        ) as InstanceType<DeviceWalletType>;

        setConnectionStatus("connecting");

        try {
          await wallet.connect(_connectedParams);
          handleWalletConnect(wallet);
        } catch (e: any) {
          setConnectionStatus("disconnected");
          throw e;
        }
      }

      // Metamask
      else if (Wallet.id === "metamask") {
        const _connectedParams = {
          chainId: chainIdToConnect,
          ...(connectParams as WalletConnectParams<MetaMaskWalletType>),
        };

        const wallet = createWalletInstance(
          Wallet as MetaMaskWalletType,
        ) as InstanceType<MetaMaskWalletType>;

        setConnectionStatus("connecting");
        try {
          await wallet.connect(_connectedParams);
          handleWalletConnect(wallet);
        } catch (e: any) {
          setConnectionStatus("disconnected");
          throw e;
        }
      }

      // Coinbase
      else if (Wallet.id === "coinbaseWallet") {
        const _connectedParams = {
          chainId: chainIdToConnect,
          ...(connectParams as WalletConnectParams<CoinbaseWalletType>),
        };

        const wallet = createWalletInstance(
          Wallet as CoinbaseWalletType,
        ) as InstanceType<CoinbaseWalletType>;

        setConnectionStatus("connecting");
        try {
          await wallet.connect(_connectedParams);
          handleWalletConnect(wallet);
        } catch (e: any) {
          setConnectionStatus("disconnected");
          throw e;
        }
      }

      // WalletConnect v2
      else if (Wallet.id === "walletConnect") {
        const _connectedParams = {
          chainId: chainIdToConnect,
          ...(connectParams as WalletConnectParams<WalletConnectWalletType>),
        };

        const wallet = createWalletInstance(
          Wallet as WalletConnectWalletType,
        ) as InstanceType<WalletConnectWalletType>;
        wallet.on("open_wallet", onWCOpenWallet);

        setConnectionStatus("connecting");
        try {
          await wallet.connect(_connectedParams);
          handleWalletConnect(wallet);
        } catch (e: any) {
          setConnectionStatus("disconnected");
          throw e;
        }
      }

      // WalletConnect v1
      else if (Wallet.id === "walletConnectV1") {
        const _connectedParams = {
          chainId: chainIdToConnect,
          ...(connectParams as WalletConnectParams<WalletConnectWalletType>),
        };

        const wallet = createWalletInstance(
          Wallet as WalletConnectV1WalletType,
        ) as InstanceType<WalletConnectV1WalletType>;
        wallet.on("open_wallet", onWCOpenWallet);

        setConnectionStatus("connecting");
        try {
          await wallet.connect(_connectedParams);
          handleWalletConnect(wallet);
        } catch (e: any) {
          setConnectionStatus("disconnected");
          throw e;
        }
      }
    },
    [
      createWalletInstance,
      handleWalletConnect,
      onWCOpenWallet,
      chainIdToConnect,
    ],
  );

  const disconnectWallet = useCallback(() => {
    // get the connected wallet
    if (!activeWallet) {
      return;
    }

    console.log("disconnecting wallet", activeWallet.walletId);

    if (activeWallet.walletId.includes("walletConnect")) {
      activeWallet.removeListener("open_wallet", onWCOpenWallet);
    }

    activeWallet.disconnect().then(() => {
      setSigner(undefined);
      setActiveChainId(undefined);
      setActiveWallet(undefined);
      setDisplayUri(undefined);
    });
  }, [activeWallet, onWCOpenWallet]);

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

    activeWallet.connector?.getProvider().then((provider) => {
      if (!provider) {
        return;
      }

      // TODO - once the wallet.addListener('change', cb) is working - use that
      provider.on("chainChanged", update);
      provider.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          update();
        }
      });
      provider.on("disconnect", () => {
        disconnectWallet();
      });
    });
  }, [activeWallet, disconnectWallet]);

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
        displayUri,
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

type DeviceWalletStorage = {
  data: string | null;
  address: string | null;
};

export function useDeviceWalletStorage() {
  const [_deviceWalletStorage, _setDeviceWalletStorage] = useState<
    DeviceWalletStorage | undefined
  >(undefined);

  useEffect(() => {
    Promise.all([
      deviceWalletStorage.getItem("data"),
      deviceWalletStorage.getItem("address"),
    ]).then(([_data, _address]) => {
      _setDeviceWalletStorage({
        data: _data,
        address: _address,
      });
    });
  }, []);

  return _deviceWalletStorage;
}
