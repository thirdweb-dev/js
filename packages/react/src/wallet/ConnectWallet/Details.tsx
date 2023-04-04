import { ChainIcon } from "../../components/ChainIcon";
import { CopyIcon } from "../../components/CopyIcon";
import { Img } from "../../components/Img";
import { Modal } from "../../components/Modal";
import { Skeleton } from "../../components/Skeleton";
import { Spacer } from "../../components/Spacer";
import { ToolTip } from "../../components/Tooltip";
import { IconButton } from "../../components/buttons";
import {
  fontSize,
  iconSize,
  media,
  radius,
  spacing,
  Theme,
} from "../../design-system";
import { shortenString } from "../../evm/utils/addresses";
import { isMobile } from "../../evm/utils/isMobile";
import { NetworkSelector } from "./NetworkSelector";
import { ExitIcon } from "./icons/ExitIcon";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { defaultChains } from "@thirdweb-dev/chains";
import {
  useAddress,
  useBalance,
  useChainId,
  useDisconnect,
  useSupportedChains,
  useThirdwebWallet,
  useWallet,
} from "@thirdweb-dev/react-core";
import { useEffect, useMemo, useState } from "react";
import { fadeInAnimation } from "../../components/FadeIn";
import type { SafeWallet } from "@thirdweb-dev/wallets";
import { Flex } from "../../components/basic";
import { FundsIcon } from "./icons/FundsIcon";
import { utils } from "ethers";

export type DropDownPosition = {
  side: "top" | "bottom" | "left" | "right";
  align: "start" | "center" | "end";
};

export const ConnectedWalletDetails: React.FC<{
  dropdownPosition?: DropDownPosition;
  onDisconnect: () => void;
}> = (props) => {
  const disconnect = useDisconnect();
  const chains = useSupportedChains();
  const walletChainId = useChainId();
  const address = useAddress();
  const balanceQuery = useBalance();
  const activeWallet = useWallet();
  const walletContext = useThirdwebWallet();
  const [personalWalletBalance, setPersonalWalletBalance] = useState<
    string | undefined
  >(undefined);
  const [personalWalletAddress, setPersonalWalletAddress] = useState<
    string | undefined
  >(undefined);

  const chain = useMemo(() => {
    return chains.find((_chain) => _chain.chainId === walletChainId);
  }, [walletChainId, chains]);

  const unknownChain = useMemo(() => {
    if (!chain) {
      return defaultChains.find((c) => c.chainId === walletChainId);
    }
  }, [walletChainId, chain]);

  const activeWalletIconURL = activeWallet?.getMeta().iconURL || "";

  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const [open, setOpen] = useState(false);

  const personalWallet =
    activeWallet?.walletId === "Safe"
      ? (activeWallet as SafeWallet).getPersonalWallet()
      : undefined;

  // get personal wallet address and balance
  useEffect(() => {
    if (!personalWallet) {
      setPersonalWalletAddress(undefined);
      setPersonalWalletBalance(undefined);
      return;
    }
    personalWallet.getAddress().then((_address) => {
      setPersonalWalletAddress(_address);
    });

    personalWallet.getSigner().then((signer) => {
      signer.getBalance().then((balance) => {
        setPersonalWalletBalance(utils.formatEther(balance));
      });
    });
  }, [personalWallet]);

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
          <Skeleton height={fontSize.sm} width="82px" />
        )}
        <Spacer y="xs" />
        <WalletAddress>{shortenString(address || "")}</WalletAddress>
      </ColFlex>

      <Img width={iconSize.lg} height={iconSize.lg} src={activeWalletIconURL} />
    </WalletInfoButton>
  );

  const networkSwitcherButton = (
    <MenuButton
      id="current-network"
      type="button"
      disabled={activeWallet?.walletId === "Safe"}
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
      {chain?.name || unknownChain?.name || `Unknown chain #${walletChainId}`}
      <StyledChevronRightIcon
        width={iconSize.sm}
        height={iconSize.sm}
        style={{
          flexShrink: 0,
          marginLeft: "auto",
        }}
      />
    </MenuButton>
  );

  const switchToPersonalWallet = personalWallet && (
    <MenuButton
      type="button"
      onClick={() => {
        walletContext?.handleWalletConnect(personalWallet);
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Img
          src={personalWallet.getMeta().iconURL}
          width={iconSize.lg}
          height={iconSize.lg}
        />
      </div>

      <ColFlex>
        {personalWalletBalance ? (
          <WalletBalance>
            {String(personalWalletBalance).slice(0, 5)}{" "}
            {balanceQuery.data?.symbol}
          </WalletBalance>
        ) : (
          <Skeleton height={fontSize.sm} width="82px" />
        )}
        <Spacer y="xxs" />
        <WalletAddress>
          {shortenString(personalWalletAddress || "")}
        </WalletAddress>
      </ColFlex>

      <StyledChevronRightIcon
        width={iconSize.sm}
        height={iconSize.sm}
        style={{
          flexShrink: 0,
          marginLeft: "auto",
        }}
      />
    </MenuButton>
  );

  const content = (
    <div>
      {/* Balance and Account Address */}
      <Flex gap="md">
        <Img
          width={iconSize.xl}
          height={iconSize.xl}
          src={activeWalletIconURL}
          alt=""
        />

        <div
          style={{
            flexGrow: 1,
          }}
        >
          {/* row 1 */}
          <Flex gap="xs" alignItems="center">
            <div
              style={{
                display: "flex",
                gap: spacing.xs,
                alignItems: "center",
              }}
            >
              <AccountAddress> {shortenString(address || "")}</AccountAddress>
              <IconButton
                variant="secondary"
                style={{
                  padding: "3px",
                }}
              >
                <CopyIcon
                  text={address || ""}
                  tip="Copy Address"
                  side="bottom"
                />
              </IconButton>
            </div>

            <ToolTip
              tip="Disconnect Wallet"
              side="bottom"
              align={"end"}
              sideOffset={10}
            >
              <DisconnectIconButton
                type="button"
                variant="secondary"
                onClick={() => {
                  disconnect();
                  props.onDisconnect();
                }}
              >
                <ExitIcon size={iconSize.md} />
              </DisconnectIconButton>
            </ToolTip>
          </Flex>

          {/* row 2 */}
          <AccountBalance>
            {" "}
            {balanceQuery.data?.displayValue.slice(0, 5)}{" "}
            {balanceQuery.data?.symbol}{" "}
          </AccountBalance>
        </div>
      </Flex>

      <Spacer y="lg" />

      {/* Network Switcher */}
      <div>
        <DropdownLabel htmlFor="current-network">Current Network</DropdownLabel>
        <Spacer y="sm" />
        {networkSwitcherButton}
      </div>

      {/* Switch to Personal Wallet for Safe */}
      {personalWallet && (
        <div>
          <Spacer y="lg" />
          <DropdownLabel htmlFor="current-network">
            Personal Wallet
          </DropdownLabel>
          <Spacer y="sm" />
          <ToolTip tip="Switch To Personal Wallet">
            {switchToPersonalWallet}
          </ToolTip>
        </div>
      )}

      {/* Request Testnet funds */}
      {chain?.faucets && chain.faucets.length > 0 && (
        <div>
          <Spacer y="lg" />
          <MenuLink
            href={chain.faucets[0]}
            target="_blank"
            as="a"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontSize: fontSize.sm,
            }}
          >
            <SecondaryIconContainer>
              <FundsIcon size={iconSize.sm} />
            </SecondaryIconContainer>
            Request Testnet Funds
          </MenuLink>
        </div>
      )}
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

const dropdownContentFade = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const DropDownContent = styled(DropdownMenu.Content)<{ theme?: Theme }>`
  width: 360px;
  box-sizing: border-box;
  max-width: 100%;
  border-radius: ${radius.lg};
  padding: ${spacing.lg};
  animation: ${dropdownContentFade} 400ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
  border: 1px solid ${(props) => props.theme.border.base};
  background-color: ${(props) => props.theme.bg.base};
  z-index: 1000000;
  line-height: 1;
`;

const WalletInfoButton = styled.button<{ theme?: Theme }>`
  all: unset;
  background: ${(props) => props.theme.bg.base};
  border: 1px solid ${(props) => props.theme.border.base};
  padding: ${spacing.sm} ${spacing.sm};
  border-radius: ${radius.lg};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: ${spacing.md};
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  line-height: 1;
  animation: ${fadeInAnimation} 300ms ease;

  ${media.mobile} {
    gap: ${spacing.sm};
    padding: ${spacing.xs} ${spacing.sm};
    img {
      width: ${iconSize.md}px;
      height: ${iconSize.md}px;
    }
  }

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

const DropdownLabel = styled.label<{ theme?: Theme }>`
  font-size: ${fontSize.sm};
  color: ${(props) => props.theme.text.secondary};
  font-weight: 500;
`;

const MenuButton = styled.button<{ theme?: Theme }>`
  all: unset;
  padding: ${spacing.sm} ${spacing.sm};
  border-radius: ${radius.md};
  background-color: ${(props) => props.theme.bg.base};
  border: 1px solid ${(props) => props.theme.border.elevated};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  font-size: ${fontSize.md};
  font-weight: 500;
  color: ${(props) => props.theme.text.neutral} !important;
  gap: ${spacing.sm};
  -webkit-tap-highlight-color: transparent;
  line-height: 1.3;

  &:not([disabled]):hover {
    transition: box-shadow 250ms ease, border-color 250ms ease;
    border: 1px solid ${(props) => props.theme.link.primary};
    box-shadow: 0 0 0 1px ${(props) => props.theme.link.primary};
  }

  &[disabled] {
    cursor: not-allowed;
    svg {
      display: none;
    }
  }
`;

const MenuLink = MenuButton.withComponent("a");

export const DropdownMenuItem = styled(DropdownMenu.Item)<{ theme?: Theme }>`
  outline: none;
`;

export const StyledChevronRightIcon = styled(ChevronRightIcon)<{
  theme?: Theme;
}>`
  color: ${(props) => props.theme.text.secondary};
`;

const DisconnectIconButton = styled(IconButton)<{ theme?: Theme }>`
  margin-right: -${spacing.xxs};
  margin-left: auto;
  color: ${(props) => props.theme.icon.secondary};
  &:hover {
    color: ${(props) => props.theme.icon.danger};
    background: none;
  }
`;

const SecondaryIconContainer = styled.div<{ theme?: Theme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.icon.secondary};
`;
