import { walletIds } from "@thirdweb-dev/wallets";
import { ModalHeaderTextClose } from "../../base/modal/ModalHeaderTextClose";
import {
  WalletConfig,
  useAddress,
  useConnect,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { ReactNode, useCallback, useMemo, useState } from "react";
import Box from "../../base/Box";
import Text from "../../base/Text";
import ThirdwebLogo from "../../../assets/thirdweb-logo";
import { ChooseWalletContent } from "./ChooseWalletContent";
import { BaseButton, ImageSvgUri, WalletButton } from "../../base";
import { ActivityIndicator, Linking } from "react-native";
import { useTheme } from "@shopify/restyle";
import {
  useGlobalTheme,
  useLocale,
} from "../../../providers/ui-context-provider";

export type ChooseWalletProps = {
  headerText?: ReactNode | string;
  subHeaderText?: ReactNode | string;
  onChooseWallet: (wallet: WalletConfig<any>, data?: any) => void;
  onClose?: () => void;
  wallets: WalletConfig<any>[];
  excludeWalletIds?: string[];
  modalTitleIconUrl?: string;
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
};

export function ChooseWallet({
  headerText,
  subHeaderText,
  wallets,
  onChooseWallet,
  modalTitleIconUrl,
  onClose,
  termsOfServiceUrl,
  privacyPolicyUrl,
}: ChooseWalletProps) {
  const l = useLocale();
  const theme = useGlobalTheme();
  const themeLightDark = useTheme();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnectAWalletEnabled, setIsConnectAWalletEnabled] = useState(false);

  const guestWallet = wallets.find((w) => w.id === walletIds.localWallet);
  const emailWallet = wallets.find(
    (w) => w.id === walletIds.embeddedWallet && w.selectUI,
  );

  const walletsToDisplay = useMemo(() => {
    const filteredWallets = wallets.filter(
      (wallet) =>
        wallet.id !== walletIds.embeddedWallet &&
        wallet.id !== walletIds.localWallet,
    );

    const trueItems = filteredWallets.filter(
      (item) => item.recommended === true,
    );
    const falseItems = filteredWallets.filter(
      (item) => item.recommended !== true,
    );
    const sortedWallets = [...trueItems, ...falseItems];

    return sortedWallets;
  }, [wallets]);

  const showToSPrivacyPolicy = termsOfServiceUrl || privacyPolicyUrl;

  const onContinueAsGuestPress = () => {
    setIsConnecting(true);
    setTimeout(() => {
      if (guestWallet) {
        onChooseWallet(guestWallet);
      }
    }, 0);
  };

  const onConnectAWalletPress = () => {
    setIsConnectAWalletEnabled(true);
  };

  const onSingleWalletPress = () => {
    onChooseWallet(walletsToDisplay[0]);
  };

  const onBackPress = () => {
    setIsConnectAWalletEnabled(false);
  };

  const onGetStartedPress = () => {
    Linking.openURL("https://ethereum.org/en/wallets/find-wallet/");
  };

  const onToSPressed = () => {
    if (termsOfServiceUrl) {
      Linking.openURL(termsOfServiceUrl);
    }
  };

  const onPrivacyPolicyPress = () => {
    if (privacyPolicyUrl) {
      Linking.openURL(privacyPolicyUrl);
    }
  };

  const getHeaderText = useCallback(() => {
    if (typeof headerText === "string" && headerText.length === 0) {
      return null;
    }

    if (!headerText || typeof headerText === "string") {
      return (
        <Text variant="headerBold" ml="xxs" fontSize={20} lineHeight={24}>
          {headerText ? headerText : l.connect_wallet_details.connect}
        </Text>
      );
    }

    return headerText;
  }, [headerText, l.connect_wallet_details.connect]);

  const connect = useConnect();
  const address = useAddress();
  const {
    setConnectedWallet,
    setConnectionStatus,
    connectionStatus,
    createWalletInstance,
    activeWallet,
  } = useWalletContext();

  return (
    <Box flexDirection="column">
      <ModalHeaderTextClose
        paddingHorizontal="xl"
        onBackPress={isConnectAWalletEnabled ? onBackPress : undefined}
        onClose={onClose}
        headerText={
          <Box
            flexDirection="row"
            alignItems="center"
            alignContent="center"
            justifyContent="center"
          >
            {modalTitleIconUrl !== undefined ? (
              modalTitleIconUrl.length === 0 ? null : (
                <ImageSvgUri
                  width={26}
                  height={15}
                  imageUrl={modalTitleIconUrl}
                />
              )
            ) : (
              <ThirdwebLogo
                width={26}
                height={15}
                color={theme.colors.backgroundInverted}
              />
            )}
            {getHeaderText()}
          </Box>
        }
        subHeaderText={subHeaderText}
      />
      {!emailWallet || isConnectAWalletEnabled ? (
        <>
          <ChooseWalletContent
            wallets={walletsToDisplay}
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
            <Text variant="bodySmall">
              {l.connect_wallet_details.new_to_wallets}
            </Text>
            <BaseButton onPress={onGetStartedPress}>
              <Text variant="link">{l.connect_wallet_details.get_started}</Text>
            </BaseButton>
          </Box>
        </>
      ) : emailWallet.selectUI ? (
        <emailWallet.selectUI
          modalSize="compact"
          theme={themeLightDark}
          supportedWallets={wallets}
          onSelect={(data: any) => {
            onChooseWallet(emailWallet, data);
          }}
          walletConfig={emailWallet}
          connect={(options: any) => connect(emailWallet, options)}
          connectedWallet={activeWallet}
          connectedWalletAddress={address}
          connectionStatus={connectionStatus}
          createWalletInstance={() => createWalletInstance(emailWallet)}
          setConnectedWallet={setConnectedWallet}
          setConnectionStatus={setConnectionStatus}
        />
      ) : null}
      {emailWallet &&
      !isConnectAWalletEnabled &&
      (guestWallet || walletsToDisplay.length > 0) ? (
        <Box
          mt="md"
          marginHorizontal="xl"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <Box height={1} flex={1} backgroundColor="border" />
          <Text variant="subHeader" textAlign="center" marginHorizontal="xxs">
            {l.common.or}
          </Text>
          <Box height={1} flex={1} backgroundColor="border" />
        </Box>
      ) : null}
      {emailWallet &&
      !isConnectAWalletEnabled &&
      walletsToDisplay.length > 0 ? (
        walletsToDisplay.length === 1 ? (
          <WalletButton
            marginHorizontal="xl"
            paddingHorizontal="none"
            paddingVertical="none"
            mt="md"
            walletIconUrl={walletsToDisplay[0].meta.iconURL}
            name={walletsToDisplay[0].meta.name}
            onPress={onSingleWalletPress}
          />
        ) : (
          <BaseButton
            marginHorizontal="xl"
            justifyContent="center"
            borderRadius="lg"
            mt="md"
            paddingVertical="md"
            borderColor="border"
            flexDirection="row"
            alignItems="center"
            borderWidth={1}
            onPress={onConnectAWalletPress}
          >
            {walletsToDisplay.map((wallet, index) => {
              if (index > 1) {
                return null;
              }
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
            <Text variant="bodySmallBold">
              {l.connect_wallet_details.connect_a_wallet}
            </Text>
          </BaseButton>
        )
      ) : null}
      {guestWallet ? (
        <BaseButton
          marginHorizontal="xl"
          mt="sm"
          paddingVertical="md"
          justifyContent="center"
          borderRadius="lg"
          borderColor="border"
          borderWidth={1}
          onPress={onContinueAsGuestPress}
        >
          {isConnecting ? (
            <ActivityIndicator
              size={"small"}
              color={theme.colors.textPrimary}
            />
          ) : (
            <Text variant="bodySmallBold">
              {l.connect_wallet_details.continue_as_guest}
            </Text>
          )}
        </BaseButton>
      ) : null}
      {showToSPrivacyPolicy ? (
        <Box
          mt="sm"
          marginHorizontal={!isConnectAWalletEnabled ? "xl" : "none"}
          alignItems="center"
        >
          <Text variant="bodySmallSecondary" fontSize={10} lineHeight={14}>
            {l.connect_wallet_details.by_connecting_you_agree}
          </Text>
          <Box flexDirection="row" alignItems="center" justifyContent="center">
            {termsOfServiceUrl ? (
              <BaseButton
                onPress={onToSPressed}
                flexDirection="row"
                padding="none"
              >
                <Text
                  variant="link"
                  fontSize={10}
                  padding="none"
                  lineHeight={14}
                >
                  {l.connect_wallet_details.tos}
                </Text>
              </BaseButton>
            ) : null}
            {termsOfServiceUrl && privacyPolicyUrl ? (
              <Text
                variant="bodySmallSecondary"
                fontSize={10}
                padding="none"
                lineHeight={14}
              >
                {" & "}
              </Text>
            ) : null}
            {privacyPolicyUrl ? (
              <BaseButton
                onPress={onPrivacyPolicyPress}
                flexDirection="row"
                padding="none"
              >
                <Text
                  variant="link"
                  fontSize={10}
                  padding="none"
                  lineHeight={14}
                >
                  {l.connect_wallet_details.privacy_policy}
                </Text>
              </BaseButton>
            ) : null}
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}
