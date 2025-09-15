import {
  Cross1Icon,
  DiscIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import type { BridgeChain } from "../../../../../bridge/types/Chain.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { toTokens } from "../../../../../utils/units.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
  type Theme,
} from "../../../../core/design-system/index.js";
import { ConnectButton } from "../../ConnectWallet/ConnectButton.js";
import { formatTokenAmount } from "../../ConnectWallet/screens/formatTokenBalance.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Input } from "../../components/formElements.js";
import { Img } from "../../components/Img.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Text } from "../../components/text.js";
import { SelectChainButton } from "./SelectChainButton.js";
import { SelectBridgeChain } from "./select-chain.js";
import type { ActiveWalletInfo, TokenSelection } from "./types.js";
import { useBridgeChains } from "./use-bridge-chains.js";
import { type TokenBalance, useTokenBalances } from "./use-tokens.js";

type SelectSellTokenProps = {
  onBack: () => void;
  client: ThirdwebClient;
  selectedToken: TokenSelection | undefined;
  setSelectedToken: (token: TokenSelection) => void;
};

function getDefaultSelectedChain(
  chains: BridgeChain[],
  chainId: number | undefined,
) {
  return chains.find((chain) => chain.chainId === (chainId || 1));
}

export function SelectSellToken(
  props: SelectSellTokenProps & {
    activeWalletInfo: ActiveWalletInfo | undefined;
    theme: Theme | "light" | "dark";
  },
) {
  if (props.activeWalletInfo) {
    return (
      <SelectSellTokenConnected
        {...props}
        activeWalletInfo={props.activeWalletInfo}
      />
    );
  }
  return (
    <SelectSellTokenDisconnectedUI
      onBack={props.onBack}
      client={props.client}
      theme={props.theme}
    />
  );
}

export function SelectSellTokenDisconnectedUI(props: {
  onBack: () => void;
  client: ThirdwebClient;
  theme: Theme | "light" | "dark";
}) {
  return (
    <Container>
      <Container px="lg" py="md">
        <ModalHeader onBack={props.onBack} title="Select Token" />
      </Container>
      <Line />

      <Container
        flex="column"
        center="both"
        gap="lg"
        style={{
          height: "300px",
        }}
      >
        <Container
          p="sm"
          flex="row"
          center="both"
          bg="tertiaryBg"
          borderColor="borderColor"
          color="secondaryText"
          style={{
            borderRadius: radius.full,
            borderWidth: 1,
            borderStyle: "solid",
          }}
        >
          <Cross1Icon width={iconSize.md} height={iconSize.md} />
        </Container>
        <Container flex="column" gap="xs">
          <Text size="md" color="primaryText" weight={500} center>
            Wallet is not connected
          </Text>
          <Text center size="sm">
            Connect your wallet to view your tokens
          </Text>
        </Container>
      </Container>
      <Container p="md">
        <ConnectButton
          client={props.client}
          connectButton={{ style: { width: "100%" }, label: "Connect Wallet" }}
          theme={props.theme}
        />
      </Container>
    </Container>
  );
}

function SelectSellTokenConnected(
  props: SelectSellTokenProps & {
    activeWalletInfo: ActiveWalletInfo;
  },
) {
  const chainQuery = useBridgeChains(props.client);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50);

  const [selectedChain, setSelectedChain] = useState<BridgeChain | undefined>(
    () => {
      if (!chainQuery.data) {
        return undefined;
      }
      return getDefaultSelectedChain(
        chainQuery.data,
        props.selectedToken?.chainId || props.activeWalletInfo.activeChain.id,
      );
    },
  );

  useEffect(() => {
    if (chainQuery.data && !selectedChain) {
      setSelectedChain(
        getDefaultSelectedChain(
          chainQuery.data,
          props.selectedToken?.chainId || props.activeWalletInfo.activeChain.id,
        ),
      );
    }
  }, [
    chainQuery.data,
    selectedChain,
    props.activeWalletInfo.activeChain.id,
    props.selectedToken?.chainId,
  ]);

  // TODO - useTokenBalances doesn't support all the bridge chains, we need to add a fallback to show all the tokens and not just owned tokens when a chain is not supported
  const tokensQuery = useTokenBalances({
    clientId: props.client.clientId,
    chainId: selectedChain?.chainId,
    limit,
    page: 1,
    walletAddress: props.activeWalletInfo.activeAccount.address,
  });

  return (
    <SelectSellTokenConnectedUI
      {...props}
      tokens={tokensQuery.data?.tokens || []}
      isPending={tokensQuery.isFetching}
      selectedChain={selectedChain}
      setSelectedChain={setSelectedChain}
      search={search}
      setSearch={setSearch}
      selectedToken={props.selectedToken}
      setSelectedToken={props.setSelectedToken}
      showAll={
        tokensQuery.data?.pagination.hasMore
          ? () => {
              setLimit(tokensQuery.data.pagination.totalCount);
            }
          : undefined
      }
    />
  );
}

export function SelectSellTokenConnectedUI(
  props: SelectSellTokenProps & {
    activeWalletInfo: ActiveWalletInfo;
    tokens: TokenBalance[];
    isPending: boolean;
    selectedChain: BridgeChain | undefined;
    setSelectedChain: (chain: BridgeChain) => void;
    search: string;
    setSearch: (search: string) => void;
    selectedToken: TokenSelection | undefined;
    setSelectedToken: (token: TokenSelection) => void;
    showAll: (() => void) | undefined;
  },
) {
  const [screen, setScreen] = useState<"select-chain" | "select-token">(
    "select-token",
  );

  const filteredTokens = props.tokens.filter((token) => {
    return (
      token.symbol.toLowerCase().includes(props.search.toLowerCase()) ||
      token.name.toLowerCase().includes(props.search.toLowerCase()) ||
      token.token_address.toLowerCase().includes(props.search.toLowerCase())
    );
  });

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
              <div
                style={{
                  position: "relative",
                }}
              >
                <Container color="secondaryText">
                  <MagnifyingGlassIcon
                    width={iconSize.md}
                    height={iconSize.md}
                    style={{
                      position: "absolute",
                      left: spacing.sm,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                </Container>

                <Input
                  variant="outline"
                  placeholder="Search by Token or Address"
                  value={props.search}
                  style={{
                    paddingLeft: "44px",
                  }}
                  onChange={(e) => props.setSearch(e.target.value)}
                />
              </div>
            </Container>
            <Spacer y="sm" />
            <Container px="md">
              <Container
                flex="column"
                style={{
                  height: "400px",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  borderRadius: radius.lg,
                  paddingBottom: spacing.md,
                }}
              >
                {filteredTokens.map((token) => {
                  return (
                    <TokenButton
                      key={token.token_address}
                      token={token}
                      client={props.client}
                      onSelect={props.setSelectedToken}
                      isSelected={
                        props.selectedToken
                          ? props.selectedToken.tokenAddress?.toLowerCase() ===
                            token.token_address.toLowerCase()
                          : false
                      }
                    />
                  );
                })}

                {props.showAll && (
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => {
                      props.showAll?.();
                    }}
                  >
                    Show All
                  </Button>
                )}

                {props.isPending &&
                  new Array(20).fill(0).map(() => (
                    // biome-ignore lint/correctness/useJsxKeyInIterable: ok
                    <TokenButtonSkeleton />
                  ))}

                {filteredTokens.length === 0 && !props.isPending && (
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

function TokenButton(props: {
  token: TokenBalance;
  client: ThirdwebClient;
  onSelect: (tokenWithPrices: TokenSelection) => void;
  isSelected: boolean;
}) {
  const tokenBalanceInUnits = toTokens(
    BigInt(props.token.balance),
    props.token.decimals,
  );
  const usdValue =
    props.token.price_data.price_usd * Number(tokenBalanceInUnits);

  return (
    <Button
      variant={props.isSelected ? "secondary" : "ghost-solid"}
      fullWidth
      style={{
        justifyContent: "flex-start",
        fontWeight: 500,
        fontSize: fontSize.md,
        border: "1px solid transparent",
        padding: `${spacing.sm} ${spacing.sm}`,
        textAlign: "left",
        lineHeight: "1.5",
        height: "70px",
      }}
      gap="sm"
      onClick={async () => {
        props.onSelect({
          tokenAddress: props.token.token_address,
          chainId: props.token.chain_id,
        });
      }}
    >
      <Img
        src={props.token.icon_uri || ""}
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
          gap: "2px",
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
          <div>
            {formatTokenAmount(
              BigInt(props.token.balance),
              props.token.decimals,
              3,
            )}
          </div>
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
          <Text size="sm" color="secondaryText" weight={400}>
            {usdValue < 0.01 ? "~$0.00" : `$${usdValue.toFixed(2)}`}
          </Text>
        </Container>
      </div>
    </Button>
  );
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
