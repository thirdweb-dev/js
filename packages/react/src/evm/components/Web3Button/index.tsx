import { Spinner } from "../../../components/Spinner";
import { ToolTip } from "../../../components/Tooltip";
import { Button } from "../../../components/buttons";
import { darkTheme, lightTheme } from "../../../design-system";
import { ConnectWallet } from "../../../wallet/ConnectWallet/ConnectWallet";
import { useCanSwitchNetwork } from "../../../wallet/hooks/useCanSwitchNetwork";
import { ThemeProvider } from "@emotion/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ThirdwebThemeContext,
  useAddress,
  useChainId,
  useContract,
  useNetworkMismatch,
  useSDKChainId,
  useSwitchChain,
  useConnectionStatus,
} from "@thirdweb-dev/react-core";
import type { SmartContract } from "@thirdweb-dev/sdk";
import type { CallOverrides, ContractInterface } from "ethers";
import { PropsWithChildren, useContext } from "react";
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
  type?: "button" | "submit" | "reset";
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
  type,
  theme,
}: PropsWithChildren<Web3ButtonProps<TAction>>) => {
  const address = useAddress();
  const walletChainId = useChainId();
  const sdkChainId = useSDKChainId();
  const switchChain = useSwitchChain();
  const hasMismatch = useNetworkMismatch();
  const needToSwitchChain =
    sdkChainId && walletChainId && sdkChainId !== walletChainId;
  const connectionStatus = useConnectionStatus();

  const queryClient = useQueryClient();
  const canSwitchNetwork = useCanSwitchNetwork();

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

      // Wait for the promise to resolve, so errors get caught by onError
      const result = await action(contract);
      return result;
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
      onSettled: () => queryClient.invalidateQueries(),
    },
  );

  if (!address) {
    return <ConnectWallet theme={theme} />;
  }

  let content = children;
  let buttonDisabled = !!isDisabled;
  let buttonLoading = false;
  let showTooltip = false;

  // if button is disabled, show original action
  if (!buttonDisabled) {
    if (hasMismatch) {
      if (!canSwitchNetwork) {
        showTooltip = true;
        content = "Network Mismatch";
        buttonDisabled = true;
      } else {
        content = "Switch Network";
      }
    } else if (
      actionMutation.isLoading ||
      !contract ||
      connectionStatus === "connecting" ||
      connectionStatus === "unknown"
    ) {
      content = (
        <Spinner size="sm" color={themeToUse === "dark" ? "black" : "white"} />
      );
      buttonLoading = true;
    }
  }

  const btn = (
    <Button
      variant="inverted"
      type={type}
      className={className}
      onClick={() => actionMutation.mutate()}
      disabled={buttonDisabled || buttonLoading}
      style={{
        minWidth: "120px",
        minHeight: "43px",
      }}
    >
      {content}
    </Button>
  );

  return (
    <ThemeProvider theme={themeToUse === "dark" ? darkTheme : lightTheme}>
      {showTooltip ? (
        <ToolTip tip="Change Network from Wallet App">{btn}</ToolTip>
      ) : (
        btn
      )}
    </ThemeProvider>
  );
};
