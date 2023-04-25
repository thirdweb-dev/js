import {
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import { ConnectWalletHeader } from "../ConnectingWallet/ConnectingWalletHeader";
import { UsernameInput } from "./UsernameInput";
import BaseButton from "../../base/BaseButton";
import Text from "../../base/Text";
import { ActivityIndicator, StyleSheet } from "react-native";
import {
  AssociatedAccount,
  getAssociatedAccounts,
  isAccountIdAvailable,
} from "@thirdweb-dev/wallets";
import {
  Wallet,
  useActiveChain,
  useConnect,
  useCreateWalletInstance,
  useSupportedWallet,
  useThirdwebWallet,
  useWallet,
} from "@thirdweb-dev/react-core";
import { SmartWalletObj } from "../../../wallets/wallets/smart-wallet";
import { localWallet } from "../../../wallets/wallets/local-wallet";

export type SmartWalletModalProps = {
  onClose: () => void;
  onBackPress: () => void;
  onConnect: () => void;
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
        "Enter username",
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

export const SmartWalletModal = ({
  onClose,
  onBackPress,
  onConnect,
}: SmartWalletModalProps) => {
  const walletObj = useSupportedWallet("SmartWallet") as SmartWalletObj;
  const [accounts, setAccounts] = useState<AssociatedAccount[] | undefined>();
  const thirdwebWalletContext = useThirdwebWallet();
  const localWalletGenerated = useRef(false);
  const activeWallet = useWallet();
  const chain = useActiveChain();
  const createWalletInstance = useCreateWalletInstance();

  // initialize the localWallet
  useEffect(() => {
    if (!localWalletGenerated.current) {
      const wallet = createWalletInstance(localWallet());

      (async () => {
        await wallet.connect();
        thirdwebWalletContext?.handleWalletConnect(wallet);
        localWalletGenerated.current = true;
      })();
    }
  }, [createWalletInstance, thirdwebWalletContext]);

  // get the associated accounts
  useEffect(() => {
    if (!localWallet || !chain) {
      return;
    }

    (async () => {
      const _accounts = await getAssociatedAccounts(
        localWallet,
        walletObj.factoryAddress,
        chain,
      );
      setAccounts(_accounts);
    })();
  }, [chain, walletObj.factoryAddress]);

  // loading state
  // we don't know whether the user has an account or not
  if (!accounts) {
    return (
      <>
        <Flex
          style={{
            height: "350px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner size="lg" color="secondary" />
        </Flex>
      </>
    );
  }

  // no accounts found
  if (accounts.length === 0) {
    return <SmartWalletCreate {...props} />;
  }

  // accounts found
  return <ConnectToSmartWalletAccount {...props} accounts={accounts} />;
};

const SmartWalletCreate = ({
  onClose,
  onBackPress,
  onConnect,
}: SmartWalletModalProps) => {
  const [step, setStep] = useState<Step>("createAccount");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>(true);
  const activeWallet = useWallet();
  const walletObj = useSupportedWallet("SmartWallet") as SmartWalletObj;
  const chain = useActiveChain();
  const connect = useConnect();

  const deferredUsername = useDeferredValue(username);

  useEffect(() => {
    if (!deferredUsername) {
      setIsUsernameAvailable(false);
      return;
    }

    let isStale = false;

    async function checkAccountAvailable() {
      if (!chain) {
        throw new Error("No active chain detected");
      }

      setIsCreatingAccount(true);
      const isAvailable = await isAccountIdAvailable(
        deferredUsername,
        walletObj.factoryAddress,
        chain,
      );
      if (isStale) {
        return;
      }
      setError(isAvailable ? "" : "Username is not available");
      setIsUsernameAvailable(isAvailable);
      setIsCreatingAccount(false);
    }

    checkAccountAvailable();
    return () => {
      isStale = true;
    };
  }, [deferredUsername, walletObj.factoryAddress, chain]);

  const onChangeText = (text: string) => {
    setUsername(text);
  };

  const onCreatePress = useCallback(async () => {
    if (!isUsernameAvailable || !activeWallet) {
      return;
    }

    setIsCreatingAccount(true);
    // create account
    try {
      await connect(walletObj, {
        accountId: username,
        personalWallet: activeWallet,
      });
      onConnect();
    } catch (e) {
      console.error("Error connecting your smart wallet.", e);
      setError("Error connecting to wallet, please try again");
    }
    setIsCreatingAccount(false);
    // setStep("selectAccount");
  }, [
    activeWallet,
    connect,
    isUsernameAvailable,
    onConnect,
    username,
    walletObj,
  ]);

  const onBackPressInternal = () => {
    if (step === "personalWallet") {
      onBackPress();
    } else {
      const index = steps.indexOf(step);
      setStep(steps[index - 1]);
    }
  };

  return (
    <>
      <ConnectWalletHeader
        headerText={getHeaderText(step)[0]}
        subHeaderText={getHeaderText(step)[1]}
        alignHeader="flex-start"
        onClose={onClose}
        onBackPress={onBackPressInternal}
      />

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
