import { Flex } from "@chakra-ui/react";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { ExamplesSection } from "components/product-pages/homepage/examples/ExamplesSection";
import { Heading } from "tw-components";

/**
 * Simple Wrapper for the ExamplesSection for HomePage
 */
export function ExamplesSection_HomePage() {
  return (
    <HomepageSection id="examples" middleGradient>
      <Flex
        flexDir="column"
        py={{ base: 12, lg: 24 }}
        align="center"
        gap={{ base: 12, lg: 24 }}
      >
        <Heading
          as="h2"
          bgGradient="linear(to-r, #907EFF, #C5D8FF)"
          bgClip="text"
          size="display.md"
          textAlign="center"
        >
          Build anything.
        </Heading>
        <ExamplesSection />
      </Flex>
    </HomepageSection>
  );
}
