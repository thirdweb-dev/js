import { useChain, useWallet } from "@thirdweb-dev/react-core";
import Box from "../base/Box";
import BaseButton from "../base/BaseButton";
import Text from "../base/Text";
import {
  EIP155_SIGNING_METHODS,
  IWalletConnectReceiver,
} from "@thirdweb-dev/wallets";
import { useLocale, useModalState } from "../../providers/ui-context-provider";
import {
  CLOSE_MODAL_STATE,
  WalletConnectSessionRequestModal,
} from "../../utils/modalTypes";
import { ActivityIndicator, Dimensions } from "react-native";
import { shortenWalletAddress } from "../../utils/addresses";
import { useCallback, useState } from "react";

const getTitle = (method: string) => {
  switch (method) {
    case EIP155_SIGNING_METHODS.SWITCH_CHAIN:
      return "Switch Chain";
    case EIP155_SIGNING_METHODS.ETH_SIGN:
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
      return "Sign this message?";
    default:
      return "Send / Sign Transaction";
  }
};

const MODAL_HEIGHT = Dimensions.get("window").height * 0.7;

export const SessionRequestModal = () => {
  const l = useLocale();
  const { modalState, setModalState } = useModalState();
  const { data: requestData } = modalState as WalletConnectSessionRequestModal;
  const [approvingRequest, setApprovingRequest] = useState(false);

  const wallet = useWallet();
  const chain = useChain();

  const onClose = () => {
    setModalState(CLOSE_MODAL_STATE("SessionRequestModal"));
  };

  const onApprove = async () => {
    if (!wallet) {
      throw new Error("Wallet not connected.");
    }

    setApprovingRequest(true);
    (wallet as unknown as IWalletConnectReceiver)
      .approveRequest()
      .finally(() => {
        setApprovingRequest(false);
        onClose();
      });
  };

  const getContent = useCallback(() => {
    switch (requestData.method) {
      case EIP155_SIGNING_METHODS.SWITCH_CHAIN:
        return (
          <Text variant="bodySmall" textAlign="left">
            {`${l.connect_wallet_details.switch_to} ${
              requestData.params[0].chainId === chain?.chainId
                ? chain?.slug
                : requestData.params[0].chainId
            }`}
          </Text>
        );
      case EIP155_SIGNING_METHODS.ETH_SIGN:
      case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
        return (
          <Text variant="bodySmall" textAlign="left">
            {requestData.params[0]}
          </Text>
        );
      case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
        const { params } = requestData;
        const transaction = params[0];

        const from = transaction.from;
        const to = transaction.to;

        return (
          <Box>
            <Text variant="bodySmall" textAlign="left">
              {`${l.common.from}: ${shortenWalletAddress(from)}`}
            </Text>
            <Text variant="bodySmall" textAlign="left" mt="sm">
              {`${l.common.to}: ${shortenWalletAddress(to)}`}
            </Text>
          </Box>
        );
      default:
        throw new Error(`Method not implemented: ${requestData.method}`);
    }
  }, [chain?.chainId, chain?.slug, requestData, l]);

  return (
    <Box
      flexDirection="column"
      backgroundColor="background"
      borderRadius="md"
      p="lg"
    >
      <Text variant="bodyLarge" mb="md">
        {requestData.peer.metadata.name}
      </Text>
      <Text variant="bodySmallSecondary" textAlign="center" fontSize={15}>
        {getTitle(requestData.method)}
      </Text>
      <Box maxHeight={MODAL_HEIGHT} mt="md">
        {getContent()}
      </Box>
      <Box flexDirection="row" justifyContent="space-evenly" mt="lg">
        <BaseButton
          alignContent="center"
          alignItems="center"
          borderRadius="sm"
          borderWidth={0.5}
          disabled={approvingRequest}
          paddingHorizontal="sm"
          paddingVertical="md"
          minWidth={100}
          borderColor="border"
          onPress={async () => {
            (wallet as unknown as IWalletConnectReceiver).rejectRequest();
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
          disabled={approvingRequest}
          paddingHorizontal="sm"
          paddingVertical="md"
          minWidth={100}
          backgroundColor="white"
          borderColor="border"
          onPress={onApprove}
        >
          {approvingRequest ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text variant="bodySmall" color="black">
              {l.common.approve}
            </Text>
          )}
        </BaseButton>
      </Box>
    </Box>
  );
};
