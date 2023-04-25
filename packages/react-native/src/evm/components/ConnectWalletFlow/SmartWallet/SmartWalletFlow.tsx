import { useCallback, useDeferredValue, useEffect, useState } from "react";
import { ConnectWalletHeader } from "../ConnectingWallet/ConnectingWalletHeader";
import { UsernameInput } from "./UsernameInput";
import BaseButton from "../../base/BaseButton";
import Text from "../../base/Text";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import {
  AssociatedAccount,
  SmartWallet,
  getAssociatedAccounts,
  isAccountIdAvailable,
} from "@thirdweb-dev/wallets";
import {
  WalletInstance,
  useConnect,
  useCreateWalletInstance,
  useSupportedWallet,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { SmartWalletObj } from "../../../wallets/wallets/smart-wallet";
import {
  LocalWallet,
  localWallet as localWalletCreator,
} from "../../../wallets/wallets/local-wallet";
import Box from "../../base/Box";
import { NetworkButton } from "../../ConnectWalletDetails/NetworkButton";

export const SmartWalletFlow = ({
  onClose,
  onBackPress,
  onConnect,
}: {
  onClose: () => void;
  onBackPress: () => void;
  onConnect: () => void;
}) => {
  const walletObj = useSupportedWallet("SmartWallet") as SmartWalletObj;
  const [accounts, setAccounts] = useState<AssociatedAccount[] | undefined>();
  const context = useThirdwebWallet();
  const handleWalletConnect = context?.handleWalletConnect;
  const chain = context?.activeChain;
  const createWalletInstance = useCreateWalletInstance();
  const [localWallet, setLocalWallet] = useState<LocalWallet | undefined>();

  // initialize the localWallet
  useEffect(() => {
    if (!localWallet) {
      const wallet = createWalletInstance(localWalletCreator()) as LocalWallet;

      (async () => {
        await wallet.connect();
        // handleWalletConnect?.(wallet);
        setLocalWallet(wallet);
      })();
    }
  }, [createWalletInstance, handleWalletConnect, localWallet]);

  // get the associated accounts
  useEffect(() => {
    console.log("localWallet", localWallet);
    console.log("chain", chain);
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
  }, [chain, localWallet, walletObj.factoryAddress]);

  console.log("accounts", accounts);

  // loading state
  // we don't know whether the user has an account or not
  if (!accounts) {
    return (
      <View style={styles.loadingAccounts}>
        <ConnectWalletHeader
          headerText={"Loading accounts"}
          subHeaderText={""}
          walletLogoUrl={SmartWallet.meta.iconURL}
          onClose={() => {}}
          onBackPress={() => {}}
        />
        <ActivityIndicator size="small" color="buttonTextColor" />
      </View>
    );
  }

  // no accounts found
  if (accounts.length === 0) {
    return (
      <SmartWalletCreate
        personalWallet={localWallet}
        onBackPress={onBackPress}
        onClose={onClose}
        onConnect={onConnect}
      />
    );
  }

  // accounts found
  return (
    <ConnectToSmartWalletAccount
      personalWallet={localWallet}
      onBackPress={onBackPress}
      onConnect={onConnect}
      accounts={accounts}
    />
  );
};

const SmartWalletCreate = ({
  personalWallet,
  onClose,
  onBackPress,
  onConnect,
}: {
  personalWallet: WalletInstance | undefined;
  onClose: () => void;
  onBackPress: () => void;
  onConnect: () => void;
}) => {
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>(true);
  const walletObj = useSupportedWallet("SmartWallet") as SmartWalletObj;
  const chain = useThirdwebWallet()?.activeChain;
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
    if (!isUsernameAvailable || !personalWallet) {
      return;
    }

    setIsCreatingAccount(true);
    // create account
    try {
      await connect(walletObj, {
        accountId: username,
        personalWallet: personalWallet,
      });
      onConnect();
    } catch (e) {
      console.error("Error connecting your smart wallet.", e);
      setError("Error connecting to wallet, please try again");
    }
    setIsCreatingAccount(false);
  }, [
    connect,
    isUsernameAvailable,
    onConnect,
    personalWallet,
    username,
    walletObj,
  ]);

  const onBackPressInternal = () => {
    onBackPress();
  };

  return (
    <>
      <ConnectWalletHeader
        headerText={"Create account"}
        subHeaderText={"Create your account by choosing a unique username"}
        alignHeader="flex-start"
        walletLogoUrl={SmartWallet.meta.iconURL}
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

export const ConnectToSmartWalletAccount: React.FC<{
  personalWallet: WalletInstance | undefined;
  onBackPress: () => void;
  onConnect: () => void;
  accounts: AssociatedAccount[];
}> = ({ onBackPress, onConnect, accounts, personalWallet }) => {
  const walletObj = useSupportedWallet("SmartWallet") as SmartWalletObj;
  const connect = useConnect();
  const [showCreateScreen, setShowCreateScreen] = useState(false);

  if (showCreateScreen) {
    return (
      <SmartWalletCreate
        personalWallet={personalWallet}
        onBackPress={() => {
          setShowCreateScreen(false);
        }}
        onClose={onBackPress}
        onConnect={onConnect}
      />
    );
  }

  const handleConnect = async (account: AssociatedAccount) => {
    if (!personalWallet) {
      throw new Error("No personal wallet defined");
    }

    await connect(walletObj, {
      accountId: account.accountId,
      personalWallet: personalWallet,
    });
    onConnect();
  };

  return (
    <>
      <ConnectWalletHeader
        headerText={"Choose your account"}
        subHeaderText={"Connect to an existing account or create a new one"}
        alignHeader="flex-start"
        walletLogoUrl={SmartWallet.meta.iconURL}
        onClose={onBackPress}
        onBackPress={onBackPress}
      />

      <Box gap="sm" flexDirection="column">
        {accounts.map((account) => {
          return (
            <NetworkButton
              chainName={account.accountId}
              key={account.account}
              onPress={() => handleConnect(account)}
            />
          );
        })}
      </Box>

      <BaseButton
        backgroundColor="white"
        style={styles.modalButton}
        onPress={() => {
          setShowCreateScreen(true);
        }}
      >
        <Text variant="bodySmall" color="black">
          Create a new account
        </Text>
      </BaseButton>
    </>
  );
};

const styles = StyleSheet.create({
  loadingAccounts: {
    height: 300,
  },
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
