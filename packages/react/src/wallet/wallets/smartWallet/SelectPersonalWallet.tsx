import { walletIds } from "@thirdweb-dev/wallets";
import { Img } from "../../../components/Img";
import { Spacer } from "../../../components/Spacer";
import {
  ScreenBottomContainer,
  Flex,
  ScreenContainer,
} from "../../../components/basic";
import { Button } from "../../../components/buttons";
import {
  BackButton,
  ModalTitle,
  ModalDescription,
  HelperLink,
} from "../../../components/modalElements";
import { iconSize } from "../../../design-system";
import { WalletSelection } from "../../ConnectWallet/WalletSelector";
import { SmartWalletConfig } from "./types";
import { WalletConfig } from "@thirdweb-dev/react-core";
import { useEffect, useRef } from "react";

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
    <>
      <ScreenContainer
        style={{
          paddingBottom: 0,
        }}
      >
        {props.renderBackButton && (
          <>
            <BackButton onClick={props.onBack} />
            <Spacer y="md" />
          </>
        )}
        <Img
          src={props.smartWallet.meta.iconURL}
          width={iconSize.xl}
          height={iconSize.xl}
        />
        <Spacer y="lg" />
        <ModalTitle>Link Personal Wallet</ModalTitle>
        <Spacer y="sm" />

        <ModalDescription>
          Select a personal wallet to access your account.{" "}
          <HelperLink
            md
            href="https://portal.thirdweb.com/glossary/smart-wallet"
            target="_blank"
            style={{
              display: "inline",
              whiteSpace: "nowrap",
            }}
          >
            {" "}
            Learn More{" "}
          </HelperLink>
        </ModalDescription>

        <Spacer y="lg" />

        <WalletSelection
          maxHeight="300px"
          walletConfigs={personalWallets}
          selectWallet={props.selectWallet}
        />
      </ScreenContainer>

      {guestWallet && (
        <>
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
        </>
      )}
    </>
  );
};
