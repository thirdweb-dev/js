import { walletIds } from "@thirdweb-dev/wallets";
import { Img } from "../../../components/Img";
import { Spacer } from "../../../components/Spacer";
// import { Steps } from "../../../components/Steps";
import { Flex } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import {
  BackButton,
  ModalTitle,
  ModalDescription,
  HelperLink,
} from "../../../components/modalElements";
import { iconSize } from "../../../design-system";
import { WalletSelection } from "../../ConnectWallet/WalletSelector";
import { WalletConfig } from "@thirdweb-dev/react-core";
import { SafeWalletConfig } from "./types";
import { useEffect, useRef } from "react";

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
      {props.renderBackButton && (
        <>
          <BackButton onClick={props.onBack} />
          <Spacer y="md" />
        </>
      )}
      <Img
        src={props.safeWallet.meta.iconURL}
        width={iconSize.xl}
        height={iconSize.xl}
      />
      <Spacer y="lg" />
      <ModalTitle>Link Personal Wallet</ModalTitle>
      <Spacer y="sm" />

      <ModalDescription>
        Select a personal wallet to connect to your Safe
      </ModalDescription>

      <Spacer y="xl" />
      {/* <Steps step={1} /> */}
      {/* <Spacer y="lg" /> */}

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
            data-test="continue-as-guest-button"
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
