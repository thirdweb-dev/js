import {
  ExitIcon,
  ChevronRightIcon,
  TextAlignJustifyIcon,
  EnterIcon,
  PaperPlaneIcon,
  PinBottomIcon,
} from "@radix-ui/react-icons";
import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChainId,
  useConnect,
  useDisconnect,
} from "../../providers/wallet-provider.js";
import { useTWLocale } from "../../providers/locale-provider.js";
import { Modal } from "../components/Modal.js";
import { Skeleton } from "../components/Skeleton.js";
import { Spacer } from "../components/Spacer.js";
import { Container, Line } from "../components/basic.js";
import { Button, IconButton } from "../components/buttons.js";
import { useCustomTheme } from "../design-system/CustomThemeProvider.js";
import { fadeInAnimation } from "../design-system/animations.js";
import { StyledButton, StyledDiv } from "../design-system/elements.js";
import {
  type Theme,
  iconSize,
  radius,
  fontSize,
  spacing,
  media,
} from "../design-system/index.js";
import { NetworkSelectorContent } from "./NetworkSelector.js";
import { onModalUnmount } from "./constants.js";
import type { SupportedTokens } from "./defaultTokens.js";
import { Link, Text } from "../components/text.js";
import { CopyIcon } from "../components/CopyIcon.js";
import { shortenString } from "../../utils/addresses.js";
import { Img } from "../components/Img.js";
import { useChainQuery } from "../../hooks/others/useChainQuery.js";
import { ChainIcon } from "../components/ChainIcon.js";
import { useWalletBalance } from "../../hooks/others/useWalletBalance.js";
import { FundsIcon } from "./icons/FundsIcon.js";
import type {
  ConnectWallet_DetailsButtonOptions,
  ConnectWallet_DetailsModalOptions,
} from "./ConnectWalletProps.js";
import {
  smartWalletMetadata,
  type Wallet,
  type WalletWithPersonalWallet,
  personalWalletToSmartAccountMap,
} from "../../../wallets/index.js";
import { connectionManager } from "../../connectionManager.js";
import { SendFunds } from "./screens/SendFunds.js";
import { ReceiveFunds } from "./screens/ReceiveFunds.js";

// TEMP
const LocalWalletId = "localWallet";

const TW_CONNECTED_WALLET = "tw-connected-wallet";

const LocalhostChainId = 1337;

type WalletDetailsModalScreen =
  | "main"
  | "export"
  | "send"
  | "receive"
  | "network-switcher";

/**
 * @internal
 */
export const ConnectedWalletDetails: React.FC<{
  onDisconnect: () => void;
  detailsButton?: ConnectWallet_DetailsButtonOptions;
  detailsModal?: ConnectWallet_DetailsModalOptions;
  theme: "light" | "dark" | Theme;
  supportedTokens: SupportedTokens;
  chains: bigint[];
}> = (props) => {
  const locale = useTWLocale().connectWallet;
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  const walletChainId = useActiveWalletChainId();
  const chainQuery = useChainQuery(walletChainId);
  const { disconnect } = useDisconnect();

  const tokenAddress =
    walletChainId && props.detailsButton?.displayBalanceToken
      ? props.detailsButton.displayBalanceToken[Number(walletChainId)]
      : undefined;

  const balanceQuery = useWalletBalance({
    chain: walletChainId,
    tokenAddress,
    account: activeAccount,
  });

  const [screen, setScreen] = useState<WalletDetailsModalScreen>("main");
  const [isOpen, setIsOpen] = useState(false);

  // const activeWalletConfig = undefined;
  // const activeWalletConfig = useWalletConfig();
  // const ensQuery = useENS();

  // const walletContext = useWalletContext();

  // const wrapperWallet = activeWallet
  //   ? walletContext.getWrapperWallet(activeWallet)
  //   : undefined;

  // const [overrideWalletIconUrl, setOverrideWalletIconUrl] = useState<
  //   string | undefined
  // >(undefined);

  // const sdk = useSDK();

  const personalWallet = (activeWallet as WalletWithPersonalWallet)
    ?.personalWallet;

  const smartWallet = activeWallet
    ? personalWalletToSmartAccountMap.get(activeWallet)
    : undefined;

  const disableSwitchChain = !activeWallet?.switchChain;

  // const disableSwitchChain = !!personalWallet;

  // const isActuallyMetaMask =
  //   activeWallet && activeWallet instanceof MetaMaskWallet;

  // const shortAddress = "<address>";
  const shortAddress = activeAccount?.address
    ? shortenString(activeAccount.address, false)
    : "";

  const addressOrENS = shortAddress;
  // const avatarUrl = undefined;
  // const addressOrENS = ensQuery.data?.ens || shortAddress;
  // const avatarUrl = ensQuery.data?.avatarUrl;

  // useEffect(() => {
  //   if (activeWallet) {
  //     if (activeWallet.walletId === walletIds.embeddedWallet) {
  //       (activeWallet as EmbeddedWallet)
  //         .getLastUsedAuthStrategy()
  //         .then((auth) => {
  //           if (auth === "apple") {
  //             setOverrideWalletIconUrl(appleIconUri);
  //           } else if (auth === "google") {
  //             setOverrideWalletIconUrl(googleIconUri);
  //           } else if (auth === "facebook") {
  //             setOverrideWalletIconUrl(facebookIconUri);
  //           } else {
  //             setOverrideWalletIconUrl(undefined);
  //           }
  //         });
  //     } else if (activeWallet.walletId === walletIds.smartWallet) {
  //       setOverrideWalletIconUrl(smartWalletIcon);
  //     } else {
  //       setOverrideWalletIconUrl(undefined);
  //     }
  //   } else {
  //     setOverrideWalletIconUrl(undefined);
  //   }
  // }, [activeWallet]);

  useEffect(() => {
    if (!isOpen) {
      onModalUnmount(() => {
        setScreen("main");
      });
    }
  }, [isOpen]);

  // const walletIconUrl =
  //   overrideWalletIconUrl || activeWalletConfig?.meta.iconURL || "";
  // const avatarOrWalletIconUrl = avatarUrl || walletIconUrl;
  let avatarOrWalletIconUrl = activeWallet?.metadata.iconUrl || "";

  if (activeWallet && "isSmartWallet" in activeWallet) {
    avatarOrWalletIconUrl = smartWalletMetadata.iconUrl;
  }

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
      <Img
        width={iconSize.lg}
        height={iconSize.lg}
        src={avatarOrWalletIconUrl}
        className={`${TW_CONNECTED_WALLET}__wallet-icon`}
        style={{
          borderRadius: radius.sm,
        }}
      />

      <Container flex="column" gap="xxs">
        {/* Address */}
        {activeWallet?.metadata.id === LocalWalletId ? (
          <Text
            color="danger"
            size="xs"
            style={{
              minWidth: "70px",
            }}
          >
            {locale.guest}
          </Text>
        ) : addressOrENS ? (
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
      <Text color="primaryText" multiline>
        {chainQuery.data?.name || `Unknown chain #${walletChainId}`}
      </Text>
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
        <Img
          width={iconSize.xxl}
          height={iconSize.xxl}
          src={avatarOrWalletIconUrl}
          alt=""
          style={{
            borderRadius: radius.sm,
          }}
        />

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
        {/* <EmbeddedWalletEmail /> */}

        {/* Send and Receive */}
        <Container
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: spacing.sm,
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
            <PaperPlaneIcon
              width={iconSize.sm}
              height={iconSize.sm}
              style={{
                transform: "translateY(-10%) rotate(-45deg) ",
              }}
            />
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
            <PinBottomIcon width={iconSize.sm} height={iconSize.sm} />{" "}
            {locale.receive}{" "}
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

          {/* Switch to Personal Wallet  */}
          {personalWallet &&
            !props.detailsModal?.hideSwitchToPersonalWallet && (
              <AccountSwitcher
                wallet={personalWallet}
                name={locale.personalWallet}
              />
            )}

          {/* Switch to Smart Wallet */}
          {smartWallet && (
            <AccountSwitcher name={locale.smartWallet} wallet={smartWallet} />
          )}

          {/* Switch Account for Metamask */}
          {/* {isActuallyMetaMask &&
            activeWalletConfig &&
            activeWalletConfig.isInstalled &&
            activeWalletConfig.isInstalled() &&
            !isMobile() && (
              <MenuButton
                type="button"
                onClick={() => {
                  (activeWallet as MetaMaskWallet).switchAccount();
                  setIsOpen(false);
                }}
              >
                <ShuffleIcon width={iconSize.md} height={iconSize.md} />
                <Text color="primaryText">{locale.switchAccount}</Text>
              </MenuButton>
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
                onClick={async () => {
                  // if (chain.chainId === LocalhostChainId) {
                  //   e.preventDefault();
                  //   setIsOpen(false);
                  //   await sdk?.wallet.requestFunds(10);
                  //   await balanceQuery.refetch();
                  // }
                }}
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

          {/* Explorer link */}
          {chainQuery.data?.explorers && chainQuery.data?.explorers[0]?.url && (
            <MenuLink
              href={
                chainQuery.data.explorers[0].url +
                "/address/" +
                activeAccount?.address
              }
              target="_blank"
              as="a"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Container flex="row" center="y" color="secondaryText">
                <TextAlignJustifyIcon
                  width={iconSize.md}
                  height={iconSize.md}
                />
              </Container>
              {locale.transactionHistory}
            </MenuLink>
          )}

          {/* Export  Wallet */}
          {/* {activeWallet?.walletId === walletIds.localWallet && (
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
      {/* {activeWallet?.walletId === walletIds.localWallet && (
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

  if (screen === "network-switcher") {
    content = (
      <NetworkSelectorContent
        chains={
          walletChainId
            ? [...new Set([walletChainId, ...props.chains])]
            : props.chains
        }
        open={true}
        theme={props.theme}
        {...props.detailsModal?.networkSelector}
        onClose={() => {
          setIsOpen(false);
        }}
        onBack={() => {
          setScreen("main");
        }}
      />
    );
  }
  // else if (screen === "export") {
  //   content = (
  //     <ExportLocalWallet
  //       modalSize="compact"
  //       localWalletConfig={activeWalletConfig as LocalWalletConfig}
  //       onExport={() => {
  //         setIsOpen(false);
  //       }}
  //       walletAddress={address}
  //       walletInstance={activeWallet}
  //       onBack={() => {
  //         setScreen("main");
  //       }}
  //     />
  //   );
  // }
  else if (screen === "send") {
    content = (
      <SendFunds
        supportedTokens={props.supportedTokens}
        onBack={() => {
          setScreen("main");
        }}
      />
    );
  } else if (screen === "receive") {
    content = (
      <ReceiveFunds
        iconUrl={avatarOrWalletIconUrl}
        onBack={() => {
          setScreen("main");
        }}
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
      color: theme.colors.danger + "!important",
    },
    "&[data-variant='primary']:hover svg": {
      color: theme.colors.primaryText + "!important",
    },
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

function AccountSwitcher(props: { wallet: Wallet; name: string }) {
  const { connect } = useConnect();
  const locale = useTWLocale().connectWallet;
  const activeWallet = useActiveWallet();

  return (
    <MenuButton
      type="button"
      onClick={() => {
        // remove the current active account as "connected"
        if (activeWallet) {
          connectionManager.removeConnectedWallet(activeWallet);
        }
        // set as connected and active
        connect(props.wallet);
      }}
      style={{
        fontSize: fontSize.sm,
      }}
    >
      <EnterIcon width={iconSize.md} height={iconSize.md} />
      <Text color="primaryText">
        {locale.switchTo} {props.name}
      </Text>
    </MenuButton>
  );
}

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
  const chainId = useActiveWalletChainId();
  const locale = useTWLocale().connectWallet;
  const isSmartWallet = activeWallet && "isSmartWallet" in activeWallet;

  const [isSmartWalletDeployed] = useState(false);

  // useEffect(() => {
  //   if (activeAccount && isSmartWallet) {
  //     (activeAccount.wallet as SmartWallet).isDeployed().then((isDeployed) => {
  //       setIsSmartWalletDeployed(isDeployed);
  //     });
  //   } else {
  //     setIsSmartWalletDeployed(false);
  //   }
  // }, [activeWallet]);

  const content = (
    <Container flex="row" gap="xxs" center="both">
      <ActiveDot />
      {locale.connectedToSmartWallet}
    </Container>
  );

  if (chainId && activeAccount && isSmartWallet) {
    return (
      <>
        {isSmartWalletDeployed ? (
          <Link
            color="secondaryText"
            hoverColor="primaryText"
            href={`https://thirdweb.com/${chainId}/${activeAccount.address}/account`}
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

// function EmbeddedWalletEmail() {
//   const emailQuery = useEmbeddedWalletUserEmail();

//   if (emailQuery.data) {
//     return (
//       <Container
//         flex="row"
//         center="x"
//         style={{
//           paddingBottom: spacing.md,
//         }}
//       >
//         <Text size="sm">{emailQuery.data}</Text>
//       </Container>
//     );
//   }

//   return undefined;
// }
