import Text from "../base/Text";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import BaseButton from "../base/BaseButton";
import Box from "../base/Box";
import { ModalHeaderTextClose } from "../base/modal/ModalHeaderTextClose";
import { useCreateWalletInstance } from "@thirdweb-dev/react-core";
import { PasswordInput } from "../PasswordInput";
import type { LocalWalletInstance } from "../../wallets/types/local-wallet";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { TWModal } from "../base/modal/TWModal";
import { localWallet } from "../../wallets/wallets/local-wallet";
import { TextInput } from "../base";
import { useAppTheme } from "../../styles/hooks";

export type LocalWalletImportModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onWalletImported: (wallet: LocalWalletInstance) => void;
};

export const LocalWalletImportModal = ({
  isVisible,
  onClose,
  onWalletImported,
}: LocalWalletImportModalProps) => {
  const [password, setPassword] = useState<string | undefined>();
  const [privateKeyOrMnemonic, setPrivateKeyOrMnemonic] = useState<
    string | undefined
  >(undefined);
  const [jsonFile, setJsonFile] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const createWalletInstance = useCreateWalletInstance();
  const theme = useAppTheme();

  const createLocalWalletFromJsonFile = async () => {
    if (!jsonFile || !password) {
      return null;
    }

    let json;
    try {
      json = await FileSystem.readAsStringAsync(jsonFile, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    } catch (err) {
      return null;
    }

    const localWalletInstance = createWalletInstance(localWallet());

    try {
      await localWalletInstance.import({
        encryptedJson: json,
        password: password,
      });
    } catch (err) {
      console.error("Error importing the wallet", err);
      return null;
    }

    return localWalletInstance;
  };

  const createLocalWalletPK = async () => {
    if (!privateKeyOrMnemonic) {
      return null;
    }

    const localWalletInstance = createWalletInstance(localWallet());

    try {
      if (privateKeyOrMnemonic.indexOf(" ") === -1) {
        await localWalletInstance.import({
          privateKey: privateKeyOrMnemonic,
          encryption: false,
        });
      } else {
        await localWalletInstance.import({
          mnemonic: privateKeyOrMnemonic,
          encryption: false,
        });
      }
    } catch (err) {
      console.error("Error importing the wallet", err);
      return null;
    }

    return localWalletInstance;
  };

  const onImportPress = async () => {
    setError(undefined);
    setIsImporting(true);

    setTimeout(async () => {
      let localWalletInstance = await createLocalWalletFromJsonFile();

      if (!localWalletInstance) {
        localWalletInstance = await createLocalWalletPK();
      }

      if (!localWalletInstance) {
        setError("Please, double check your password or private key.");
        setIsImporting(false);
        return;
      }

      localWalletInstance.save({
        strategy: "privateKey",
        encryption: false,
      });

      onWalletImported(localWalletInstance);

      setIsImporting(false);
      onCloseInternal();
    }, 0);
  };

  const onCloseInternal = () => {
    setPassword(undefined);
    onClose();
  };

  const onChangeText = (text: string) => {
    setPassword(text);

    if (text.length === 0) {
      setError(undefined);
    }
  };

  const onPickFilePress = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: "application/json",
    });

    if (result.type === "success") {
      setJsonFile(result.uri);
      setError(undefined);
    } else {
      setError("Error accessing the file. Please try again.");
    }
  };

  const onPrivateKeyEntered = (text: string) => {
    setPrivateKeyOrMnemonic(text);
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
            headerText={"Import JSON Wallet"}
            onClose={onCloseInternal}
          />
          <Text variant="subHeader" mt="md" textAlign="center">
            {
              "The application can authorize any transactions on behalf of the wallet without any approvals. We recommend only connecting to trusted applications."
            }
          </Text>
          <BaseButton
            backgroundColor="background"
            borderColor="border"
            mt="lg"
            onPress={onPickFilePress}
            style={styles.pkButton}
          >
            <Text variant="bodySmallSecondary" textAlign="left">
              {jsonFile ||
                "Select the JSON file you exported from your wallet."}
            </Text>
          </BaseButton>
          <Text variant="bodySmall" textAlign="left" mt="lg" mb="xxs">
            Password
          </Text>
          <PasswordInput onChangeText={onChangeText} />
          <Text variant="bodySmall" color="red" mt="xs" textAlign="left">
            {error}
          </Text>
          <Box
            mb="xs"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <Box height={1} flex={1} backgroundColor="border" />
            <Text variant="bodySmall" textAlign="center" marginHorizontal="xxs">
              Or Private key or Mnemonic
            </Text>
            <Box height={1} flex={1} backgroundColor="border" />
          </Box>
          <TextInput
            textInputProps={{
              secureTextEntry: true,
              placeholder: "Private key / Mnemonic",
              placeholderTextColor: theme.colors.textSecondary,
              onChangeText: onPrivateKeyEntered,
            }}
            containerProps={{ pl: "xxs" }}
          />
          <Box
            flexDirection="row"
            justifyContent="center"
            paddingHorizontal="md"
            mt="lg"
          >
            <BaseButton
              backgroundColor="white"
              style={styles.modalButton}
              onPress={onImportPress}
            >
              {isImporting ? (
                <ActivityIndicator size="small" color="buttonTextColor" />
              ) : (
                <Text variant="bodySmall" color="black">
                  Import
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
