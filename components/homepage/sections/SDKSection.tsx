import { Flex } from "@chakra-ui/react";
import { CodeSelector } from "components/product-pages/homepage/CodeSelector";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { Heading } from "tw-components";

/**
 * Highlights JavaScript, React, Python and Go SDKs
 */
export function SDKSection() {
  return (
    <HomepageSection id="sdks" bottomPattern middleGradient>
      <Flex
        flexDir="column"
        pt={{ base: 12, lg: 24 }}
        align="center"
        gap={{ base: 6, md: 8 }}
      >
        <Heading as="h2" size="display.sm" textAlign="center">
          Connect to web3 easily.
        </Heading>
        <Heading
          as="h3"
          size="subtitle.lg"
          textAlign="center"
          maxW="container.md"
        >
          Powerful SDKs to integrate decentralized technologies into your apps,
          backends, and games.
        </Heading>
        <CodeSelector />
      </Flex>
    </HomepageSection>
  );
}
