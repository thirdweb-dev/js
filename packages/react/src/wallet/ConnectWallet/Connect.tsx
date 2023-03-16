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

type Screen =
  | "deviceWallet/connect"
  | "metamask/connecting"
  | "walletList"
  | "coinbase/connecting"
  | "coinbase/scan"
  | "metamask/scan"
  | "metamask/get-started"
  | "coinbase/get-started";

export const ConnectWalletFlow: React.FC<{
  btnClass?: string;
  btnTitle?: string;
}> = (props) => {
  const connectionStatus = useConnectionStatus();
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

  const walletsMeta: WalletMeta[] = wallets.map((wallet) => ({
    id: wallet.id,
    name: wallet.meta.name,
    iconURL: wallet.meta.iconURL,
    installed: installedWallets[wallet.id],
    onClick: async () => {
      // Device Wallet
      if (wallet.id === "deviceWallet") {
        setShowScreen("deviceWallet/connect");
      }

      // Metamask
      else if (wallet.id === "metamask") {
        if (installedWallets.metamask) {
          try {
            setShowScreen("metamask/connecting");
            await connect(wallet, {});
          } catch (e) {
            setShowScreen("walletList");
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
          } catch (e) {
            setShowScreen("walletList");
            setOpen(false);
          }
        } else {
          setShowScreen("coinbase/scan");
        }
      }

      // Wallet Connect v1, and v2
      else {
        connect(wallet, {});
        setOpen(false);
      }
    },
  }));

  const handleBack = () => setShowScreen("walletList");

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
          aria-label={
            connectionStatus === "connecting" ? "Connecting" : btnTitle
          }
        >
          {connectionStatus === "connecting" ||
          connectionStatus === "unknown" ? (
            <Spinner size="sm" color="inverted" />
          ) : (
            btnTitle
          )}
        </Button>
      }
    >
      {showScreen === "walletList" && (
        <WalletSelector walletsMeta={walletsMeta} />
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
