/* eslint-disable @next/next/no-img-element */
import { ChainIcon } from "../../components/ChainIcon";
import { CopyIcon } from "../../components/CopyIcon";
import { Modal } from "../../components/Modal";
import { Skeleton } from "../../components/Skeleton";
import { Spacer } from "../../components/Spacer";
import { ToolTip } from "../../components/Tooltip";
import { IconButton } from "../../components/buttons";
import {
  fontSize,
  iconSize,
  radius,
  shadow,
  spacing,
  Theme,
} from "../../design-system";
import { shortenString } from "../../evm/utils/addresses";
import { isMobile } from "../../evm/utils/isMobile";
import { useCanSwitchNetwork } from "../hooks/useCanSwitchNetwork";
import { DeviceWallet } from "../wallets";
import { NetworkSelector } from "./NetworkSelector";
import { CoinbaseWalletIcon } from "./icons/CoinbaseWalletIcon";
import { DeviceWalletIcon } from "./icons/DeviceWalletIcon";
import { ExitIcon } from "./icons/ExitIcon";
import { GenericWalletIcon } from "./icons/GenericWalletIcon";
import { MetamaskIcon } from "./icons/MetamaskIcon";
import { WalletConnectIcon } from "./icons/WalletConnectIcon";
import { IconFC } from "./icons/types";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { GearIcon } from "@radix-ui/react-icons";
import { defaultChains } from "@thirdweb-dev/chains";
import {
  SupportedWallet,
  useAddress,
  useBalance,
  useChainId,
  useDisconnect,
  useSupportedChains,
  useWallet,
} from "@thirdweb-dev/react-core";
import { useMemo, useState } from "react";

const walletIcons: Record<SupportedWallet["id"], IconFC> = {
  metamask: MetamaskIcon,
  deviceWallet: DeviceWalletIcon,
  coinbaseWallet: CoinbaseWalletIcon,
  walletConnect: WalletConnectIcon,
  walletConnectV1: WalletConnectIcon,
};

export type DropDownPosition = {
  side: "top" | "bottom" | "left" | "right";
  align: "start" | "center" | "end";
};

export const ConnectedWalletDetails: React.FC<{
  dropdownPosition?: DropDownPosition;
}> = (props) => {
  const disconnect = useDisconnect();
  const chains = useSupportedChains();
  const activeChainId = useChainId();
  const address = useAddress();
  const balanceQuery = useBalance();
  const activeWallet = useWallet();

  const chain = useMemo(() => {
    return chains.find((_chain) => _chain.chainId === activeChainId);
  }, [activeChainId, chains]);

  const unknownChain = useMemo(() => {
    if (!chain) {
      return defaultChains.find((c) => c.chainId === activeChainId);
    }
  }, [activeChainId, chain]);

  const WalletIcon = activeWallet
    ? walletIcons[activeWallet.walletId as SupportedWallet["id"]]
    : null;

  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const [open, setOpen] = useState(false);

  // can not switch network if
  // * no wallet is connected
  // * only one supported network and connected to that network
  // * wallet is walletConnectV1, walletConnectV2, or deviceWallet
  // * wallet is non-injected metamask
  const disableNetworkSwitching = !useCanSwitchNetwork();

  const handleDeviceWalletExport = async () => {
    const deviceWallet = activeWallet as InstanceType<typeof DeviceWallet>;
    const walletData = await deviceWallet.getWalletData();
    if (!walletData) {
      throw new Error("No wallet data found");
    }

    downloadAsFile(
      JSON.parse(walletData.encryptedData),
      "wallet.json",
      "application/json",
    );
  };

  const trigger = (
    <WalletInfoButton type="button">
      <ChainIcon chain={chain} size={iconSize.lg} />

      <ColFlex>
        {!balanceQuery.isLoading ? (
          <WalletBalance>
            {balanceQuery.data?.displayValue.slice(0, 5)}{" "}
            {balanceQuery.data?.symbol}
          </WalletBalance>
        ) : (
          <Skeleton height={fontSize.md} />
        )}
        <Spacer y="xxs" />
        <WalletAddress>{shortenString(address || "")}</WalletAddress>
      </ColFlex>

      {WalletIcon && <WalletIcon size={iconSize.lg} />}
    </WalletInfoButton>
  );

  const networkSwitcherButton = (
    <MenuButton
      id="current-network"
      type="button"
      disabled={disableNetworkSwitching}
      onClick={() => {
        setOpen(false);
        setShowNetworkSelector(true);
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <ChainIcon chain={chain || unknownChain} size={iconSize.lg} active />
      </div>
      {chain?.name || unknownChain?.name || "Unknown Chain"}
      <StyledGearIcon
        style={{
          flexShrink: 0,
          marginLeft: "auto",
          width: "20px",
          height: "20px",
        }}
      />
    </MenuButton>
  );

  const content = (
    <div>
      {/* Balance and Account Address */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: spacing.md,
        }}
      >
        {WalletIcon && <WalletIcon size={iconSize.xl} />}

        <ColFlex>
          <div
            style={{
              display: "flex",
              gap: spacing.xs,
            }}
          >
            <AccountAddress> {shortenString(address || "")}</AccountAddress>
            <IconButton variant="secondary">
              <CopyIcon text={address || ""} />
            </IconButton>
          </div>
          <AccountBalance>
            {" "}
            {balanceQuery.data?.displayValue.slice(0, 5)}{" "}
            {balanceQuery.data?.symbol}{" "}
          </AccountBalance>
        </ColFlex>

        <ToolTip tip="Disconnect Wallet">
          <DisconnectIconButton
            type="button"
            variant="secondary"
            onClick={() => {
              disconnect();
            }}
          >
            <ExitIcon size={iconSize.md} />
          </DisconnectIconButton>
        </ToolTip>
      </div>

      {activeWallet?.walletId === "deviceWallet" ? (
        <>
          <Spacer y="md" />

          <MenuButton
            onClick={handleDeviceWalletExport}
            style={{
              fontSize: fontSize.sm,
            }}
          >
            <GenericWalletIconContainer>
              <GenericWalletIcon size={iconSize.sm} />
            </GenericWalletIconContainer>
            Export Device Wallet{" "}
          </MenuButton>

          <Spacer y="xl" />
        </>
      ) : (
        <Spacer y="xl" />
      )}

      {/* Network Switcher */}
      <div>
        <PrimaryLabel htmlFor="current-network">Current Network</PrimaryLabel>
        <Spacer y="sm" />
        {!disableNetworkSwitching ? (
          networkSwitcherButton
        ) : (
          <ToolTip tip="Switch Network from Wallet App" sideOffset={10}>
            {networkSwitcherButton}
          </ToolTip>
        )}
      </div>

      <Spacer y="md" />
    </div>
  );

  return (
    <>
      {isMobile() ? (
        <Modal
          trigger={trigger}
          open={open}
          setOpen={setOpen}
          hideCloseIcon={true}
        >
          <div
            style={{
              minHeight: "200px",
            }}
          >
            {content}
          </div>
        </Modal>
      ) : (
        <DropdownMenu.Root open={open} onOpenChange={setOpen}>
          <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropDownContent
              asChild
              side={props.dropdownPosition?.side || "bottom"}
              align={props.dropdownPosition?.align || "end"}
              sideOffset={10}
            >
              {content}
            </DropDownContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}

      {showNetworkSelector && (
        <NetworkSelector
          open={showNetworkSelector}
          setOpen={setShowNetworkSelector}
        />
      )}
    </>
  );
};

const slideUpAndFade = keyframes`
    from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const DropDownContent = styled(DropdownMenu.Content)<{ theme?: Theme }>`
  width: 360px;
  max-width: 100%;
  border-radius: ${radius.lg};
  padding: ${spacing.lg};
  box-shadow: ${shadow.lg};
  animation: ${slideUpAndFade} 400ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
  border: 1px solid ${(props) => props.theme.bg.highlighted};
  background-color: ${(props) => props.theme.bg.base};
  z-index: 1000000;
`;

const WalletInfoButton = styled.button<{ theme?: Theme }>`
  all: unset;
  background: ${(props) => props.theme.bg.base};
  border: 1px solid ${(props) => props.theme.bg.highlighted};
  padding: ${spacing.xs} ${spacing.md};
  border-radius: ${radius.lg};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  box-shadow: ${shadow.sm};
  min-width: 200px;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  line-height: 1;

  &:hover {
    transition: background 250ms ease;
    background: ${(props) => props.theme.bg.baseHover};
    border-color: ${(props) => props.theme.bg.highlighted};
  }
`;

const WalletAddress = styled.span<{ theme?: Theme }>`
  color: ${(props) => props.theme.text.secondary};
  font-size: ${fontSize.xs};
  font-weight: 500;
`;

const ColFlex = styled.div<{ theme?: Theme }>`
  display: flex;
  flex-direction: column;
`;

const WalletBalance = styled.span<{ theme?: Theme }>`
  color: ${(props) => props.theme.text.neutral};
  font-size: ${fontSize.sm};
  font-weight: 500;
`;

const AccountAddress = styled.span<{ theme?: Theme }>`
  font-size: ${fontSize.md};
  color: ${(props) => props.theme.text.neutral};
  font-weight: 500;
`;

const AccountBalance = styled.span<{ theme?: Theme }>`
  font-size: ${fontSize.sm};
  color: ${(props) => props.theme.text.secondary};
  font-weight: 500;
`;

const PrimaryLabel = styled.label<{ theme?: Theme }>`
  font-size: ${fontSize.sm};
  color: ${(props) => props.theme.text.neutral};
  font-weight: 500;
`;

const MenuButton = styled.button<{ theme?: Theme }>`
  all: unset;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${radius.md};
  border: 1px solid ${(props) => props.theme.bg.highlighted};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  font-size: ${fontSize.md};
  font-weight: 500;
  color: ${(props) => props.theme.text.neutral};
  gap: ${spacing.sm};
  -webkit-tap-highlight-color: transparent;

  &:not([disabled]):hover {
    transition: background 150ms ease;
    background: ${(props) => props.theme.bg.baseHover};
  }

  &[disabled] {
    cursor: not-allowed;
    svg {
      display: none;
    }
  }
`;

export const DropdownMenuItem = styled(DropdownMenu.Item)<{ theme?: Theme }>`
  outline: none;
`;

export const StyledGearIcon = styled(GearIcon)<{ theme?: Theme }>`
  color: ${(props) => props.theme.text.secondary};
`;

const DisconnectIconButton = styled(IconButton)<{ theme?: Theme }>`
  margin-right: -${spacing.xxs};
  margin-left: auto;
  padding: ${spacing.xxs};
  color: ${(props) => props.theme.icon.danger};
  &:hover {
    color: ${(props) => props.theme.icon.danger};
    background: ${(props) => props.theme.bg.danger};
  }
`;

const GenericWalletIconContainer = styled.div<{ theme?: Theme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.icon.secondary};
`;

// utils

function downloadAsFile(data: any, fileName: string, fileType: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: fileType,
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = "none";
  a.click();
  URL.revokeObjectURL(a.href);
}
