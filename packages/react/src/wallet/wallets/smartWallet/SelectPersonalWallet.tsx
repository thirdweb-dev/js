import { walletIds } from "@thirdweb-dev/wallets";
import { Spacer } from "../../../components/Spacer";
import {
  ScreenBottomContainer,
  Flex,
  ModalHeader,
  Container,
} from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { ModalDescription } from "../../../components/modalElements";
import { WalletSelection } from "../../ConnectWallet/WalletSelector";
import { SmartWalletConfig } from "./types";
import { WalletConfig } from "@thirdweb-dev/react-core";
import { useEffect, useRef } from "react";
import { Link, Text } from "../../../components/text";

export const SelectPersonalWallet: React.FC<{
  onBack: () => void;
  smartWallet: SmartWalletConfig;
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
    <Container fullHeight flex="column" animate="fadein" scrollY>
      <Container
        p="lg"
        style={{
          paddingBottom: 0,
        }}
      >
        <ModalHeader
          title={props.smartWallet.meta.name}
          onBack={props.renderBackButton ? props.onBack : undefined}
        />

        <Spacer y="lg" />
        <Spacer y="md" />

        <Text size="lg" weight={500} color="primaryText">
          Link personal wallet
        </Text>

        <Spacer y="sm" />

        <ModalDescription>
          Connect your personal wallet to access your account.{" "}
          <Link
            inline
            href="https://portal.thirdweb.com/glossary/smart-wallet"
            target="_blank"
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {" "}
            Learn More{" "}
          </Link>
        </ModalDescription>

        <Spacer y="lg" />
      </Container>

      <Container px="md" flex="column" expand scrollY>
        <WalletSelection
          maxHeight="300px"
          walletConfigs={personalWallets}
          selectWallet={props.selectWallet}
        />
      </Container>

      {guestWallet && (
        <ScreenBottomContainer>
          <Flex justifyContent="center">
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
          </Flex>
        </ScreenBottomContainer>
      )}
    </Container>
  );
};
