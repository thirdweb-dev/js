"use client";
import type { ChainMetadata } from "thirdweb/chains";
import { BuyAndSwapEmbed } from "@/components/blocks/BuyAndSwapEmbed";
import { GridPatternEmbedContainer } from "@/components/blocks/grid-pattern-embed-container";
import { defineDashboardChain } from "@/lib/defineDashboardChain";

export function BuyFundsSection(props: { chain: ChainMetadata }) {
  return (
    <GridPatternEmbedContainer>
      <BuyAndSwapEmbed
        // eslint-disable-next-line no-restricted-syntax
        chain={defineDashboardChain(props.chain.chainId, props.chain)}
        buyAmount={undefined}
        tokenAddress={undefined}
        pageType="chain"
      />
    </GridPatternEmbedContainer>
  );
}
