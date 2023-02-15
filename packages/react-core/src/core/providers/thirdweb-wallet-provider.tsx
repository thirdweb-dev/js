import { DAppMetaData } from "../types/dAppMeta";
import { transformChainToMinimalWagmiChain } from "../utils";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import type { DeviceWalletOptions } from "@thirdweb-dev/wallets";
import { AsyncStorage, WalletOptions } from "@thirdweb-dev/wallets";
import { Signer } from "ethers";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import invariant from "tiny-invariant";

// TODO: add correct type for wallet class
type Wallet = any;

let coordinatorStorage: AsyncStorage;
const walletStorageMap: Map<string, AsyncStorage> = new Map();

type ThirdwebWalletContextData = {
  wallets: Wallet[];
  signer?: Signer;
  activeWallet?: Wallet;
  connect: (wallet: Wallet) => Promise<void>;
};

const ThirdwebWalletContext = createContext<
  ThirdwebWalletContextData | undefined
>(undefined);

export function ThirdwebWalletProvider(
  props: PropsWithChildren<{
    value: {
      activeChain: Chain;
      wallets: Wallet[];
      shouldAutoConnect?: boolean;
      storage: AsyncStorage;
      dAppMeta: DAppMetaData;
      chains: Chain[];
    };
  }>,
) {
  const [signer, setSigner] = useState<Signer | undefined>(undefined);

  if (!coordinatorStorage) {
    coordinatorStorage = props.value.storage.createInstance("");
  }

  const connect = useCallback(
    async (walletClass: Wallet) => {
      let walletStorage = walletStorageMap.get(walletClass.id);

      if (!walletStorage) {
        walletStorage = props.value.storage.createInstance(
          `wallet_${walletClass.id}`,
        );
        walletStorageMap.set(walletClass.id, walletStorage);
      }

      let options: WalletOptions = {
        chains:
          props.value.chains.map(transformChainToMinimalWagmiChain) ||
          defaultChains.map(transformChainToMinimalWagmiChain),
        shouldAutoConnect: props.value.shouldAutoConnect,
        coordinatorStorage,
        walletStorage: walletStorage,
        appName: props.value.dAppMeta.name,
      };

      if (walletClass.id === "deviceWallet") {
        (options as WalletOptions<DeviceWalletOptions>).chain =
          props.value.activeChain;
        // todo : options.storage
      }

      const wallet = new walletClass(options);
      await wallet.connect();
      const _signer = await wallet.getSigner();
      setSigner(_signer);
    },
    [
      props.value.activeChain,
      props.value.chains,
      props.value.dAppMeta.name,
      props.value.shouldAutoConnect,
      props.value.storage,
    ],
  );

  return (
    <ThirdwebWalletContext.Provider
      value={{ wallets: props.value.wallets, connect, signer }}
    >
      {props.children}
    </ThirdwebWalletContext.Provider>
  );
}

export function useThirdwebWalletContext() {
  const context = useContext(ThirdwebWalletContext);
  if (!context) {
    invariant(
      context,
      "useThirdwebWalletContext must be used within a ThirdwebWalletProvider",
    );
  }
  return context;
}

export function useWalletSigner() {
  return useThirdwebWalletContext().signer;
}
