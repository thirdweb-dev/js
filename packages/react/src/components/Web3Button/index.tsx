import { useActiveChainId } from "../../Provider";
import { Contract, useContract } from "../../hooks/async/contracts";
import { useAddress } from "../../hooks/useAddress";
import { useChainId } from "../../hooks/useChainId";
import { useNetwork } from "../../hooks/useNetwork";
import { ConnectWallet } from "../ConnectWallet";
import { Button } from "../shared/Button";
import { ThemeProvider, ThemeProviderProps } from "../shared/ThemeProvider";
import type { CallOverrides } from "ethers";
import { PropsWithChildren, useMemo } from "react";

type ActionFn = (contract: Contract) => any;

interface Web3ButtonProps<TActionFn extends ActionFn>
  extends ThemeProviderProps {
  contractAddress: `0x${string}` | `${string}.eth` | string;

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
  overrides,
  onSuccess,
  onError,
  onSubmit,
  isDisabled,
  children,
  action,
  ...themeProps
}: PropsWithChildren<Web3ButtonProps<TAction>>) => {
  const address = useAddress();
  const walletChainId = useChainId();
  const sdkChainId = useActiveChainId();
  const [, switchNetwork] = useNetwork();

  const switchToChainId = useMemo(() => {
    if (sdkChainId && walletChainId && sdkChainId !== walletChainId) {
      return sdkChainId;
    }
    return null;
  }, [sdkChainId, walletChainId]);

  const { useWrite, isLoading } = useContract(contractAddress);

  const mutation = useWrite(async (contract) => {
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
    if (onSubmit) {
      onSubmit();
    }
    return action(contract);
  });

  if (!address) {
    return <ConnectWallet {...themeProps} />;
  }

  return (
    <ThemeProvider {...themeProps}>
      <Button
        style={{ height: "50px" }}
        isLoading={mutation.isLoading || !isLoading}
        onClick={() =>
          mutation.mutate(undefined, {
            onSuccess: (res) => {
              if (onSuccess) {
                onSuccess(res);
              }
            },
            onError: (err) => {
              if (onError) {
                onError(err as Error);
              }
            },
          })
        }
        isDisabled={isDisabled}
      >
        {children}
      </Button>
    </ThemeProvider>
  );
};
