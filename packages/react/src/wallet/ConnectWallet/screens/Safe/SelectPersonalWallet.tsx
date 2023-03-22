import styled from "@emotion/styled";
import { Img } from "../../../../components/Img";
import {
  BackButton,
  ModalTitle,
  HelperLink,
  ModalDescription,
} from "../../../../components/modalElements";
import { Spacer } from "../../../../components/Spacer";
import { iconSize, spacing, media } from "../../../../design-system";
import { WalletMeta } from "../../../types";
import { SafeWallet } from "../../../wallets";
import { WalletSelection } from "../../WalletSelector";
import { Steps } from "./Steps";

export const SelectpersonalWallet: React.FC<{
  onBack: () => void;
  walletsMeta: WalletMeta[];
}> = (props) => {
  // remove gnosis safe from the list of wallets
  const walletsMeta = props.walletsMeta.filter((w) => w.id !== "Safe");

  return (
    <>
      <BackButton onClick={props.onBack} />
      <IconContainer>
        <Img
          src={SafeWallet.meta.iconURL}
          width={iconSize.xl}
          height={iconSize.xl}
        />
      </IconContainer>
      <Spacer y="lg" />
      <ModalTitle>Connecting your Safe</ModalTitle>
      <Spacer y="md" />

      <Desc>
        Select and connect the wallet that{`'`}s attached to your Safe.
      </Desc>

      <Spacer y="lg" />
      <Steps step={1} />
      <Spacer y="lg" />

      <WalletSelection walletsMeta={walletsMeta} />

      <Spacer y="xl" />
      <HelperLink
        target="_blank"
        href="https://safe.global/"
        style={{
          textAlign: "center",
        }}
      >
        What is a Safe?
      </HelperLink>
    </>
  );
};

const IconContainer = styled.div`
  display: flex;
  margin-top: ${spacing.lg};
  ${media.mobile} {
    justify-content: center;
    margin-top: 0;
  }
`;

const Desc = styled(ModalDescription)`
  ${media.mobile} {
    padding: 0 ${spacing.lg};
  }
`;
