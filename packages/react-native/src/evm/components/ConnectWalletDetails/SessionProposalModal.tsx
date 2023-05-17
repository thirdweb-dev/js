import { useWallet } from "@thirdweb-dev/react-core";
import Modal from "react-native-modal";
import Box from "../base/Box";
import BaseButton from "../base/BaseButton";
import Text from "../base/Text";
import { IWalletConnectReceiver, WCProposal } from "@thirdweb-dev/wallets";

export const SessionProposalModal = ({
  isVisible,
  proposal,
  onApprove,
  onClose,
}: {
  isVisible: boolean;
  proposal: WCProposal;
  onApprove: (appName: string, appIconUrl: string) => void;
  onClose: () => void;
}) => {
  const wallet = useWallet();

  console.log("proposal", proposal);

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.9}>
      <Box
        flexDirection="column"
        backgroundColor="background"
        borderRadius="md"
        p="lg"
      >
        <Text variant="bodyLarge">Session Proposal</Text>
        <Text variant="bodyLarge">{proposal.proposer.metadata.name}</Text>
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
              onApprove(
                proposal.proposer.metadata.name,
                proposal.proposer.metadata.icons[0],
              );
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
