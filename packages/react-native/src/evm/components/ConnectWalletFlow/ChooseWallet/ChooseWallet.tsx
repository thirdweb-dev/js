import { ModalFooter } from "../../base/modal/ModalFooter";
import { ModalHeaderTextClose } from "../../base/modal/ModalHeaderTextClose";
import { ChooseWalletContent } from "./ChooseWalletContent";
import { ReactNode } from "react";
import { View } from "react-native";
import { SupportedWallet } from "@thirdweb-dev/react-core";

export type ChooseWalletProps = {
  headerText?: ReactNode | string;
  subHeaderText?: ReactNode | string;
  footer?: ReactNode;
  onChooseWallet: (wallet: SupportedWallet) => void;
  onClose: () => void;
  wallets: SupportedWallet[];
};

export function ChooseWallet({
  headerText = "Choose your Wallet",
  subHeaderText = "Select the wallet that you want to connect to Thirdweb",
  wallets,
  footer,
  onChooseWallet,
  onClose,
}: ChooseWalletProps) {
  return (
    <View>
      <ModalHeaderTextClose
        onClose={onClose}
        headerText={headerText}
        subHeaderText={subHeaderText}
      />
      <ChooseWalletContent wallets={wallets} onChooseWallet={onChooseWallet} />
      {footer ? footer : <ModalFooter footer={"Need help getting started?"} />}
    </View>
  );
}
