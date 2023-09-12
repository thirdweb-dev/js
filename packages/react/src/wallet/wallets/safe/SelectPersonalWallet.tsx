import { walletIds } from "@thirdweb-dev/wallets";
import { Spacer } from "../../../components/Spacer";
// import { Steps } from "../../../components/Steps";
import {
  Container,
  ModalHeader,
  ScreenBottomContainer,
} from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { WalletSelection } from "../../ConnectWallet/WalletSelector";
import { WalletConfig } from "@thirdweb-dev/react-core";
import { SafeWalletConfig } from "./types";
import { useEffect, useRef } from "react";
import { Link, Text } from "../../../components/text";

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

  // auto select guest wallet if no other wallets
  const { selectWallet } = props;
  const selected = useRef(false);
  useEffect(() => {
    if (selected.current) {
      return;
    }

    if (guestWallet && personalWallets.length === 0) {
      selected.current = true;
      selectWallet(guestWallet);
    }
  }, [guestWallet, personalWallets.length, selectWallet]);

  if (guestWallet && personalWallets.length === 0) {
    return <div style={{ height: "250px" }}></div>;
  }

  return (
    <Container flex="column" scrollY animate="fadein">
      {/* header */}

      <Container p="lg">
        <ModalHeader
          title={props.safeWallet.meta.name}
          onBack={props.renderBackButton ? props.onBack : undefined}
          imgSrc={props.safeWallet.meta.iconURL}
        />
      </Container>

      <Container px="lg">
        <Spacer y="md" />
        <Text size="lg" color="primaryText" weight={500}>
          Link personal wallet
        </Text>
        <Spacer y="sm" />
        <Text multiline>
          Connect your personal wallet to use Safe.{" "}
          <Link
            inline
            target="_blank"
            href="https://docs.safe.global/getting-started/readme"
            style={{
              whiteSpace: "nowrap",
            }}
          >
            Learn more
          </Link>{" "}
        </Text>
      </Container>

      <Spacer y="lg" />

      {/* list */}
      <Container expand px="md" scrollY>
        <WalletSelection
          maxHeight="300px"
          walletConfigs={personalWallets}
          selectWallet={props.selectWallet}
        />
      </Container>

      <ScreenBottomContainer>
        {guestWallet && (
          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              props.selectWallet(guestWallet);
            }}
            data-test="continue-as-guest-button"
          >
            Continue as guest
          </Button>
        )}
      </ScreenBottomContainer>
    </Container>
  );
};
