import { Overlay } from "../../components/Overlay";
import { Skeleton } from "../../components/Skeleton";
import { Spacer } from "../../components/Spacer";
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
import { NetworkSelector } from "./NetworkSelector";
import { CoinbaseWalletIcon } from "./setup-ui/shared/icons/CoinbaseWalletIcon";
import { DeviceWalletIcon } from "./setup-ui/shared/icons/DeviceWalletIcon";
import { ExitIcon } from "./setup-ui/shared/icons/ExitIcon";
import { MetamaskIcon } from "./setup-ui/shared/icons/MetamaskIcon";
// import "./styles.css";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { GearIcon } from "@radix-ui/react-icons";
import {
  SupportedWallet,
  useActiveChainId,
  useActiveWallet,
  useAddress,
  useBalance,
  useDisconnect,
  useSupportedChains,
  useSwitchChain,
} from "@thirdweb-dev/react-core";
import { useMemo, useState } from "react";

const defaultChainIcon =
  "https://gateway.ipfscdn.io/ipfs/QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png";

const walletIcons: Record<
  SupportedWallet["id"],
  React.FC<{ width: string; height: string }>
> = {
  metamask: MetamaskIcon,
  deviceWallet: DeviceWalletIcon,
  coinbaseWallet: CoinbaseWalletIcon,
  walletConnect: CoinbaseWalletIcon,
};

const ChainIcon: React.FC<{ src: string }> = (props) => {
  return (
    <img
      src={props.src}
      onError={(e) => {
        if (e.currentTarget.src === defaultChainIcon) {return;}
        e.currentTarget.src = defaultChainIcon;
      }}
      alt={`C`}
      width={iconSize.lg}
      height={iconSize.lg}
    />
  );
};

export const ConnectedWalletDetails = () => {
  const disconnect = useDisconnect();
  const chains = useSupportedChains();
  const switchChain = useSwitchChain();
  const activeChainId = useActiveChainId();
  const address = useAddress();
  const balanceQuery = useBalance();
  const activeWallet = useActiveWallet();

  const { chainIcon, chainName } = useMemo(() => {
    const chain = chains.find((chain) => chain.chainId === activeChainId);
    const url = chain?.icon?.url;

    return {
      chainIcon: url
        ? `https://gateway.ipfscdn.io/ipfs/${url.replace("ipfs://", "")}`
        : defaultChainIcon,
      chainName: chain?.name || "Unknown Chain",
    };
  }, [activeChainId, chains]);

  const WalletIcon = activeWallet
    ? walletIcons[activeWallet.walletId as SupportedWallet["id"]]
    : null;

  const [showNetworkSelector, setShowNetworkSelector] = useState(false);

  console.log({ showNetworkSelector });

  return (
    <>
      {showNetworkSelector && (
        <Dialog.Root>
          <Dialog.Trigger asChild></Dialog.Trigger>

          <Dialog.Overlay asChild>
            <Overlay />
          </Dialog.Overlay>

          <Dialog.Content>
            Hello and welcome
            <NetworkSelector />
          </Dialog.Content>
        </Dialog.Root>
      )}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <WalletInfo type="button">
            <ChainIcon src={chainIcon} />

            <ColFlex>
              {!balanceQuery.isLoading ? (
                <WalletBalance>
                  {balanceQuery.data?.displayValue.slice(0, 5)}{" "}
                  {balanceQuery.data?.symbol}
                </WalletBalance>
              ) : (
                <Skeleton height={fontSize.md} />
              )}
              <WalletAddress>{shortenString(address || "")}</WalletAddress>
            </ColFlex>

            {WalletIcon && (
              <WalletIcon width={iconSize.lg} height={iconSize.lg} />
            )}
          </WalletInfo>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenuContent side="bottom" align="end" sideOffset={10}>
            <DropdownMenuItem>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                {WalletIcon && (
                  <WalletIcon width={iconSize.xl} height={iconSize.xl} />
                )}

                <ColFlex>
                  <AccountAddress>
                    {" "}
                    {shortenString(address || "")}
                  </AccountAddress>
                  <AccountBalance>
                    {" "}
                    {balanceQuery.data?.displayValue.slice(0, 5)}{" "}
                    {balanceQuery.data?.symbol}{" "}
                  </AccountBalance>
                </ColFlex>

                <IconButton
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    disconnect();
                  }}
                  style={{
                    marginRight: `-${spacing.xxs}`,
                    marginLeft: "auto",
                    padding: spacing.xs,
                  }}
                >
                  <ExitIcon width={iconSize.md} height={iconSize.md} />
                </IconButton>
              </div>
            </DropdownMenuItem>

            <Spacer y="xl" />

            {/* Network Selector */}

            <DropdownMenuItem>
              <PrimaryLabel htmlFor="current-network">
                Current Network
              </PrimaryLabel>
              <Spacer y="sm" />
              <MenuButton
                id="current-network"
                type="button"
                onClick={() => {
                  setShowNetworkSelector(true);
                }}
              >
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <ActiveDot />
                  <ChainIcon src={chainIcon} />
                </div>
                {chainName}
                <StyledGearIcon
                  style={{
                    flexShrink: 0,
                    marginLeft: "auto",
                    width: "20px",
                    height: "20px",
                  }}
                />
              </MenuButton>
            </DropdownMenuItem>

            <Spacer y="xl" />

            <DropdownMenuItem>
              {chains.map((chain) => (
                <button
                  key={chain.chainId}
                  onClick={() => {
                    switchChain(chain.chainId);
                  }}
                >
                  {" "}
                  {chain.name}
                </button>
              ))}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
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

const DropdownMenuContent = styled(DropdownMenu.Content)<{ theme?: Theme }>`
  width: 360px;
  background-color: ${(props) => props.theme.bg.base};
  border-radius: ${radius.sm};
  padding: ${spacing.lg};
  box-shadow: ${shadow.lg};
  animation: ${slideUpAndFade} 400ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
  border: 1px solid ${(props) => props.theme.bg.highlighted};
`;

const WalletInfo = styled.button<{ theme?: Theme }>`
  all: unset;
  background: ${(props) => props.theme.bg.base};
  border: 1px solid ${(props) => props.theme.bg.highlighted};
  padding: ${spacing.xs} ${spacing.md};
  border-radius: ${radius.lg};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  box-shadow: ${shadow.md};
  min-width: 200px;
  box-sizing: border-box;

  &:hover {
    transition: background 150ms ease;
    background: ${(props) => props.theme.bg.elevated};
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
  gap: 4px;
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
  &:hover {
    transition: background 150ms ease;
    background: ${(props) => props.theme.bg.elevated};
    border-color: ${(props) => props.theme.text.secondary};

    svg {
      color: ${(props) => props.theme.text.neutral};
    }
  }
`;

export const DropdownMenuItem = styled(DropdownMenu.Item)<{ theme?: Theme }>`
  outline: none;
`;

export const StyledGearIcon = styled(GearIcon)<{ theme?: Theme }>`
  color: ${(props) => props.theme.text.secondary};
`;

const ActiveDot = styled.div<{ theme?: Theme }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: absolute;
  top: 60%;
  right: 2px;
  background-color: #00d395;
  box-shadow: 0 0 0 3px ${(props) => props.theme.bg.base};
`;
