import { DiscIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import type { Token } from "../../../../../bridge/index.js";
import type { BridgeChain } from "../../../../../bridge/types/Chain.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { toTokens } from "../../../../../utils/units.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { CoinsIcon } from "../../ConnectWallet/icons/CoinsIcon.js";
import { WalletDotIcon } from "../../ConnectWallet/icons/WalletDotIcon.js";
import { formatTokenAmount } from "../../ConnectWallet/screens/formatTokenBalance.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Img } from "../../components/Img.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Text } from "../../components/text.js";
import { DecimalRenderer } from "./common.js";
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

type SelectTokenUIProps = {
  onBack: () => void;
  client: ThirdwebClient;
  selectedToken: TokenSelection | undefined;
  setSelectedToken: (token: TokenSelection) => void;
  activeWalletInfo: ActiveWalletInfo | undefined;
};

function getDefaultSelectedChain(
  chains: BridgeChain[],
  activeChainId: number | undefined,
) {
  return chains.find((chain) => chain.chainId === (activeChainId || 1));
}

export function SelectToken(props: SelectTokenUIProps) {
  const chainQuery = useBridgeChains(props.client);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(1000);

  const [_selectedChain, setSelectedChain] = useState<BridgeChain | undefined>(
    undefined,
  );
  const selectedChain =
    _selectedChain ||
    (chainQuery.data
      ? getDefaultSelectedChain(
          chainQuery.data,
          props.selectedToken?.chainId ||
            props.activeWalletInfo?.activeChain.id,
        )
      : undefined);

  // all tokens
  const tokensQuery = useTokens({
    client: props.client,
    chainId: selectedChain?.chainId,
    search,
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
        token.symbol.toLowerCase().includes(search.toLowerCase()) ||
        token.name.toLowerCase().includes(search.toLowerCase()) ||
        token.token_address.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [ownedTokensQuery.data?.tokens, search]);

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

  const noTokensFound =
    !props.isFetching &&
    sortedOtherTokens.length === 0 &&
    props.ownedTokens.length === 0;

  if (screen === "select-token") {
    return (
      <Container>
        <Container px="lg" py="md">
          <ModalHeader onBack={props.onBack} title="Select Token" />
        </Container>
        <Line />

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
            <Container p="md">
              <SelectChainButton
                onClick={() => setScreen("select-chain")}
                selectedChain={props.selectedChain}
                client={props.client}
              />
            </Container>

            {/* search */}
            <Container px="md">
              <SearchInput
                value={props.search}
                onChange={props.setSearch}
                placeholder="Search by Token or Address"
              />
            </Container>

            <Spacer y="sm" />
            <Container px="md">
              <Container
                flex="column"
                style={{
                  height: "400px",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  paddingBottom: spacing.md,
                }}
              >
                {props.isFetching &&
                  new Array(20).fill(0).map(() => (
                    // biome-ignore lint/correctness/useJsxKeyInIterable: ok
                    <TokenButtonSkeleton />
                  ))}

                {!props.isFetching && sortedOwnedTokens.length > 0 && (
                  <Container
                    px="xs"
                    py="xs"
                    flex="row"
                    gap="xs"
                    center="y"
                    color="secondaryText"
                  >
                    <WalletDotIcon size={iconSize.sm} />
                    <Text
                      size="sm"
                      color="secondaryText"
                      weight={500}
                      style={{
                        overflow: "unset",
                      }}
                    >
                      Your Tokens
                    </Text>
                  </Container>
                )}

                {!props.isFetching &&
                  sortedOwnedTokens.map((token) => (
                    <TokenButton
                      key={token.token_address}
                      token={token}
                      client={props.client}
                      onSelect={props.setSelectedToken}
                      isSelected={
                        props.selectedToken?.tokenAddress ===
                        token.token_address
                      }
                    />
                  ))}

                {!props.isFetching && sortedOwnedTokens.length > 0 && (
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
                    <CoinsIcon size={iconSize.sm} />
                    <Text
                      size="sm"
                      color="secondaryText"
                      weight={500}
                      style={{
                        overflow: "unset",
                      }}
                    >
                      Other Tokens
                    </Text>
                  </Container>
                )}

                {!props.isFetching &&
                  sortedOtherTokens.map((token) => (
                    <TokenButton
                      key={token.address}
                      token={token}
                      client={props.client}
                      onSelect={props.setSelectedToken}
                      isSelected={
                        props.selectedToken?.tokenAddress === token.address
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
            </Container>
          </>
        )}
      </Container>
    );
  }

  if (screen === "select-chain") {
    return (
      <SelectBridgeChain
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
        padding: `${spacing.sm} ${spacing.sm}`,
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
        padding: `${spacing.sm} ${spacing.xs}`,
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
            <DiscIcon width={iconSize.lg} height={iconSize.lg} />
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
            <DecimalRenderer
              integerSize="md"
              fractionSize="sm"
              value={formatTokenAmount(
                BigInt(props.token.balance),
                props.token.decimals,
                3,
              )}
              color="primaryText"
              weight={500}
            />
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
            size="sm"
            color="secondaryText"
            weight={400}
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
              <Text size="sm" color="secondaryText" weight={400}>
                $
              </Text>
              <DecimalRenderer
                value={usdValue.toFixed(2)}
                color="secondaryText"
                weight={500}
                integerSize="sm"
                fractionSize="xs"
              />
            </Container>
          )}
        </Container>
      </div>
    </Button>
  );
}
