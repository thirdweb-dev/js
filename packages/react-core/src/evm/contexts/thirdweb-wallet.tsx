import { __DEV__ } from "../../core/constants/runtime";
import { useThirdwebConfigContext } from "./thirdweb-config";
import { getValidChainRPCs } from "@thirdweb-dev/chains/src/utils";
import { UserWallet } from "@thirdweb-dev/sdk";
import { Signer } from "ethers";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSDK } from "../hooks/useSDK";
import invariant from "tiny-invariant";

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

export const ThirdwebConnectedWalletContext = /* @__PURE__ */ createContext<
  ThirdwebConnectedWalletContext | undefined
>(undefined);

export const ThirdwebConnectedWalletProvider: React.FC<
  PropsWithChildren<{ signer?: Signer }>
> = ({ signer, children }) => {
  const { chains, clientId } = useThirdwebConfigContext();
  const storage = useSDK()?.storage;

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
    if (!storage) {
      return;
    }

    let s = signer;
    if (signer) {
      // just get both of these up front and keep them around with the context
      Promise.all([signer.getAddress(), signer.getChainId()])
        .then(([address, chainId]) => {
          const chain = chains.find((c) => c.chainId === chainId);
          let rpcUrl = undefined;
          if (chain) {
            try {
              rpcUrl = getValidChainRPCs(chain, clientId)[0];
            } catch (e) {
              // failed to get a viable rpc url, nothing we can do
              console.error(e);
            }
          }

          // only if the signer is still the same!
          if (signer === s) {
            const wallet = new UserWallet(
              signer,
              {
                readonlySettings: rpcUrl
                  ? {
                      rpcUrl,
                      chainId,
                    }
                  : undefined,
              },
              storage,
            );
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
  }, [signer, clientId]);

  return (
    <ThirdwebConnectedWalletContext.Provider value={contextValue}>
      {children}
    </ThirdwebConnectedWalletContext.Provider>
  );
};

export function useThirdwebConnectedWalletContext() {
  const context = useContext(ThirdwebConnectedWalletContext);
  invariant(
    context,
    "useThirdwebConnectedWalletContext() hook must be used within a <ThirdwebProvider/>",
  );
  return context;
}
