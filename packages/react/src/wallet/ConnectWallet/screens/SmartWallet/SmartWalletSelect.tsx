import { Img } from "../../../../components/Img";
import { Spacer } from "../../../../components/Spacer";
import { Button } from "../../../../components/buttons";
import {
  BackButton,
  ModalTitle,
  ModalDescription,
} from "../../../../components/modalElements";
import { iconSize, spacing } from "../../../../design-system";
import { WalletMeta } from "../../../types";
import { WalletSelection } from "../../WalletSelector";
import styled from "@emotion/styled";
import { Wallet, useSupportedWallet } from "@thirdweb-dev/react-core";

export const SmartWalletSelect: React.FC<{
  onBack: () => void;
  guestMode?: boolean;
  walletsMeta: WalletMeta[];
}> = (props) => {
  const smartWalletObj = useSupportedWallet("SmartWallet") as Wallet;

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
          src={smartWalletObj.meta.iconURL}
          width={iconSize.xl}
          height={iconSize.xl}
        />
      </IconContainer>
      <Spacer y="lg" />
      <ModalTitle>Choose your wallet</ModalTitle>
      <Spacer y="sm" />

      <ModalDescription>
        Select a personal wallet to connect to smart wallet
      </ModalDescription>

      <Spacer y="lg" />

      <WalletSelection walletsMeta={walletsMeta} />

      <Spacer y="xl" />

      {showGuest && (
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
      )}
    </>
  );
};

const IconContainer = styled.div`
  margin-top: ${spacing.lg};
`;
