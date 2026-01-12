import { PlusIcon } from "@radix-ui/react-icons";
import { useCallback, useMemo, useState } from "react";
import type { Token } from "../../../../../bridge/index.js";
import type { BridgeChain } from "../../../../../bridge/types/Chain.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { isNativeTokenAddress } from "../../../../../constants/addresses.js";
import type { SupportedFiatCurrency } from "../../../../../pay/convert/type.js";
import { shortenAddress } from "../../../../../utils/address.js";
import { toTokens } from "../../../../../utils/units.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { CoinsIcon } from "../../ConnectWallet/icons/CoinsIcon.js";
import { InfoIcon } from "../../ConnectWallet/icons/InfoIcon.js";
import { WalletDotIcon } from "../../ConnectWallet/icons/WalletDotIcon.js";
import connectLocaleEn from "../../ConnectWallet/locale/en.js";
import { formatCurrencyAmount } from "../../ConnectWallet/screens/formatTokenBalance.js";
import { WalletConnectionScreen } from "../../ConnectWallet/screens/WalletSwitcherConnectionScreen.js";
import {
  Container,
  Line,
  ModalHeader,
  noScrollBar,
} from "../../components/basic.js";
import { Button, IconButton } from "../../components/buttons.js";
import { CopyIcon } from "../../components/CopyIcon.js";
import { Img } from "../../components/Img.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Link, Text } from "../../components/text.js";
import { StyledDiv } from "../../design-system/elements.js";
import { useDebouncedValue } from "../../hooks/useDebouncedValue.js";
import { useIsMobile } from "../../hooks/useisMobile.js";
import { useTokenPrice } from "./hooks.js";
import { SearchInput } from "./SearchInput.js";
import { MobileTabSelector } from "./SelectChainButton.js";
import type { SwapWidgetProps } from "./SwapWidget.js";
import { SelectBridgeChain } from "./select-chain.js";
import type { ActiveWalletInfo, SelectedTab, TokenSelection } from "./types.js";
import { useBridgeChainsWithFilters } from "./use-bridge-chains.js";
import {
  type TokenBalance,
  useTokenBalances,
  useTokens,
} from "./use-tokens.js";
import { cleanedChainName, tokenAmountFormatter } from "./utils.js";

/**
 * @internal
 */
type SelectTokenUIProps = {
  onClose: () => void;
  client: ThirdwebClient;
  selectedToken: TokenSelection | undefined;
  setSelectedToken: (token: TokenSelection) => void;
  activeWalletInfo: ActiveWalletInfo | undefined;
  type: "buy" | "sell";
  selections: {
    buyChainId: number | undefined;
    sellChainId: number | undefined;
  };
  currency: SupportedFiatCurrency;
  theme: SwapWidgetProps["theme"];
  connectOptions: SwapWidgetProps["connectOptions"];
};

function findChain(chains: BridgeChain[], activeChainId: number | undefined) {
  if (!activeChainId) {
    return undefined;
  }
  return chains.find((chain) => chain.chainId === activeChainId);
}

const INITIAL_LIMIT = 100;

export function SelectToken(props: SelectTokenUIProps) {
  const chainQuery = useBridgeChainsWithFilters({
    client: props.client,
    type: props.type,
    buyChainId: props.selections.buyChainId,
    sellChainId: props.selections.sellChainId,
  });

  if (chainQuery.isPending) {
    return (
      <Container
        flex="column"
        center="both"
        fullHeight
        expand
        style={{
          minHeight: "450px",
        }}
      >
        <Spinner color="secondaryText" size="xl" />
      </Container>
    );
  }

  if (!chainQuery.data) {
    return (
      <Container center="both">
        <Text size="sm" color="secondaryText">
          Failed to fetch chains
        </Text>
      </Container>
    );
  }

  return <SelectTokenUI {...props} chains={chainQuery.data} />;
}

function SelectTokenUI(
  props: SelectTokenUIProps & {
    chains: BridgeChain[];
  }
) {
  const [selectedTab, setSelectedTab] = useState<SelectedTab>(() => {
    if (props.selectedToken) {
      const chain = findChain(props.chains, props.selectedToken?.chainId);
      if (chain) {
        return { type: "chain", chain };
      }
    }
    return { type: "your-tokens" };
  });

  const isMobile = useIsMobile();
  const [screen, setScreen] = useState<
    "select-chain" | "select-token" | "connect-wallet"
  >("select-token");

  if (screen === "connect-wallet") {
    return (
      <WalletConnectionScreen
        shouldSetActive={true}
        size={isMobile ? "compact" : "wide"}
        client={props.client}
        chain={props.connectOptions?.chain}
        chains={props.connectOptions?.chains}
        wallets={props.connectOptions?.wallets}
        appMetadata={props.connectOptions?.appMetadata}
        connectLocale={connectLocaleEn}
        recommendedWallets={props.connectOptions?.recommendedWallets}
        showAllWallets={props.connectOptions?.showAllWallets || true}
        walletConnect={props.connectOptions?.walletConnect}
        onBack={() => {
          setScreen("select-token");
        }}
        isEmbed={false}
        accountAbstraction={props.connectOptions?.accountAbstraction}
        onSelect={() => {
          setScreen("select-token");
        }}
      />
    );
  }

  // desktop
  if (!isMobile) {
    return (
      <Container
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          height: "100%",
        }}
      >
        <LeftContainer>
          <SelectBridgeChain
            type={props.type}
            selections={props.selections}
            onBack={() => setScreen("select-token")}
            client={props.client}
            isMobile={false}
            onSelectTab={(tab) => {
              setSelectedTab(tab);
              setScreen("select-token");
            }}
            selectedTab={selectedTab}
          />
        </LeftContainer>
        <Container flex="column" relative scrollY>
          <TokenSelectionScreen
            setSelectedTab={setSelectedTab}
            chains={props.chains}
            onConnectWallet={() => {
              setScreen("connect-wallet");
            }}
            activeWalletInfo={props.activeWalletInfo}
            onSelectToken={(token) => {
              props.setSelectedToken(token);
              props.onClose();
            }}
            isMobile={false}
            key={
              selectedTab?.type === "chain"
                ? selectedTab.chain.chainId
                : undefined
            }
            selectedToken={props.selectedToken}
            selectedTab={selectedTab}
            onShowChainSelector={() => setScreen("select-chain")}
            client={props.client}
            currency={props.currency}
            theme={props.theme}
            connectOptions={props.connectOptions}
          />
        </Container>
      </Container>
    );
  }

  // mobile
  if (screen === "select-token") {
    return (
      <TokenSelectionScreen
        setSelectedTab={setSelectedTab}
        chains={props.chains}
        onConnectWallet={() => {
          setScreen("connect-wallet");
        }}
        activeWalletInfo={props.activeWalletInfo}
        key={
          selectedTab?.type === "chain" ? selectedTab.chain.chainId : undefined
        }
        onSelectToken={(token) => {
          props.setSelectedToken(token);
          props.onClose();
        }}
        selectedToken={props.selectedToken}
        selectedTab={selectedTab}
        isMobile={true}
        onShowChainSelector={() => setScreen("select-chain")}
        client={props.client}
        currency={props.currency}
        theme={props.theme}
        connectOptions={props.connectOptions}
      />
    );
  }

  if (screen === "select-chain") {
    return (
      <SelectBridgeChain
        isMobile={true}
        onBack={() => setScreen("select-token")}
        client={props.client}
        onSelectTab={(tab) => {
          setSelectedTab(tab);
          setScreen("select-token");
        }}
        selectedTab={selectedTab}
        type={props.type}
        selections={props.selections}
      />
    );
  }

  return null;
}

function TokenButtonSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: spacing.sm,
        padding: spacing.xs,
      }}
    >
      <Skeleton
        height={`${iconSize.lg}px`}
        width={`${iconSize.lg}px`}
        style={{
          borderRadius: radius.full,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <Skeleton height={fontSize.sm} width="100px" />
        <Skeleton height={fontSize.md} width="200px" />
      </div>
    </div>
  );
}

function TokenButton(props: {
  token: TokenBalance | Token;
  client: ThirdwebClient;
  onSelect: (tokenWithPrices: TokenSelection) => void;
  onInfoClick: (tokenAddress: string, chainId: number) => void;
  isSelected: boolean;
}) {
  const theme = useCustomTheme();
  const tokenBalanceInUnits =
    "balance" in props.token
      ? toTokens(BigInt(props.token.balance), props.token.decimals)
      : undefined;
  const usdValue =
    "balance" in props.token
      ? props.token.price_data.price_usd * Number(tokenBalanceInUnits)
      : undefined;

  const tokenAddress =
    "balance" in props.token ? props.token.token_address : props.token.address;
  const chainId =
    "balance" in props.token ? props.token.chain_id : props.token.chainId;

  return (
    <Button
      variant={props.isSelected ? "secondary" : "ghost-solid"}
      fullWidth
      style={{
        justifyContent: "flex-start",
        fontWeight: 500,
        fontSize: fontSize.md,
        border: "1px solid transparent",
        padding: spacing.xs,
        textAlign: "left",
        lineHeight: "1.5",
        borderRadius: radius.lg,
      }}
      gap="sm"
      onClick={async () => {
        props.onSelect({
          tokenAddress,
          chainId,
        });
      }}
    >
      <Img
        src={
          ("balance" in props.token
            ? props.token.icon_uri
            : props.token.iconUri) || ""
        }
        client={props.client}
        width={iconSize.lg}
        height={iconSize.lg}
        style={{
          flexShrink: 0,
          borderRadius: radius.full,
        }}
        fallback={
          <Container color="secondaryText">
            <Container
              style={{
                background: `linear-gradient(45deg, white, ${theme.colors.accentText})`,
                borderRadius: radius.full,
                width: `${iconSize.lg}px`,
                height: `${iconSize.lg}px`,
              }}
            />
          </Container>
        }
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing["3xs"],
          flex: 1,
        }}
      >
        {/* left */}
        <Container
          flex="row"
          style={{
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text
            size="md"
            color="primaryText"
            weight={500}
            style={{
              maxWidth: "200px",
              whiteSpace: "nowrap",
            }}
          >
            {props.token.symbol}
          </Text>

          {"balance" in props.token && (
            <Text size="md" color="primaryText">
              {tokenAmountFormatter.format(
                Number(
                  toTokens(BigInt(props.token.balance), props.token.decimals)
                )
              )}
            </Text>
          )}
        </Container>

        {/* right */}
        <Container
          flex="row"
          style={{
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text
            size="xs"
            color="secondaryText"
            style={{
              whiteSpace: "nowrap",
              maxWidth: "200px",
            }}
          >
            {props.token.name}
          </Text>
          {usdValue && (
            <Container flex="row">
              <Text size="xs" color="secondaryText" weight={400}>
                ${usdValue.toFixed(2)}
              </Text>
            </Container>
          )}
        </Container>
      </div>

      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          props.onInfoClick(tokenAddress, chainId);
        }}
        style={{
          padding: spacing.xxs,
          borderRadius: radius.full,
        }}
      >
        <InfoIcon size={iconSize.sm} />
      </IconButton>
    </Button>
  );
}

function YourTokenButton(props: {
  token: TokenBalance;
  chain: BridgeChain | undefined;
  client: ThirdwebClient;
  onSelect: (tokenWithPrices: TokenSelection) => void;
  onInfoClick: (tokenAddress: string, chainId: number) => void;
  isSelected: boolean;
}) {
  const theme = useCustomTheme();
  const tokenBalanceInUnits = toTokens(
    BigInt(props.token.balance),
    props.token.decimals
  );
  const usdValue =
    props.token.price_data.price_usd * Number(tokenBalanceInUnits);

  const tokenAddress = props.token.token_address;
  const chainId = props.token.chain_id;

  return (
    <Button
      variant={props.isSelected ? "secondary" : "ghost-solid"}
      fullWidth
      style={{
        justifyContent: "flex-start",
        fontWeight: 500,
        fontSize: fontSize.md,
        border: "1px solid transparent",
        padding: spacing.xs,
        textAlign: "left",
        lineHeight: "1.5",
        borderRadius: radius.lg,
      }}
      gap="sm"
      onClick={async () => {
        props.onSelect({
          tokenAddress,
          chainId,
        });
      }}
    >
      {/* Token icon with chain icon overlay */}
      <div
        style={{
          position: "relative",
          width: `${iconSize.lg}px`,
          height: `${iconSize.lg}px`,
          flexShrink: 0,
        }}
      >
        <Img
          src={props.token.icon_uri || ""}
          client={props.client}
          width={iconSize.lg}
          height={iconSize.lg}
          style={{
            borderRadius: radius.full,
          }}
          fallback={
            <Container color="secondaryText">
              <Container
                style={{
                  background: `linear-gradient(45deg, white, ${theme.colors.accentText})`,
                  borderRadius: radius.full,
                  width: `${iconSize.lg}px`,
                  height: `${iconSize.lg}px`,
                }}
              />
            </Container>
          }
        />
        {/* Chain icon - small, overlapping bottom right */}
        {props.chain?.icon && (
          <Img
            src={props.chain.icon}
            client={props.client}
            width={iconSize.sm}
            height={iconSize.sm}
            style={{
              position: "absolute",
              bottom: -2,
              right: -2,
              borderRadius: radius.full,
              border: `1.5px solid ${theme.colors.modalBg}`,
              background: theme.colors.modalBg,
            }}
          />
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing["3xs"],
          flex: 1,
        }}
      >
        {/* Top row - Symbol and Balance */}
        <Container
          flex="row"
          style={{
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text
            size="md"
            color="primaryText"
            weight={500}
            style={{
              maxWidth: "200px",
              whiteSpace: "nowrap",
            }}
          >
            {props.token.symbol}
          </Text>

          <Text size="md" color="primaryText">
            {tokenAmountFormatter.format(
              Number(
                toTokens(BigInt(props.token.balance), props.token.decimals)
              )
            )}
          </Text>
        </Container>

        {/* Bottom row - Chain name and USD value */}
        <Container
          flex="row"
          style={{
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text
            size="xs"
            color="secondaryText"
            style={{
              whiteSpace: "nowrap",
              maxWidth: "200px",
            }}
          >
            {props.chain
              ? cleanedChainName(props.chain.name)
              : `Chain ${chainId}`}
          </Text>
          {usdValue > 0 && (
            <Container flex="row">
              <Text size="xs" color="secondaryText" weight={400}>
                ${usdValue.toFixed(2)}
              </Text>
            </Container>
          )}
        </Container>
      </div>

      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          props.onInfoClick(tokenAddress, chainId);
        }}
        style={{
          padding: spacing.xxs,
          borderRadius: radius.full,
        }}
      >
        <InfoIcon size={iconSize.sm} />
      </IconButton>
    </Button>
  );
}

function TokenInfoScreen(props: {
  tokenAddress: string;
  chainId: number;
  client: ThirdwebClient;
  onBack: () => void;
  currency: SupportedFiatCurrency;
}) {
  const theme = useCustomTheme();
  const tokenQuery = useTokenPrice({
    token: {
      tokenAddress: props.tokenAddress,
      chainId: props.chainId,
    },
    client: props.client,
  });
  const token = tokenQuery.data;

  const isNativeToken = isNativeTokenAddress(props.tokenAddress);
  const explorerLink = isNativeToken
    ? `https://thirdweb.com/${props.chainId}`
    : `https://thirdweb.com/${props.chainId}/${props.tokenAddress}`;

  return (
    <Container
      flex="column"
      expand
      style={{ minHeight: "450px" }}
      animate="fadein"
    >
      {/* Header */}
      <Container px="md" py="md+">
        <ModalHeader onBack={props.onBack} title="Token Details" />
      </Container>
      <Line dashed />

      {tokenQuery.isPending ? (
        <Container flex="column" center="both" expand>
          <Spinner size="lg" color="secondaryText" />
        </Container>
      ) : !token ? (
        <Container flex="column" center="both" expand>
          <Text size="sm" color="secondaryText">
            Token not found
          </Text>
        </Container>
      ) : (
        <Container flex="column" gap="md" px="md" py="lg">
          {/* name + icon */}
          <Container
            flex="row"
            style={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text size="sm" color="secondaryText">
              Name
            </Text>

            <Container flex="row" gap="xxs" center="y">
              <Img
                src={token.iconUri || ""}
                client={props.client}
                width={iconSize.sm}
                height={iconSize.sm}
                style={{
                  borderRadius: radius.full,
                }}
                fallback={
                  <Container
                    style={{
                      background: `linear-gradient(45deg, white, ${theme.colors.accentText})`,
                      borderRadius: radius.full,
                      width: `${iconSize.sm}px`,
                      height: `${iconSize.sm}px`,
                    }}
                  />
                }
              />
              <Text
                size="sm"
                color="primaryText"
                weight={500}
                style={{
                  maxWidth: "200px",
                  whiteSpace: "nowrap",
                }}
              >
                {token.name}
              </Text>
            </Container>
          </Container>

          {/* symbol */}
          <TokenInfoRow label="Symbol" value={token.symbol} />

          {/* price */}
          {"prices" in token && (
            <TokenInfoRow
              label="Price"
              value={
                token.prices[props.currency]
                  ? formatCurrencyAmount(
                      props.currency,
                      token.prices[props.currency] as number
                    )
                  : "N/A"
              }
            />
          )}

          {/* market cap */}
          {!!token.marketCapUsd && (
            <TokenInfoRow
              label="Market Cap"
              value={formatCurrencyAmount(props.currency, token.marketCapUsd)}
            />
          )}

          {/* volume 24h */}
          {!!token.volume24hUsd && (
            <TokenInfoRow
              label="Volume (24h)"
              value={formatCurrencyAmount(props.currency, token.volume24hUsd)}
            />
          )}

          {/* address + link */}
          <Container
            flex="row"
            style={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text size="sm" color="secondaryText">
              Contract Address
            </Text>

            <Container flex="row" gap="3xs" center="y">
              {!isNativeToken && (
                <CopyIcon
                  text={props.tokenAddress}
                  iconSize={13}
                  tip="Copy Address"
                />
              )}

              <Link
                href={explorerLink}
                target="_blank"
                rel="noreferrer"
                color="accentText"
                hoverColor="primaryText"
                weight={500}
                size="sm"
              >
                {isNativeToken
                  ? "Native Currency"
                  : shortenAddress(props.tokenAddress)}
              </Link>
            </Container>
          </Container>
        </Container>
      )}
    </Container>
  );
}

function TokenInfoRow(props: { label: string; value: string }) {
  return (
    <Container
      flex="row"
      style={{
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text size="sm" color="secondaryText">
        {props.label}
      </Text>
      <Text
        size="sm"
        color="primaryText"
        weight={500}
        style={{
          maxWidth: "200px",
          whiteSpace: "nowrap",
        }}
      >
        {props.value}
      </Text>
    </Container>
  );
}

function TokenSelectionScreen(props: {
  selectedTab: SelectedTab;
  isMobile: boolean;
  client: ThirdwebClient;
  selectedToken: TokenSelection | undefined;
  onSelectToken: (token: TokenSelection) => void;
  currency: SupportedFiatCurrency;
  onShowChainSelector: () => void;
  activeWalletInfo: ActiveWalletInfo | undefined;
  theme: SwapWidgetProps["theme"];
  connectOptions: SwapWidgetProps["connectOptions"];
  onConnectWallet: () => void;
  setSelectedTab: (tab: SelectedTab) => void;
  chains: BridgeChain[];
}) {
  const [tokenInfoScreen, setTokenInfoScreen] = useState<
    | {
        tokenAddress: string;
        chainId: number;
      }
    | undefined
  >();

  if (tokenInfoScreen) {
    return (
      <TokenInfoScreen
        tokenAddress={tokenInfoScreen.tokenAddress}
        chainId={tokenInfoScreen.chainId}
        client={props.client}
        onBack={() => setTokenInfoScreen(undefined)}
        currency={props.currency}
      />
    );
  }

  return (
    <Container
      flex="column"
      fullHeight
      style={{
        minHeight: "450px",
      }}
    >
      <ScreenHeader
        title="Select Token"
        description="Select a token from the list or use the search"
      />

      {/* tab switcher */}
      {props.isMobile ? (
        <Container py="sm">
          <MobileTabSelector
            selectedTab={props.selectedTab}
            client={props.client}
            onSelect={(value) => {
              if (value === "your-tokens") {
                props.setSelectedTab({ type: "your-tokens" });
              }
              if (value === "all-tokens") {
                const chain = props.selectedToken
                  ? findChain(props.chains, props.selectedToken.chainId)
                  : props.chains[0];
                if (chain) {
                  props.setSelectedTab({ type: "chain", chain: chain });
                }
              }
              if (value === "chain-selector") {
                props.onShowChainSelector();
              }
            }}
          />
        </Container>
      ) : (
        <Spacer y="md" />
      )}

      {props.selectedTab.type === "chain" && (
        <ChainTokenSelectionScreen
          selectedTab={props.selectedTab}
          setSelectedTab={props.setSelectedTab}
          chains={props.chains}
          isMobile={props.isMobile}
          client={props.client}
          selectedToken={props.selectedToken}
          onSelectToken={props.onSelectToken}
          currency={props.currency}
          onShowChainSelector={props.onShowChainSelector}
          activeWalletInfo={props.activeWalletInfo}
          showTokenInfo={tokenInfoScreen}
          setShowTokenInfo={setTokenInfoScreen}
        />
      )}

      {props.selectedTab.type === "your-tokens" && (
        <YourTokenSelectionScreen
          isMobile={props.isMobile}
          showTokenInfo={tokenInfoScreen}
          setShowTokenInfo={setTokenInfoScreen}
          setSelectedTab={props.setSelectedTab}
          chains={props.chains}
          selectedTab={props.selectedTab}
          onConnectWallet={props.onConnectWallet}
          client={props.client}
          selectedToken={props.selectedToken}
          onSelectToken={props.onSelectToken}
          currency={props.currency}
          onShowChainSelector={props.onShowChainSelector}
          activeWalletInfo={props.activeWalletInfo}
          theme={props.theme}
          connectOptions={props.connectOptions}
        />
      )}
    </Container>
  );
}

function ChainTokenSelectionScreen(props: {
  selectedTab: SelectedTab;
  setSelectedTab: (tab: SelectedTab) => void;
  isMobile: boolean;
  client: ThirdwebClient;
  chains: BridgeChain[];
  selectedToken: TokenSelection | undefined;
  onSelectToken: (token: TokenSelection) => void;
  currency: SupportedFiatCurrency;
  onShowChainSelector: () => void;
  activeWalletInfo: ActiveWalletInfo | undefined;
  showTokenInfo: { tokenAddress: string; chainId: number } | undefined;
  setShowTokenInfo: (
    showTokenInfo: { tokenAddress: string; chainId: number } | undefined
  ) => void;
}) {
  const [limit, setLimit] = useState(INITIAL_LIMIT);
  const [search, _setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const setSearch = useCallback((search: string) => {
    _setSearch(search);
    setLimit(INITIAL_LIMIT);
  }, []);

  const allTokensQuery = useTokens({
    client: props.client,
    chainId:
      props.selectedTab?.type === "chain"
        ? props.selectedTab.chain.chainId
        : undefined,
    search: debouncedSearch,
    limit,
    offset: 0,
  });

  const ownedTokensQuery = useTokenBalances({
    client: props.client,
    chainId:
      props.selectedTab?.type === "chain"
        ? props.selectedTab.chain.chainId
        : undefined,
    limit,
    page: 1,
    walletAddress: props.activeWalletInfo?.activeAccount.address,
  });

  const isFetching = allTokensQuery.isFetching || ownedTokensQuery.isFetching;

  const ownedTokens = useMemo(() => {
    if (!ownedTokensQuery.data || ownedTokensQuery.data?.tokens?.length === 0) {
      return [];
    }

    let tokens = ownedTokensQuery.data.tokens;

    if (debouncedSearch) {
      tokens = tokens.filter((token) => {
        return (
          token.symbol.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          token.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          token.token_address
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())
        );
      });
    }

    tokens = tokens.sort((a, b) => {
      if (a.icon_uri && !b.icon_uri) {
        return -1;
      }
      if (!a.icon_uri && b.icon_uri) {
        return 1;
      }
      return 0;
    });

    return tokens;
  }, [ownedTokensQuery.data?.tokens, debouncedSearch, ownedTokensQuery.data]);

  const otherTokens = useMemo(() => {
    if (!allTokensQuery.data || allTokensQuery.data?.length === 0) {
      return [];
    }

    const ownedTokenSet = new Set(
      ownedTokens.map((t) => `${t.token_address}-${t.chain_id}`.toLowerCase())
    );

    let tokens = allTokensQuery.data.filter(
      (token) =>
        !ownedTokenSet.has(`${token.address}-${token.chainId}`.toLowerCase())
    );

    tokens = tokens.sort((a, b) => {
      if (a.iconUri && !b.iconUri) {
        return -1;
      }
      if (!a.iconUri && b.iconUri) {
        return 1;
      }
      return 0;
    });

    return tokens;
  }, [allTokensQuery.data, ownedTokens]);

  const showMore = useCallback(() => {
    setLimit(limit + INITIAL_LIMIT);
  }, [limit]);

  const showLoadMoreButton = allTokensQuery.data?.length === limit;

  const noTokensFound =
    !isFetching && otherTokens.length === 0 && ownedTokens.length === 0;

  return (
    <Container
      flex="column"
      fullHeight
      style={{
        minHeight: "450px",
      }}
    >
      {/* search */}
      <Container px="md">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by token or address"
          autoFocus={!props.isMobile}
        />
      </Container>

      <Spacer y="xs" />

      {/* tokens for a chain */}
      {props.selectedTab?.type === "chain" && (
        <Container
          pb="md"
          px="md"
          expand
          gap="xxs"
          flex="column"
          style={{
            minHeight: "300px",
            maxHeight: props.isMobile ? "450px" : "none",
            overflowY: "auto",
            scrollbarWidth: "none",
            paddingBottom: spacing.md,
          }}
        >
          {isFetching &&
            new Array(20).fill(0).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: ok
              <TokenButtonSkeleton key={i} />
            ))}

          {!isFetching && ownedTokens.length > 0 && (
            <Container
              px="xs"
              py="xs"
              flex="row"
              gap="xs"
              center="y"
              color="secondaryText"
            >
              <WalletDotIcon size="14" />
              <Text
                size="sm"
                color="secondaryText"
                style={{
                  overflow: "unset",
                }}
              >
                Your Tokens
              </Text>
            </Container>
          )}

          {!isFetching &&
            ownedTokens.map((token) => (
              <TokenButton
                key={token.token_address}
                token={token}
                client={props.client}
                onSelect={props.onSelectToken}
                onInfoClick={(tokenAddress, chainId) =>
                  props.setShowTokenInfo({ tokenAddress, chainId })
                }
                isSelected={
                  !!props.selectedToken &&
                  props.selectedToken.tokenAddress.toLowerCase() ===
                    token.token_address.toLowerCase() &&
                  token.chain_id === props.selectedToken.chainId
                }
              />
            ))}

          {!isFetching && ownedTokens.length > 0 && (
            <Container
              px="xs"
              py="xs"
              flex="row"
              gap="xs"
              center="y"
              color="secondaryText"
              style={{
                marginTop: spacing.sm,
              }}
            >
              <CoinsIcon size="14" />
              <Text
                size="sm"
                color="secondaryText"
                style={{
                  overflow: "unset",
                }}
              >
                Other Tokens
              </Text>
            </Container>
          )}

          {!isFetching &&
            otherTokens.map((token) => (
              <TokenButton
                key={token.address}
                token={token}
                client={props.client}
                onSelect={props.onSelectToken}
                onInfoClick={(tokenAddress, chainId) =>
                  props.setShowTokenInfo({ tokenAddress, chainId })
                }
                isSelected={
                  !!props.selectedToken &&
                  props.selectedToken.tokenAddress.toLowerCase() ===
                    token.address.toLowerCase() &&
                  token.chainId === props.selectedToken.chainId
                }
              />
            ))}

          {showLoadMoreButton && (
            <Button
              variant="outline"
              fullWidth
              style={{
                borderRadius: radius.full,
              }}
              gap="xs"
              onClick={() => {
                showMore();
              }}
            >
              <PlusIcon width={iconSize.sm} height={iconSize.sm} />
              Load More
            </Button>
          )}

          {noTokensFound && (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text size="sm" color="secondaryText">
                No Tokens Found
              </Text>
            </div>
          )}
        </Container>
      )}
    </Container>
  );
}

function YourTokenSelectionScreen(props: {
  client: ThirdwebClient;
  selectedToken: TokenSelection | undefined;
  onSelectToken: (token: TokenSelection) => void;
  currency: SupportedFiatCurrency;
  onShowChainSelector: () => void;
  activeWalletInfo: ActiveWalletInfo | undefined;
  theme: SwapWidgetProps["theme"];
  connectOptions: SwapWidgetProps["connectOptions"];
  onConnectWallet: () => void;
  isMobile: boolean;
  setSelectedTab: (tab: SelectedTab) => void;
  selectedTab: SelectedTab;
  showTokenInfo: { tokenAddress: string; chainId: number } | undefined;
  setShowTokenInfo: (
    showTokenInfo: { tokenAddress: string; chainId: number } | undefined
  ) => void;
  chains: BridgeChain[];
}) {
  const [search, _setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const setSearch = useCallback((value: string) => {
    _setSearch(value);
  }, []);

  const allTokensQuery = useTokenBalances({
    client: props.client,
    limit: 100,
    page: 1,
    walletAddress: props.activeWalletInfo?.activeAccount.address,
    chainId: props.chains.map((chain) => chain.chainId), // TODO - this is not working!!
  });

  const chainMap = useMemo(() => {
    const map = new Map<number, BridgeChain>();
    for (const chain of props.chains) {
      map.set(chain.chainId, chain);
    }
    return map;
  }, [props.chains]);

  const filteredTokens = useMemo(() => {
    if (!allTokensQuery.data?.tokens) {
      return [];
    }

    let tokens = allTokensQuery.data.tokens;

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      tokens = tokens.filter((token) => {
        const chain = chainMap.get(token.chain_id);
        const chainName = chain?.name.toLowerCase() || "";
        return (
          token.symbol.toLowerCase().includes(searchLower) ||
          token.name.toLowerCase().includes(searchLower) ||
          token.token_address.toLowerCase().includes(searchLower) ||
          chainName.includes(searchLower)
        );
      });
    }

    // Sort by tokens with icons first
    tokens = tokens.sort((a, b) => {
      if (a.icon_uri && !b.icon_uri) {
        return -1;
      }
      if (!a.icon_uri && b.icon_uri) {
        return 1;
      }
      return 0;
    });

    return tokens;
  }, [allTokensQuery.data?.tokens, debouncedSearch, chainMap]);

  if (!props.activeWalletInfo) {
    return (
      <Container center="both" expand flex="column">
        <Button
          variant="primary"
          gap="xs"
          style={{
            paddingInline: spacing.lg,
          }}
          onClick={() => {
            props.onConnectWallet();
          }}
        >
          Connect Wallet
        </Button>
      </Container>
    );
  }

  const isFetching = allTokensQuery.isFetching;
  const noTokensFound = !isFetching && filteredTokens.length === 0;

  return (
    <Container
      flex="column"
      fullHeight
      style={{
        minHeight: "450px",
      }}
    >
      {/* search */}
      <Container px="md">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by token, chain, or address"
          autoFocus={!props.isMobile}
        />
      </Container>

      <Spacer y="xs" />

      {/* tokens list */}
      <Container
        pb="md"
        px="md"
        expand
        gap="xxs"
        flex="column"
        style={{
          minHeight: "300px",
          maxHeight: props.isMobile ? "450px" : "none",
          overflowY: "auto",
          scrollbarWidth: "none",
          paddingBottom: spacing.md,
        }}
      >
        {isFetching &&
          new Array(20).fill(0).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: ok
            <TokenButtonSkeleton key={i} />
          ))}

        {!isFetching &&
          filteredTokens.map((token) => (
            <YourTokenButton
              key={`${token.token_address}-${token.chain_id}`}
              token={token}
              chain={chainMap.get(token.chain_id)}
              client={props.client}
              onSelect={props.onSelectToken}
              onInfoClick={(tokenAddress, chainId) =>
                props.setShowTokenInfo({ tokenAddress, chainId })
              }
              isSelected={
                !!props.selectedToken &&
                props.selectedToken.tokenAddress.toLowerCase() ===
                  token.token_address.toLowerCase() &&
                token.chain_id === props.selectedToken.chainId
              }
            />
          ))}

        {noTokensFound && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text size="sm" color="secondaryText">
              {debouncedSearch ? "No Tokens Found" : "No tokens in wallet"}
            </Text>
          </div>
        )}
      </Container>
    </Container>
  );
}

const LeftContainer = /* @__PURE__ */ StyledDiv((_) => {
  const theme = useCustomTheme();
  return {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    ...noScrollBar,
    borderRight: `1px solid ${theme.colors.separatorLine}`,
    position: "relative",
  };
});

function ScreenHeader(props: {
  title: string;
  description: string | undefined;
}) {
  return (
    <Container px="md" pt="md+">
      <Text size="lg" weight={600} color="primaryText" trackingTight>
        {props.title}
      </Text>
      {props.description && (
        <>
          {" "}
          <Spacer y="3xs" />
          <Text size="sm" color="secondaryText">
            {props.description}
          </Text>
        </>
      )}
    </Container>
  );
}
