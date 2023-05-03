import {
  LocalWallet,
  localWallet,
} from "../../../wallets/wallets/local-wallet";
import { ModalFooter } from "../../base/modal/ModalFooter";
import { ModalHeaderTextClose } from "../../base/modal/ModalHeaderTextClose";
import { ChooseWalletContent } from "./ChooseWalletContent";
import { Wallet } from "@thirdweb-dev/react-core";
import { ReactNode, useState } from "react";
import { View } from "react-native";

export type ChooseWalletProps = {
  headerText?: ReactNode | string;
  subHeaderText?: ReactNode | string;
  onChooseWallet: (wallet: Wallet) => void;
  onClose: () => void;
  wallets: Wallet[];
  excludeWalletIds?: string[];
  showGuestWalletAsButton?: boolean;
};

export function ChooseWallet({
  headerText = "Choose your Wallet",
  subHeaderText,
  wallets,
  onChooseWallet,
  onClose,
  excludeWalletIds = [],
  showGuestWalletAsButton = false,
}: ChooseWalletProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const guestWallet = wallets.find((w) => w.id === LocalWallet.id);

  const onContinueAsGuestPress = () => {
    setIsConnecting(true);
    onChooseWallet(localWallet());
  };

  return (
    <View>
      <ModalHeaderTextClose
        onClose={onClose}
        headerText={headerText}
        subHeaderText={subHeaderText}
      />
      <ChooseWalletContent
        wallets={wallets}
        excludeWalletIds={
          showGuestWalletAsButton
            ? excludeWalletIds
            : [...excludeWalletIds, LocalWallet.id]
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
    </View>
  );
}
