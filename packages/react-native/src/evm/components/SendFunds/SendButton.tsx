import React, { useEffect, useMemo, useState } from "react";
import SendIcon from "../../assets/send";
import {
  BaseButton,
  Box,
  ChainIcon,
  IconTextButton,
  ImageSvgUri,
  ModalHeaderTextClose,
  TWModal,
  Text,
} from "../base";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  TextInput as TextInputRN,
} from "react-native";
import {
  TransactionResult,
  useBalance,
  useChain,
  useChainId,
  useWallet,
} from "@thirdweb-dev/react-core";
import { SupportedTokens, TokenInfo, defaultTokens } from "./defaultTokens";
import { useMutation } from "@tanstack/react-query";
import { utils } from "ethers";
import LoadingTextAnimation from "../base/LoadingTextAnimation";
import CheckIcon from "../../assets/check";
import { TokenSelector } from "./TokenSelector";
import { useGlobalTheme, useLocale } from "../../providers/ui-context-provider";

export const SendButton = ({
  supportedTokens,
}: {
  supportedTokens: SupportedTokens;
}) => {
  const l = useLocale();
  const theme = useGlobalTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onClose = () => {
    setIsModalVisible(false);
  };

  const onSendPress = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <IconTextButton
        flex={1}
        text={l.common.send}
        justifyContent="center"
        icon={
          <SendIcon height={16} width={16} color={theme.colors.textPrimary} />
        }
        onPress={onSendPress}
      />
      <SendFundsModal
        isVisible={isModalVisible}
        onClose={onClose}
        supportedTokens={supportedTokens}
      />
    </>
  );
};

const MODAL_HEIGHT = Dimensions.get("window").height * 0.7;

type TXError = Error & { data?: { message?: string } };

export type SendFundsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  supportedTokens: SupportedTokens;
};

export const SendFundsModal = ({
  isVisible,
  onClose,
  supportedTokens,
}: SendFundsModalProps) => {
  const [showTokenSelector, setShowTokenSelector] = useState(false);

  const chainId = useChainId();
  let defaultToken: TokenInfo | undefined = undefined;
  if (
    // if we know chainId
    chainId &&
    // if there is a list of tokens for this chain
    supportedTokens[chainId] &&
    // if the list of tokens is not the default list
    supportedTokens[chainId] !== defaultTokens[chainId]
  ) {
    // use the first token in the list as default selected
    defaultToken = supportedTokens[chainId][0];
  }

  const [token, setToken] = useState<TokenInfo | undefined>(defaultToken);

  const onTokenSelectorPress = () => {
    setShowTokenSelector(true);
  };

  return (
    <TWModal isVisible={isVisible} backdropOpacity={0.7}>
      <KeyboardAvoidingView behavior="padding">
        {showTokenSelector ? (
          <TokenSelector
            supportedTokens={supportedTokens}
            onBack={() => {
              setShowTokenSelector(false);
            }}
            onTokenSelect={(_token) => {
              setToken(_token);
              setShowTokenSelector(false);
            }}
          />
        ) : (
          <SendFundsForm
            onClose={onClose}
            token={token}
            onTokenSelectorPress={onTokenSelectorPress}
          />
        )}
      </KeyboardAvoidingView>
    </TWModal>
  );
};

const SendFundsForm = ({
  onClose,
  onTokenSelectorPress,
  token,
}: {
  onClose: () => void;
  onTokenSelectorPress: () => void;
  token?: TokenInfo;
}) => {
  const l = useLocale();
  const theme = useGlobalTheme();
  const chain = useChain();
  const wallet = useWallet();
  const chainId = useChainId();
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("0");
  const [showIcon, setShowIcon] = useState(false);
  const tokenAddress = token?.address;

  const balanceQuery = useBalance(
    tokenAddress && utils.isAddress(tokenAddress) ? tokenAddress : undefined,
  );

  const tokenName = token?.name || balanceQuery?.data?.name;
  const tokenSymbol = token?.symbol || balanceQuery.data?.symbol;

  // Ethereum or Rinkeby or Goerli
  const isENSSupprted = chainId === 1 || chainId === 5 || chainId === 4;

  const isValidReceieverAddress = useMemo(() => {
    const isENS = receiverAddress.endsWith(".eth");

    if (!isENSSupprted && isENS) {
      return false;
    }

    return isENS || utils.isAddress(receiverAddress);
  }, [receiverAddress, isENSSupprted]);

  const showInvalidAddressError = receiverAddress && !isValidReceieverAddress;

  const sendTokenMutation = useMutation<TransactionResult | undefined, TXError>(
    async () => {
      if (!wallet) {
        return;
      }

      return wallet.transfer(receiverAddress, amount, tokenAddress);
    },
  );

  useEffect(() => {
    if (sendTokenMutation.isSuccess) {
      setShowIcon(true);
      setTimeout(() => {
        setShowIcon(false);
      }, 1000);
    }
  }, [sendTokenMutation.isSuccess]);

  const onCloseInternal = () => {
    onClose();
  };

  function getErrorMessage(error?: TXError) {
    const message = error?.data?.message || error?.message;

    if (!message) {
      return "Transaction Failed";
    }

    if (message.includes("user rejected")) {
      return "Transaction Rejected";
    }

    if (message.includes("insufficient funds")) {
      return "Insufficient funds";
    }

    return "Transaction Failed";
  }

  return (
    <Box
      flexDirection="column"
      backgroundColor="background"
      maxHeight={MODAL_HEIGHT}
      borderRadius="md"
      p="lg"
    >
      <ModalHeaderTextClose
        onClose={onCloseInternal}
        headerText={l.connect_wallet_details.send_funds}
      />
      <Text mt="lg" variant="bodySmallSecondary">
        {l.connect_wallet_details.select_token}
      </Text>

      <BaseButton
        mt="xs"
        borderRadius="md"
        borderWidth={0.5}
        paddingHorizontal="md"
        paddingVertical="sm"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        borderColor="border"
        onPress={onTokenSelectorPress}
      >
        <Box flexDirection="row" alignItems="center">
          {token?.icon ? (
            <ImageSvgUri width={32} height={32} imageUrl={token.icon} />
          ) : (
            <ChainIcon chainIconUrl={chain?.icon?.url} size={32} />
          )}
          <Box
            ml="md"
            alignItems="flex-start"
            justifyContent="center"
            height={36}
          >
            <Text variant="bodySmall">{tokenName}</Text>
            {!balanceQuery.data ? (
              <LoadingTextAnimation
                text={l.common.fetching}
                textVariant={"bodySmallSecondary"}
              />
            ) : (
              <Text variant="bodySmallSecondary" fontSize={12}>
                {Number(balanceQuery.data?.displayValue).toFixed(3)}{" "}
                {balanceQuery.data.symbol}
              </Text>
            )}
          </Box>
        </Box>
      </BaseButton>

      <Text mt="md" variant="bodySmallSecondary">
        {l.connect_wallet_details.send_to}
      </Text>
      <Box
        mt="xs"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        borderColor={showInvalidAddressError ? "red" : "border"}
        borderWidth={1}
        borderRadius="md"
        pr="xs"
      >
        <TextInputRN
          editable={!sendTokenMutation.isLoading}
          returnKeyType={"done"}
          clearTextOnFocus={false}
          onChangeText={setReceiverAddress}
          style={{
            color: theme.colors.textPrimary,
            fontFamily: theme.textVariants.defaults.fontFamily,
            textAlign: "left",
            flex: 1,
            height: 40,
            paddingHorizontal: 16,
          }}
          value={receiverAddress}
          placeholder={isENSSupprted ? `0x... / ENS name` : "0x..."}
          placeholderTextColor={theme.colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </Box>
      <Text mt="md" variant="bodySmallSecondary">
        {l.common.amount}
      </Text>
      <Box
        mt="xs"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        borderColor="border"
        borderWidth={1}
        borderRadius="md"
        pr="xs"
      >
        <TextInputRN
          editable={!sendTokenMutation.isLoading}
          returnKeyType={"done"}
          keyboardType="numeric"
          value={amount}
          clearTextOnFocus={false}
          style={{
            color: theme.colors.textPrimary,
            fontFamily: theme.textVariants.defaults.fontFamily,
            textAlign: "left",
            flex: 1,
            height: 40,
            paddingHorizontal: 16,
          }}
          onChangeText={setAmount}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text variant="bodySmallSecondary">{tokenSymbol}</Text>
      </Box>
      <BaseButton
        mt="md"
        backgroundColor="accentButtonColor"
        borderColor="accentButtonColor"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        alignContent="center"
        borderRadius="md"
        borderWidth={0.5}
        paddingVertical="md"
        onPress={async () => {
          if (!receiverAddress || !wallet || !amount) {
            return;
          }

          await sendTokenMutation.mutateAsync();
        }}
      >
        {sendTokenMutation.isLoading ? (
          <ActivityIndicator
            size="small"
            color={theme.colors.accentButtonTextColor}
          />
        ) : showIcon ? (
          <CheckIcon
            width={20}
            height={13}
            color={theme.colors.accentButtonTextColor}
          />
        ) : (
          <Text variant="bodySmall" color="accentButtonTextColor" mr="sm">
            {l.common.send}
          </Text>
        )}
      </BaseButton>

      {sendTokenMutation.isError && (
        <Text mt="sm" variant="error">
          {getErrorMessage(sendTokenMutation.error || undefined)}
        </Text>
      )}
    </Box>
  );
};
