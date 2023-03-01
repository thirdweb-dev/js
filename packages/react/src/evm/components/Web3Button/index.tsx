import { Spinner } from "../../../components/Spinner";
import { Button } from "../../../components/buttons";
import { darkTheme, lightTheme } from "../../../design-system";
import { ConnectWallet } from "../../../wallet/ConnectWallet/ConnectWallet";
import { ThemeProvider } from "@emotion/react";
import { useMutation } from "@tanstack/react-query";
import {
  ThirdwebThemeContext,
  useAddress,
  useChainId,
  useContract,
  useNetworkMismatch,
  useSDKChainId,
  useSwitchChain,
} from "@thirdweb-dev/react-core";
import type { SmartContract } from "@thirdweb-dev/sdk";
import type { CallOverrides, ContractInterface } from "ethers";
import { PropsWithChildren, useContext, useMemo } from "react";
import invariant from "tiny-invariant";

type ActionFn = (contract: SmartContract) => any;

interface Web3ButtonProps<TActionFn extends ActionFn> {
  className?: string;
  contractAddress: `0x${string}` | `${string}.eth` | string;
  contractAbi?: ContractInterface;

  overrides?: CallOverrides;
  // called with the result
  onSuccess?: (result: Awaited<ReturnType<TActionFn>>) => void;
  // called with any error that might happen
  onError?: (error: Error) => void;
  // called before the `action` function is called
  onSubmit?: () => void;
  // disabled state
  isDisabled?: boolean;
  // the fn to execute
  action: TActionFn;
  theme?: "dark" | "light";
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
  theme,
}: PropsWithChildren<Web3ButtonProps<TAction>>) => {
  const address = useAddress();
  const walletChainId = useChainId();
  const sdkChainId = useSDKChainId();
  const switchChain = useSwitchChain();
  const hasMismatch = useNetworkMismatch();
  const needToSwitchChain =
    sdkChainId && walletChainId && sdkChainId !== walletChainId;

  const { contract } = useContract(contractAddress, contractAbi || "custom");
  const thirdwebTheme = useContext(ThirdwebThemeContext);
  const themeToUse = theme || thirdwebTheme || "dark";

  const actionMutation = useMutation(
    async () => {
      invariant(contract, "contract is not ready yet");

      // if need to switch the chain to perform the action
      if (needToSwitchChain) {
        await switchChain(sdkChainId);
        return "__NETWORK_SWITCHED__";
      }

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
      // TODO bring back invalidation
      // onSettled: () =>
      //   queryClient.invalidateQueries(
      //     createCacheKeyWithNetwork(
      //       createContractCacheKey(contractAddress),
      //       sdkChainId,
      //     ),
      //   ),
    },
  );

  if (!address) {
    return <ConnectWallet theme={theme} />;
  }

  return (
    <ThemeProvider theme={themeToUse === "dark" ? darkTheme : lightTheme}>
      <Button
        variant="inverted"
        className={className}
        onClick={() => actionMutation.mutate()}
        disabled={!contract || (hasMismatch ? false : isDisabled)}
        style={{
          minWidth: "120px",
        }}
      >
        {actionMutation.isLoading || !contract ? (
          <Spinner
            size="sm"
            color={themeToUse === "dark" ? "black" : "white"}
          />
        ) : hasMismatch ? (
          "Switch Network"
        ) : (
          children
        )}
      </Button>
    </ThemeProvider>
  );
};
