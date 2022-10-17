import { __DEV__ } from "../constants/runtime";
import { useThirdwebConfigContext } from "./thirdweb-config";
import { UserWallet } from "@thirdweb-dev/sdk";
import { Signer } from "ethers";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

interface ThirdwebConnectedWalletContext {
  wallet: UserWallet | undefined;
  address: string | undefined;
  chainId: number | undefined;
  signer: Signer | undefined;
}

const INITIAL_CONTEXT_VALUE: ThirdwebConnectedWalletContext = {
  wallet: undefined,
  address: undefined,
  chainId: undefined,
  signer: undefined,
};

const ThirdwebConnectedWalletContext =
  createContext<ThirdwebConnectedWalletContext>(INITIAL_CONTEXT_VALUE);

export const ThirdwebConnectedWalletProvider: React.FC<
  PropsWithChildren<{ signer?: Signer }>
> = ({ signer, children }) => {
  const { rpcUrlMap } = useThirdwebConfigContext();

  const [contextValue, setContextValue] =
    useState<ThirdwebConnectedWalletContext>(INITIAL_CONTEXT_VALUE);

  useEffect(() => {
    let s = signer;
    if (signer) {
      // just get both of these up front and keep them around with the context
      Promise.all([signer.getAddress(), signer.getChainId()])
        .then(([address, chainId]) => {
          const rpcUrl = rpcUrlMap[chainId];
          // only if the signer is still the same!
          if (signer === s) {
            const wallet = new UserWallet(signer, {
              readonlySettings: rpcUrl
                ? {
                    rpcUrl,
                    chainId,
                  }
                : undefined,
            });
            setContextValue({ wallet, address, chainId, signer });
          }
        })
        .catch((err) => {
          if (__DEV__) {
            console.warn(
              "failed to get wallet instance in `<ThirdwebConnectedWalletProvider />`",
              err,
            );
          }
        });
    } else {
      // if signer is not provided, re-set the context value to initial values
      setContextValue(INITIAL_CONTEXT_VALUE);
    }
    return () => {
      // set the previous signer to undefined because it is invalid now
      s = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer]);

  return (
    <ThirdwebConnectedWalletContext.Provider value={contextValue}>
      {children}
    </ThirdwebConnectedWalletContext.Provider>
  );
};

export function useThirdwebConnectedWalletContext() {
  return useContext(ThirdwebConnectedWalletContext);
}
