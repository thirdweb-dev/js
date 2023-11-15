import { useWallet } from "@thirdweb-dev/react-core";
import Box from "../base/Box";
import BaseButton from "../base/BaseButton";
import Text from "../base/Text";
import {
  CLOSE_MODAL_STATE,
  WalletConnectSessionProposalModal,
} from "../../utils/modalTypes";
import { useLocale, useModalState } from "../../providers/ui-context-provider";
import { useWalletConnectHandler } from "../../providers/context-provider";

export const SessionProposalModal = () => {
  const l = useLocale();
  const { modalState, setModalState } = useModalState();
  const { data: proposalData } =
    modalState as WalletConnectSessionProposalModal;
  const walletConnectHandler = useWalletConnectHandler();

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
      <Text variant="bodyLarge">{l.connect_wallet_details.connect_to_app}</Text>
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
            walletConnectHandler?.rejectSession();
            onClose();
          }}
        >
          <Text variant="bodySmall">{l.common.reject}</Text>
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
            await walletConnectHandler?.approveSession();
            onClose();
          }}
        >
          <Text variant="bodySmall" color="black">
            {l.common.approve}
          </Text>
        </BaseButton>
      </Box>
    </Box>
  );
};
