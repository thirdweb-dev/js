import { useWallet } from "@thirdweb-dev/react-core";
import Modal from "react-native-modal";
import Box from "../base/Box";
import BaseButton from "../base/BaseButton";
import Text from "../base/Text";
import { IWalletConnectReceiver, WCRequest } from "@thirdweb-dev/wallets";

const getTitle = (method: string) => {
  switch (method) {
    case "switch_chain":
      return "Switch Chain";
    default:
      return "Sign this message?";
  }
};

const getContent = (requestData: WCRequest) => {
  switch (requestData.method) {
    case "switch_chain":
      return `Switch to ${requestData.params[0].chainId}`;
    default:
      return `Message: ${requestData.params[0]}`;
  }
};

export const SessionRequestModal = ({
  isVisible,
  requestData,
  onClose,
}: {
  isVisible: boolean;
  requestData: WCRequest;
  onClose: () => void;
}) => {
  const wallet = useWallet();

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.7}>
      <Box
        flexDirection="column"
        backgroundColor="background"
        borderRadius="md"
        p="lg"
      >
        <Text variant="bodyLarge" mb="md">
          {requestData.peer.metadata.name}
        </Text>
        <Text variant="bodyLarge">{getTitle(requestData.method)}</Text>
        <Text variant="bodyLarge">{getContent(requestData)}</Text>
        <Box flexDirection="row" justifyContent="space-evenly" mt="lg">
          <BaseButton
            alignContent="center"
            alignItems="center"
            borderRadius="sm"
            borderWidth={0.5}
            paddingHorizontal="sm"
            paddingVertical="md"
            minWidth={100}
            borderColor="border"
            onPress={async () => {
              await (
                wallet as unknown as IWalletConnectReceiver
              ).rejectRequest();
              onClose();
            }}
          >
            <Text variant="bodySmall">Reject</Text>
          </BaseButton>
          <BaseButton
            alignContent="center"
            alignItems="center"
            borderRadius="sm"
            borderWidth={0.5}
            paddingHorizontal="sm"
            paddingVertical="md"
            minWidth={100}
            backgroundColor="white"
            borderColor="border"
            onPress={async () => {
              if (!wallet) {
                throw new Error("Wallet not connected.");
              }
              await (
                wallet as unknown as IWalletConnectReceiver
              ).approveRequest();
              onClose();
            }}
          >
            <Text variant="bodySmall" color="black">
              Approve
            </Text>
          </BaseButton>
        </Box>
      </Box>
    </Modal>
  );
};
