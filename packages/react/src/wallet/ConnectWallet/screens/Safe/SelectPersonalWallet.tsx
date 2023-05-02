import { Img } from "../../../../components/Img";
import { Spacer } from "../../../../components/Spacer";
import { Button } from "../../../../components/buttons";
import {
  BackButton,
  ModalTitle,
  HelperLink,
  ModalDescription,
} from "../../../../components/modalElements";
import { iconSize, spacing } from "../../../../design-system";
import { WalletMeta } from "../../../types";
import { WalletSelection } from "../../WalletSelector";
import { Steps } from "./Steps";
import styled from "@emotion/styled";
import { Wallet, useSupportedWallet } from "@thirdweb-dev/react-core";

export const SelectpersonalWallet: React.FC<{
  onBack: () => void;
  guestMode?: boolean;
  walletsMeta: WalletMeta[];
}> = (props) => {
  const safeWalletObj = useSupportedWallet("Safe") as Wallet;
  console.log("wallets meta", props.walletsMeta, props.guestMode);

  const walletsMeta = props.walletsMeta.filter(
    (w) => w.id !== "SmartWallet" && w.id !== "Safe" && w.id !== "localWallet",
  );

  const guestWallet = props.walletsMeta.find((w) => w.id === "localWallet");

  const showGuest = props.guestMode && guestWallet;

  return (
    <>
      <BackButton onClick={props.onBack} />
      <IconContainer>
        <Img
          src={safeWalletObj.meta.iconURL}
          width={iconSize.xl}
          height={iconSize.xl}
        />
      </IconContainer>
      <Spacer y="lg" />
      <ModalTitle>Choose your Wallet</ModalTitle>
      <Spacer y="sm" />

      <ModalDescription>
        Select a personal wallet to connect to your Safe
      </ModalDescription>

      <Spacer y="xl" />
      <Steps step={1} />
      <Spacer y="lg" />

      <WalletSelection walletsMeta={walletsMeta} />

      <Spacer y="xl" />

      {showGuest ? (
        <Button
          variant="link"
          onClick={guestWallet.onClick}
          style={{
            width: "100%",
            padding: 0,
          }}
        >
          Continue as guest
        </Button>
      ) : (
        <HelperLink
          target="_blank"
          href="https://docs.safe.global/learn/what-is-a-smart-contract-account"
          style={{
            textAlign: "center",
          }}
        >
          What is a Safe?
        </HelperLink>
      )}
    </>
  );
};

const IconContainer = styled.div`
  margin-top: ${spacing.lg};
`;
