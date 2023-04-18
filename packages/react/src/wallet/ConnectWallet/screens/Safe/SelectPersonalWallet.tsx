import { Img } from "../../../../components/Img";
import { Spacer } from "../../../../components/Spacer";
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
import { useSupportedWallet } from "../useSupportedWallet";
import { Wallet } from "@thirdweb-dev/react-core";

export const SelectpersonalWallet: React.FC<{
  onBack: () => void;
  walletsMeta: WalletMeta[];
}> = (props) => {
  const safeWalletObj = useSupportedWallet("Safe") as Wallet;
  // remove gnosis safe from the list of wallets
  const walletsMeta = props.walletsMeta.filter((w) => w.id !== "Safe");

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
      <HelperLink
        target="_blank"
        href="https://docs.safe.global/learn/what-is-a-smart-contract-account"
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
  margin-top: ${spacing.lg};
`;
