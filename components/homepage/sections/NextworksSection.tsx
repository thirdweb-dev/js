import { Flex } from "@chakra-ui/react";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { MultiChainSVG } from "components/product-pages/homepage/multi-chain-svg";
import { Heading } from "tw-components";

/**
 * Highlights supported chains/networks
 */
export function NetworksSection() {
  return (
    <HomepageSection id="networks" middleGradient>
      <Flex
        flexDir="column"
        py={{ base: 12, lg: 24 }}
        align="center"
        gap={{ base: 6, md: 8 }}
      >
        <Heading
          bgGradient="linear(to-l, #7EB6FF, #F0C5FF)"
          bgClip="text"
          as="h2"
          size="display.sm"
          textAlign="center"
        >
          Think multi-chain.
        </Heading>
        <Heading size="subtitle.lg" as="h3" textAlign="center">
          Continuously adding support for the most in-demand chains.
        </Heading>
        <MultiChainSVG />
      </Flex>
    </HomepageSection>
  );
}
