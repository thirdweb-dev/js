import { useMemo, useState } from "react";
import type { Token } from "../../../../../bridge/index.js";
import type { BridgeChain } from "../../../../../bridge/types/Chain.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { toTokens } from "../../../../../utils/units.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { CoinsIcon } from "../../ConnectWallet/icons/CoinsIcon.js";
import { WalletDotIcon } from "../../ConnectWallet/icons/WalletDotIcon.js";
import { Container, noScrollBar } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Img } from "../../components/Img.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Text } from "../../components/text.js";
import { StyledDiv } from "../../design-system/elements.js";
import { useDebouncedValue } from "../../hooks/useDebouncedValue.js";
import { useIsMobile } from "../../hooks/useisMobile.js";
import { SearchInput } from "./SearchInput.js";
import { SelectChainButton } from "./SelectChainButton.js";
import { SelectBridgeChain } from "./select-chain.js";
import type { ActiveWalletInfo, TokenSelection } from "./types.js";
import { useBridgeChains } from "./use-bridge-chains.js";
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
};

function findChain(chains: BridgeChain[], activeChainId: number | undefined) {
  if (!activeChainId) {
    return undefined;
  }
  return chains.find((chain) => chain.chainId === activeChainId);
}

/**
 * @internal
 */
export function SelectToken(props: SelectTokenUIProps) {
  const chainQuery = useBridgeChains(props.client);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const [limit, setLimit] = useState(1000);

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
    clientId: props.client.clientId,
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
              setLimit(limit * 2);
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
          />
        </Container>
      </Container>
    );
  }

  if (screen === "select-token") {
    return (
      <TokenSelectionScreen
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
        if ("balance" in props.token) {
          props.onSelect({
            tokenAddress: props.token.token_address,
            chainId: props.token.chain_id,
          });
        } else {
          props.onSelect({
            tokenAddress: props.token.address,
            chainId: props.token.chainId,
          });
        }
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
        <Container
          flex="row"
          style={{
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text size="md" color="primaryText" weight={500}>
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
              overflow: "hidden",
              textOverflow: "ellipsis",
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
    </Button>
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
}) {
  const noTokensFound =
    !props.isFetching &&
    props.otherTokens.length === 0 &&
    props.ownedTokens.length === 0;

  return (
    <Container fullHeight flex="column">
      <Container px="md" pt="md+">
        <Text size="lg" weight={600} color="primaryText" trackingTight>
          Select Token
        </Text>
        <Spacer y="3xs" />
        <Text
          size="xs"
          color="secondaryText"
          multiline
          style={{
            textWrap: "pretty",
            maxWidth: "70%",
          }}
        >
          Select a token from the list or search for a token by symbol or
          address
        </Text>
      </Container>

      {!props.selectedChain && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
          }}
        >
          <Spinner color="secondaryText" size="xl" />
        </div>
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
              minHeight: "400px",
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
                <WalletDotIcon size={iconSize.xs} />
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
                <CoinsIcon size={iconSize.xs} />
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
                variant="secondary"
                fullWidth
                onClick={() => {
                  props.showMore?.();
                }}
              >
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
                <Text size="md" color="secondaryText">
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
