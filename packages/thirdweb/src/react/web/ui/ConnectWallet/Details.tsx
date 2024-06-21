"use client";
import styled from "@emotion/styled";
import {
  ChevronRightIcon,
  ExitIcon,
  PaperPlaneIcon,
  PinBottomIcon,
  PlusIcon,
  TextAlignJustifyIcon,
} from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getContract } from "../../../../contract/contract.js";
import { resolveAvatar } from "../../../../extensions/ens/resolve-avatar.js";
import { resolveName } from "../../../../extensions/ens/resolve-name.js";
import { isContractDeployed } from "../../../../utils/bytecode/is-contract-deployed.js";
import type { Account, Wallet } from "../../../../wallets/interfaces/wallet.js";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../../../core/design-system/CustomThemeProvider.js";
import {
  type Theme,
  fontSize,
  iconSize,
  media,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import {
  useChainQuery,
  useChainsQuery,
} from "../../../core/hooks/others/useChainQuery.js";
import { useWalletBalance } from "../../../core/hooks/others/useWalletBalance.js";
import { SetRootElementContext } from "../../../core/providers/RootElementContext.js";
import { shortenString } from "../../../core/utils/addresses.js";
import { useActiveAccount } from "../../hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../hooks/wallets/useActiveWallet.js";
import { useActiveWalletChain } from "../../hooks/wallets/useActiveWalletChain.js";
import { useDisconnect } from "../../hooks/wallets/useDisconnect.js";
import { useSwitchActiveWalletChain } from "../../hooks/wallets/useSwitchActiveWalletChain.js";
import { hasSmartAccount } from "../../utils/isSmartWallet.js";
import { ChainIcon } from "../components/ChainIcon.js";
import { CopyIcon } from "../components/CopyIcon.js";
import { Img } from "../components/Img.js";
import { Modal } from "../components/Modal.js";
import { Skeleton } from "../components/Skeleton.js";
import { Spacer } from "../components/Spacer.js";
import { Spinner } from "../components/Spinner.js";
import { WalletImage } from "../components/WalletImage.js";
import { Container, Line } from "../components/basic.js";
import { Button, IconButton } from "../components/buttons.js";
import { Link, Text } from "../components/text.js";
import { fadeInAnimation } from "../design-system/animations.js";
import { StyledButton } from "../design-system/elements.js";
import type { LocaleId } from "../types.js";
import type {
  ConnectButtonProps,
  ConnectButton_detailsButtonOptions,
  ConnectButton_detailsModalOptions,
  PayUIOptions,
} from "./ConnectButtonProps.js";
import { MenuButton, MenuLink } from "./MenuButton.js";
import {
  NetworkSelectorContent,
  type NetworkSelectorProps,
} from "./NetworkSelector.js";
import { onModalUnmount } from "./constants.js";
import type { SupportedTokens } from "./defaultTokens.js";
import { CoinsIcon } from "./icons/CoinsIcon.js";
import { FundsIcon } from "./icons/FundsIcon.js";
import { GenericWalletIcon } from "./icons/GenericWalletIcon.js";
import { OutlineWalletIcon } from "./icons/OutlineWalletIcon.js";
import { SmartWalletBadgeIcon } from "./icons/SmartAccountBadgeIcon.js";
import { getConnectLocale } from "./locale/getConnectLocale.js";
import type { ConnectLocale } from "./locale/types.js";
import { LazyBuyScreen } from "./screens/Buy/LazyBuyScreen.js";
import { BuyTxHistory } from "./screens/Buy/tx-history/BuyTxHistory.js";
import { ManageWalletScreen } from "./screens/ManageWalletScreen.js";
import { PrivateKey } from "./screens/PrivateKey.js";
import { ReceiveFunds } from "./screens/ReceiveFunds.js";
import { SendFunds } from "./screens/SendFunds.js";
import { ViewFunds } from "./screens/ViewFunds.js";
import { WalletConnectReceiverScreen } from "./screens/WalletConnectReceiverScreen.js";
import type { WalletDetailsModalScreen } from "./screens/types.js";

const TW_CONNECTED_WALLET = "tw-connected-wallet";

const LocalhostChainId = 1337;

/**
 * @internal
 */
export const ConnectedWalletDetails: React.FC<{
  onDisconnect: (info: {
    wallet: Wallet;
    account: Account;
  }) => void;
  detailsButton?: ConnectButton_detailsButtonOptions;
  detailsModal?: ConnectButton_detailsModalOptions;
  theme: "light" | "dark" | Theme;
  supportedTokens?: SupportedTokens;
  chains: Chain[];
  chain?: Chain;
  switchButton: ConnectButtonProps["switchButton"];
  connectLocale: ConnectLocale;
  client: ThirdwebClient;
}> = (props) => {
  const { connectLocale: locale, client } = props;

  const setRootEl = useContext(SetRootElementContext);
  const activeWallet = useActiveWallet();
  const walletChain = useActiveWalletChain();

  useChainsQuery(props.chains, 5);

  const { ensAvatarQuery, addressOrENS, balanceQuery } = useWalletInfo(
    client,
    props.detailsButton?.displayBalanceToken,
  );

  function closeModal() {
    setRootEl(null);
  }

  function openModal() {
    setRootEl(
      <DetailsModal
        client={client}
        locale={locale}
        detailsModal={props.detailsModal}
        theme={props.theme}
        supportedTokens={props.supportedTokens}
        closeModal={closeModal}
        onDisconnect={props.onDisconnect}
        chains={props.chains}
        displayBalanceToken={props.detailsButton?.displayBalanceToken}
      />,
    );
  }

  const isNetworkMismatch =
    props.chain && walletChain && walletChain.id !== props.chain.id;

  if (props.detailsButton?.render) {
    return (
      // biome-ignore lint/a11y/useKeyWithClickEvents: ok
      <div onClick={openModal}>
        <props.detailsButton.render />
      </div>
    );
  }

  if (props.chain && isNetworkMismatch) {
    return (
      <SwitchNetworkButton
        style={props.switchButton?.style}
        className={props.switchButton?.className}
        switchNetworkBtnTitle={props.switchButton?.label}
        targetChain={props.chain}
        connectLocale={locale}
      />
    );
  }

  return (
    <WalletInfoButton
      type="button"
      className={`${TW_CONNECTED_WALLET} ${
        props.detailsButton?.className || ""
      }`}
      style={props.detailsButton?.style}
      data-test="connected-wallet-details"
      onClick={openModal}
    >
      {ensAvatarQuery.data ? (
        <Img
          src={ensAvatarQuery.data}
          width={iconSize.lg}
          height={iconSize.lg}
          style={{
            borderRadius: radius.sm,
          }}
          client={client}
        />
      ) : activeWallet?.id ? (
        <WalletImage size={iconSize.lg} id={activeWallet.id} client={client} />
      ) : (
        <GenericWalletIcon size={iconSize.lg} />
      )}

      <Container flex="column" gap="xxs">
        {/* Address */}

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
};

function DetailsModal(props: {
  client: ThirdwebClient;
  locale: ConnectLocale;
  detailsModal?: ConnectButton_detailsModalOptions;
  theme: "light" | "dark" | Theme;
  supportedTokens?: SupportedTokens;
  closeModal: () => void;
  onDisconnect: (info: {
    wallet: Wallet;
    account: Account;
  }) => void;
  chains: Chain[];
  displayBalanceToken?: Record<number, string>;
}) {
  const [screen, setScreen] = useState<WalletDetailsModalScreen>("main");
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(true);

  const { client, locale } = props;
  const { ensAvatarQuery, addressOrENS, balanceQuery } = useWalletInfo(
    client,
    props.displayBalanceToken,
  );

  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  const walletChain = useActiveWalletChain();
  const chainQuery = useChainQuery(walletChain);

  const disableSwitchChain = !activeWallet?.switchChain;

  function closeModal() {
    setIsOpen(false);
    onModalUnmount(() => {
      props.closeModal();
    });
  }

  function handleDisconnect(info: { wallet: Wallet; account: Account }) {
    setIsOpen(false);
    props.closeModal();
    props.onDisconnect(info);
  }

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
          <ChainIcon
            chainIcon={chainQuery.data?.icon}
            size={iconSize.md}
            active
            client={client}
          />
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
        {ensAvatarQuery.data ? (
          <Img
            src={ensAvatarQuery.data}
            width={iconSize.xxl}
            height={iconSize.xxl}
            style={{
              borderRadius: radius.lg,
            }}
            client={client}
          />
        ) : activeWallet?.id ? (
          <WalletImage
            size={iconSize.xxl}
            id={activeWallet.id}
            client={client}
          />
        ) : (
          <GenericWalletIcon size={iconSize.xxl} />
        )}

        <Spacer y="md" />

        <ConnectedToSmartWallet client={props.client} connectLocale={locale} />

        {(activeWallet?.id === "embedded" || activeWallet?.id === "inApp") && (
          <InAppWalletUserInfo client={props.client} />
        )}

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
        <Container
          flex="column"
          style={{
            gap: "1px",
          }}
        >
          {/* Network Switcher */}
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
            </Container>
          </MenuButton>

          {/* View Funds */}
          <MenuButton
            onClick={() => {
              setScreen("view-funds");
            }}
            style={{
              fontSize: fontSize.sm,
            }}
          >
            <CoinsIcon size={iconSize.md} />
            <Text color="primaryText">View Funds</Text>
          </MenuButton>

          {/* Manage Wallet */}
          <MenuButton
            onClick={() => {
              setScreen("manage-wallet");
            }}
            style={{
              fontSize: fontSize.sm,
            }}
          >
            <OutlineWalletIcon size={iconSize.md} />
            <Text color="primaryText">Manage Wallet</Text>
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

          {props.detailsModal?.footer && (
            <props.detailsModal.footer close={closeModal} />
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
                if (activeWallet && activeAccount) {
                  disconnect(activeWallet);
                  handleDisconnect({
                    account: activeAccount,
                    wallet: activeWallet,
                  });
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
      <BuyTxHistory
        isBuyForTx={false}
        isEmbed={false}
        onBack={() => setScreen("main")}
        client={client}
        onDone={closeModal}
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
        closeModal={closeModal}
        networkSelector={props.detailsModal?.networkSelector}
        onBack={() => {
          setScreen("main");
        }}
        connectLocale={locale}
        client={client}
      />
    );
  } else if (screen === "view-funds") {
    content = (
      <ViewFunds
        supportedTokens={props.supportedTokens}
        onBack={() => {
          setScreen("main");
        }}
        client={client}
      />
    );
  } else if (screen === "private-key") {
    content = (
      <PrivateKey
        theme={props.theme} // do not use the useCustomTheme hook to get this, it's not valid here
        onBack={() => {
          setScreen("manage-wallet");
        }}
        wallet={activeWallet}
        client={client}
      />
    );
  } else if (screen === "manage-wallet") {
    content = (
      <ManageWalletScreen
        onBack={() => {
          setScreen("main");
        }}
        locale={locale}
        closeModal={closeModal}
        client={client}
        setScreen={setScreen}
      />
    );
  } else if (screen === "wallet-connect-receiver") {
    content = (
      <WalletConnectReceiverScreen
        onBack={() => {
          setScreen("manage-wallet");
        }}
        chains={props.chains}
        client={client}
      />
    );
  }

  // send funds
  else if (screen === "send") {
    content = (
      <SendFunds
        supportedTokens={props.supportedTokens}
        onBack={() => {
          setScreen("main");
        }}
        client={client}
        connectLocale={locale}
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
        client={client}
        connectLocale={locale}
      />
    );
  }

  // thirdweb pay
  else if (screen === "buy") {
    content = (
      <LazyBuyScreen
        isEmbed={false}
        client={client}
        onBack={() => setScreen("main")}
        supportedTokens={props.supportedTokens}
        onViewPendingTx={() => setScreen("pending-tx")}
        connectLocale={locale}
        payOptions={props.detailsModal?.payOptions || {}}
        theme={typeof props.theme === "string" ? props.theme : props.theme.type}
        onDone={closeModal}
      />
    );
  }

  return (
    <CustomThemeProvider theme={props.theme}>
      <Modal
        size={"compact"}
        open={isOpen}
        setOpen={(_open) => {
          if (!_open) {
            closeModal();
          }
        }}
      >
        {content}
      </Modal>
    </CustomThemeProvider>
  );
}

const WalletInfoButton = /* @__PURE__ */ StyledButton((_) => {
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

const StyledChevronRightIcon = /* @__PURE__ */ styled(
  /* @__PURE__ */ ChevronRightIcon,
)(() => {
  const theme = useCustomTheme();
  return {
    color: theme.colors.secondaryText,
  };
});

function ConnectedToSmartWallet(props: {
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
}) {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const isSmartWallet = hasSmartAccount(activeWallet);
  const chain = useActiveWalletChain();
  const { client, connectLocale: locale } = props;

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
    <Container
      flex="row"
      bg="secondaryButtonBg"
      gap="xxs"
      style={{
        borderRadius: radius.md,
        padding: `${spacing.xxs} ${spacing.sm} ${spacing.xxs} ${spacing.xs}`,
      }}
      center="y"
    >
      <Container flex="row" color="accentText" center="both">
        <SmartWalletBadgeIcon size={iconSize.xs} />
      </Container>
      <Text size="xs" color="secondaryButtonText">
        {locale.connectedToSmartWallet}
      </Text>
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

        <Spacer y="xs" />
      </>
    );
  }

  return null;
}

function InAppWalletUserInfo(props: { client: ThirdwebClient }) {
  const { client } = props;
  const account = useActiveAccount();

  const userInfoQuery = useQuery({
    queryKey: ["in-app-wallet-user", client, account?.address],
    queryFn: async () => {
      const { getUserEmail, getUserPhoneNumber } = await import(
        "../../../../wallets/in-app/web/lib/auth/index.js"
      );

      const [email, phone] = await Promise.all([
        getUserEmail({
          client: client,
        }),
        getUserPhoneNumber({
          client: client,
        }),
      ]);

      return email || phone || null;
    },
  });

  if (userInfoQuery.data) {
    return (
      <Container
        flex="row"
        center="x"
        style={{
          paddingBottom: spacing.xs,
        }}
      >
        <Text size="sm">{userInfoQuery.data}</Text>
      </Container>
    );
  }

  return null;
}

/**
 * @internal
 */
function SwitchNetworkButton(props: {
  style?: React.CSSProperties;
  className?: string;
  switchNetworkBtnTitle?: string;
  targetChain: Chain;
  connectLocale: ConnectLocale;
}) {
  const switchChain = useSwitchActiveWalletChain();
  const [switching, setSwitching] = useState(false);
  const locale = props.connectLocale;

  const switchNetworkBtnTitle =
    props.switchNetworkBtnTitle ?? locale.switchNetwork;

  return (
    <Button
      className={`tw-connect-wallet--switch-network ${props.className || ""}`}
      variant="primary"
      type="button"
      data-is-loading={switching}
      data-test="switch-network-button"
      disabled={switching}
      onClick={async () => {
        setSwitching(true);
        try {
          await switchChain(props.targetChain);
        } catch (e) {
          console.error(e);
        }
        setSwitching(false);
      }}
      style={{
        minWidth: "140px",
        ...props.style,
      }}
      aria-label={switching ? locale.switchingNetwork : undefined}
    >
      {switching ? (
        <Spinner size="sm" color="primaryButtonText" />
      ) : (
        switchNetworkBtnTitle
      )}
    </Button>
  );
}

export type UseWalletDetailsModalOptions = {
  /**
   * A client is the entry point to the thirdweb SDK.
   * It is required for all other actions.
   * You can create a client using the `createThirdwebClient` function. Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   * You must provide a `clientId` or `secretKey` in order to initialize a client. Pass `clientId` if you want for client-side usage and `secretKey` for server-side usage.
   *
   * ```tsx
   * import { createThirdwebClient } from "thirdweb";
   *
   * const client = createThirdwebClient({
   *  clientId: "<your_client_id>",
   * })
   * ```
   */
  client: ThirdwebClient;
  /**
   * Set the theme for the Wallet Details Modal. By default it is set to `"dark"`
   *
   * theme can be set to either `"dark"`, `"light"` or a custom theme object.
   * You can also import [`lightTheme`](https://portal.thirdweb.com/references/typescript/v5/lightTheme)
   * or [`darkTheme`](https://portal.thirdweb.com/references/typescript/v5/darkTheme)
   * functions from `thirdweb/react` to use the default themes as base and overrides parts of it.
   * @example
   * ```ts
   * import { lightTheme } from "thirdweb/react";
   *
   * const customTheme = lightTheme({
   *  colors: {
   *    modalBg: 'red'
   *  }
   * })
   *
   * ```
   */
  theme?: "light" | "dark" | Theme;
  /**
   * Customize the tokens shown in the "Send Funds" screen in Details Modal for various networks.
   *
   * By default, The "Send Funds" screen shows a few popular tokens for default chains and the native token. For other chains it only shows the native token.
   * @example
   *
   * supportedTokens prop allows you to customize this list as shown below which shows  "Dai Stablecoin" when users wallet is connected to the "Base" mainnet.
   *
   * ```tsx
   * import { useWalletDetailsModal } from 'thirdweb/react';
   *
   * function Example() {
   *   const detailsModal = useWalletDetailsModal();
   *
   *   function handleClick() {
   *      detailsModal.open({
   *        client,
   *        supportedTokens:{
   * 				  84532: [
   * 					  {
   * 						  address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', // token contract address
   * 						  name: 'Dai Stablecoin',
   * 						  symbol: 'DAI',
   * 						  icon: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png?1687143508',
   * 					  },
   * 				  ],
   * 			  }
   *      });
   *   }
   *
   *   return (
   * 		<button onClick={handleClick}> show wallet details </button>
   * 	);
   * }
   * ```
   */
  supportedTokens?: SupportedTokens;
  /**
   * By default - Details Modal UI uses the `en-US` locale for english language users.
   *
   * You can customize the language used in the Details Modal UI by setting the `locale` prop.
   *
   * Refer to the [`LocaleId`](https://portal.thirdweb.com/references/typescript/v5/LocaleId) type for supported locales.
   */
  locale?: LocaleId;
  /**
   * Array of chains that your app supports. They will be displayed in the network selector in the screen.
   *
   * This is only relevant if your app is a multi-chain app and works across multiple blockchains.
   * If your app only works on a single blockchain, you should only specify the `chain` prop.
   *
   * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
   * At minimum, you need to pass the `id` of the blockchain to `defineChain` function to create a `Chain` object.
   *
   * ```tsx
   * import { defineChain } from "thirdweb/react";
   *
   * const polygon = defineChain({
   *   id: 137,
   * });
   * ```
   */
  chains?: Chain[];
  /**
   * Show a "Request Testnet funds" link in Wallet Details Modal when user is connected to a testnet.
   *
   * By default it is `false`, If you want to show the "Request Testnet funds" link when user is connected to a testnet, set this prop to `true`
   */
  showTestnetFaucet?: boolean;

  /**
   * customize the Network selector shown in the Wallet Details Modal
   */
  networkSelector?: NetworkSelectorProps;

  /**
   * Hide the "Disconnect Wallet" button in the Wallet Details Modal.
   *
   * By default it is `false`
   */
  hideDisconnect?: boolean;

  /**
   * Callback to be called when a wallet is disconnected by clicking the "Disconnect Wallet" button in the Wallet Details Modal.
   *
   * ```tsx
   * import { useWalletDetailsModal } from 'thirdweb/react';
   *
   * function Example() {
   *   const detailsModal = useWalletDetailsModal();
   *
   *   function handleClick() {
   *      detailsModal.open({
   *        client,
   *        onDisconnect: ({ wallet, account }) => {
   *           console.log('disconnected', wallet, account);
   *        }
   *      });
   *   }
   *
   *   return (
   * 		<button onClick={handleClick}> wallet details </button>
   * 	);
   * }
   * ```
   */
  onDisconnect?: (info: {
    wallet: Wallet;
    account: Account;
  }) => void;

  /**
   * Render custom UI at the bottom of the Details Modal
   */
  footer?: (props: { close: () => void }) => JSX.Element;

  /**
   * Configure options for thirdweb Pay.
   *
   * thirdweb Pay allows users to buy tokens using crypto or fiat currency.
   */
  payOptions?: PayUIOptions;

  /**
   * Display the balance of a token instead of the native token
   * @example
   * ```tsx
   * const displayBalanceToken = {
   *   // show USDC balance when connected to Ethereum mainnet or Polygon
   *   [ethereum.id]: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
   *   [polygon.id]: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
   * }
   * ```
   */
  displayBalanceToken?: Record<number, string>;
};

/**
 * Hook to open the Wallet Details Modal that shows various information about the connected wallet and allows users to perform various actions like sending funds, receiving funds, switching networks, Buying tokens, etc.
 *
 * @example
 * ```tsx
 * import { createThirdwebClient } from "thirdweb";
 * import { useWalletDetailsModal } from "thirdweb/react";
 *
 * const client = createThirdwebClient({
 *  clientId: "<your_client_id>",
 * });
 *
 * function Example() {
 *   const detailsModal = useWalletDetailsModal();
 *
 *   function handleClick() {
 *      detailsModal.open({ client, theme: 'light' });
 *   }
 *
 *   return <button onClick={handleClick}> Show Wallet Details </button>
 * }
 * ```
 */
export function useWalletDetailsModal() {
  const account = useActiveAccount();
  const setRootEl = useContext(SetRootElementContext);

  function closeModal() {
    setRootEl(null);
  }

  function openModal(props: UseWalletDetailsModalOptions) {
    if (!account) {
      throw new Error("Wallet is not connected.");
    }

    getConnectLocale(props.locale || "en_US")
      .then((locale) => {
        setRootEl(
          <DetailsModal
            client={props.client}
            locale={locale}
            detailsModal={{
              footer: props.footer,
              hideDisconnect: props.hideDisconnect,
              networkSelector: props.networkSelector,
              payOptions: props.payOptions,
              showTestnetFaucet: props.showTestnetFaucet,
            }}
            displayBalanceToken={props.displayBalanceToken}
            theme={props.theme || "dark"}
            supportedTokens={props.supportedTokens}
            closeModal={closeModal}
            onDisconnect={(info) => {
              props.onDisconnect?.(info);
              closeModal();
            }}
            chains={props.chains || []}
          />,
        );
      })
      .catch(() => {
        closeModal();
      });
  }

  return {
    open: openModal,
  };
}

function useWalletInfo(
  client: ThirdwebClient,
  displayBalanceToken?: Record<number, string>,
) {
  const walletChain = useActiveWalletChain();

  const tokenAddress =
    walletChain && displayBalanceToken
      ? displayBalanceToken[Number(walletChain.id)]
      : undefined;

  const activeAccount = useActiveAccount();
  const ensNameQuery = useQuery({
    queryKey: ["ens-name", activeAccount?.address],
    enabled: !!activeAccount?.address,
    queryFn: () =>
      resolveName({
        client,
        address: activeAccount?.address || "",
        resolverChain: ethereum,
      }),
  });

  const ensAvatarQuery = useQuery({
    queryKey: ["ens-avatar", ensNameQuery.data],
    enabled: !!ensNameQuery.data,
    queryFn: async () =>
      resolveAvatar({
        client,
        name: ensNameQuery.data || "",
      }),
  });

  const shortAddress = activeAccount?.address
    ? shortenString(activeAccount.address, false)
    : "";

  const balanceQuery = useWalletBalance({
    chain: walletChain ? walletChain : undefined,
    tokenAddress,
    address: activeAccount?.address,
    client,
  });

  const addressOrENS = ensNameQuery.data || shortAddress;

  return {
    ensNameQuery,
    ensAvatarQuery,
    addressOrENS,
    shortAddress,
    balanceQuery,
  };
}
