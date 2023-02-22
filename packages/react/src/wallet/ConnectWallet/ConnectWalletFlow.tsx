import { Modal } from "../../components/Modal";
import { Spacer } from "../../components/Spacer";
import { Button } from "../../components/buttons";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
  Theme,
} from "../../design-system";
import { useInstalledWallets } from "../hooks/useInstalledWallets";
import { CoinbaseWalletIcon } from "./icons/CoinbaseWalletIcon";
import { DeviceWalletIcon } from "./icons/DeviceWalletIcon";
import { MetamaskIcon } from "./icons/MetamaskIcon";
import { InstallCoinbaseWallet } from "./install-ui/InstallCoinbase";
import { CoinbaseWalletSetup } from "./setup-ui/CoinbaseWaletSetup";
import { ConnectToDeviceWallet } from "./setup-ui/DeviceWalletSetup";
import { MetamaskWalletSetup } from "./setup-ui/MetamaskWalletSetup";
import styled from "@emotion/styled";
import * as Dialog from "@radix-ui/react-dialog";
import {
  useConnect,
  useConnectingToWallet,
  useWallets,
} from "@thirdweb-dev/react-core";
import { SupportedWallet } from "@thirdweb-dev/react-core/src/core/types/wallet";
import { useEffect, useState } from "react";

const metamaskIcon = <MetamaskIcon width={iconSize.lg} height={iconSize.lg} />;
const deviceWalletIcon = (
  <DeviceWalletIcon width={iconSize.lg} height={iconSize.lg} />
);
const coinbaseWalletIcon = (
  <CoinbaseWalletIcon width={iconSize.lg} height={iconSize.lg} />
);

const walletIcons: Record<SupportedWallet["id"], JSX.Element> = {
  metamask: metamaskIcon,
  deviceWallet: deviceWalletIcon,
  coinbaseWallet: coinbaseWalletIcon,
};

const walletNames: Record<SupportedWallet["id"], string> = {
  metamask: "Metamask",
  deviceWallet: "Device Wallet",
  coinbaseWallet: "Coinbase Wallet",
};

export const ConnectWalletFlow = () => {
  const connectingToWallet = useConnectingToWallet();
  const [showUI, setShowUI] = useState<
    | "deviceWallet"
    | "metamask"
    | "walletList"
    | "coinbaseWallet"
    | "installCoinbaseWallet"
  >("walletList");
  const connect = useConnect();
  const wallets = useWallets();
  const installedWallets = useInstalledWallets();

  const [open, setOpen] = useState(false);

  // when the dialog is closed, reset the showUI state
  useEffect(() => {
    if (!open) {
      setShowUI("walletList");
    }
  }, [open]);

  // when wallet connection is complete or cancelled, show the network list
  useEffect(() => {
    if (!connectingToWallet) {
      setShowUI("walletList");
    }
  }, [connectingToWallet]);

  const walletsMeta = wallets.map((wallet) => ({
    id: wallet.id,
    name: walletNames[wallet.id],
    icon: walletIcons[wallet.id],
    onClick: () => {
      if (wallet.id === "deviceWallet") {
        setShowUI("deviceWallet");
      } else {
        if (wallet.id === "metamask" && !installedWallets.metamask) {
          // open metamask extension page in new tab
          // TEMPORARY
          window.open("https://metamask.io/download/", "_blank");
        } else if (
          wallet.id === "coinbaseWallet" &&
          !installedWallets.coinbaseWallet
        ) {
          setShowUI("installCoinbaseWallet");
        } else {
          connect(wallet, {});
          setShowUI(wallet.id);
        }
      }
    },
    installed: installedWallets[wallet.id],
  }));

  const handleBack = () => setShowUI("walletList");

  return (
    <Modal
      style={{
        maxWidth: "500px",
      }}
      open={open}
      setOpen={setOpen}
      trigger={
        <Button variant="inverted" type="button">
          Connect Wallet
        </Button>
      }
    >
      {showUI === "installCoinbaseWallet" && (
        <InstallCoinbaseWallet onBack={handleBack} />
      )}

      {showUI === "walletList" && (
        <>
          <DialogTitle>Connect your wallet</DialogTitle>

          <Spacer y="xl" />

          <WalletList>
            {walletsMeta.map((Wallet) => {
              return (
                <li key={Wallet.id}>
                  <WalletButton
                    type="button"
                    onClick={() => {
                      Wallet.onClick();
                    }}
                  >
                    {Wallet.icon}
                    <WalletName>{Wallet.name}</WalletName>
                    {Wallet.installed && (
                      <InstallBadge> Installed </InstallBadge>
                    )}
                  </WalletButton>
                </li>
              );
            })}
          </WalletList>
        </>
      )}

      {/* Show Connecting UI for various wallets */}
      {showUI === "metamask" && <MetamaskWalletSetup onBack={handleBack} />}

      {showUI === "deviceWallet" && (
        <ConnectToDeviceWallet onBack={handleBack} />
      )}

      {showUI === "coinbaseWallet" && (
        <CoinbaseWalletSetup onBack={handleBack} />
      )}
    </Modal>
  );
};

// styles

const InstallBadge = styled.span<{ theme?: Theme }>`
  padding: ${spacing.xxs} ${spacing.xs};
  font-size: ${fontSize.sm};
  background-color: ${(p) => p.theme.badge.secondary};
  border-radius: ${radius.lg};
  margin-left: auto;
`;

const WalletName = styled.span`
  font-size: ${fontSize.md};
  font-weight: 500;
`;

const DialogTitle = styled(Dialog.Title)<{ theme?: Theme }>`
  margin: 0;
  font-weight: 500;
  color: ${(p) => p.theme.text.neutral};
  font-size: ${fontSize.lg};
`;

const WalletList = styled.ul`
  all: unset;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const WalletButton = styled.button<{ theme?: Theme }>`
  all: unset;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${radius.sm};
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  color: ${(p) => p.theme.text.neutral};
  background: ${(p) => p.theme.bg.elevated};
  transition: 100ms ease;
  &:hover {
    background: ${(p) => p.theme.bg.highlighted};
  }
`;
