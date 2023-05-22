import { useWallet } from "@thirdweb-dev/react-core";
import Box from "../base/Box";
import BaseButton from "../base/BaseButton";
import Text from "../base/Text";
import { IWalletConnectReceiver } from "@thirdweb-dev/wallets";
import {
  CLOSE_MODAL_STATE,
  WalletConnectSessionProposalModal,
} from "../../utils/modalTypes";
import { useModalState } from "../../providers/ui-context-provider";

export const SessionProposalModal = () => {
  const { modalState, setModalState } = useModalState();
  const { data: proposalData } =
    modalState as WalletConnectSessionProposalModal;

  const wallet = useWallet();

  const onClose = () => {
    setModalState(CLOSE_MODAL_STATE("SessionProposalModal"));
  };

  return (
    <Box
      flexDirection="column"
      backgroundColor="background"
      borderRadius="md"
      p="lg"
    >
      <Text variant="bodyLarge">Connect to App</Text>
      <Text variant="bodyLarge">{proposalData.proposer.metadata.name}</Text>
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
            (wallet as unknown as IWalletConnectReceiver).rejectSession();
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
            ).approveSession();
            onClose();
          }}
        >
          <Text variant="bodySmall" color="black">
            Approve
          </Text>
        </BaseButton>
      </Box>
    </Box>
  );
};
