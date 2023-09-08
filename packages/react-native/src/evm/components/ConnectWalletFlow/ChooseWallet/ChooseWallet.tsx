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
import { BaseButton, ImageSvgUri } from "../../base";
import { ActivityIndicator, Linking } from "react-native";
import { useTheme } from "@shopify/restyle";

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
  const themeLightDark = useTheme();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnectAWalletEnabled, setIsConnectAWalletEnabled] = useState(false);

  const guestWallet = wallets.find((w) => w.id === walletIds.localWallet);
  const emailWallet = wallets.find((w) => w.id === walletIds.magicLink);
  const connectionWallets = wallets
    .filter(
      (wallet) =>
        wallet.id !== walletIds.magicLink &&
        wallet.id !== walletIds.localWallet,
    )
    .slice(0, 2);

  const onContinueAsGuestPress = () => {
    setIsConnecting(true);
    setTimeout(() => {
      onChooseWallet(localWallet());
    }, 0);
  };

  const onConnectAWalletPress = () => {
    setIsConnectAWalletEnabled(true);
  };

  const onBackPress = () => {
    setIsConnectAWalletEnabled(false);
  };

  const onGetStartedPress = () => {
    Linking.openURL("https://ethereum.org/en/wallets/find-wallet/");
  };

  return (
    <Box flexDirection="column">
      <ModalHeaderTextClose
        paddingHorizontal="xl"
        onBackPress={isConnectAWalletEnabled ? onBackPress : undefined}
        onClose={onClose}
        headerText={
          headerText ? (
            headerText
          ) : (
            <Box
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
      {!emailWallet || isConnectAWalletEnabled ? (
        <>
          <ChooseWalletContent
            wallets={wallets}
            excludeWalletIds={[
              ...excludeWalletIds,
              walletIds.localWallet,
              walletIds.magicLink,
            ]}
            onChooseWallet={onChooseWallet}
          />

          <Box
            pt="md"
            flexGrow={0}
            borderTopColor="border"
            borderTopWidth={1}
            paddingHorizontal="xl"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text variant="bodySmall">New to wallets?</Text>
            <BaseButton onPress={onGetStartedPress}>
              <Text variant="link">Get started</Text>
            </BaseButton>
          </Box>
        </>
      ) : emailWallet.selectUI ? (
        <emailWallet.selectUI
          theme={themeLightDark}
          supportedWallets={wallets}
          onSelect={(data: any) => {
            onChooseWallet(emailWallet, data);
          }}
          walletConfig={emailWallet}
        />
      ) : null}
      {emailWallet &&
      !isConnectAWalletEnabled &&
      (guestWallet || connectionWallets.length > 0) ? (
        <Box
          mb="md"
          marginHorizontal="xl"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <Box height={1} flex={1} backgroundColor="border" />
          <Text variant="subHeader" textAlign="center" marginHorizontal="xxs">
            Or
          </Text>
          <Box height={1} flex={1} backgroundColor="border" />
        </Box>
      ) : null}
      {emailWallet &&
      !isConnectAWalletEnabled &&
      connectionWallets.length > 0 ? (
        <BaseButton
          mt="sm"
          marginHorizontal="xl"
          justifyContent="center"
          borderRadius="lg"
          height={50}
          borderColor="border"
          flexDirection="row"
          alignItems="center"
          borderWidth={1}
          onPress={onConnectAWalletPress}
        >
          {connectionWallets.map((wallet) => {
            return (
              <Box key={wallet.meta.name} mr="xxs">
                <ImageSvgUri
                  height={20}
                  width={20}
                  imageUrl={wallet.meta.iconURL}
                />
              </Box>
            );
          })}
          <Text variant="bodySmall">Connect a wallet</Text>
        </BaseButton>
      ) : null}
      {guestWallet ? (
        <BaseButton
          marginHorizontal="xl"
          mt="sm"
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
      ) : null}
    </Box>
  );
}
