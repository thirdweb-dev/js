import { walletIds } from "@thirdweb-dev/wallets";
import { localWallet } from "../../../wallets/wallets/local-wallet";
import { ModalHeaderTextClose } from "../../base/modal/ModalHeaderTextClose";
import { WalletConfig } from "@thirdweb-dev/react-core";
import { ReactNode, useState } from "react";
import Box from "../../base/Box";
import Text from "../../base/Text";
import ThirdwebLogo from "../../../assets/thirdweb-logo";
import { useAppTheme } from "../../../styles/hooks";
import { ChooseWalletContent } from "./ChooseWalletContent";
import { BaseButton } from "../../base";
import { ActivityIndicator } from "react-native";
import Email from "../../../assets/email";

export type ChooseWalletProps = {
  headerText?: ReactNode | string;
  subHeaderText?: ReactNode | string;
  onChooseWallet: (wallet: WalletConfig<any>, data?: any) => void;
  onClose: () => void;
  wallets: WalletConfig<any>[];
  excludeWalletIds?: string[];
};

export function ChooseWallet({
  headerText,
  subHeaderText,
  wallets,
  onChooseWallet,
  onClose,
  excludeWalletIds = [],
}: ChooseWalletProps) {
  const theme = useAppTheme();
  const [isConnecting, setIsConnecting] = useState(false);

  const guestWallet = wallets.find((w) => w.id === walletIds.localWallet);
  const emailWallet = wallets.find((w) => w.id === walletIds.metamask);

  const onContinueAsGuestPress = () => {
    setIsConnecting(true);
    setTimeout(() => {
      onChooseWallet(localWallet());
    }, 0);
  };

  return (
    <Box height={"100%"} justifyContent="space-around">
      <ModalHeaderTextClose
        paddingHorizontal="xl"
        onClose={onClose}
        headerText={
          headerText ? (
            headerText
          ) : (
            <Box
              paddingHorizontal="md"
              flexDirection="row"
              alignItems="center"
              alignContent="center"
              justifyContent="center"
            >
              <ThirdwebLogo
                width={26}
                height={15}
                color={theme.colors.backgroundInverted}
              />
              <Text
                variant="header"
                ml="xxs"
                fontWeight="700"
                fontSize={20}
                lineHeight={24}
              >
                Connect
              </Text>
            </Box>
          )
        }
        subHeaderText={subHeaderText}
      />
      <ChooseWalletContent
        wallets={wallets}
        excludeWalletIds={[...excludeWalletIds, walletIds.localWallet]}
        onChooseWallet={onChooseWallet}
      />
      <Box
        paddingVertical="md"
        borderTopColor="border"
        borderTopWidth={1}
        paddingHorizontal="xl"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text variant="bodySmall">New to wallets?</Text>
        <BaseButton>
          <Text variant="link">Get started</Text>
        </BaseButton>
      </Box>
      {guestWallet || emailWallet ? (
        <Text
          variant="subHeader"
          textAlign="center"
          marginHorizontal="xl"
          mb="md"
        >
          ----------- Or -----------
        </Text>
      ) : null}
      {emailWallet ? (
        <Box marginHorizontal="xl">
          <BaseButton
            mb="sm"
            justifyContent="center"
            borderRadius="lg"
            height={50}
            borderColor="border"
            flexDirection="row"
            alignItems="center"
            borderWidth={1}
            onPress={onContinueAsGuestPress}
          >
            <Email width={20} height={20} />
            <Text variant="bodySmall" ml="xxs">
              Email
            </Text>
          </BaseButton>
        </Box>
      ) : null}
      {guestWallet ? (
        <Box marginHorizontal="xl">
          <BaseButton
            justifyContent="center"
            borderRadius="lg"
            height={50}
            borderColor="border"
            borderWidth={1}
            onPress={onContinueAsGuestPress}
          >
            {isConnecting ? (
              <ActivityIndicator size={"small"} />
            ) : (
              <Text variant="bodySmall">Continue as guest</Text>
            )}
          </BaseButton>
        </Box>
      ) : null}
    </Box>
  );
}
