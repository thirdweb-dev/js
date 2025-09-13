import { useState } from "react";
import type { Chain as BridgeChain } from "../../../../../bridge/index.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import {
  fontSize,
  iconSize,
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
};

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

export function SelectBridgeChainUI(
  props: SelectBuyTokenProps & {
    isPending: boolean;
    chains: BridgeChain[];
    onSelectChain: (chain: BridgeChain) => void;
    selectedChain: BridgeChain | undefined;
  },
) {
  const [search, setSearch] = useState("");
  const filteredChains = props.chains.filter((chain) => {
    return chain.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <Container px="lg" py="md">
        <ModalHeader onBack={props.onBack} title="Select Chain" />
      </Container>
      <Line />

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
        px="md"
        flex="column"
        style={{
          height: "400px",
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
    </div>
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

export function ChainButton(props: {
  chain: BridgeChain;
  client: ThirdwebClient;
  onClick: () => void;
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
      }}
      gap="sm"
      onClick={props.onClick}
    >
      <Img
        src={props.chain.icon}
        client={props.client}
        width={iconSize.lg}
        height={iconSize.lg}
      />
      {cleanedChainName(props.chain.name)}
    </Button>
  );
}
