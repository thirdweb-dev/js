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
import { ConfiguredWallet } from "@thirdweb-dev/react-core";
import { useConfiguredWallet } from "../../hooks/useConfiguredWallet";
import { SafeConfiguredWallet } from "./types";

export const SelectpersonalWallet: React.FC<{
  onBack: () => void;
  safeWallet: SafeConfiguredWallet;
  personalWallets: ConfiguredWallet[];
  selectWallet: (wallet: ConfiguredWallet) => void;
}> = (props) => {
  const guestWallet = useConfiguredWallet("localWallet", false);
  const personalWallets = props.personalWallets.filter(
    (w) => w.id !== walletIds.localWallet,
  );

  return (
    <>
      <BackButton onClick={props.onBack} />
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
        configuredWallets={personalWallets}
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
