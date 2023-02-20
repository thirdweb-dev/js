import { Overlay } from "../../components/Overlay";
import { Spacer } from "../../components/Spacer";
import { Button, IconButton } from "../../components/buttons";
import {
  fontSize,
  iconSize,
  media,
  radius,
  shadow,
  spacing,
  Theme,
} from "../../design-system";
import { scrollbar } from "../../design-system/styles";
import { ConnectToDeviceWallet } from "./setup-ui/DeviceWalletSetup";
import { MetamaskWalletSetup } from "./setup-ui/MetamaskWalletSetup";
import { DeviceWalletIcon } from "./setup-ui/shared/icons/DeviceWalletIcon";
import { MetamaskIcon } from "./setup-ui/shared/icons/MetamaskIcon";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useConnect, useConnectingToWallet } from "@thirdweb-dev/react-core";
import { MetaMask } from "@thirdweb-dev/wallets";
import { useEffect, useState } from "react";

const metamaskIcon = <MetamaskIcon width={iconSize.lg} height={iconSize.lg} />;
const deviceWalletIcon = (
  <DeviceWalletIcon width={iconSize.lg} height={iconSize.lg} />
);

export const ConnectWalletFlow = () => {
  const connectingToWallet = useConnectingToWallet();
  const [showUI, setShowUI] = useState<
    "deviceWallet" | "metamask" | "networkList"
  >("networkList");
  const connect = useConnect();

  const [open, setOpen] = useState(false);

  // when the dialog is closed, reset the showUI state
  useEffect(() => {
    if (!open) {
      setShowUI("networkList");
    }
  }, [open]);

  // when wallet connection is complete or cancelled, show the network list
  useEffect(() => {
    if (!connectingToWallet) {
      setShowUI("networkList");
    }
  }, [connectingToWallet]);

  const networksMeta = [
    {
      id: "metamask",
      name: "Metamask",
      icon: metamaskIcon,
      onClick: () => connect(MetaMask, {}),
    },
    {
      id: "deviceWallet",
      name: "Device Wallet",
      icon: deviceWalletIcon,
      onClick: () => {
        setShowUI("deviceWallet");
      },
    },
  ] as const;

  const handleBack = () => setShowUI("networkList");

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <Dialog.Trigger asChild>
        <Button variant="inverted" type="button">
          Connect Wallet
        </Button>
      </Dialog.Trigger>

      {/* Overlay */}
      <Dialog.Overlay asChild>
        <Overlay />
      </Dialog.Overlay>

      {/* Dialog */}
      <Dialog.Portal>
        <Dialog.Content asChild>
          <DialogContent>
            {showUI === "networkList" && (
              <>
                <Dialog.Title asChild>
                  <DialogTitle>Connect your wallet</DialogTitle>
                </Dialog.Title>

                <Spacer y="xl" />

                <NetworkList>
                  {networksMeta.map((network) => {
                    return (
                      <li key={network.id}>
                        <NetworkButton
                          type="button"
                          onClick={() => {
                            network.onClick();
                            setShowUI(network.id);
                          }}
                        >
                          {network.icon}
                          {network.name}
                        </NetworkButton>
                      </li>
                    );
                  })}
                </NetworkList>
              </>
            )}

            {/* Show Connecting UI for various wallets */}
            {showUI === "metamask" && (
              <MetamaskWalletSetup onBack={handleBack} />
            )}

            {showUI === "deviceWallet" && (
              <ConnectToDeviceWallet onBack={handleBack} />
            )}

            {/* Close Icon */}
            <CrossContainer>
              <Dialog.Close asChild>
                <IconButton
                  variant="secondary"
                  type="button"
                  aria-label="Close"
                >
                  <Cross2Icon
                    style={{
                      width: iconSize.md,
                      height: iconSize.md,
                      color: "inherit",
                    }}
                  />
                </IconButton>
              </Dialog.Close>
            </CrossContainer>
          </DialogContent>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const CrossContainer = styled.div`
  position: absolute;
  top: ${spacing.lg};
  right: ${spacing.lg};

  ${media.mobile} {
    right: ${spacing.md};
  }
`;

// styles

const contentShowAnimation = keyframes`
from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const DialogContent = styled.div<{ theme?: Theme }>`
  background-color: ${(p) => p.theme.bg.base};
  border-radius: ${radius.lg};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100vw - 40px);
  max-width: 450px;
  max-height: 85vh;
  overflow-y: auto;
  padding: ${spacing.lg};
  padding-bottom: ${spacing.xl};
  animation: ${contentShowAnimation} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: ${shadow.lg};

  &:focus {
    outline: none;
  }

  ${media.mobile} {
    padding: ${spacing.lg} ${spacing.md};
  }

  ${(p) =>
    scrollbar({
      track: "transparent",
      thumb: p.theme.bg.elevated,
      hover: p.theme.bg.highlighted,
    })}
`;

const DialogTitle = styled.h2<{ theme?: Theme }>`
  margin: 0;
  font-weight: 500;
  color: ${(p) => p.theme.text.neutral};
  font-size: ${fontSize.lg};
`;

const NetworkList = styled.ul`
  all: unset;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const NetworkButton = styled.button<{ theme?: Theme }>`
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
