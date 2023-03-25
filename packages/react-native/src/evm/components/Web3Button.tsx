import { ThemeProvider } from "../styles/ThemeProvider";
import { ConnectWallet } from "./ConnectWallet";
import BaseButton from "./base/BaseButton";
import Text from "./base/Text";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useAddress,
  useContract,
  useNetworkMismatch,
  useSDKChainId,
  useSwitchChain,
  useConnectionStatus,
  useWallet,
} from "@thirdweb-dev/react-core";
import type { SmartContract } from "@thirdweb-dev/sdk";
import type { CallOverrides, ContractInterface } from "ethers";
import { PropsWithChildren, useEffect, useState } from "react";
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
  isDisabled = false,
  contractAbi,
  children,
  action,
  theme,
}: PropsWithChildren<Web3ButtonProps<TAction>>) => {
  const activeWallet = useWallet();
  const address = useAddress();
  const sdkChainId = useSDKChainId();
  const switchChain = useSwitchChain();
  const hasMismatch = useNetworkMismatch();
  const connectionStatus = useConnectionStatus();

  const queryClient = useQueryClient();

  const { contract } = useContract(contractAddress, contractAbi || "custom");

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

  useEffect(() => {
    if (!activeWallet && actionMutation.isLoading) {
      actionMutation.reset();
    }
  }, [actionMutation, activeWallet]);

  if (!address) {
    return <ConnectWallet theme={theme} />;
  }

  const handleSwitchChain = async () => {
    if (sdkChainId) {
      setConfirmStatus("waiting");
      try {
        await switchChain(sdkChainId);
        setConfirmStatus("idle");
      } catch (e) {
        console.error(`Web3Button. Error switching chains: ${e}`);
        setConfirmStatus("idle");
      }
    }
  };

  let button: React.ReactNode = null;
  // Switch Network Button
  if (hasMismatch && !isDisabled) {
    button = (
      <BaseButton
        backgroundColor="white"
        onPress={handleSwitchChain}
        style={styles.actionButton}
      >
        {confirmStatus === "waiting" ? (
          <ActivityIndicator size="small" color={"black"} />
        ) : (
          <Text variant="bodyLarge" color="black">
            Switch Network
          </Text>
        )}
      </BaseButton>
    );
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
      <BaseButton
        backgroundColor="white"
        onPress={handleSwitchChain}
        style={styles.actionButton}
      >
        {confirmStatus === "waiting" ? (
          <ActivityIndicator size="small" color={"black"} />
        ) : (
          <Text variant="bodyLarge" color="black">
            Switch Network
          </Text>
        )}
      </BaseButton>
    );
  }

  // action button
  else {
    button = (
      <BaseButton
        backgroundColor="white"
        onPress={() => {
          actionMutation.mutate();
        }}
        style={styles.actionButton}
        disabled={isDisabled}
      >
        {typeof children === "string" ? (
          <Text variant="bodyLarge" color="black">
            {children}
          </Text>
        ) : (
          children
        )}
      </BaseButton>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      {button}
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
