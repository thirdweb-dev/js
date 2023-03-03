import { DAppMetaData } from "../types/dAppMeta";
import { SupportedWallet } from "../types/wallet";
import { transformChainToMinimalWagmiChain } from "../utils";
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

  // connect to this chain when wallet is connected
  const chainIdToConnect = props.activeChain.chainId;

  const theme = useContext(ThirdwebThemeContext);

  const createWalletInstance = useCallback(
    (Wallet: SupportedWallet) => {
      const walletChains =
        props.chains.map(transformChainToMinimalWagmiChain) ||
        defaultChains.map(transformChainToMinimalWagmiChain);

      let walletOptions = {
        chains: walletChains,
        shouldAutoConnect: props.shouldAutoConnect,
        dappMetadata: props.dAppMeta,
      };

      return new Wallet({
        ...walletOptions,
        chain: props.activeChain,
        coordinatorStorage,
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
        setConnectionStatus("disconnected");
        throw e;
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
