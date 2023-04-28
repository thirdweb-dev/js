import { ModalFooter } from "../../base/modal/ModalFooter";
import { ModalHeaderTextClose } from "../../base/modal/ModalHeaderTextClose";
import { ChooseWalletContent } from "./ChooseWalletContent";
import {
  Wallet,
  useIsConnecting,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { ReactNode } from "react";
import { View } from "react-native";

export type ChooseWalletProps = {
  headerText?: ReactNode | string;
  subHeaderText?: ReactNode | string;
  onChooseWallet: (wallet: Wallet) => void;
  onJoinAsGuestPress?: () => void;
  onClose: () => void;
  wallets: Wallet[];
};

export function ChooseWallet({
  headerText = "Choose your Wallet",
  subHeaderText,
  wallets,
  onChooseWallet,
  onJoinAsGuestPress,
  onClose,
}: ChooseWalletProps) {
  const guestMode = useThirdwebWallet()?.guestMode;
  const isConnecting = useIsConnecting();

  return (
    <View>
      <ModalHeaderTextClose
        onClose={onClose}
        headerText={headerText}
        subHeaderText={subHeaderText}
      />
      <ChooseWalletContent wallets={wallets} onChooseWallet={onChooseWallet} />
      {guestMode ? (
        <ModalFooter
          footer={"Continue as Guest"}
          isLoading={isConnecting}
          onPress={onJoinAsGuestPress}
        />
      ) : null}
    </View>
  );
}
