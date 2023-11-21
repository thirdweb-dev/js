import { useState } from "react";
import RightArrowIcon from "../../assets/right-arrow";
import { Theme } from "../../styles/theme";
import BaseButton from "./BaseButton";
import { ChainIcon } from "./ChainIcon";
import Text from "./Text";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useSwitchChain, useSupportedChains } from "@thirdweb-dev/react-core";
import Box from "./Box";
import { ModalHeaderTextClose } from "./modal/ModalHeaderTextClose";
import { TWModal } from "./modal/TWModal";
import type { Chain } from "@thirdweb-dev/chains";
import { useGlobalTheme, useLocale } from "../../providers/ui-context-provider";

type NetworkButtonProps = {
  chain?: Chain;
  padding?: keyof Theme["spacing"];
  onPress?: () => void;
  enableSwitchModal?: boolean;
  switchChainOnPress?: boolean;
  onChainSwitched?: () => void;
} & React.ComponentProps<typeof Box>;

export const NetworkButton = ({
  onPress,
  chain,
  enableSwitchModal = false,
  switchChainOnPress = false,
  onChainSwitched,
  padding,
  ...props
}: NetworkButtonProps) => {
  const l = useLocale();
  const theme = useGlobalTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [switchError, setSwitchError] = useState<string | undefined>();
  const [isSwitching, setIsSwitching] = useState(false);
  const switchChain = useSwitchChain();

  const onClose = () => {
    setIsModalVisible(false);
  };

  const onChangeNetworkPress = () => {
    if (enableSwitchModal) {
      setIsModalVisible(true);
    } else if (switchChainOnPress) {
      setIsSwitching(true);
      setTimeout(async () => {
        if (!chain?.chainId) {
          throw new Error(`Empty chainId for chain: ${chain?.name}`);
        }

        try {
          await switchChain(chain.chainId);
          setIsSwitching(false);
          onChainSwitched?.();
        } catch (error) {
          setSwitchError((error as Error).message);
          setIsSwitching(false);
        }
      }, 0);
    }
    onPress?.();
  };

  return (
    <>
      <BaseButton
        p={padding || "sm"}
        paddingVertical="xs"
        borderRadius="md"
        borderWidth={0.5}
        flexDirection="row"
        alignItems="center"
        onPress={onChangeNetworkPress}
        justifyContent="space-between"
        borderColor="border"
        {...props}
      >
        <Box flexDirection="row" alignItems="center">
          <ChainIcon chainIconUrl={chain?.icon?.url} size={28} />
          <Box ml="sm" alignItems="flex-start" justifyContent="center">
            <Text variant="bodyLarge">
              {chain?.name || l.common.unknown_network}
            </Text>
            {isSwitching ? (
              <Box flexDirection="row" alignItems="center">
                <Text
                  variant="bodySmall"
                  color="linkPrimary"
                  mr="xxs"
                  fontSize={10}
                >
                  {l.connect_wallet_details.confirm_in_wallet}
                </Text>
                <ActivityIndicator size={10} color={theme.colors.linkPrimary} />
              </Box>
            ) : switchError ? (
              <Text variant="error">{l.common.error_switching_network}</Text>
            ) : null}
          </Box>
        </Box>
        {enableSwitchModal ? (
          <RightArrowIcon
            width={10}
            height={10}
            color={theme.colors.iconPrimary}
          />
        ) : null}
      </BaseButton>
      {enableSwitchModal ? (
        <SwitchChainModal isVisible={isModalVisible} onClose={onClose} />
      ) : null}
    </>
  );
};

const MODAL_HEIGHT = Dimensions.get("window").height * 0.7;

export type SwitchChainModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const SwitchChainModal = ({
  isVisible,
  onClose,
}: SwitchChainModalProps) => {
  const l = useLocale();
  const supportedChains = useSupportedChains();

  const onCloseInternal = () => {
    onClose();
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
          <Box flexDirection="row" justifyContent="space-between" mb="sm">
            <Text variant="bodyLarge" textAlign="left">
              {l.connect_wallet_details.select_network}
            </Text>
            <ModalHeaderTextClose flex={1} onClose={onCloseInternal} />
          </Box>
          <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
            {supportedChains?.length > 0 ? (
              supportedChains.map((chain) => {
                return (
                  <NetworkButton
                    mt="xxs"
                    padding="none"
                    key={chain.chainId}
                    backgroundColor="transparent"
                    borderColor="transparent"
                    chain={chain}
                    enableSwitchModal={false}
                    switchChainOnPress={true}
                    onChainSwitched={onCloseInternal}
                  />
                );
              })
            ) : (
              <Text variant="error">
                {l.connect_wallet_details.no_supported_chains_detected}
              </Text>
            )}
          </ScrollView>
        </Box>
      </KeyboardAvoidingView>
    </TWModal>
  );
};
