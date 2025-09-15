import { CheckIcon, DiscIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import type { Token } from "../../../../../bridge/index.js";
import type { BridgeChain } from "../../../../../bridge/types/Chain.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { useActiveWalletChain } from "../../../../core/hooks/wallets/useActiveWalletChain.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Img } from "../../components/Img.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Text } from "../../components/text.js";
import { SearchInput } from "./SearchInput.js";
import { SelectChainButton } from "./SelectChainButton.js";
import { SelectBridgeChain } from "./select-chain.js";
import type { TokenSelection } from "./types.js";
import { useBridgeChains } from "./use-bridge-chains.js";
import { useTokens } from "./use-tokens.js";

type SelectBuyTokenProps = {
  onBack: () => void;
  client: ThirdwebClient;
  selectedToken: TokenSelection | undefined;
  setSelectedToken: (token: TokenSelection) => void;
};

function getDefaultSelectedChain(
  chains: BridgeChain[],
  activeChainId: number | undefined,
) {
  return chains.find((chain) => chain.chainId === (activeChainId || 1));
}

export function SelectBuyToken(props: SelectBuyTokenProps) {
  const activeChain = useActiveWalletChain();
  const chainQuery = useBridgeChains(props.client);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(1000);

  const [selectedChain, setSelectedChain] = useState<BridgeChain | undefined>(
    () => {
      if (!chainQuery.data) {
        return undefined;
      }
      return getDefaultSelectedChain(
        chainQuery.data,
        props.selectedToken?.chainId || activeChain?.id,
      );
    },
  );

  useEffect(() => {
    if (chainQuery.data && !selectedChain) {
      setSelectedChain(
        getDefaultSelectedChain(
          chainQuery.data,
          props.selectedToken?.chainId || activeChain?.id,
        ),
      );
    }
  }, [
    chainQuery.data,
    selectedChain,
    activeChain?.id,
    props.selectedToken?.chainId,
  ]);

  const tokensQuery = useTokens({
    client: props.client,
    chainId: selectedChain?.chainId,
    search,
    limit,
    offset: 0,
  });

  return (
    <SelectBuyTokenUI
      {...props}
      tokens={tokensQuery.data || []}
      isPending={tokensQuery.isFetching}
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

export function SelectBuyTokenUI(
  props: SelectBuyTokenProps & {
    tokens: Token[];
    isPending: boolean;
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
                  maxHeight: "400px",
                  minHeight: "300px",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  borderRadius: radius.lg,
                  paddingBottom: spacing.md,
                }}
              >
                {props.tokens.map((token) => (
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

                {props.isPending &&
                  new Array(20).fill(0).map(() => (
                    // biome-ignore lint/correctness/useJsxKeyInIterable: ok
                    <TokenButtonSkeleton />
                  ))}

                {props.tokens.length === 0 && !props.isPending && (
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
  token: Token;
  client: ThirdwebClient;
  onSelect: (tokenWithPrices: TokenSelection) => void;
  isSelected: boolean;
}) {
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
          tokenAddress: props.token.address,
          chainId: props.token.chainId,
        });
      }}
    >
      <Img
        src={props.token.iconUri || ""}
        client={props.client}
        width={iconSize.lg}
        height={iconSize.lg}
        fallback={
          <Container color="secondaryText">
            <DiscIcon width={iconSize.lg} height={iconSize.lg} />
          </Container>
        }
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <div>{props.token.symbol}</div>
        <Text size="sm" color="secondaryText" weight={400}>
          {props.token.name}
        </Text>
      </div>

      {props.isSelected && (
        <CheckIcon
          width={iconSize.md}
          height={iconSize.md}
          style={{
            marginLeft: "auto",
          }}
        />
      )}
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
