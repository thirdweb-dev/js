import { ThemeProvider } from "../styles/ThemeProvider";
import { ConnectWallet } from "./ConnectWallet";
import BaseButton from "./base/BaseButton";
import Text from "./base/Text";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useAddress,
  useChainId,
  useContract,
  useNetworkMismatch,
  useSDKChainId,
  useSwitchChain,
  useConnectionStatus,
  useWallet,
} from "@thirdweb-dev/react-core";
import type { SmartContract } from "@thirdweb-dev/sdk";
import type { CallOverrides, ContractInterface } from "ethers";
import { PropsWithChildren, useEffect } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import invariant from "tiny-invariant";

type ActionFn = (contract: SmartContract) => any;

interface Web3ButtonProps<TActionFn extends ActionFn> {
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
 * import { Web3Button } from "@thirdweb-dev/react-native";
 *
 * const App = () => {
 *  return (
 *   <View>
 *     <Web3Button contractAddress="0x..." action={(contract) => contract.erc721.transfer("0x...", 1)} />
 *   </View>
 *  )
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
  theme,
}: PropsWithChildren<Web3ButtonProps<TAction>>) => {
  const address = useAddress();
  const activeWallet = useWallet();
  const walletChainId = useChainId();
  const sdkChainId = useSDKChainId();
  const switchChain = useSwitchChain();
  const hasMismatch = useNetworkMismatch();
  const needToSwitchChain =
    sdkChainId && walletChainId && sdkChainId !== walletChainId;
  const connectionStatus = useConnectionStatus();

  const queryClient = useQueryClient();

  const { contract } = useContract(contractAddress, contractAbi || "custom");

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

  useEffect(() => {
    if (!activeWallet && actionMutation.isLoading) {
      actionMutation.reset();
    }
  }, [actionMutation, activeWallet]);

  if (!address) {
    return <ConnectWallet theme={theme} />;
  }

  let content = children;
  let buttonDisabled = !!isDisabled;
  let buttonLoading = false;

  // if button is disabled, show original action
  if (!buttonDisabled) {
    if (hasMismatch) {
      content = "Switch Network";
    } else if (
      actionMutation.isLoading ||
      !contract ||
      connectionStatus === "connecting" ||
      connectionStatus === "unknown"
    ) {
      content = <ActivityIndicator size="small" color={"black"} />;
      buttonLoading = true;
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <BaseButton
        backgroundColor="white"
        onPress={() => {
          actionMutation.mutate();
        }}
        style={styles.actionButton}
        disabled={buttonDisabled || buttonLoading}
      >
        {typeof content === "string" ? (
          <Text variant="bodyLarge" color="black">
            {content}
          </Text>
        ) : (
          content
        )}
      </BaseButton>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    minWidth: 120,
    minHeight: 43,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
