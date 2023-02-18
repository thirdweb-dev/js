import { DAppMetaData } from "../types/dAppMeta";
import {
  DeviceWalletType,
  MetaMaskWalletType,
  SupportedWallet,
} from "../types/wallet";
import { transformChainToMinimalWagmiChain } from "../utils";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import type {
  AsyncStorage,
  CreateAsyncStorage,
  WalletOptions,
} from "@thirdweb-dev/wallets";
import { Signer } from "ethers";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import invariant from "tiny-invariant";

let coordinatorStorage: AsyncStorage;
let deviceWalletStorage: AsyncStorage;
let connectorStorage: AsyncStorage;
const walletStorageMap: Map<string, AsyncStorage> = new Map();

type NonNullable<T> = T extends null | undefined ? never : T;
type WalletConnectParams<W extends SupportedWallet> = NonNullable<
  Parameters<InstanceType<W>["connect"]>[0]
>;

type ThirdwebWalletContextData = {
  wallets: SupportedWallet[];
  signer?: Signer;
  activeWallet?: InstanceType<SupportedWallet>;
  connect: <W extends SupportedWallet>(
    wallet: W,
    connectParams: WalletConnectParams<W>,
  ) => Promise<void>;
  disconnect: () => void;
};

const ThirdwebWalletContext = createContext<
  ThirdwebWalletContextData | undefined
>(undefined);

type ThirdwebWalletProviderProps = PropsWithChildren<{
  activeChain: Chain;
  wallets: SupportedWallet[];
  shouldAutoConnect?: boolean;
  createWalletStorage: CreateAsyncStorage;
  dAppMeta: DAppMetaData;
  chains: Chain[];
}>;

export function ThirdwebWalletProvider(props: ThirdwebWalletProviderProps) {
  const [signer, setSigner] = useState<Signer | undefined>(undefined);
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

  const getConstructorArg = useCallback(
    <W extends SupportedWallet>(Wallet: W): ConstructorParameters<W>[0] => {
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
        return {
          ...walletOptions,
          chain: props.activeChain,
          // can't use credentialStore right now - so use asyncStore
          storageType: "asyncStore",
          storage: deviceWalletStorage,
        };
      }

      // Metamask
      if (Wallet.id === "metamask") {
        return {
          ...walletOptions,
          connectorStorage,
        };
      }

      throw new Error(`Unsupported wallet`);
    },
    [props],
  );

  const handleWalletConnected = useCallback(
    async (wallet: InstanceType<SupportedWallet>) => {
      const _signer = await wallet.getSigner();
      setSigner(_signer);
      setActiveWallet(wallet);
    },
    [],
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

      const Wallet = props.wallets.find((W) => W.id === lastConnectedWalletId);
      if (Wallet) {
        const wallet = new Wallet(getConstructorArg(Wallet));
        await wallet.autoConnect();
        handleWalletConnected(wallet);
      }
    })();
  }, [
    getConstructorArg,
    props.wallets,
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

        const _Wallet = Wallet as DeviceWalletType;
        const wallet = new _Wallet(getConstructorArg(_Wallet));

        await wallet.connect(_connectedParams);
        handleWalletConnected(wallet);
      }

      // Metamask
      else if (Wallet.id === "metamask") {
        const _Wallet = Wallet as MetaMaskWalletType;
        const _connectedParams = connectParams as NonNullable<
          Parameters<InstanceType<MetaMaskWalletType>["connect"]>[0]
        >;

        const wallet = new _Wallet(getConstructorArg(_Wallet));

        await wallet.connect(_connectedParams);
        handleWalletConnected(wallet);
      }
    },
    [getConstructorArg, handleWalletConnected],
  );

  const disconnectWallet = useCallback(() => {
    // get the connected wallet
    if (!activeWallet) {
      return;
    }
    activeWallet.disconnect().then(() => {
      setSigner(undefined);
      setActiveWallet(undefined);
    });
  }, [activeWallet]);

  return (
    <ThirdwebWalletContext.Provider
      value={{
        disconnect: disconnectWallet,
        wallets: props.wallets,
        connect: connectWallet,
        signer,
        activeWallet,
      }}
    >
      {props.children}
    </ThirdwebWalletContext.Provider>
  );
}

export function useThirdwebWallet() {
  const context = useContext(ThirdwebWalletContext);
  if (!context) {
    invariant(
      context,
      "useThirdwebWallet must be used within a ThirdwebProvider",
    );
  }
  return context;
}

export function useWalletSigner() {
  return useThirdwebWallet().signer;
}
