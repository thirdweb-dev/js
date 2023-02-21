import { DAppMetaData } from "../types/dAppMeta";
import {
  CoinbaseWalletType,
  DeviceWalletType,
  MetaMaskWalletType,
  SupportedWallet,
} from "../types/wallet";
import { transformChainToMinimalWagmiChain } from "../utils";
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

type ConnectingToWallet = SupportedWallet["id"];

type ThirdwebWalletContextData = {
  wallets: SupportedWallet[];
  signer?: Signer;
  activeWallet?: InstanceType<SupportedWallet>;
  connect: <W extends SupportedWallet>(
    wallet: W,
    connectParams: WalletConnectParams<W>,
  ) => Promise<void>;
  disconnect: () => void;
  connectingToWallet?: ConnectingToWallet;
  createWalletInstance: (
    Wallet: SupportedWallet,
  ) => InstanceType<SupportedWallet>;
  createWalletStorage: CreateAsyncStorage;
  switchChain: (chain: number) => Promise<void>;
  activeChainId?: number;
  accountAddress?: string;
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
  const [accountAddress, setAccountAddress] = useState<string | undefined>();

  const [activeWallet, setActiveWallet] = useState<
    InstanceType<SupportedWallet> | undefined
  >();
  const [connectingToWallet, setIsConnectingToWallet] = useState<
    ConnectingToWallet | undefined
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
        appName: props.dAppMeta.name,
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
        });
      }

      throw new Error(`Unsupported wallet`);
    },
    [props],
  );

  const handleWalletConnected = useCallback(
    async (wallet: InstanceType<SupportedWallet>) => {
      const _signer = await wallet.getSigner();
      const _chainId = await _signer.getChainId();
      setSigner(_signer);
      setActiveChainId(_chainId);
      setActiveWallet(wallet);
      setIsConnectingToWallet(undefined);
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
        const _address = await wallet.autoConnect();
        setAccountAddress(_address);
        handleWalletConnected(wallet);
      }
    })();
  }, [
    createWalletInstance,
    props.supportedWallets,
    handleWalletConnected,
    props.shouldAutoConnect,
  ]);

  const connectWallet = useCallback(
    async <W extends SupportedWallet>(
      Wallet: W,
      connectParams: Parameters<InstanceType<W>["connect"]>[0],
    ) => {
      // Device wallet
      if (Wallet.id === "deviceWallet") {
        const _connectedParams =
          connectParams as WalletConnectParams<DeviceWalletType>;

        const wallet = createWalletInstance(
          Wallet as DeviceWalletType,
        ) as InstanceType<DeviceWalletType>;

        setIsConnectingToWallet(Wallet.id);

        const address = await wallet.connect(_connectedParams);
        setAccountAddress(address);
        handleWalletConnected(wallet);
      }

      // Metamask
      else if (Wallet.id === "metamask") {
        const _connectedParams = connectParams as NonNullable<
          Parameters<InstanceType<MetaMaskWalletType>["connect"]>[0]
        >;

        const wallet = createWalletInstance(
          Wallet as MetaMaskWalletType,
        ) as InstanceType<MetaMaskWalletType>;

        try {
          setIsConnectingToWallet(Wallet.id);
          const address = await wallet.connect(_connectedParams);
          setAccountAddress(address);
          handleWalletConnected(wallet);
        } catch (e: any) {
          if (e.message === "Resource unavailable") {
            // if we have already requested metamask earlier and asking again
            // in that case metamask is still in connecting status, so don't reset
            // reset when user rejects the connect request
            wallet.addListener("error", () => {
              setIsConnectingToWallet(undefined);
            });
          } else {
            setIsConnectingToWallet(undefined);
          }

          throw e;
        }
      }

      // Coinbase
      else if (Wallet.id === "coinbaseWallet") {
        const _connectedParams = connectParams as NonNullable<
          Parameters<InstanceType<CoinbaseWalletType>["connect"]>[0]
        >;

        const wallet = createWalletInstance(
          Wallet as CoinbaseWalletType,
        ) as InstanceType<CoinbaseWalletType>;

        try {
          setIsConnectingToWallet(Wallet.id);
          const address = await wallet.connect(_connectedParams);
          setAccountAddress(address);
          handleWalletConnected(wallet);
        } catch (e: any) {
          setIsConnectingToWallet(undefined);
        }
      }
    },
    [createWalletInstance, handleWalletConnected],
  );

  const disconnectWallet = useCallback(() => {
    // get the connected wallet
    if (!activeWallet) {
      return;
    }
    activeWallet.disconnect().then(() => {
      setSigner(undefined);
      setActiveChainId(undefined);
      setActiveWallet(undefined);
    });
  }, [activeWallet]);

  return (
    <ThirdwebWalletContext.Provider
      value={{
        disconnect: disconnectWallet,
        wallets: props.supportedWallets,
        connect: connectWallet,
        signer,
        activeWallet,
        connectingToWallet: connectingToWallet,
        createWalletInstance: createWalletInstance,
        createWalletStorage: props.createWalletStorage,
        switchChain,
        activeChainId,
        accountAddress,
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
