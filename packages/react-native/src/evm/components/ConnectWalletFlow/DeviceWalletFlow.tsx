import BaseButton from "../base/BaseButton";
import { StyleSheet, View } from "react-native";
import { ConnectWalletHeader } from "./ConnectingWallet/ConnectingWalletHeader";
import Text from "../base/Text";
import { ModalFooter } from "../base/modal/ModalFooter";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { DeviceWallet } from "../../wallets/wallets/device-wallet";
import {
  Wallet,
  useCreateWalletInstance,
  useSupportedWallet,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";

export type DeviceWalletFlowProps = {
  onClose: () => void;
  onBackPress: () => void;
  onConnectPress: () => void;
};

export function DeviceWalletFlow({
  onClose,
  onBackPress,
  onConnectPress,
}: DeviceWalletFlowProps) {
  const createWalletInstance = useCreateWalletInstance();
  const deviceWalletCreator = useSupportedWallet(DeviceWallet.id) as Wallet;
  const twWalletContext = useThirdwebWallet();

  const onImportPress = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: "application/json",
    });

    if (result.type === "success") {
      const json = await FileSystem.readAsStringAsync(result.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      console.log("json", json);

      const deviceWallet = createWalletInstance(
        deviceWalletCreator,
      ) as DeviceWallet;

      try {
        deviceWallet.import({
          encryptedJson: json,
          password: "asdf",
        });
      } catch (error) {
        console.log(error);
        return;
      }

      deviceWallet.connect();
      twWalletContext?.handleWalletConnect(deviceWallet);
    }
  };

  return (
    <View>
      <ConnectWalletHeader
        onBackPress={onBackPress}
        walletLogoUrl={DeviceWallet.meta.iconURL}
        subHeaderText={""}
        close={onClose}
      />
      <View style={styles.connectingContainer}>
        <BaseButton
          backgroundColor="white"
          onPress={onConnectPress}
          style={styles.connectWalletButton}
        >
          <Text variant="bodyLarge" color="black">
            Create Device Wallet
          </Text>
        </BaseButton>
        <Text variant="subHeader" mt="lg">
          -------- OR --------
        </Text>
        <ModalFooter footer={"Import a JSON wallet"} onPress={onImportPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  connectingContainer: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 18,
  },
  connectWalletButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
