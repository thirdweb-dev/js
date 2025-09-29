import { useMemo, useState } from "react";
import type { Chain as BridgeChain } from "../../../../../bridge/index.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Img } from "../../components/Img.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Text } from "../../components/text.js";
import { SearchInput } from "./SearchInput.js";
import { useBridgeChains } from "./use-bridge-chains.js";
import { cleanedChainName } from "./utils.js";

type SelectBuyTokenProps = {
  onBack: () => void;
  client: ThirdwebClient;
  onSelectChain: (chain: BridgeChain) => void;
  selectedChain: BridgeChain | undefined;
  isMobile: boolean;
};

/**
 * @internal
 */
export function SelectBridgeChain(props: SelectBuyTokenProps) {
  const chainQuery = useBridgeChains(props.client);

  return (
    <SelectBridgeChainUI
      {...props}
      isPending={chainQuery.isPending}
      onSelectChain={props.onSelectChain}
      chains={chainQuery.data ?? []}
    />
  );
}

/**
 * @internal
 */
export function SelectBridgeChainUI(
  props: SelectBuyTokenProps & {
    isPending: boolean;
    chains: BridgeChain[];
    onSelectChain: (chain: BridgeChain) => void;
    selectedChain: BridgeChain | undefined;
  },
) {
  const [search, setSearch] = useState("");
  const [initiallySelectedChain] = useState(props.selectedChain);

  // put the initially selected chain first
  const sortedChains = useMemo(() => {
    if (initiallySelectedChain) {
      return [
        initiallySelectedChain,
        ...props.chains.filter(
          (chain) => chain.chainId !== initiallySelectedChain.chainId,
        ),
      ];
    }
    return props.chains;
  }, [props.chains, initiallySelectedChain]);

  const filteredChains = sortedChains.filter((chain) => {
    return chain.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Container fullHeight flex="column">
      {props.isMobile && (
        <>
          <Container px="md" py="md+">
            <ModalHeader onBack={props.onBack} title="Select Chain" />
          </Container>
          <Line />
        </>
      )}

      <Spacer y="md" />

      <Container
        px="md"
        style={{
          paddingBottom: 0,
        }}
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search Chain"
        />
      </Container>
      <Spacer y="sm" />

      <Container
        expand
        px="md"
        gap={props.isMobile ? undefined : "xxs"}
        flex="column"
        style={{
          maxHeight: props.isMobile ? "400px" : "none",
          overflowY: "auto",
          scrollbarWidth: "none",
          paddingBottom: spacing.md,
        }}
      >
        {filteredChains.map((chain) => (
          <ChainButton
            key={chain.chainId}
            chain={chain}
            client={props.client}
            onClick={() => props.onSelectChain(chain)}
            isSelected={chain.chainId === props.selectedChain?.chainId}
            isMobile={props.isMobile}
          />
        ))}

        {props.isPending &&
          new Array(20).fill(0).map(() => (
            // biome-ignore lint/correctness/useJsxKeyInIterable: ok
            <ChainButtonSkeleton />
          ))}

        {filteredChains.length === 0 && !props.isPending && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text color="secondaryText" size="md" center multiline>
              No chains found for "{search}"
            </Text>
          </div>
        )}
      </Container>
    </Container>
  );
}

function ChainButtonSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: spacing.sm,
        padding: `${spacing.sm} ${spacing.sm}`,
      }}
    >
      <Skeleton height={`${iconSize.lg}px`} width={`${iconSize.lg}px`} />
      <Skeleton height={fontSize.md} width="160px" />
    </div>
  );
}

function ChainButton(props: {
  chain: BridgeChain;
  client: ThirdwebClient;
  onClick: () => void;
  isSelected: boolean;
  isMobile: boolean;
}) {
  return (
    <Button
      variant={props.isSelected ? "secondary" : "ghost-solid"}
      fullWidth
      style={{
        justifyContent: "flex-start",
        fontWeight: 500,
        fontSize: props.isMobile ? fontSize.md : fontSize.sm,
        border: "1px solid transparent",
        padding: !props.isMobile ? `${spacing.xs} ${spacing.xs}` : undefined,
      }}
      onClick={props.onClick}
      gap="sm"
    >
      <Img
        src={props.chain.icon}
        client={props.client}
        width={props.isMobile ? iconSize.lg : iconSize.md}
        height={props.isMobile ? iconSize.lg : iconSize.md}
        style={{
          borderRadius: radius.full,
        }}
      />
      {cleanedChainName(props.chain.name)}
    </Button>
  );
}
