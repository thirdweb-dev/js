import { ChainIcon } from "../../components/ChainIcon";
import { CopyIcon } from "../../components/CopyIcon";
import { Img } from "../../components/Img";
import { Modal } from "../../components/Modal";
import { Skeleton } from "../../components/Skeleton";
import { Spacer } from "../../components/Spacer";
import { Button, IconButton } from "../../components/buttons";
import {
  fontSize,
  iconSize,
  media,
  radius,
  spacing,
  Theme,
} from "../../design-system";
import { isMobile } from "../../evm/utils/isMobile";
import {
  NetworkSelectorContent,
  type NetworkSelectorProps,
} from "./NetworkSelector";
import styled from "@emotion/styled";
import {
  ChevronRightIcon,
  EnterIcon,
  PaperPlaneIcon,
  PinBottomIcon,
  ShuffleIcon,
  TextAlignLeftIcon,
  ExternalLinkIcon,
  ExitIcon,
} from "@radix-ui/react-icons";
import { Localhost } from "@thirdweb-dev/chains";
import {
  useChain,
  useAddress,
  useBalance,
  useChainId,
  useDisconnect,
  useSDK,
  useSupportedChains,
  useWallet,
  WalletInstance,
  useENS,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import {
  MetaMaskWallet,
  type SmartWallet,
  walletIds,
  type EmbeddedWallet,
} from "@thirdweb-dev/wallets";
import { Container, Line } from "../../components/basic";
import { FundsIcon } from "./icons/FundsIcon";
import { ExportLocalWallet } from "../wallets/localWallet/ExportLocalWallet";
import { useWalletContext } from "@thirdweb-dev/react-core";
import { useWalletConfig } from "@thirdweb-dev/react-core";
import type { LocalWalletConfig } from "../wallets/localWallet/types";
import { fadeInAnimation } from "../../design-system/animations";
import { Link, Text } from "../../components/text";
import { SendFunds } from "./SendFunds";
import { SupportedTokens } from "./defaultTokens";
import { ReceiveFunds } from "./ReceiveFunds";
import { smartWalletIcon } from "./icons/dataUris";
import { useTWLocale } from "../../evm/providers/locale-provider";
import { shortenString } from "@thirdweb-dev/react-core";
import { StyledButton, StyledDiv } from "../../design-system/elements";
import { useCustomTheme } from "../../design-system/CustomThemeProvider";
import {
  appleIconUri,
  facebookIconUri,
  googleIconUri,
} from "./icons/socialLogins";
import { useEmbeddedWalletUserEmail } from "../../evm/hooks/wallets/useEmbeddedWallet";
import { onModalUnmount } from "./constants";

type ConnectedWalletDetailsLink = {
  title: string;
  url: string;
};

export type ConnectedWalletDetailsLinks = ConnectedWalletDetailsLink[];

const TW_CONNECTED_WALLET = "tw-connected-wallet";

type WalletDetailsModalScreen =
  | "main"
  | "export"
  | "send"
  | "receive"
  | "network-switcher";

export const ConnectedWalletDetails: React.FC<{
  onDisconnect: () => void;
  style?: React.CSSProperties;
  networkSelector?: Omit<
    NetworkSelectorProps,
    "theme" | "onClose" | "chains" | "open"
  >;
  className?: string;
  detailsBtn?: () => JSX.Element;
  hideTestnetFaucet?: boolean;
  links?: ConnectedWalletDetailsLinks;
  theme: "light" | "dark" | Theme;
  supportedTokens: SupportedTokens;
  displayBalanceToken?: Record<number, string>;
  hideSwitchToPersonalWallet?: boolean;
  hideDisconnect?: boolean;
}> = (props) => {
  const locale = useTWLocale().connectWallet;
  const chain = useChain();
  const walletChainId = useChainId();

  const disconnect = useDisconnect();
  const chains = useSupportedChains();
  const address = useAddress();

  const token =
    walletChainId && props.displayBalanceToken
      ? props.displayBalanceToken[walletChainId]
      : undefined;

  const balanceQuery = useBalance(token);
  const activeWallet = useWallet();
  const activeWalletConfig = useWalletConfig();
  const ensQuery = useENS();

  const walletContext = useWalletContext();

  const wrapperWallet = activeWallet
    ? walletContext.getWrapperWallet(activeWallet)
    : undefined;

  const [overrideWalletIconUrl, setOverrideWalletIconUrl] = useState<
    string | undefined
  >(undefined);

  const [screen, setScreen] = useState<WalletDetailsModalScreen>("main");
  const [isOpen, setIsOpen] = useState(false);

  const sdk = useSDK();

  const personalWallet = activeWallet?.getPersonalWallet() as
    | WalletInstance
    | undefined;

  const personalWalletConfig =
    personalWallet && walletContext.getWalletConfig(personalWallet);
  const wrapperWalletConfig =
    wrapperWallet && walletContext.getWalletConfig(wrapperWallet);

  const disableSwitchChain = !!personalWallet;

  const isActuallyMetaMask =
    activeWallet && activeWallet instanceof MetaMaskWallet;

  const shortAddress = address ? shortenString(address, false) : "";

  const addressOrENS = ensQuery.data?.ens || shortAddress;
  const avatarUrl = ensQuery.data?.avatarUrl;

  useEffect(() => {
    if (activeWallet) {
      if (activeWallet.walletId === walletIds.embeddedWallet) {
        (activeWallet as EmbeddedWallet)
          .getLastUsedAuthStrategy()
          .then((auth) => {
            if (auth === "apple") {
              setOverrideWalletIconUrl(appleIconUri);
            } else if (auth === "google") {
              setOverrideWalletIconUrl(googleIconUri);
            } else if (auth === "facebook") {
              setOverrideWalletIconUrl(facebookIconUri);
            } else {
              setOverrideWalletIconUrl(undefined);
            }
          });
      } else if (activeWallet.walletId === walletIds.smartWallet) {
        setOverrideWalletIconUrl(smartWalletIcon);
      } else {
        setOverrideWalletIconUrl(undefined);
      }
    } else {
      setOverrideWalletIconUrl(undefined);
    }
  }, [activeWallet]);

  useEffect(() => {
    if (!isOpen) {
      onModalUnmount(() => {
        setScreen("main");
      });
    }
  }, [isOpen]);

  const walletIconUrl =
    overrideWalletIconUrl || activeWalletConfig?.meta.iconURL || "";
  const avatarOrWalletIconUrl = avatarUrl || walletIconUrl;

  const trigger = props.detailsBtn ? (
    <div>
      <props.detailsBtn />
    </div>
  ) : (
    <WalletInfoButton
      type="button"
      className={`${TW_CONNECTED_WALLET} ${props.className || ""}`}
      style={props.style}
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
        {activeWallet?.walletId === walletIds.localWallet ? (
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
        <ChainIcon chain={chain} size={iconSize.md} active />
      </div>
      <Text color="primaryText" multiline>
        {chain?.name || `Unknown chain #${walletChainId}`}
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

  // by default we hide faucet link
  const showFaucet =
    props.hideTestnetFaucet === undefined ? false : !props.hideTestnetFaucet;

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
          data-address={address}
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
              text={address || ""}
              tip={locale.copyAddress}
              side="top"
            />
          </IconButton>
        </div>

        <Spacer y="xxs" />

        {/* Balance */}
        <Text weight={500} size="sm">
          {" "}
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
        <EmbeddedWalletEmail />

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

      {props.links && props.links.length > 0 ? (
        <>
          <Spacer y="md" />
          <Container flex="column" gap="sm">
            {props.links.map((link) => {
              return (
                <MenuLink
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  as="a"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    fontSize: fontSize.sm,
                  }}
                >
                  <Container flex="row" center="both" color="secondaryText">
                    <ExternalLinkIcon
                      width={iconSize.sm}
                      height={iconSize.sm}
                    />
                  </Container>
                  {link.title}
                </MenuLink>
              );
            })}
          </Container>
        </>
      ) : null}

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

          {/* Switch to Personal Wallet for Safe */}
          {personalWallet &&
            personalWalletConfig &&
            !props.hideSwitchToPersonalWallet && (
              <WalletSwitcher
                wallet={personalWallet}
                name={locale.personalWallet}
              />
            )}

          {/* Switch to Wrapper Wallet */}
          {wrapperWalletConfig && wrapperWallet && (
            <WalletSwitcher
              name={
                wrapperWallet.walletId === walletIds.smartWallet
                  ? locale.smartWallet
                  : wrapperWalletConfig.meta.name
              }
              wallet={wrapperWallet}
            />
          )}

          {/* Switch Account for Metamask */}
          {isActuallyMetaMask &&
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
            )}

          {/* Request Testnet funds */}
          {showFaucet &&
            ((chain?.faucets && chain.faucets.length > 0) ||
              chain?.chainId === Localhost.chainId) && (
              <MenuLink
                href={chain?.faucets ? chain.faucets[0] : "#"}
                target="_blank"
                as="a"
                onClick={async (e) => {
                  if (chain.chainId === Localhost.chainId) {
                    e.preventDefault();
                    setIsOpen(false);
                    await sdk?.wallet.requestFunds(10);
                    await balanceQuery.refetch();
                  }
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
          {chain?.explorers && chain.explorers[0]?.url && (
            <MenuLink
              href={chain.explorers[0].url + "/address/" + address}
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
          {activeWallet?.walletId === walletIds.localWallet && (
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
          )}
        </Container>

        <Spacer y="md" />
      </Container>

      {props.hideDisconnect !== true && (
        <Container>
          <Line />
          <Spacer y="sm" />
          <Container px="md">
            <MenuButton
              data-variant="danger"
              type="button"
              onClick={() => {
                disconnect();
                props.onDisconnect();
              }}
            >
              <ExitIcon width={iconSize.md} height={iconSize.md} />
              <Text color="primaryText">{locale.disconnectWallet}</Text>
            </MenuButton>
          </Container>
          <Spacer y="sm" />
        </Container>
      )}

      {activeWallet?.walletId === walletIds.localWallet && (
        <>
          <Line />
          <Container py="md">
            <Text size="xs" center multiline color="danger" balance>
              {locale.guestWalletWarning}
            </Text>
          </Container>
        </>
      )}
    </div>
  );

  if (screen === "network-switcher") {
    content = (
      <NetworkSelectorContent
        open={true}
        theme={props.theme}
        chains={chains}
        {...props.networkSelector}
        onClose={() => {
          setIsOpen(false);
        }}
        onBack={() => {
          setScreen("main");
        }}
      />
    );
  } else if (screen === "export") {
    content = (
      <ExportLocalWallet
        modalSize="compact"
        localWalletConfig={activeWalletConfig as LocalWalletConfig}
        onExport={() => {
          setIsOpen(false);
        }}
        walletAddress={address}
        walletInstance={activeWallet}
        onBack={() => {
          setScreen("main");
        }}
      />
    );
  } else if (screen === "send") {
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
        iconUrl={walletIconUrl}
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

export const StyledChevronRightIcon = /* @__PURE__ */ styled(
  /* @__PURE__ */ ChevronRightIcon,
)(() => {
  const theme = useCustomTheme();
  return {
    color: theme.colors.secondaryText,
  };
});

function WalletSwitcher({
  wallet,
  name,
}: {
  wallet: WalletInstance;
  name: string;
}) {
  const walletContext = useWalletContext();
  const locale = useTWLocale().connectWallet;

  return (
    <MenuButton
      type="button"
      onClick={() => {
        walletContext.setConnectedWallet(wallet);
      }}
      style={{
        fontSize: fontSize.sm,
      }}
    >
      <EnterIcon width={iconSize.md} height={iconSize.md} />
      <Text color="primaryText">
        {locale.switchTo} {name}
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
  const activeWallet = useWallet();
  const chain = useChain();
  const address = useAddress();
  const locale = useTWLocale().connectWallet;

  const [isSmartWalletDeployed, setIsSmartWalletDeployed] = useState(false);

  useEffect(() => {
    if (activeWallet && activeWallet.walletId === walletIds.smartWallet) {
      const smartWallet = activeWallet as SmartWallet;
      smartWallet.isDeployed().then((isDeployed) => {
        setIsSmartWalletDeployed(isDeployed);
      });
    } else {
      setIsSmartWalletDeployed(false);
    }
  }, [activeWallet]);

  const content = (
    <Container flex="row" gap="xxs" center="both">
      <ActiveDot />
      {locale.connectedToSmartWallet}
    </Container>
  );

  if (chain && address && activeWallet?.walletId === walletIds.smartWallet) {
    return (
      <>
        {isSmartWalletDeployed ? (
          <Link
            color="secondaryText"
            hoverColor="primaryText"
            href={`https://thirdweb.com/${chain.slug}/${address}/account`}
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

function EmbeddedWalletEmail() {
  const emailQuery = useEmbeddedWalletUserEmail();

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

  return undefined;
}
