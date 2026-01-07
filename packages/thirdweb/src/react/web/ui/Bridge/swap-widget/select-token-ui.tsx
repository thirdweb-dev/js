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
import { formatCurrencyAmount } from "../../ConnectWallet/screens/formatTokenBalance.js";
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
import { SelectChainButton } from "./SelectChainButton.js";
import { SelectBridgeChain } from "./select-chain.js";
import type { ActiveWalletInfo, TokenSelection } from "./types.js";
import { useBridgeChainsWithFilters } from "./use-bridge-chains.js";
import {
  type TokenBalance,
  useTokenBalances,
  useTokens,
} from "./use-tokens.js";
import { tokenAmountFormatter } from "./utils.js";

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
};

function findChain(chains: BridgeChain[], activeChainId: number | undefined) {
  if (!activeChainId) {
    return undefined;
  }
  return chains.find((chain) => chain.chainId === activeChainId);
}

const INITIAL_LIMIT = 100;

/**
 * @internal
 */
export function SelectToken(props: SelectTokenUIProps) {
  const chainQuery = useBridgeChainsWithFilters({
    client: props.client,
    type: props.type,
    buyChainId: props.selections.buyChainId,
    sellChainId: props.selections.sellChainId,
  });

  const [search, _setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const [limit, setLimit] = useState(INITIAL_LIMIT);

  const setSearch = useCallback((search: string) => {
    _setSearch(search);
    setLimit(INITIAL_LIMIT);
  }, []);

  const [_selectedChain, setSelectedChain] = useState<BridgeChain | undefined>(
    undefined,
  );
  const selectedChain =
    _selectedChain ||
    (chainQuery.data
      ? findChain(chainQuery.data, props.selectedToken?.chainId) ||
        findChain(chainQuery.data, props.activeWalletInfo?.activeChain.id) ||
        findChain(chainQuery.data, 1)
      : undefined);

  // all tokens
  const tokensQuery = useTokens({
    client: props.client,
    chainId: selectedChain?.chainId,
    search: debouncedSearch,
    limit,
    offset: 0,
  });

  // owned tokens
  const ownedTokensQuery = useTokenBalances({
    client: props.client,
    chainId: selectedChain?.chainId,
    limit,
    page: 1,
    walletAddress: props.activeWalletInfo?.activeAccount.address,
  });

  const filteredOwnedTokens = useMemo(() => {
    return ownedTokensQuery.data?.tokens?.filter((token) => {
      return (
        token.symbol.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        token.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        token.token_address
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())
      );
    });
  }, [ownedTokensQuery.data?.tokens, debouncedSearch]);

  const isFetching = tokensQuery.isFetching || ownedTokensQuery.isFetching;

  return (
    <SelectTokenUI
      {...props}
      ownedTokens={filteredOwnedTokens || []}
      allTokens={tokensQuery.data || []}
      isFetching={isFetching}
      selectedChain={selectedChain}
      setSelectedChain={setSelectedChain}
      search={search}
      setSearch={setSearch}
      selectedToken={props.selectedToken}
      setSelectedToken={props.setSelectedToken}
      showMore={
        tokensQuery.data?.length === limit
          ? () => {
              setLimit(limit + INITIAL_LIMIT);
            }
          : undefined
      }
    />
  );
}

function SelectTokenUI(
  props: SelectTokenUIProps & {
    ownedTokens: TokenBalance[];
    allTokens: Token[];
    isFetching: boolean;
    selectedChain: BridgeChain | undefined;
    setSelectedChain: (chain: BridgeChain) => void;
    search: string;
    setSearch: (search: string) => void;
    selectedToken: TokenSelection | undefined;
    setSelectedToken: (token: TokenSelection) => void;
    showMore: (() => void) | undefined;
    type: "buy" | "sell";
    selections: {
      buyChainId: number | undefined;
      sellChainId: number | undefined;
    };
  },
) {
  const isMobile = useIsMobile();
  const [screen, setScreen] = useState<"select-chain" | "select-token">(
    "select-token",
  );

  // show tokens with icons first
  const sortedOwnedTokens = useMemo(() => {
    return props.ownedTokens.sort((a, b) => {
      if (a.icon_uri && !b.icon_uri) {
        return -1;
      }
      if (!a.icon_uri && b.icon_uri) {
        return 1;
      }
      return 0;
    });
  }, [props.ownedTokens]);

  const otherTokens = useMemo(() => {
    const ownedTokenSet = new Set(
      sortedOwnedTokens.map((t) =>
        `${t.token_address}-${t.chain_id}`.toLowerCase(),
      ),
    );
    return props.allTokens.filter(
      (token) =>
        !ownedTokenSet.has(`${token.address}-${token.chainId}`.toLowerCase()),
    );
  }, [props.allTokens, sortedOwnedTokens]);

  // show tokens with icons first
  const sortedOtherTokens = useMemo(() => {
    return otherTokens.sort((a, b) => {
      if (a.iconUri && !b.iconUri) {
        return -1;
      }
      if (!a.iconUri && b.iconUri) {
        return 1;
      }
      return 0;
    });
  }, [otherTokens]);

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
            onSelectChain={(chain) => {
              props.setSelectedChain(chain);
              setScreen("select-token");
            }}
            selectedChain={props.selectedChain}
          />
        </LeftContainer>
        <Container flex="column" relative scrollY>
          <TokenSelectionScreen
            onSelectToken={(token) => {
              props.setSelectedToken(token);
              props.onClose();
            }}
            isMobile={false}
            key={props.selectedChain?.chainId}
            selectedToken={props.selectedToken}
            isFetching={props.isFetching}
            ownedTokens={props.ownedTokens}
            otherTokens={sortedOtherTokens}
            showMore={props.showMore}
            selectedChain={props.selectedChain}
            onSelectChain={() => setScreen("select-chain")}
            client={props.client}
            search={props.search}
            setSearch={props.setSearch}
            currency={props.currency}
          />
        </Container>
      </Container>
    );
  }

  if (screen === "select-token") {
    return (
      <TokenSelectionScreen
        key={props.selectedChain?.chainId}
        onSelectToken={(token) => {
          props.setSelectedToken(token);
          props.onClose();
        }}
        selectedToken={props.selectedToken}
        isFetching={props.isFetching}
        ownedTokens={props.ownedTokens}
        otherTokens={sortedOtherTokens}
        showMore={props.showMore}
        selectedChain={props.selectedChain}
        isMobile={true}
        onSelectChain={() => setScreen("select-chain")}
        client={props.client}
        search={props.search}
        setSearch={props.setSearch}
        currency={props.currency}
      />
    );
  }

  if (screen === "select-chain") {
    return (
      <SelectBridgeChain
        isMobile={true}
        onBack={() => setScreen("select-token")}
        client={props.client}
        onSelectChain={(chain) => {
          props.setSelectedChain(chain);
          setScreen("select-token");
        }}
        selectedChain={props.selectedChain}
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
        padding: `${spacing.xs} ${spacing.xs}`,
        height: "70px",
      }}
    >
      <Skeleton height={`${iconSize.lg}px`} width={`${iconSize.lg}px`} />
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
        padding: `${spacing.xs} ${spacing.xs}`,
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
                  toTokens(BigInt(props.token.balance), props.token.decimals),
                ),
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
                      token.prices[props.currency] as number,
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
  selectedChain: BridgeChain | undefined;
  isMobile: boolean;
  onSelectChain: () => void;
  client: ThirdwebClient;
  search: string;
  setSearch: (search: string) => void;
  isFetching: boolean;
  ownedTokens: TokenBalance[];
  otherTokens: Token[];
  showMore: (() => void) | undefined;
  selectedToken: TokenSelection | undefined;
  onSelectToken: (token: TokenSelection) => void;
  currency: SupportedFiatCurrency;
}) {
  const [tokenInfoScreen, setTokenInfoScreen] = useState<{
    tokenAddress: string;
    chainId: number;
  } | null>(null);

  const noTokensFound =
    !props.isFetching &&
    props.otherTokens.length === 0 &&
    props.ownedTokens.length === 0;

  if (tokenInfoScreen) {
    return (
      <TokenInfoScreen
        tokenAddress={tokenInfoScreen.tokenAddress}
        chainId={tokenInfoScreen.chainId}
        client={props.client}
        onBack={() => setTokenInfoScreen(null)}
        currency={props.currency}
      />
    );
  }

  return (
    <Container fullHeight flex="column">
      <Container px="md" pt="md+">
        <Text size="lg" weight={600} color="primaryText" trackingTight>
          Select Token
        </Text>
        <Spacer y="3xs" />
        <Text
          size="sm"
          color="secondaryText"
          multiline
          style={{
            textWrap: "pretty",
          }}
        >
          Select a token from the list or use the search
        </Text>
      </Container>

      {!props.selectedChain && (
        <Container
          flex="column"
          center="both"
          expand
          style={{
            minHeight: "300px",
          }}
        >
          <Spinner color="secondaryText" size="lg" />
        </Container>
      )}

      {props.selectedChain && (
        <>
          {props.isMobile ? (
            <Container p="md">
              <SelectChainButton
                onClick={props.onSelectChain}
                selectedChain={props.selectedChain}
                client={props.client}
              />
            </Container>
          ) : (
            <Spacer y="md" />
          )}

          {/* search */}
          <Container px="md">
            <SearchInput
              value={props.search}
              onChange={props.setSearch}
              placeholder="Search by token or address"
              autoFocus={!props.isMobile}
            />
          </Container>

          <Spacer y="xs" />

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
            {props.isFetching &&
              new Array(20).fill(0).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: ok
                <TokenButtonSkeleton key={i} />
              ))}

            {!props.isFetching && props.ownedTokens.length > 0 && (
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

            {!props.isFetching &&
              props.ownedTokens.map((token) => (
                <TokenButton
                  key={token.token_address}
                  token={token}
                  client={props.client}
                  onSelect={props.onSelectToken}
                  onInfoClick={(tokenAddress, chainId) =>
                    setTokenInfoScreen({ tokenAddress, chainId })
                  }
                  isSelected={
                    !!props.selectedToken &&
                    props.selectedToken.tokenAddress.toLowerCase() ===
                      token.token_address.toLowerCase() &&
                    token.chain_id === props.selectedToken.chainId
                  }
                />
              ))}

            {!props.isFetching && props.ownedTokens.length > 0 && (
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

            {!props.isFetching &&
              props.otherTokens.map((token) => (
                <TokenButton
                  key={token.address}
                  token={token}
                  client={props.client}
                  onSelect={props.onSelectToken}
                  onInfoClick={(tokenAddress, chainId) =>
                    setTokenInfoScreen({ tokenAddress, chainId })
                  }
                  isSelected={
                    !!props.selectedToken &&
                    props.selectedToken.tokenAddress.toLowerCase() ===
                      token.address.toLowerCase() &&
                    token.chainId === props.selectedToken.chainId
                  }
                />
              ))}

            {props.showMore && (
              <Button
                variant="outline"
                fullWidth
                style={{
                  borderRadius: radius.full,
                }}
                gap="xs"
                onClick={() => {
                  props.showMore?.();
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
        </>
      )}
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
