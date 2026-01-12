import { useMemo, useState } from "react";
import type { Chain as BridgeChain } from "../../../../../bridge/index.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { WalletDotIcon } from "../../ConnectWallet/icons/WalletDotIcon.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Img } from "../../components/Img.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Text } from "../../components/text.js";
import { SearchInput } from "./SearchInput.js";
import type { SelectedTab } from "./types.js";
import { useBridgeChainsWithFilters } from "./use-bridge-chains.js";
import { cleanedChainName } from "./utils.js";

type SelectBuyTokenProps = {
  onBack: () => void;
  client: ThirdwebClient;
  onSelectTab: (tab: SelectedTab) => void;
  selectedTab: SelectedTab;
  isMobile: boolean;
  type: "buy" | "sell";
  selections: {
    buyChainId: number | undefined;
    sellChainId: number | undefined;
  };
};

/**
 * @internal
 */
export function SelectBridgeChain(props: SelectBuyTokenProps) {
  const chainQuery = useBridgeChainsWithFilters({
    client: props.client,
    type: props.type,
    buyChainId: props.selections.buyChainId,
    sellChainId: props.selections.sellChainId,
  });

  return (
    <SelectBridgeChainUI
      {...props}
      isPending={chainQuery.isPending}
      onSelectTab={props.onSelectTab}
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
    onSelectTab: (tab: SelectedTab) => void;
    selectedTab: SelectedTab;
  },
) {
  const [search, setSearch] = useState("");
  const [initiallySelectedChain] = useState(
    props.selectedTab?.type === "chain" ? props.selectedTab.chain : undefined,
  );

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
    <Container
      fullHeight
      flex="column"
      style={{
        minHeight: "450px",
      }}
    >
      {props.isMobile && (
        <>
          <Container px="md" py="md+">
            <ModalHeader onBack={props.onBack} title="Select Chain" />
          </Container>
          <Line />
        </>
      )}

      <Spacer y="md" />

      {/* search */}
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
      <Spacer y="xs" />

      {/* scroll container */}
      <Container
        flex="column"
        expand
        style={{
          maxHeight: props.isMobile ? "400px" : "none",
          overflowY: "auto",
          scrollbarWidth: "none",
          paddingBottom: spacing.md,
        }}
      >
        {/* chains label */}
        {!props.isMobile && (
          <>
            {/* your tokens button */}
            <Container px="md">
              <YourTokensButton
                onClick={() => props.onSelectTab({ type: "your-tokens" })}
                isSelected={props.selectedTab?.type === "your-tokens"}
              />
            </Container>

            <Spacer y="sm" />

            <Container px="lg">
              <Text size="sm" color="secondaryText">
                Chains
              </Text>
            </Container>

            <Spacer y="xs" />
          </>
        )}

        {/* chains list */}
        <Container expand px="md" gap="xxs" flex="column">
          {filteredChains.map((chain) => (
            <ChainButton
              key={chain.chainId}
              chain={chain}
              client={props.client}
              onClick={() => props.onSelectTab({ type: "chain", chain })}
              isSelected={
                props.selectedTab?.type === "chain" &&
                chain.chainId === props.selectedTab.chain.chainId
              }
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
              <Text color="secondaryText" size="sm" center multiline>
                No chains found
              </Text>
            </div>
          )}
        </Container>
      </Container>
    </Container>
  );
}

function ChainButtonSkeleton() {
  const iconSizeValue = iconSize.md;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: spacing.sm,
        padding: `${spacing.xs} ${spacing.xs}`,
      }}
    >
      <Skeleton
        height={`${iconSizeValue}px`}
        width={`${iconSizeValue}px`}
        style={{ borderRadius: radius.full }}
      />
      <Skeleton height={fontSize.sm} width="160px" />
    </div>
  );
}

function ChainButton(props: {
  chain: BridgeChain;
  client: ThirdwebClient;
  onClick: () => void;
  isSelected: boolean;
}) {
  const theme = useCustomTheme();
  const iconSizeValue = iconSize.md;
  return (
    <Button
      variant={props.isSelected ? "secondary" : "ghost-solid"}
      fullWidth
      style={{
        justifyContent: "flex-start",
        fontWeight: 500,
        fontSize: fontSize.sm,
        border: "1px solid transparent",
        padding: `${spacing.xs} ${spacing.xs}`,
      }}
      onClick={props.onClick}
      gap="sm"
    >
      <Img
        src={props.chain.icon || ""}
        client={props.client}
        width={iconSizeValue}
        height={iconSizeValue}
        style={{
          borderRadius: radius.full,
        }}
        fallback={
          <Container color="secondaryText">
            <Container
              style={{
                background: `linear-gradient(45deg, white, ${theme.colors.accentText})`,
                borderRadius: radius.full,
                width: `${iconSizeValue}px`,
                height: `${iconSizeValue}px`,
              }}
            />
          </Container>
        }
      />
      {cleanedChainName(props.chain.name)}
    </Button>
  );
}

function YourTokensButton(props: { onClick: () => void; isSelected: boolean }) {
  const iconSizeValue = iconSize.md;
  return (
    <Button
      variant={props.isSelected ? "secondary" : "ghost-solid"}
      fullWidth
      style={{
        justifyContent: "flex-start",
        fontWeight: 500,
        fontSize: fontSize.sm,
        border: "1px solid transparent",
        padding: `${spacing.xs} ${spacing.xs}`,
      }}
      onClick={props.onClick}
      gap="sm"
    >
      <Container
        flex="column"
        center="both"
        color="secondaryText"
        style={{
          width: `${iconSizeValue}px`,
          height: `${iconSizeValue}px`,
        }}
      >
        <WalletDotIcon
          style={{
            width: "85%",
            height: "85%",
            transform: "translateX(7.5%)", // optical alignment
          }}
        />
      </Container>
      Your Tokens
    </Button>
  );
}
