import { useContract } from "../../hooks/async/contracts";
import { useNetworkMismatch } from "../../hooks/useNetworkMismatch";
import { useNetwork } from "../../hooks/wagmi-required/useNetwork";
import { useAddress, useChainId } from "../../hooks/wallet";
import { useSDKChainId } from "../../providers/base";
import {
  createCacheKeyWithNetwork,
  createContractCacheKey,
} from "../../utils/cache-keys";
import { ConnectWallet } from "../ConnectWallet";
import { Button } from "../shared/Button";
import { ThemeProvider, ThemeProviderProps } from "../shared/ThemeProvider";
import { FiWifi } from "@react-icons/all-files/fi/FiWifi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SmartContract } from "@thirdweb-dev/sdk/dist/declarations/src/evm/contracts/smart-contract";
import type { CallOverrides, ContractInterface } from "ethers";
import { PropsWithChildren, useMemo } from "react";
import invariant from "tiny-invariant";

type ActionFn = (contract: SmartContract) => any;

interface Web3ButtonProps<TActionFn extends ActionFn>
  extends ThemeProviderProps {
  className?: string;
  contractAddress: `0x${string}` | `${string}.eth` | string;
  contractAbi?: ContractInterface;

  overrides?: CallOverrides;
  // called with the result
  onSuccess?: (result: Awaited<ReturnType<TActionFn>>) => void;
  // called with any error that might happen
  onError?: (error: Error) => void;
  // called when the function is called
  onSubmit?: () => void;
  // disabled state
  isDisabled?: boolean;
  // the fn to execute
  action: TActionFn;
}

/**
 * A component that allows the user to call an on-chain function on a contract.
 *
 * The button has to be wrapped in a `ThirdwebProvider` in order to function.
 *
 * @example
 * ```javascript
 * import { Web3Button } from "@thirdweb-dev/react";
 *
 * const App = () => {
 *  return (
 *   <div>
 *     <Web3Button contractAddress="0x..." action={(contract) => contract.erc721.transfer("0x...", 1)} />
 *   </div>
 * )
 * }
 * ```
 *
 *
 * @beta
 */
export const Web3Button = <TAction extends ActionFn>({
  contractAddress,
  onSuccess,
  onError,
  onSubmit,
  isDisabled,
  contractAbi,
  children,
  action,
  className,
  ...themeProps
}: PropsWithChildren<Web3ButtonProps<TAction>>) => {
  const address = useAddress();
  const walletChainId = useChainId();
  const sdkChainId = useSDKChainId();
  const [, switchNetwork] = useNetwork();

  const queryClient = useQueryClient();

  const hasMismatch = useNetworkMismatch();

  const switchToChainId = useMemo(() => {
    if (sdkChainId && walletChainId && sdkChainId !== walletChainId) {
      return sdkChainId;
    }
    return null;
  }, [sdkChainId, walletChainId]);

  const { contract } = useContract(contractAddress, contractAbi || "custom");

  const mutation = useMutation(
    async () => {
      if (switchToChainId) {
        if (switchNetwork) {
          await switchNetwork(switchToChainId);
          return "__NETWORK_SWITCHED__";
        } else {
          throw new Error(
            "need to switch chain but connected wallet does not support switching",
          );
        }
      }
      invariant(contract, "contract is not ready yet");

      if (onSubmit) {
        onSubmit();
      }

      return await action(contract);
    },
    {
      onSuccess: (res) => {
        if (res === "__NETWORK_SWITCHED__") {
          return;
        }
        if (onSuccess) {
          onSuccess(res);
        }
      },
      onError: (err) => {
        if (onError) {
          onError(err as Error);
        }
      },
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
    return <ConnectWallet className={className} {...themeProps} />;
  }

  const willSwitchNetwork = hasMismatch && !!switchNetwork;

  return (
    <ThemeProvider {...themeProps}>
      <Button
        className={className}
        style={{ height: "50px", minWidth: "200px", width: "100%" }}
        isLoading={mutation.isLoading || !contract}
        onClick={() => mutation.mutate()}
        isDisabled={willSwitchNetwork ? false : isDisabled}
        leftElement={
          willSwitchNetwork ? <FiWifi width="1em" height="1em" /> : undefined
        }
      >
        {willSwitchNetwork ? "Switch Network" : children}
      </Button>
    </ThemeProvider>
  );
};
