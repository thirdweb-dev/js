import { useCallback, useState } from "react";
import { ConnectWalletHeader } from "../ConnectingWallet/ConnectingWalletHeader";
import Step1Image from "../../../assets/step-1";
import Step2Image from "../../../assets/step-2";
import { ChooseWalletContent } from "../ChooseWallet/ChooseWalletContent";
import { useWallets } from "@thirdweb-dev/react-core";
import { UsernameInput } from "./UsernameInput";
import BaseButton from "../../base/BaseButton";
import Text from "../../base/Text";
import { ActivityIndicator, StyleSheet } from "react-native";
import { ModalFooter } from "../../base/modal/ModalFooter";
import { SmartWallet } from "@thirdweb-dev/wallets";
import Box from "../../base/Box";

export type SmartContractModalProps = {
  onClose: () => void;
  onBackPress: () => void;
};

type Step = "personalWallet" | "createAccount" | "selectAccount";
const steps: Step[] = ["personalWallet", "createAccount", "selectAccount"];

function getHeaderText(step: Step) {
  switch (step) {
    case "personalWallet":
      return [
        "Select your personal wallet",
        "Select and connect your personal wallet. This will be the key to your on-chain account.",
      ];
    case "createAccount":
      return [
        "Creating new smart account",
        "Create your smart account by choosing a unique username.",
      ];
    case "selectAccount":
      return [
        "Select a smart account",
        "Select your smart account to connect or create a new one.",
      ];
    default:
      throw new Error("Invalid step");
  }
}

export const SmartContractModal = ({
  onClose,
  onBackPress,
}: SmartContractModalProps) => {
  const [step, setStep] = useState<Step>("personalWallet");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false);
  const supportedWallets = useWallets();

  const onChangeText = (text: string) => {
    setUsername(text);
  };

  const onChooseWallet = useCallback(() => {
    // TODO:
    setError(username);
    setStep("createAccount");
  }, [username]);

  const onCreatePress = () => {
    setIsCreatingAccount(true);
    // create account
    setIsCreatingAccount(false);
    setStep("selectAccount");
  };

  const onBackPressInternal = () => {
    if (step === "personalWallet") {
      onBackPress();
    } else {
      const index = steps.indexOf(step);
      setStep(steps[index - 1]);
    }
  };

  const onCreateNewAccountPress = useCallback(() => {
    onClose();
  }, [onClose]);

  const activeComponent = useCallback(() => {
    switch (step) {
      case "personalWallet":
        return (
          <ChooseWalletContent
            wallets={supportedWallets}
            excludeWalletIds={[SmartWallet.id]}
            onChooseWallet={onChooseWallet}
          />
        );
      case "createAccount":
        return (
          <>
            <UsernameInput onChangeText={onChangeText} />
            <Text variant="bodySmall" color="red" mt="xs" textAlign="left">
              {error}
            </Text>
            <BaseButton
              backgroundColor="white"
              style={styles.modalButton}
              onPress={onCreatePress}
            >
              {isCreatingAccount ? (
                <ActivityIndicator size="small" color="buttonTextColor" />
              ) : (
                <Text variant="bodySmall" color="black">
                  Create
                </Text>
              )}
            </BaseButton>
          </>
        );
      case "selectAccount": // render available accounts
        return (
          <ModalFooter
            footer="Create new smart account"
            onPress={onCreateNewAccountPress}
          />
        );
    }
  }, [
    error,
    isCreatingAccount,
    onChooseWallet,
    onCreateNewAccountPress,
    step,
    supportedWallets,
  ]);

  return (
    <>
      <ConnectWalletHeader
        headerText={getHeaderText(step)[0]}
        subHeaderText={getHeaderText(step)[1]}
        alignHeader="flex-start"
        onClose={onClose}
        onBackPress={onBackPressInternal}
      />

      <Box mt="md">
        {step === "personalWallet" ? (
          <Step1Image width={180} height={24} color="#2B3036" />
        ) : (
          <Step2Image width={180} height={24} color="#2B3036" />
        )}
      </Box>

      {activeComponent()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalButton: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    minWidth: 100,
  },
});
