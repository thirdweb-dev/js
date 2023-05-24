import { __DEV__ } from "../../core/constants/runtime";
import { useThirdwebConfigContext } from "./thirdweb-config";
import { getChainRPC } from "@thirdweb-dev/chains";
import { UserWallet } from "@thirdweb-dev/sdk";
import { Signer } from "ethers";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
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
  const { chains, thirdwebApiKey, alchemyApiKey, infuraApiKey } =
    useThirdwebConfigContext();

  const [contextValue, setContextValue] =
    useState<ThirdwebConnectedWalletContext>({
      ...INITIAL_CONTEXT_VALUE,
      signer: signer ? signer : undefined,
    });

  useEffect(() => {
    setContextValue((val) => ({
      ...val,
      signer: signer ? signer : undefined,
    }));
  }, [signer]);

  useEffect(() => {
    let s = signer;
    if (signer) {
      (async () => {
        console.log("signer.twconnected.address.before");
        const address = await signer.getChainId();
        console.log("signer.twconnected.address", address);
      })();
      // just get both of these up front and keep them around with the context
      Promise.all([signer.getAddress(), signer.getChainId()])
        .then(([address, chainId]) => {
          console.log("connected wallet context");
          console.log("address", address);
          console.log("chainId", chainId);

          const chain = chains.find((c) => c.chainId === chainId);
          let rpcUrl = undefined;
          if (chain) {
            try {
              rpcUrl = getChainRPC(chain, {
                thirdwebApiKey,
                alchemyApiKey,
                infuraApiKey,
              });
            } catch (e) {
              // failed to get a viable rpc url, nothing we can do
              console.error(e);
            }
          }

          console.log("check same signer", signer === s);
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
          console.log("check same signer", err);
          if (__DEV__) {
            console.warn(
              "failed to get wallet instance in `<ThirdwebConnectedWalletProvider />`",
              err,
            );
          }
        })
        .finally(() => {
          console.log("check same signer promise resolved");
        });
    } else {
      console.log("signer.twconnected.signer.notprovided");
      // if signer is not provided, re-set the context value to initial values
      setContextValue(INITIAL_CONTEXT_VALUE);
    }
    return () => {
      // set the previous signer to undefined because it is invalid now
      s = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, thirdwebApiKey, alchemyApiKey, infuraApiKey]);

  return (
    <ThirdwebConnectedWalletContext.Provider value={contextValue}>
      {children}
    </ThirdwebConnectedWalletContext.Provider>
  );
};

export function useThirdwebConnectedWalletContext() {
  return useContext(ThirdwebConnectedWalletContext);
}
