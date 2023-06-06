import styled from "@emotion/styled";
import { walletIds } from "@thirdweb-dev/wallets";
import { Img } from "../../../components/Img";
import { Spacer } from "../../../components/Spacer";
import { Steps } from "../../../components/Steps";
import { Flex } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import {
  BackButton,
  ModalTitle,
  ModalDescription,
  HelperLink,
} from "../../../components/modalElements";
import { iconSize, spacing } from "../../../design-system";
import { WalletSelection } from "../../ConnectWallet/WalletSelector";
import { WalletConfig } from "@thirdweb-dev/react-core";
import { SafeWalletConfig } from "./types";

export const SelectpersonalWallet: React.FC<{
  onBack: () => void;
  safeWallet: SafeWalletConfig;
  personalWallets: WalletConfig[];
  selectWallet: (wallet: WalletConfig) => void;
  renderBackButton?: boolean;
}> = (props) => {
  const guestWallet = props.personalWallets.find(
    (w) => w.id === walletIds.localWallet,
  );
  const personalWallets = props.personalWallets.filter(
    (w) => w.id !== walletIds.localWallet,
  );

  return (
    <>
      {props.renderBackButton && <BackButton onClick={props.onBack} />}
      <IconContainer>
        <Img
          src={props.safeWallet.meta.iconURL}
          width={iconSize.xl}
          height={iconSize.xl}
        />
      </IconContainer>
      <Spacer y="lg" />
      <ModalTitle>Link Personal Wallet</ModalTitle>
      <Spacer y="sm" />

      <ModalDescription>
        Select a personal wallet to connect to your Safe
      </ModalDescription>

      <Spacer y="xl" />
      <Steps step={1} />
      <Spacer y="lg" />

      <WalletSelection
        walletConfigs={personalWallets}
        selectWallet={props.selectWallet}
      />

      <Spacer y="xl" />

      {guestWallet ? (
        <Flex justifyContent="center">
          <Button
            variant="link"
            onClick={() => {
              props.selectWallet(guestWallet);
            }}
          >
            Continue as guest
          </Button>
        </Flex>
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
