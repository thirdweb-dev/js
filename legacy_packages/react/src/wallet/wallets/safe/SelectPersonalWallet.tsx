import { walletIds } from "@thirdweb-dev/wallets";
import { Spacer } from "../../../components/Spacer";
// import { Steps } from "../../../components/Steps";
import {
  Container,
  Line,
  ModalHeader,
  ScreenBottomContainer,
} from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { WalletSelection } from "../../ConnectWallet/WalletSelector";
import { WalletConfig, useWalletContext } from "@thirdweb-dev/react-core";
import { SafeWalletConfig } from "./types";
import { useEffect, useRef } from "react";
import { Link, Text } from "../../../components/text";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export const SelectpersonalWallet: React.FC<{
  onBack: () => void;
  safeWallet: SafeWalletConfig;
  personalWallets: WalletConfig[];
  selectWallet: (wallet: WalletConfig) => void;
  renderBackButton?: boolean;
}> = (props) => {
  const twLocale = useTWLocale();
  const locale = twLocale.wallets.safeWallet;
  const guestWallet = props.personalWallets.find(
    (w) => w.id === walletIds.localWallet,
  );
  const personalWallets = props.personalWallets.filter(
    (w) => w.id !== walletIds.localWallet,
  );

  const { personalWalletConnection } = useWalletContext();

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
      <Line />
      <Spacer y="sm" />

      <Container px="lg">
        <Spacer y="md" />
        <Text size="lg" color="primaryText" weight={500}>
          {locale.connectWalletScreen.title}
        </Text>
        <Spacer y="sm" />
        <Text multiline>
          {locale.connectWalletScreen.subtitle}{" "}
          <Link
            inline
            target="_blank"
            href="https://docs.safe.global/getting-started/readme"
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {locale.connectWalletScreen.learnMoreLink}
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
          selectUIProps={{
            connect: personalWalletConnection.connectWallet,
            connectionStatus: personalWalletConnection.connectionStatus,
            createWalletInstance: personalWalletConnection.createWalletInstance,
            setConnectedWallet: personalWalletConnection.setConnectedWallet,
            setConnectionStatus: personalWalletConnection.setConnectionStatus,
            connectedWallet: personalWalletConnection.activeWallet,
            connectedWalletAddress: personalWalletConnection.address,
          }}
        />
      </Container>

      {guestWallet && (
        <ScreenBottomContainer>
          <Button
            variant="link"
            fullWidth
            onClick={() => {
              props.selectWallet(guestWallet);
            }}
            data-test="continue-as-guest-button"
          >
            {twLocale.connectWallet.continueAsGuest}
          </Button>
        </ScreenBottomContainer>
      )}
    </Container>
  );
};
