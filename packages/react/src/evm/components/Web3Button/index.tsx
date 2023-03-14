import { Popover } from "../../../components/Popover";
import { Spinner } from "../../../components/Spinner";
import { Button } from "../../../components/buttons";
import { darkTheme, lightTheme } from "../../../design-system";
import { ConnectWallet } from "../../../wallet/ConnectWallet/ConnectWallet";
import { useWalletRequiresConfirmation } from "../../../wallet/hooks/useCanSwitchNetwork";
import { ThemeProvider } from "@emotion/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ThirdwebThemeContext,
  useAddress,
  useContract,
  useNetworkMismatch,
  useSDKChainId,
  useSwitchChain,
  useConnectionStatus,
} from "@thirdweb-dev/react-core";
import type { SmartContract } from "@thirdweb-dev/sdk";
import type { CallOverrides, ContractInterface } from "ethers";
import { PropsWithChildren, useContext, useState } from "react";
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
  const sdkChainId = useSDKChainId();
  const switchChain = useSwitchChain();
  const hasMismatch = useNetworkMismatch();
  const connectionStatus = useConnectionStatus();

  const queryClient = useQueryClient();
  const requiresConfirmation = useWalletRequiresConfirmation();

  const { contract } = useContract(contractAddress, contractAbi || "custom");
  const thirdwebTheme = useContext(ThirdwebThemeContext);
  const themeToUse = theme || thirdwebTheme || "dark";

  const [confirmStatus, setConfirmStatus] = useState<"idle" | "waiting">(
    "idle",
  );

  const actionMutation = useMutation(
    async () => {
      invariant(contract, "contract is not ready yet");

      if (onSubmit) {
        onSubmit();
      }

      // Wait for the promise to resolve, so errors get caught by onError
      const result = await action(contract);
      return result;
    },
    {
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
      onSettled: () => queryClient.invalidateQueries(),
    },
  );

  if (!address) {
    return <ConnectWallet theme={theme} />;
  }

  // let onClick = () => actionMutation.mutate();

  const btnStyle = {
    minWidth: "150px",
    minHeight: "43px",
  };

  let button: React.ReactNode = null;

  const handleSwitchChain = async () => {
    if (sdkChainId) {
      setConfirmStatus("waiting");
      try {
        await switchChain(sdkChainId);
        setConfirmStatus("idle");
      } catch (e) {
        console.error(e);
        setConfirmStatus("idle");
      }
    }
  };

  // Switch Network Button
  if (hasMismatch && !isDisabled) {
    const _button = (
      <Button
        variant="inverted"
        type={type}
        className={className}
        onClick={handleSwitchChain}
        style={btnStyle}
      >
        {confirmStatus === "waiting" ? (
          <Spinner size="sm" color={"inverted"} />
        ) : (
          "Switch Network"
        )}
      </Button>
    );

    if (requiresConfirmation) {
      button = (
        <Popover
          content={<span>Confirm in Wallet</span>}
          open={confirmStatus === "waiting"}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setConfirmStatus("idle");
            }
          }}
        >
          {_button}
        </Popover>
      );
    } else {
      button = _button;
    }
  }

  // Disabled Loading Spinner Button
  else if (
    !isDisabled &&
    (actionMutation.isLoading ||
      !contract ||
      connectionStatus === "connecting" ||
      connectionStatus === "unknown")
  ) {
    button = (
      <Button
        variant="inverted"
        type={type}
        className={className}
        disabled
        onClick={handleSwitchChain}
        style={btnStyle}
      >
        <Spinner size="md" color={"inverted"} />
      </Button>
    );
  }

  // action button
  else {
    button = (
      <Button
        variant="inverted"
        type={type}
        className={className}
        onClick={() => actionMutation.mutate()}
        disabled={isDisabled}
        style={btnStyle}
      >
        {children}
      </Button>
    );
  }

  return (
    <ThemeProvider theme={themeToUse === "dark" ? darkTheme : lightTheme}>
      {button}
    </ThemeProvider>
  );
};
