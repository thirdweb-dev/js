import { walletIds } from "@thirdweb-dev/wallets";
import { localWallet } from "../../../wallets/wallets/local-wallet";
import { ModalFooter } from "../../base/modal/ModalFooter";
import { ModalHeaderTextClose } from "../../base/modal/ModalHeaderTextClose";
import { ChooseWalletContent } from "./ChooseWalletContent";
import { WalletConfig } from "@thirdweb-dev/react-core";
import { ReactNode, useState } from "react";
import Box from "../../base/Box";
import Text from "../../base/Text";
import ThirdwebLogo from "../../../assets/thirdweb-logo";
import { useAppTheme } from "../../../styles/hooks";

export type ChooseWalletProps = {
  headerText?: ReactNode | string;
  subHeaderText?: ReactNode | string;
  onChooseWallet: (wallet: WalletConfig<any>, data?: any) => void;
  onClose: () => void;
  wallets: WalletConfig<any>[];
  excludeWalletIds?: string[];
  showGuestWalletAsButton?: boolean;
};

export function ChooseWallet({
  headerText,
  subHeaderText,
  wallets,
  onChooseWallet,
  onClose,
  excludeWalletIds = [],
  showGuestWalletAsButton = false,
}: ChooseWalletProps) {
  const theme = useAppTheme();
  const [isConnecting, setIsConnecting] = useState(false);

  const guestWallet = wallets.find((w) => w.id === walletIds.localWallet);

  const onContinueAsGuestPress = () => {
    setIsConnecting(true);
    onChooseWallet(localWallet());
  };

  return (
    <Box>
      <ModalHeaderTextClose
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
      <ChooseWalletContent
        wallets={wallets}
        excludeWalletIds={
          showGuestWalletAsButton
            ? excludeWalletIds
            : [...excludeWalletIds, walletIds.localWallet]
        }
        onChooseWallet={onChooseWallet}
      />
      {guestWallet && !showGuestWalletAsButton ? (
        <ModalFooter
          footer={"Continue as Guest"}
          isLoading={isConnecting}
          onPress={onContinueAsGuestPress}
        />
      ) : null}
    </Box>
  );
}
