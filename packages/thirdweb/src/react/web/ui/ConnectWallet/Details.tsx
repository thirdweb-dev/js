import styled from "@emotion/styled";
import {
  ChevronRightIcon,
  ExitIcon,
  // EnterIcon,
  PaperPlaneIcon,
  PinBottomIcon,
  PlusIcon,
  TextAlignJustifyIcon,
} from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Chain } from "../../../../chains/types.js";
import { getContract } from "../../../../contract/contract.js";
import { isContractDeployed } from "../../../../utils/bytecode/is-contract-deployed.js";
import { getUserEmail } from "../../../../wallets/in-app/core/authentication/index.js";
import {
  useChainQuery,
  useChainsQuery,
} from "../../../core/hooks/others/useChainQuery.js";
import { useWalletBalance } from "../../../core/hooks/others/useWalletBalance.js";
import { useWalletConnectionCtx } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  // useConnect,
  useDisconnect,
} from "../../../core/hooks/wallets/wallet-hooks.js";
import { shortenString } from "../../../core/utils/addresses.js";
import { ChainIcon } from "../components/ChainIcon.js";
import { CopyIcon } from "../components/CopyIcon.js";
import { Modal } from "../components/Modal.js";
import { Skeleton } from "../components/Skeleton.js";
import { Spacer } from "../components/Spacer.js";
import { WalletImage } from "../components/WalletImage.js";
import { Container, Line } from "../components/basic.js";
import { Button, IconButton } from "../components/buttons.js";
import { Link, Text } from "../components/text.js";
import { useCustomTheme } from "../design-system/CustomThemeProvider.js";
import { fadeInAnimation } from "../design-system/animations.js";
import { StyledButton, StyledDiv } from "../design-system/elements.js";
import {
  type Theme,
  fontSize,
  iconSize,
  media,
  radius,
  spacing,
} from "../design-system/index.js";
import type {
  ConnectButton_detailsButtonOptions,
  ConnectButton_detailsModalOptions,
} from "./ConnectWalletProps.js";
import { NetworkSelectorContent } from "./NetworkSelector.js";
import { onModalUnmount } from "./constants.js";
import type { SupportedTokens } from "./defaultTokens.js";
import { FundsIcon } from "./icons/FundsIcon.js";
import { SwapScreen } from "./screens/Buy/SwapScreen.js";
import { swapTransactionsStore } from "./screens/Buy/swap/pendingSwapTx.js";
import { ReceiveFunds } from "./screens/ReceiveFunds.js";
import { SendFunds } from "./screens/SendFunds.js";
import { SwapTransactionsScreen } from "./screens/SwapTransactionsScreen.js";

const TW_CONNECTED_WALLET = "tw-connected-wallet";

const LocalhostChainId = 1337;

type WalletDetailsModalScreen =
  | "main"
  | "export"
  | "send"
  | "receive"
  | "buy"
  | "network-switcher"
  | "pending-tx";

/**
 * @internal
 */
export const ConnectedWalletDetails: React.FC<{
  onDisconnect: () => void;
  detailsButton?: ConnectButton_detailsButtonOptions;
  detailsModal?: ConnectButton_detailsModalOptions;
  theme: "light" | "dark" | Theme;
  supportedTokens: SupportedTokens;
  chains: Chain[];
}> = (props) => {
  const { connectLocale: locale, client } = useWalletConnectionCtx();
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  const walletChain = useActiveWalletChain();
  const chainQuery = useChainQuery(walletChain);
  const { disconnect } = useDisconnect();
  const swapTxs = useSyncExternalStore(
    swapTransactionsStore.subscribe,
    swapTransactionsStore.getValue,
  );
  const pendingSwapTxs = swapTxs.filter((tx) => tx.status === "PENDING");

  // prefetch chains metadata with low concurrency
  useChainsQuery(props.chains, 5);

  const tokenAddress =
    walletChain && props.detailsButton?.displayBalanceToken
      ? props.detailsButton.displayBalanceToken[Number(walletChain.id)]
      : undefined;

  const balanceQuery = useWalletBalance({
    chain: walletChain ? walletChain : undefined,
    tokenAddress,
    address: activeAccount?.address,
  });

  const [screen, setScreen] = useState<WalletDetailsModalScreen>("main");
  const [isOpen, setIsOpen] = useState(false);

  // const ensQuery = useENS();

  // const [overrideWalletIconUrl, setOverrideWalletIconUrl] = useState<
  //   string | undefined
  // >(undefined);

  // const personalAccount = (activeWallet as WalletWithPersonalAccount)
  //   ?.personalAccount;

  // const smartWallet = activeWallet
  //   ? personalAccountToSmartAccountMap.get(activeWallet.getAccount())
  //   : undefined;

  const disableSwitchChain = !activeWallet?.switchChain;

  // const isActuallyMetaMask =
  //   activeWallet && activeWallet instanceof MetaMaskWallet;

  // const shortAddress = "<address>";
  const shortAddress = activeAccount?.address
    ? shortenString(activeAccount.address, false)
    : "";

  const addressOrENS = shortAddress;

  useEffect(() => {
    if (!isOpen) {
      onModalUnmount(() => {
        setScreen("main");
      });
    }
  }, [isOpen]);

  // if (activeWallet && "isSmartWallet" in activeWallet) {
  //   avatarOrWalletIconUrl = smartWalletMetadata.iconUrl;
  // }

  const trigger = props.detailsButton?.render ? (
    <div>
      <props.detailsButton.render />
    </div>
  ) : (
    <WalletInfoButton
      type="button"
      className={`${TW_CONNECTED_WALLET} ${
        props.detailsButton?.className || ""
      }`}
      style={props.detailsButton?.style}
      data-test="connected-wallet-details"
    >
      {/* TODO: render a placeholder if we don't have an active wallet? */}
      {activeWallet?.id && (
        <WalletImage size={iconSize.lg} id={activeWallet.id} />
      )}

      <Container flex="column" gap="xxs">
        {/* Address */}

        {/* activeWallet?.id === "local" ? (
          <Text
            color="danger"
            size="xs"
            style={{
              minWidth: "70px",
            }}
          >
            {locale.guest}
          </Text>
        ) :  */}
        {addressOrENS ? (
          <Text
            size="sm"
            color="primaryText"
            weight={500}
            className={`${TW_CONNECTED_WALLET}__address`}
          >
            {addressOrENS}
          </Text>
        ) : (
          <Skeleton height={fontSize.sm} width="88px" />
        )}

        {/* Balance */}
        {balanceQuery.data ? (
          <Text
            className={`${TW_CONNECTED_WALLET}__balance`}
            size="xs"
            weight={500}
          >
            {Number(balanceQuery.data.displayValue).toFixed(3)}{" "}
            {balanceQuery.data.symbol}
          </Text>
        ) : (
          <Skeleton height={fontSize.xs} width="82px" />
        )}
      </Container>
    </WalletInfoButton>
  );

  const networkSwitcherButton = (
    <MenuButton
      type="button"
      disabled={disableSwitchChain}
      onClick={() => {
        setScreen("network-switcher");
      }}
      data-variant="primary"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        {chainQuery.data ? (
          <ChainIcon chain={chainQuery.data} size={iconSize.md} active />
        ) : (
          <Skeleton height={iconSize.md} width={iconSize.md} />
        )}
      </div>

      {chainQuery.isLoading ? (
        <Skeleton height={"16px"} width={"200px"} />
      ) : (
        <Text color="primaryText" multiline>
          {chainQuery.data?.name || `Unknown chain #${walletChain?.id}`}
        </Text>
      )}

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

  let content = (
    <div>
      <Spacer y="xl" />
      <Container px="lg" flex="column" center="x">
        {/* TODO: render a placeholder if we don't have an active wallet? */}
        {activeWallet?.id && (
          <WalletImage id={activeWallet.id} size={iconSize.xxl} />
        )}

        <Spacer y="md" />

        {/* Address */}
        <div
          style={{
            display: "flex",
            gap: spacing.xxs,
            alignItems: "center",
            transform: "translateX(10px)",
          }}
          data-test="connected-wallet-address"
          data-address={activeAccount?.address}
        >
          <Text color="primaryText" weight={500} size="md">
            {addressOrENS}
          </Text>
          <IconButton
            style={{
              padding: "3px",
            }}
            data-test="copy-address"
          >
            <CopyIcon
              text={activeAccount?.address || ""}
              tip={locale.copyAddress}
              side="top"
            />
          </IconButton>
        </div>

        <Spacer y="xxs" />

        {/* Balance */}
        <Text weight={500} size="sm">
          {balanceQuery.data ? (
            Number(balanceQuery.data.displayValue).toFixed(3)
          ) : (
            <Skeleton height="1em" width="100px" />
          )}{" "}
          {balanceQuery.data?.symbol}{" "}
        </Text>
      </Container>

      <Spacer y="lg" />

      <Container px="lg">
        <ConnectedToSmartWallet />
        <InAppWalletEmail />

        {/* Send, Receive, Swap */}
        <Container
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: spacing.xs,
          }}
        >
          <Button
            variant="outline"
            style={{
              fontSize: fontSize.sm,
              display: "flex",
              gap: spacing.xs,
              alignItems: "center",
              padding: spacing.sm,
            }}
            onClick={() => {
              setScreen("send");
            }}
          >
            <Container color="secondaryText" flex="row" center="both">
              <PaperPlaneIcon
                width={iconSize.sm}
                height={iconSize.sm}
                style={{
                  transform: "translateY(-10%) rotate(-45deg) ",
                }}
              />
            </Container>

            {locale.send}
          </Button>

          <Button
            variant="outline"
            style={{
              fontSize: fontSize.sm,
              display: "flex",
              gap: spacing.xs,
              alignItems: "center",
              padding: spacing.sm,
            }}
            onClick={() => {
              setScreen("receive");
            }}
          >
            <Container color="secondaryText" flex="row" center="both">
              <PinBottomIcon width={iconSize.sm} height={iconSize.sm} />{" "}
            </Container>
            {locale.receive}{" "}
          </Button>

          <Button
            variant="outline"
            style={{
              fontSize: fontSize.sm,
              display: "flex",
              gap: spacing.xs,
              alignItems: "center",
              padding: spacing.sm,
            }}
            onClick={() => {
              setScreen("buy");
            }}
          >
            <Container color="secondaryText" flex="row" center="both">
              <PlusIcon width={iconSize.sm} height={iconSize.sm} />
            </Container>
            {locale.buy}
          </Button>
        </Container>
      </Container>

      <Spacer y="md" />

      <Container px="md">
        {/* Network Switcher */}
        <Container
          flex="column"
          style={{
            gap: "1px",
          }}
        >
          {networkSwitcherButton}

          {/* Transactions */}
          <MenuButton
            onClick={() => {
              setScreen("pending-tx");
            }}
            style={{
              fontSize: fontSize.sm,
            }}
          >
            <TextAlignJustifyIcon width={iconSize.md} height={iconSize.md} />
            <Container flex="row" gap="xs" center="y">
              <Text color="primaryText">{locale.transactions}</Text>
              {pendingSwapTxs && pendingSwapTxs.length > 0 && (
                <BadgeCount>{pendingSwapTxs.length}</BadgeCount>
              )}
            </Container>
          </MenuButton>

          {/* Switch to Personal Wallet  */}
          {/* {personalWallet &&
            !props.detailsModal?.hideSwitchToPersonalWallet && (
              <AccountSwitcher
                wallet={personalWallet}
                name={locale.personalWallet}
              />
            )} */}

          {/* Switch to Smart Wallet */}
          {/* {smartWallet && (
            <AccountSwitcher name={locale.smartWallet} wallet={smartWallet} />
          )} */}

          {/* Request Testnet funds */}
          {(props.detailsModal?.showTestnetFaucet ?? false) &&
            ((chainQuery.data?.faucets && chainQuery.data.faucets.length > 0) ||
              chainQuery.data?.chainId === LocalhostChainId) && (
              <MenuLink
                href={
                  chainQuery.data?.faucets ? chainQuery.data.faucets[0] : "#"
                }
                target="_blank"
                as="a"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Container flex="row" center="both" color="secondaryText">
                  <FundsIcon size={iconSize.md} />
                </Container>
                {locale.requestTestnetFunds}
              </MenuLink>
            )}

          {/* Export  Wallet */}
          {/* {activeWallet?.id === "local" && (
            <div>
              <MenuButton
                onClick={() => {
                  setScreen("export");
                }}
                style={{
                  fontSize: fontSize.sm,
                }}
              >
                <PinBottomIcon width={iconSize.md} height={iconSize.md} />
                <Text color="primaryText">{locale.backupWallet}</Text>
              </MenuButton>
            </div>
          )} */}

          {props.detailsModal?.footer && (
            <props.detailsModal.footer close={() => setIsOpen(false)} />
          )}
        </Container>

        <Spacer y="md" />
      </Container>

      {props.detailsModal?.hideDisconnect !== true && (
        <Container>
          <Line />
          <Spacer y="sm" />
          <Container px="md">
            <MenuButton
              data-variant="danger"
              type="button"
              onClick={() => {
                if (activeWallet) {
                  disconnect(activeWallet);
                  props.onDisconnect();
                }
              }}
            >
              <ExitIcon width={iconSize.md} height={iconSize.md} />
              <Text color="primaryText">{locale.disconnectWallet}</Text>
            </MenuButton>
          </Container>
          <Spacer y="sm" />
        </Container>
      )}

      {/* {activeWallet?.id === "local" && (
        <>
          <Line />
          <Container py="md">
            <Text size="xs" center multiline color="danger" balance>
              {locale.guestWalletWarning}
            </Text>
          </Container>
        </>
      )} */}
    </div>
  );

  if (screen === "pending-tx") {
    content = (
      <SwapTransactionsScreen
        onBack={() => setScreen("main")}
        client={client}
      />
    );
  }

  if (screen === "network-switcher") {
    content = (
      <NetworkSelectorContent
        // add currently connected chain to the list of chains if it's not already in the list
        chains={
          walletChain &&
          props.chains.find((c) => c.id === walletChain.id) === undefined
            ? [walletChain, ...props.chains]
            : props.chains
        }
        closeModal={() => {
          setIsOpen(false);
        }}
        networkSelector={props.detailsModal?.networkSelector}
        onBack={() => {
          setScreen("main");
        }}
      />
    );
  }

  // export local wallet
  // else if (screen === "export") {
  //   content = (
  //     <ExportLocalWallet
  //       onExport={() => {
  //         setIsOpen(false);
  //       }}
  //       onBack={() => {
  //         setScreen("main");
  //       }}
  //     />
  //   );
  // }

  // send funds
  else if (screen === "send") {
    content = (
      <SendFunds
        supportedTokens={props.supportedTokens}
        onBack={() => {
          setScreen("main");
        }}
      />
    );
  }

  // receive funds
  else if (screen === "receive") {
    content = (
      <ReceiveFunds
        walletId={activeWallet?.id}
        onBack={() => {
          setScreen("main");
        }}
      />
    );
  }

  // swap tokens
  else if (screen === "buy") {
    content = (
      <SwapScreen
        client={client}
        onBack={() => setScreen("main")}
        supportedTokens={props.supportedTokens}
        onViewPendingTx={() => setScreen("pending-tx")}
      />
    );
  }

  return (
    <Modal size={"compact"} trigger={trigger} open={isOpen} setOpen={setIsOpen}>
      {content}
    </Modal>
  );
};

const WalletInfoButton = /* @__PURE__ */ StyledButton(() => {
  const theme = useCustomTheme();
  return {
    all: "unset",
    background: theme.colors.connectedButtonBg,
    border: `1px solid ${theme.colors.borderColor}`,
    padding: `${spacing.sm} ${spacing.sm}`,
    borderRadius: radius.lg,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    minWidth: "180px",
    gap: spacing.sm,
    boxSizing: "border-box",
    WebkitTapHighlightColor: "transparent",
    lineHeight: "normal",
    animation: `${fadeInAnimation} 300ms ease`,
    [media.mobile]: {
      gap: spacing.sm,
      padding: `${spacing.xs} ${spacing.sm}`,
      img: {
        width: `${iconSize.md}px`,
        height: `${iconSize.md}px`,
      },
    },
    "&:hover": {
      transition: "background 250ms ease",
      background: theme.colors.connectedButtonBgHover,
    },
  };
});

const MenuButton = /* @__PURE__ */ StyledButton(() => {
  const theme = useCustomTheme();
  return {
    all: "unset",
    padding: `${spacing.sm} ${spacing.sm}`,
    borderRadius: radius.md,
    backgroundColor: "transparent",
    // border: `1px solid ${theme.colors.borderColor}`,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    width: "100%",
    cursor: "pointer",
    fontSize: fontSize.md,
    fontWeight: 500,
    color: theme.colors.secondaryText,
    gap: spacing.sm,
    WebkitTapHighlightColor: "transparent",
    lineHeight: 1.3,
    transition: "background-color 200ms ease, transform 200ms ease",
    "&:hover": {
      backgroundColor: theme.colors.walletSelectorButtonHoverBg,
      transform: "scale(1.01)",
      svg: {
        color: theme.colors.accentText,
      },
    },
    "&[disabled]": {
      cursor: "not-allowed",
      svg: {
        display: "none",
      },
    },
    svg: {
      color: theme.colors.secondaryText,
      transition: "color 200ms ease",
    },
    "&[data-variant='danger']:hover svg": {
      color: `${theme.colors.danger}!important`,
    },
    "&[data-variant='primary']:hover svg": {
      color: `${theme.colors.primaryText}!important`,
    },
  };
});

const BadgeCount = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    background: theme.colors.primaryButtonBg,
    color: theme.colors.primaryButtonText,
    fontSize: fontSize.sm,
    fontWeight: 500,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "22px",
    minHeight: "22px",
  };
});

const MenuLink = /* @__PURE__ */ (() => MenuButton.withComponent("a"))();

const StyledChevronRightIcon = /* @__PURE__ */ styled(
  /* @__PURE__ */ ChevronRightIcon,
)(() => {
  const theme = useCustomTheme();
  return {
    color: theme.colors.secondaryText,
  };
});

// function AccountSwitcher(props: { wallet: Wallet; name: string }) {
//   const { connect } = useConnect();
//   const locale = useTWLocale().connectWallet;
//   const activeWallet = useActiveWallet();

//   return (
//     <MenuButton
//       type="button"
//       onClick={() => {
//         // remove the current active account as "connected"
//         if (activeWallet) {
//           connectionManager.removeConnectedWallet(activeWallet);
//         }
//         // set as connected and active
//         connect(props.wallet);
//       }}
//       style={{
//         fontSize: fontSize.sm,
//       }}
//     >
//       <EnterIcon width={iconSize.md} height={iconSize.md} />
//       <Text color="primaryText">
//         {locale.switchTo} {props.name}
//       </Text>
//     </MenuButton>
//   );
// }

const ActiveDot = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: theme.colors.success,
  };
});

function ConnectedToSmartWallet() {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const chain = useActiveWalletChain();
  const locale = useWalletConnectionCtx().connectLocale;
  const isSmartWallet = activeWallet?.id === "smart";
  const { client } = useWalletConnectionCtx();

  const [isSmartWalletDeployed, setIsSmartWalletDeployed] = useState(false);

  useEffect(() => {
    if (activeAccount && isSmartWallet && activeAccount.address && chain) {
      const contract = getContract({
        address: activeAccount.address,
        chain,
        client,
      });

      isContractDeployed(contract).then((isDeployed) => {
        setIsSmartWalletDeployed(isDeployed);
      });
    } else {
      setIsSmartWalletDeployed(false);
    }
  }, [activeAccount, chain, client, isSmartWallet]);

  const content = (
    <Container flex="row" gap="xxs" center="both">
      <ActiveDot />
      {locale.connectedToSmartWallet}
    </Container>
  );

  if (chain && activeAccount && isSmartWallet) {
    return (
      <>
        {isSmartWalletDeployed ? (
          <Link
            color="secondaryText"
            hoverColor="primaryText"
            href={`https://thirdweb.com/${chain.id}/${activeAccount.address}/account`}
            target="_blank"
            size="sm"
          >
            {content}
          </Link>
        ) : (
          <Text size="sm"> {content}</Text>
        )}

        <Spacer y="md" />
      </>
    );
  }

  return null;
}

function InAppWalletEmail() {
  const { client } = useWalletConnectionCtx();
  const emailQuery = useQuery({
    queryKey: ["in-app-wallet-user", client],
    queryFn: async () => {
      const data = await getUserEmail({
        client: client,
      });

      return data || null;
    },
  });

  if (emailQuery.data) {
    return (
      <Container
        flex="row"
        center="x"
        style={{
          paddingBottom: spacing.md,
        }}
      >
        <Text size="sm">{emailQuery.data}</Text>
      </Container>
    );
  }

  return null;
}
