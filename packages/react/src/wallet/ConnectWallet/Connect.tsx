import { Modal } from "../../components/Modal";
import { Spinner } from "../../components/Spinner";
import { Button } from "../../components/buttons";
import { isMobile } from "../../evm/utils/isMobile";
import { useInstalledWallets } from "../hooks/useInstalledWallets";
import { WalletMeta } from "../types";
import { WalletSelector } from "./WalletSelector";
import { CoinbaseWalletSetup } from "./screens/Coinbase/CoinbaseConnecting";
import { CoinbaseGetStarted } from "./screens/Coinbase/CoinbaseGetStarted";
import { ScanCoinbase } from "./screens/Coinbase/CoinbaseScan";
import { ConnectToDeviceWallet } from "./screens/DeviceWallet/DeviceWalletSetup";
import { MetamaskConnecting } from "./screens/Metamask/MetamaskConnecting";
import { MetamaskGetStarted } from "./screens/Metamask/MetamaskGetStarted";
import { ScanMetamask } from "./screens/Metamask/MetamaskScan";
import {
  useConnect,
  useConnectionStatus,
  useWallets,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { SelectpersonalWallet } from "./screens/Safe/SelectPersonalWallet";
import { SafeForm } from "./screens/Safe/SafeForm";
import { GetStartedWithWallets } from "./screens/GetStartedWithWallets";

type Screen =
  | "deviceWallet/connect"
  | "metamask/connecting"
  | "walletList"
  | "coinbase/connecting"
  | "coinbase/scan"
  | "metamask/scan"
  | "metamask/get-started"
  | "coinbase/get-started"
  | "safe/select-wallet"
  | "safe/form"
  | "wallets/get-started";

export const ConnectWalletFlow: React.FC<{
  btnClass?: string;
  btnTitle?: string;
  isConnectingToSafe: boolean;
  setIsConnectingToSafe: (value: boolean) => void;
}> = (props) => {
  const connectionStatus = useConnectionStatus();
  const [showScreen, setShowScreen] = useState<Screen>("walletList");
  const btnTitle = props.btnTitle || "Connect Wallet";

  const connect = useConnect();
  const wallets = useWallets();
  const installedWallets = useInstalledWallets();
  const [open, setOpen] = useState(false);
  const [hideModal, setHideModal] = useState(false);

  const { setIsConnectingToSafe } = props;

  // when the dialog is closed, reset the showUI, and isConnectingToSafe
  useEffect(() => {
    if (!open) {
      setShowScreen("walletList");
      setIsConnectingToSafe(false);
    }
  }, [open, setIsConnectingToSafe]);

  const onConnect = () => {
    if (props.isConnectingToSafe) {
      setShowScreen("safe/form");
    } else {
      setOpen(false);
    }
  };

  const onConnectError = () => {
    if (props.isConnectingToSafe) {
      setShowScreen("safe/select-wallet");
    } else {
      setShowScreen("walletList");
    }
  };

  const walletsMeta: WalletMeta[] = wallets.map((wallet) => ({
    id: wallet.id,
    name: wallet.meta.name,
    iconURL: wallet.meta.iconURL,
    installed:
      wallet.id in installedWallets &&
      installedWallets[wallet.id as keyof typeof installedWallets],
    onClick: async () => {
      // Device Wallet
      if (wallet.id === "deviceWallet") {
        setShowScreen("deviceWallet/connect");
        // TODO handle onConnect, onConnectError on component
      }

      // Metamask
      else if (wallet.id === "metamask") {
        if (installedWallets.metamask) {
          try {
            setShowScreen("metamask/connecting");
            await connect(wallet, {});
            onConnect();
          } catch (e) {
            onConnectError();
          }
        }

        // if metamask is not injected
        else {
          // on mobile, open metamask app link
          if (isMobile()) {
            window.open(
              `https://metamask.app.link/dapp/${window.location.toString()}`,
            );
          } else {
            // on desktop, show the metamask scan qr code
            setShowScreen("metamask/scan");
          }
        }
      }

      // Coinbase Wallet
      else if (wallet.id === "coinbaseWallet") {
        if (installedWallets.coinbaseWallet) {
          try {
            setShowScreen("coinbase/connecting");
            await connect(wallet, {});
            onConnect();
          } catch (e) {
            onConnectError();
          }
        } else {
          setShowScreen("coinbase/scan");
        }
      }

      // Safe
      else if (wallet.id === "Safe") {
        props.setIsConnectingToSafe(true);
        setShowScreen("safe/select-wallet");
      }

      // others ( they handle their own connection flow)
      else {
        try {
          setHideModal(true);
          await connect(wallet, {});
          onConnect();
          setHideModal(false);
        } catch (e) {
          onConnectError();
          setHideModal(false);
          console.error(e);
        }
      }
    },
  }));

  const handleBack = () => {
    if (props.isConnectingToSafe) {
      setShowScreen("safe/select-wallet");
    } else {
      setShowScreen("walletList");
    }
  };

  const isLoading =
    connectionStatus === "connecting" || connectionStatus === "unknown";

  return (
    <Modal
      style={{
        maxWidth: "450px",
      }}
      open={hideModal ? false : open}
      setOpen={setOpen}
      trigger={
        <Button
          disabled={isLoading}
          className={props.btnClass}
          variant="inverted"
          type="button"
          style={{
            minWidth: "140px",
          }}
          aria-label={
            connectionStatus === "connecting" ? "Connecting" : btnTitle
          }
        >
          {isLoading ? <Spinner size="sm" color="inverted" /> : btnTitle}
        </Button>
      }
    >
      {showScreen === "walletList" && (
        <WalletSelector
          walletsMeta={walletsMeta}
          onGetStarted={() => {
            setShowScreen("wallets/get-started");
          }}
        />
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
        <ConnectToDeviceWallet onBack={handleBack} onConnected={onConnect} />
      )}

      {showScreen === "metamask/scan" && (
        <ScanMetamask
          onBack={handleBack}
          onConnected={onConnect}
          onGetStarted={() => {
            setShowScreen("metamask/get-started");
          }}
        />
      )}

      {showScreen === "coinbase/scan" && (
        <ScanCoinbase
          onBack={handleBack}
          onConnected={onConnect}
          onGetStarted={() => {
            setShowScreen("coinbase/get-started");
          }}
        />
      )}

      {showScreen === "coinbase/connecting" && (
        <CoinbaseWalletSetup onBack={handleBack} />
      )}

      {showScreen === "safe/select-wallet" && (
        <SelectpersonalWallet
          onBack={() => {
            props.setIsConnectingToSafe(false);
            setShowScreen("walletList");
          }}
          walletsMeta={walletsMeta}
        />
      )}

      {showScreen === "safe/form" && <SafeForm onBack={handleBack} />}

      {showScreen === "wallets/get-started" && (
        <GetStartedWithWallets onBack={handleBack} />
      )}
    </Modal>
  );
};
