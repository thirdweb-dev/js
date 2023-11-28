import Text from "../base/Text";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Share,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import BaseButton from "../base/BaseButton";
import Box from "../base/Box";
import { ModalHeaderTextClose } from "../base/modal/ModalHeaderTextClose";
import {
  shortenAddress,
  useAddress,
  usePersonalWalletAddress,
  useWallet,
} from "@thirdweb-dev/react-core";
import { PasswordInput } from "../PasswordInput";
import * as FileSystem from "expo-file-system";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { LocalWallet } from "../../wallets/wallets/LocalWallet";
import { TWModal } from "../base/modal/TWModal";
import { useLocale } from "../../providers/ui-context-provider";

export type ExportLocalWalletModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const ExportLocalWalletModal = ({
  isVisible,
  onClose,
}: ExportLocalWalletModalProps) => {
  const l = useLocale();
  const [password, setPassword] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const activeWallet = useWallet();
  const address = useAddress();
  const personalWalletAddress = usePersonalWalletAddress();

  const onContinuePress = async () => {
    if (!password) {
      setError("Please enter a password");
      return;
    }

    setIsExporting(true);
    setError(undefined);

    let data;
    if (activeWallet?.walletId === SmartWallet.id) {
      data = await (activeWallet.getPersonalWallet() as LocalWallet).export({
        strategy: "encryptedJson",
        password: password,
      });
    } else {
      data = await (activeWallet as LocalWallet).export({
        strategy: "encryptedJson",
        password: password,
      });
    }

    const fileName = "wallet.json";
    if (Platform.OS === "android") {
      // Requests permissions for external directory
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permissions.granted) {
        // Gets SAF URI from response
        const uri = permissions.directoryUri;

        let fileURI;
        try {
          // Create file in external directory. If file already exists, it will be renamed.
          fileURI = await FileSystem.StorageAccessFramework.createFileAsync(
            uri,
            fileName,
            "application/json",
          );
        } catch (e) {
          console.error("Error creating the file", e);
          setError("Error creating the file. Please try again.");
          setIsExporting(false);
          return;
        }

        try {
          await FileSystem.StorageAccessFramework.writeAsStringAsync(
            fileURI,
            data,
            {
              encoding: FileSystem.EncodingType.UTF8,
            },
          );
          setIsExporting(false);
        } catch (e) {
          console.error("Error writing the file", e);
          setError("Error writing the file. Please try again.");
          setIsExporting(false);
          return;
        }
      }

      onCloseInternal();
    } else {
      let filePath;
      try {
        filePath = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(filePath, data, {
          encoding: FileSystem.EncodingType.UTF8,
        });
      } catch (e) {
        console.error("Error writing the file", e);
        setError("Error writing the file. Please try again.");
      }

      if (!filePath) {
        setIsExporting(false);
        return;
      }

      await Share.share({ title: "Wallet JSON", url: filePath });

      onCloseInternal();
    }

    setIsExporting(false);
  };

  const onCloseInternal = () => {
    setError(undefined);
    setPassword(undefined);
    onClose();
  };

  const onChangeText = (text: string) => {
    if (error) {
      setError(undefined);
    }

    setPassword(text);
  };

  return (
    <TWModal isVisible={isVisible} backdropOpacity={0.7}>
      <KeyboardAvoidingView behavior="padding">
        <Box
          flexDirection="column"
          backgroundColor="background"
          borderRadius="md"
          p="lg"
        >
          <ModalHeaderTextClose
            onClose={onCloseInternal}
            headerText={l.local_wallet.backup_your_wallet}
          />
          <Text variant="subHeader" mt="md" textAlign="left">
            {l.local_wallet.this_will_download_json}
          </Text>
          <Text variant="bodySmall" textAlign="left" mt="lg" mb="xxs">
            {l.local_wallet.wallet_address}
          </Text>
          <Text variant="bodySmallSecondary">
            {shortenAddress(
              personalWalletAddress ? personalWalletAddress : address,
            )}
          </Text>
          <Text variant="bodySmall" textAlign="left" mt="lg" mb="xxs">
            {l.common.password}
          </Text>
          <PasswordInput onChangeText={onChangeText} />
          <Text variant="bodySmall" color="red" mt="xs" textAlign="left">
            {error}
          </Text>
          <Box flexDirection="row" justifyContent="flex-end" mt="xs">
            <BaseButton
              backgroundColor="accentButtonColor"
              borderColor="accentButtonColor"
              style={styles.modalButton}
              onPress={onContinuePress}
            >
              {isExporting ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <Text variant="bodySmall" color="accentButtonTextColor">
                  {l.connect_wallet_details.backup}
                </Text>
              )}
            </BaseButton>
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </TWModal>
  );
};

const styles = StyleSheet.create({
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
  pkButton: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
});
