import { useCallback, useState } from "react";
import { SmartWallet } from "@thirdweb-dev/wallets";
import {
  Wallet,
  useConnect,
  useCreateWalletInstance,
  useSupportedWallet,
  useWallets,
} from "@thirdweb-dev/react-core";
import { SmartWalletObj } from "../../../wallets/wallets/smart-wallet";
import {
  LocalWallet,
  localWallet,
} from "../../../wallets/wallets/local-wallet";
import { ChooseWallet } from "../ChooseWallet/ChooseWallet";
import { LocalWalletFlow } from "../LocalWalletFlow";

export const SmartWalletFlow = ({
  onClose,
  onConnect,
}: {
  onClose: () => void;
  onConnect: () => void;
}) => {
  // const [accounts, setAccounts] = useState<AssociatedAccount[] | undefined>();
  // const context = useThirdwebWallet();
  const [showLocalWalletFlow, setShowLocalWalletFlow] = useState<boolean>();
  const createWalletInstance = useCreateWalletInstance();
  const supportedWallets = useWallets();
  const walletObj = useSupportedWallet("SmartWallet") as SmartWalletObj;
  const connect = useConnect();

  // initialize the localWallet
  // useEffect(() => {
  //   if (!personalWallet) {
  //     const wallet = createWalletInstance(localWalletCreator());

  //     (async () => {
  //       await wallet.connect();
  //       // handleWalletConnect?.(wallet);
  //       setPersonalWallet(wallet);
  //     })();
  //   }
  // }, [createWalletInstance, handleWalletConnect, personalWallet]);

  // get the associated accounts
  // useEffect(() => {
  //   if (!personalWallet || !chain) {
  //     return;
  //   }

  //   (async () => {
  //     const _accounts = await getAssociatedAccounts(
  //       personalWallet as EVMWallet,
  //       walletObj.factoryAddress,
  //       chain,
  //     );
  //     setAccounts(_accounts);
  //   })();
  // }, [chain, personalWallet, walletObj.factoryAddress]);

  const connectPersonalWallet = useCallback(
    async (wallet: Wallet) => {
      const walletInstance = createWalletInstance(wallet);
      await walletInstance.connect();

      await connect(walletObj, {
        personalWallet: walletInstance,
      });
      onConnect();
    },
    [connect, createWalletInstance, onConnect, walletObj],
  );

  const onLocalWalletImported = async (localWalletImported: LocalWallet) => {
    await localWalletImported.connect();

    await connect(walletObj, {
      personalWallet: localWalletImported,
    });
    onConnect();
  };

  const onChoosePersonalWallet = useCallback(
    async (wallet: Wallet) => {
      if (wallet.id === LocalWallet.id) {
        setShowLocalWalletFlow(true);
      } else {
        connectPersonalWallet(wallet);
      }
    },
    [connectPersonalWallet],
  );

  const onLocalWalletBackPress = () => {
    setShowLocalWalletFlow(false);
  };

  // loading state
  // we don't know whether the user has an account or not
  // if (!accounts) {
  //   return (
  //     <View style={styles.loadingAccounts}>
  //       <ConnectWalletHeader
  //         headerText={"Checking local accounts..."}
  //         subHeaderText={""}
  //         walletLogoUrl={SmartWallet.meta.iconURL}
  //         onClose={() => {}}
  //         onBackPress={() => {}}
  //       />
  //       <ActivityIndicator size="small" color="buttonTextColor" />
  //     </View>
  //   );
  // }

  // no accounts found
  // if (personalWallet) {
  //   return (
  //     <SmartWalletCreate
  //       personalWallet={personalWallet}
  //       onBackPress={onBackPress}
  //       onClose={onClose}
  //       onConnect={onConnect}
  //     />
  //   );
  // }

  if (showLocalWalletFlow) {
    return (
      <LocalWalletFlow
        onClose={onClose}
        onBackPress={onLocalWalletBackPress}
        onWalletImported={onLocalWalletImported}
        onConnectPress={() => connectPersonalWallet(localWallet())}
      />
    );
  }

  return (
    <ChooseWallet
      headerText={"Personal wallet"}
      wallets={supportedWallets}
      showGuestWalletAsButton={true}
      excludeWalletIds={[SmartWallet.id]}
      onChooseWallet={onChoosePersonalWallet}
      onClose={onClose}
    />
  );

  // accounts found
  // return (
  //   <ConnectToSmartWalletAccount
  //     personalWallet={localWallet}
  //     onBackPress={onBackPress}
  //     onConnect={onConnect}
  //     accounts={accounts}
  //   />
  // );
};

// const SmartWalletCreate = ({
//   personalWallet,
//   onClose,
//   onBackPress,
//   onConnect,
// }: {
//   personalWallet: WalletInstance | undefined;
//   onClose: () => void;
//   onBackPress: () => void;
//   onConnect: () => void;
// }) => {
//   const [error, setError] = useState<string>("");
//   const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false);
//   const [isImportModalVisible, setIsImportModalVisible] = useState(false);
//   const walletObj = useSupportedWallet("SmartWallet") as SmartWalletObj;
//   const connect = useConnect();

//   const onWalletImported = (localWalletP: LocalWallet) => {
//     connectSmartWallet(localWalletP);
//   };

//   const connectSmartWallet = useCallback(
//     async (wallet: WalletInstance) => {
//       setIsCreatingAccount(true);
//       // create account
//       // try {
//       await connect(walletObj, {
//         accountId: "pepe",
//         personalWallet: wallet,
//       });
//       onConnect();
//       // } catch (e) {
//       //   console.error("Error connecting your smart wallet.", e);
//       setError("Error connecting to wallet, please try again");
//       // }
//       setIsCreatingAccount(false);
//     },
//     [connect, onConnect, walletObj],
//   );

//   const onCreatePress = useCallback(async () => {
//     if (!personalWallet) {
//       return;
//     }

//     connectSmartWallet(personalWallet);
//   }, [connectSmartWallet, personalWallet]);

//   const onBackPressInternal = () => {
//     onBackPress();
//   };

//   const onImportModalClose = () => {
//     setIsImportModalVisible(false);
//   };

//   return (
//     <>
//       <ConnectWalletHeader
//         headerText={"Create account"}
//         subHeaderText={"Create your account by choosing a unique username"}
//         alignHeader="flex-start"
//         walletLogoUrl={SmartWallet.meta.iconURL}
//         onClose={onClose}
//         onBackPress={onBackPressInternal}
//       />

//       <Text variant="bodySmall" color="red" mt="xs" textAlign="left">
//         {error}
//       </Text>

//       <BaseButton
//         backgroundColor="white"
//         style={styles.modalButton}
//         onPress={onCreatePress}
//         mt="sm"
//       >
//         {isCreatingAccount ? (
//           <ActivityIndicator size="small" color="buttonTextColor" />
//         ) : (
//           <Text variant="bodySmall" color="black">
//             Create
//           </Text>
//         )}
//       </BaseButton>

//       <LocalWalletImportModal
//         isVisible={isImportModalVisible}
//         onWalletImported={onWalletImported}
//         onClose={onImportModalClose}
//       />
//     </>
//   );
// };

// export const ConnectToSmartWalletAccount: React.FC<{
//   personalWallet: WalletInstance | undefined;
//   onBackPress: () => void;
//   onConnect: () => void;
//   accounts: AssociatedAccount[];
// }> = ({ onBackPress, onConnect, accounts, personalWallet }) => {
//   const walletObj = useSupportedWallet("SmartWallet") as SmartWalletObj;
//   const connect = useConnect();
//   const [showCreateScreen, setShowCreateScreen] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(false);

//   if (showCreateScreen) {
//     return (
//       <SmartWalletCreate
//         personalWallet={personalWallet}
//         onBackPress={() => {
//           setShowCreateScreen(false);
//         }}
//         onClose={onBackPress}
//         onConnect={onConnect}
//       />
//     );
//   }

//   const handleConnect = async (account: AssociatedAccount) => {
//     if (!personalWallet) {
//       throw new Error("No personal wallet defined");
//     }

//     setIsConnecting(true);
//     await connect(walletObj, {
//       accountId: account.account,
//       personalWallet: personalWallet,
//     });
//     onConnect();
//     setIsConnecting(false);
//   };

//   return (
//     <>
//       <ConnectWalletHeader
//         headerText={"Choose account"}
//         subHeaderText={"Connect your existing account or create a new one"}
//         alignHeader="flex-start"
//         walletLogoUrl={SmartWallet.meta.iconURL}
//         onClose={onBackPress}
//         onBackPress={onBackPress}
//       />

//       <Box gap="sm" flexDirection="column" marginVertical="md">
//         {accounts.map((account) => {
//           return (
//             <NetworkButton
//               padding="sm"
//               chainName={account.accountId}
//               key={account.account}
//               onPress={() => handleConnect(account)}
//             />
//           );
//         })}
//       </Box>

//       <BaseButton
//         backgroundColor="white"
//         style={styles.modalButton}
//         onPress={() => {
//           setShowCreateScreen(true);
//         }}
//       >
//         {isConnecting ? (
//           <ActivityIndicator size="small" color="buttonTextColor" />
//         ) : (
//           <Text variant="bodySmall" color="black">
//             Create a new account
//           </Text>
//         )}
//       </BaseButton>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   loadingAccounts: {
//     height: 300,
//   },
//   container: {
//     flex: 1,
//   },
//   modalButton: {
//     display: "flex",
//     flexDirection: "row",
//     alignContent: "center",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 12,
//     borderWidth: 0.5,
//     paddingHorizontal: 10,
//     paddingVertical: 12,
//     minWidth: 100,
//   },
// });
