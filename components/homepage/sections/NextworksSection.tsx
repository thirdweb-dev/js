import { Box, Flex } from "@chakra-ui/react";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { MultiChainSVG } from "components/product-pages/homepage/multi-chain-svg";
import { Heading, Text } from "tw-components";

/**
 * Highlights supported chains/networks
 */
export const NetworksSection = () => {
  return (
    <HomepageSection id="networks" my={{ base: 14, lg: 40 }}>
      <Flex flexDir="column" align="center">
        <Heading
          as="h2"
          fontSize={{ base: "32px", lg: "48px" }}
          letterSpacing="-0.04em"
          fontWeight={700}
          mb={4}
        >
          Think multi-chain.
        </Heading>
        <Text fontSize="20px" mb={12} textAlign="center" color="whiteAlpha.700">
          Continuously adding support for the most in-demand chains.
        </Text>

        <Box maxW="850px" width="100%">
          <MultiChainSVG />
        </Box>
      </Flex>
    </HomepageSection>
  );
};
