import React, { useEffect, useState } from "react";
import { IconTextButton } from "./base/IconTextButton";
import { useAddress } from "@thirdweb-dev/react-core";
import { Dimensions, KeyboardAvoidingView } from "react-native";
import { useAppTheme } from "../styles/hooks";
import {
  TWModal,
  Box,
  ModalHeaderTextClose,
  Text,
  AddressDisplay,
  BaseButton,
  Toast,
} from "./base";
import DownloadIcon from "../assets/download";
import CopyIcon from "../assets/copy";
import QRCode from "react-native-qrcode-svg";

// type SendButtonProps = {
//   chain?: Chain;
//   onPress?: () => void;
//   switchChainOnPress?: boolean;
//   onChainSwitched?: () => void;
// };

export const ReceiveButton = () => {
  const theme = useAppTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onClose = () => {
    setIsModalVisible(false);
  };

  const onReceivePress = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <IconTextButton
        flex={1}
        ml="xs"
        text="Receive"
        justifyContent="center"
        icon={
          <DownloadIcon
            height={16}
            width={16}
            color={theme.colors.textPrimary}
          />
        }
        onPress={onReceivePress}
      />
      <ReceiveFundsModal isVisible={isModalVisible} onClose={onClose} />
    </>
  );
};

const MODAL_HEIGHT = Dimensions.get("window").height * 0.7;

export type ReceiveFundsModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const ReceiveFundsModal = ({
  isVisible,
  onClose,
}: ReceiveFundsModalProps) => {
  const theme = useAppTheme();
  const address = useAddress();
  const [addressCopied, setAddressCopied] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (addressCopied) {
        setAddressCopied(false);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [addressCopied]);

  const onCloseInternal = () => {
    onClose();
  };

  const onAddressPress = () => {
    setAddressCopied(true);
  };

  return (
    <TWModal isVisible={isVisible} backdropOpacity={0.7}>
      <KeyboardAvoidingView behavior="padding">
        <Box
          flexDirection="column"
          backgroundColor="background"
          maxHeight={MODAL_HEIGHT}
          borderRadius="md"
          p="lg"
        >
          <ModalHeaderTextClose
            onBackPress={onCloseInternal}
            headerText="Receive Funds"
          />
          <Text
            variant="bodySmallSecondary"
            textAlign="center"
            mt="md"
            marginHorizontal="xmd"
          >
            Paste the wallet address or scan the QR code to send funds to this
            wallet.
          </Text>
          <Text mt="lg" variant="bodySmallSecondary">
            Current Network
          </Text>
          <BaseButton
            mt="xs"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            borderColor="border"
            borderWidth={1}
            borderRadius="md"
            onPress={onAddressPress}
            p="md"
          >
            <AddressDisplay address={address} variant="bodySmall" />
            <CopyIcon width={14} height={14} color={theme.colors.iconPrimary} />
          </BaseButton>
          <Text mt="lg" variant="bodySmallSecondary">
            QR Code
          </Text>
          <Box
            mt="xs"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            borderColor="border"
            backgroundColor="white"
            borderWidth={1}
            borderRadius="md"
            p="md"
          >
            <QRCode value={address} size={200} />
          </Box>

          {addressCopied === true ? (
            <Toast text={"Address copied to clipboard"} />
          ) : null}
        </Box>
      </KeyboardAvoidingView>
    </TWModal>
  );
};
