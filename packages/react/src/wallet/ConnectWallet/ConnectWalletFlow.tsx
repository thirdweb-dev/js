import { Modal } from "../../components/Modal";
import { Spacer } from "../../components/Spacer";
import { Spinner } from "../../components/Spinner";
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
import { WalletConnectIcon } from "./icons/WalletConnectIcon";
import { CoinbaseGetStarted } from "./setup-ui/CoinbaseGetStarted";
import { CoinbaseWalletSetup } from "./setup-ui/CoinbaseWaletSetup";
import { ConnectToDeviceWallet } from "./setup-ui/DeviceWalletSetup";
import { MetamaskConnecting } from "./setup-ui/MetamaskConnecting";
import { MetamaskGetStarted } from "./setup-ui/MetamaskGetStarted";
import { ScanCoinbase } from "./setup-ui/scanCoinbase";
import { ScanMetamask } from "./setup-ui/scanMetamask";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import * as Dialog from "@radix-ui/react-dialog";
import {
  useConnect,
  useConnectingToWallet,
  useWallets,
} from "@thirdweb-dev/react-core";
import { SupportedWallet } from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";

const walletConnectIcon = (
  <WalletConnectIcon width={iconSize.lg} height={iconSize.lg} />
);

const walletIcons: Record<SupportedWallet["id"], JSX.Element> = {
  metamask: <MetamaskIcon width={iconSize.lg} height={iconSize.lg} />,
  deviceWallet: <DeviceWalletIcon width={iconSize.lg} height={iconSize.lg} />,
  coinbaseWallet: (
    <CoinbaseWalletIcon width={iconSize.lg} height={iconSize.lg} />
  ),
  walletConnect: walletConnectIcon,
  walletConnectV1: walletConnectIcon,
};

type Screen =
  | "deviceWallet/connect"
  | "metamask/connecting"
  | "walletList"
  | "coinbase/connecting"
  | "coinbase/scan"
  | "metamask/scan"
  | "metamask/get-started"
  | "coinbase/get-started";

const walletNames: Record<SupportedWallet["id"], string> = {
  metamask: "Metamask",
  deviceWallet: "Device Wallet",
  coinbaseWallet: "Coinbase Wallet",
  walletConnect: "Wallet Connect V2",
  walletConnectV1: "Wallet Connect V1",
};

export const ConnectWalletFlow: React.FC<{
  btnClass?: string;
  btnTitle?: string;
}> = (props) => {
  const connectingToWallet = useConnectingToWallet();
  const [showScreen, setShowScreen] = useState<Screen>("walletList");
  const btnTitle = props.btnTitle || "Connect Wallet";

  const connect = useConnect();
  const wallets = useWallets();
  const installedWallets = useInstalledWallets();
  const [open, setOpen] = useState(false);

  // when the dialog is closed, reset the showUI state
  useEffect(() => {
    if (!open) {
      setShowScreen("walletList");
    }
  }, [open]);

  const walletsMeta = wallets.map((wallet) => ({
    id: wallet.id,
    name: walletNames[wallet.id],
    icon: walletIcons[wallet.id],
    installed: installedWallets[wallet.id],
    onClick: async () => {
      // Device Wallet
      if (wallet.id === "deviceWallet") {
        setShowScreen("deviceWallet/connect");
        return;
      }

      // Metamask
      if (wallet.id === "metamask") {
        if (installedWallets.metamask) {
          try {
            setShowScreen("metamask/connecting");
            await connect(wallet, {});
          } catch (e) {
            setShowScreen("walletList");
          }
        } else {
          setShowScreen("metamask/scan");
        }
        return;
      }

      // Coinbase Wallet
      if (wallet.id === "coinbaseWallet") {
        if (installedWallets.coinbaseWallet) {
          try {
            setShowScreen("coinbase/connecting");
            await connect(wallet, {});
          } catch (e) {
            setShowScreen("walletList");
            setOpen(false);
          }
        } else {
          setShowScreen("coinbase/scan");
        }
        return;
      }

      // Wallet Connect v1, and v2
      connect(wallet, {});
      setOpen(false);
    },
  }));

  const handleBack = () => setShowScreen("walletList");

  const theme = useTheme() as Theme;

  return (
    <Modal
      style={{
        maxWidth: "500px",
      }}
      open={open}
      setOpen={setOpen}
      trigger={
        <Button
          className={props.btnClass}
          variant="inverted"
          type="button"
          style={{
            minWidth: "140px",
          }}
          aria-label={connectingToWallet ? "Connecting" : btnTitle}
        >
          {connectingToWallet ? (
            <Spinner size="sm" color={theme.text.inverted} />
          ) : (
            btnTitle
          )}
        </Button>
      }
    >
      {showScreen === "walletList" && (
        <>
          <DialogTitle>Connect your wallet</DialogTitle>
          <Spacer y="xl" />
          <WalletListUl>
            {walletsMeta.map((WalletMeta) => {
              return (
                <li key={WalletMeta.id}>
                  <WalletButton
                    type="button"
                    onClick={() => {
                      WalletMeta.onClick();
                    }}
                  >
                    {WalletMeta.icon}
                    <WalletName>{WalletMeta.name}</WalletName>
                    {WalletMeta.installed && (
                      <InstallBadge> Installed </InstallBadge>
                    )}
                  </WalletButton>
                </li>
              );
            })}
          </WalletListUl>
        </>
      )}

      {showScreen === "metamask/get-started" && (
        <MetamaskGetStarted
          onBack={() => {
            setShowScreen("metamask/scan");
          }}
        />
      )}

      {showScreen === "coinbase/get-started" && (
        <CoinbaseGetStarted
          onBack={() => {
            setShowScreen("coinbase/scan");
          }}
        />
      )}

      {showScreen === "metamask/connecting" && (
        <MetamaskConnecting onBack={handleBack} />
      )}

      {showScreen === "deviceWallet/connect" && (
        <ConnectToDeviceWallet onBack={handleBack} />
      )}

      {showScreen === "metamask/scan" && (
        <ScanMetamask
          onBack={handleBack}
          onGetStarted={() => {
            setShowScreen("metamask/get-started");
          }}
        />
      )}

      {showScreen === "coinbase/scan" && (
        <ScanCoinbase
          onBack={handleBack}
          onGetStarted={() => {
            setShowScreen("coinbase/get-started");
          }}
        />
      )}

      {showScreen === "coinbase/connecting" && (
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

const WalletListUl = styled.ul`
  all: unset;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  box-sizing: border-box;
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
