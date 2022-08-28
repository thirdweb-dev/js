import { useActiveChainId } from "../../Provider";
import { useContract } from "../../hooks/async/contracts";
import { useAddress } from "../../hooks/useAddress";
import { useChainId } from "../../hooks/useChainId";
import { useNetwork } from "../../hooks/useNetwork";
import {
  createCacheKeyWithNetwork,
  createContractCacheKey,
} from "../../utils/cache-keys";
import { ConnectWallet } from "../ConnectWallet";
import { Button } from "../shared/Button";
import { ThemeProvider, ThemeProviderProps } from "../shared/ThemeProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  SmartContract,
  TransactionError,
  TransactionResult,
} from "@thirdweb-dev/sdk";
import type { CallOverrides } from "ethers";
import { PropsWithChildren, useMemo } from "react";
import invariant from "tiny-invariant";

interface SharedWeb3ButtonProps extends ThemeProviderProps {
  contractAddress: `0x${string}` | `${string}.eth`;

  overrides?: CallOverrides;
  // called with the result
  onSuccess?: (result: TransactionResult) => void;
  // called with any error that might happen
  onError?: (error: TransactionError) => void;
  // called when the function is called
  onSubmit?: () => void;
  // disabled state
  isDisabled?: boolean;
}

type ExecutableFn = (contract: SmartContract) => any;

type Web3ButtonPropsOptinalProps<TExecutableFn extends ExecutableFn> =
  | {
      functionName: string;
      params?: unknown[] | (() => Promise<unknown[]>);
      callable?: never;
    }
  | { functionName?: never; params?: never; callable: TExecutableFn };

type Web3ButtonProps<TExecutableFn extends ExecutableFn> =
  SharedWeb3ButtonProps & Web3ButtonPropsOptinalProps<TExecutableFn>;

/**
 * A component that allows the user to call an on-chain function on a contract.
 *
 * The button has to be wrapped in a `ThirdwebProvider` in order to function.
 *
 * @example
 * ```javascript
 * import { Web3Button } from '@thirdweb-dev/react';
 *
 * const App = () => {
 *  return (
 *   <div>
 *     <Web3Button contractAddress="0x..." functionName="mint" />
 *   </div>
 * )
 * }
 * ```
 *
 *
 * @beta
 */
export const Web3Button = <TExecutableFn extends ExecutableFn>({
  contractAddress,
  overrides,
  onSuccess,
  onError,
  onSubmit,
  isDisabled,
  children,
  functionName,
  params,
  callable,
  ...themeProps
}: PropsWithChildren<Web3ButtonProps<TExecutableFn>>) => {
  const address = useAddress();
  const walletChainId = useChainId();
  const sdkChainId = useActiveChainId();
  const [, switchNetwork] = useNetwork();

  const queryClient = useQueryClient();

  const switchToChainId = useMemo(() => {
    if (sdkChainId && walletChainId && sdkChainId !== walletChainId) {
      return sdkChainId;
    }
    return null;
  }, [sdkChainId, walletChainId]);

  const contractQuery = useContract(contractAddress);

  const mutation = useMutation(
    async () => {
      if (switchToChainId) {
        if (switchNetwork) {
          await switchNetwork(switchToChainId);
          await new Promise((resolve) => setTimeout(resolve, 500));
        } else {
          throw new Error(
            "need to switch chain but connected wallet does not support switching",
          );
        }
      }
      if (!contractQuery.contract) {
        throw new Error("contract not ready yet");
      }
      if (callable) {
        if (onSubmit) {
          onSubmit();
        }
        return await callable(contractQuery.contract);
      }

      const vars = typeof params === "function" ? await params() : params || [];
      const withOverrides =
        vars && overrides
          ? [...vars, overrides]
          : overrides
          ? [overrides]
          : vars;

      invariant(functionName, "functionName is required");

      if (onSubmit) {
        onSubmit();
      }
      return await contractQuery.contract.call(functionName, ...withOverrides);
    },
    {
      onSuccess,
      onError,
      onSettled: () =>
        queryClient.invalidateQueries(
          createCacheKeyWithNetwork(
            createContractCacheKey(contractAddress),
            sdkChainId,
          ),
        ),
    },
  );
  if (!address) {
    return <ConnectWallet {...themeProps} />;
  }

  return (
    <ThemeProvider {...themeProps}>
      <Button
        style={{ height: "50px" }}
        isLoading={mutation.isLoading || !contractQuery.contract}
        onClick={() => mutation.mutate()}
        isDisabled={isDisabled}
      >
        {children}
      </Button>
    </ThemeProvider>
  );
};
