import { useWallet } from "@thirdweb-dev/react-core";
import { SignClientTypes } from "@walletconnect/types";
import Modal from "react-native-modal";
import Box from "../base/Box";
import BaseButton from "../base/BaseButton";
import Text from "../base/Text";
import { IWalletConnectReceiver } from "@thirdweb-dev/wallets";

export const SessionProposalModal = ({
  isVisible,
  proposal,
  onApprove,
  onClose,
}: {
  isVisible: boolean;
  proposal: SignClientTypes.EventArguments["session_proposal"];
  onApprove: (appName: string, appIconUrl: string) => void;
  onClose: () => void;
}) => {
  const wallet = useWallet();

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.7}>
      <Box>
        <Text variant="bodyLarge">Session Proposal</Text>
        <Text variant="bodyLarge">
          {proposal.params.proposer.metadata.name}
        </Text>
        <Box flexDirection="row">
          <BaseButton
            onPress={async () => {
              await (wallet as unknown as IWalletConnectReceiver).rejectSession(
                proposal,
              );
              onClose();
            }}
          >
            <Text variant="bodySmall">Reject</Text>
          </BaseButton>
          <BaseButton
            onPress={async () => {
              if (!wallet) {
                throw new Error("Wallet not connected.");
              }
              await (
                wallet as unknown as IWalletConnectReceiver
              ).approveSession(wallet, proposal);
              onApprove(
                proposal.params.proposer.metadata.name,
                proposal.params.proposer.metadata.icons[0],
              );
              onClose();
            }}
          >
            <Text variant="bodySmall">Approve</Text>
          </BaseButton>
        </Box>
      </Box>
    </Modal>
  );
};
