import { walletIds } from "@thirdweb-dev/wallets";
import { Spacer } from "../../../components/Spacer";
// import { Steps } from "../../../components/Steps";
import {
  ModalHeader,
  ScreenBottomContainer,
  ScreenContainer,
} from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { HelperLink } from "../../../components/modalElements";
import { fontSize } from "../../../design-system";
import { WalletSelection } from "../../ConnectWallet/WalletSelector";
import { WalletConfig } from "@thirdweb-dev/react-core";
import { SafeWalletConfig } from "./types";
import { useEffect, useRef } from "react";
import { SecondaryText } from "../../../components/text";

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
    <>
      <ScreenContainer
        style={{
          paddingBottom: 0,
          flex: 1,
        }}
      >
        <ModalHeader
          title={props.safeWallet.meta.name}
          onBack={props.renderBackButton ? props.onBack : undefined}
        />

        <Spacer y="lg" />

        <div
          style={{
            maxWidth: "290px",
          }}
        >
          <SecondaryText
            style={{
              lineHeight: 1.5,
            }}
          >
            Select a personal wallet to connect to your Safe.{" "}
          </SecondaryText>

          <HelperLink
            target="_blank"
            href="https://docs.safe.global/getting-started/readme"
            style={{
              fontSize: fontSize.md,
              display: "inline",
              lineHeight: 1.5,
            }}
          >
            Learn More
          </HelperLink>
        </div>

        <Spacer y="lg" />

        <WalletSelection
          maxHeight="300px"
          walletConfigs={personalWallets}
          selectWallet={props.selectWallet}
        />
      </ScreenContainer>

      {guestWallet && (
        <ScreenBottomContainer>
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
        </ScreenBottomContainer>
      )}
    </>
  );
};
