import { walletIds } from "@thirdweb-dev/wallets";
import { Spacer } from "../../../components/Spacer";
import {
  ScreenBottomContainer,
  Flex,
  ScreenContainer,
  ModalHeader,
} from "../../../components/basic";
import { Button } from "../../../components/buttons";
import {
  ModalDescription,
  HelperLink,
} from "../../../components/modalElements";
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
        <ModalHeader
          title={props.smartWallet.meta.name}
          onBack={props.renderBackButton ? props.onBack : undefined}
        />

        <Spacer y="lg" />

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
