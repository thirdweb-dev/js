"use client";
import { NATIVE_TOKEN_ADDRESS } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { BuyAndSwapEmbed } from "@/components/blocks/BuyAndSwapEmbed";
import { GridPatternEmbedContainer } from "@/components/blocks/grid-pattern-embed-container";

export function BuyFundsSection(props: { chain: ChainMetadata }) {
  return (
    <GridPatternEmbedContainer>
      <BuyAndSwapEmbed
        swapTab={{
          sellToken: {
            chainId: props.chain.chainId,
            tokenAddress: NATIVE_TOKEN_ADDRESS,
          },
          buyToken: undefined,
        }}
        buyTab={{
          buyToken: {
            chainId: props.chain.chainId,
            tokenAddress: NATIVE_TOKEN_ADDRESS,
          },
        }}
        pageType="chain"
      />
    </GridPatternEmbedContainer>
  );
}
