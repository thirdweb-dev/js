import { useWallet } from "@thirdweb-dev/react-core";
import { SessionTypes, SignClientTypes } from "@walletconnect/types";
import Modal from "react-native-modal";
import Box from "../base/Box";
import BaseButton from "../base/BaseButton";
import Text from "../base/Text";
import { IWalletConnectReceiver } from "@thirdweb-dev/wallets";

export const SessionRequestModal = ({
  isVisible,
  requestData,
  onClose,
}: {
  isVisible: boolean;
  requestData: {
    request: SignClientTypes.EventArguments["session_request"];
    session: SessionTypes.Struct;
  };
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
        <Text variant="bodyLarge">Session Request</Text>
        <Text variant="bodyLarge">
          {requestData.session.peer.metadata.name}
        </Text>
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
              ).rejectEIP155Request(requestData.request);
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
              ).approveEIP155Request(wallet, requestData.request);
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
