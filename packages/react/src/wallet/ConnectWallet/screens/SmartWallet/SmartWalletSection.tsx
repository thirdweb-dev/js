import { Img } from "../../../../components/Img";
import { Spacer } from "../../../../components/Spacer";
import {
  BackButton,
  ModalTitle,
  HelperLink,
  ModalDescription,
} from "../../../../components/modalElements";
import { iconSize } from "../../../../design-system";
import { WalletMeta } from "../../../types";
import { WalletSelection } from "../../WalletSelector";
import { Wallet, useSupportedWallet } from "@thirdweb-dev/react-core";
import { Steps } from "../Safe/Steps";

export const SmartWalletSelection: React.FC<{
  onBack: () => void;
  walletsMeta: WalletMeta[];
}> = (props) => {
  const walletObj = useSupportedWallet("SmartWallet") as Wallet;
  // remove gnosis safe from the list of wallets
  const walletsMeta = props.walletsMeta.filter(
    (w) => w.id !== "SmartWallet" && w.id !== "Safe",
  );

  return (
    <>
      <BackButton onClick={props.onBack} />
      <Spacer y="md" />
      <Img
        src={walletObj.meta.iconURL}
        width={iconSize.xl}
        height={iconSize.xl}
      />
      <Spacer y="lg" />
      <ModalTitle>Choose your wallet</ModalTitle>
      <Spacer y="sm" />

      <ModalDescription>
        Select a personal wallet to connect to smart wallet
      </ModalDescription>

      <Spacer y="xl" />
      <Steps step={1} />
      <Spacer y="lg" />

      <WalletSelection walletsMeta={walletsMeta} />

      <Spacer y="xl" />
      <HelperLink
        target="_blank"
        href="https://docs.safe.global/learn/what-is-a-smart-contract-account"
        style={{
          textAlign: "center",
        }}
      >
        What is a Smart Wallet?
      </HelperLink>
    </>
  );
};
