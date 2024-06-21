import { Flex } from "@chakra-ui/react";
import {
  CodeSelector,
  type CodeSelectorProps,
} from "components/product-pages/homepage/CodeSelector";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { Heading } from "tw-components";
import { Aurora } from "../Aurora";

interface SDKSectionProps {
  title?: string;
  description?: string;
  codeSelectorProps?: CodeSelectorProps;
}

export const SDKSection: React.FC<SDKSectionProps> = ({
  title = "In any language.",
  description = "",
  codeSelectorProps,
}) => {
  return (
    <HomepageSection id="sdks" mt={20}>
      <Aurora
        pos={{ left: "50%", top: "50%" }}
        size={{ width: "1500px", height: "1500px" }}
        color={"hsl(280deg 78% 30% / 30%)"}
      />
      <Flex flexDir="column" align="center" as="section">
        <Heading
          as="h2"
          size="display.sm"
          textAlign="center"
          mb={4}
          fontSize={{ base: "32px", md: "48px" }}
          fontWeight={700}
          letterSpacing="-0.04em"
        >
          {title}
        </Heading>
        <Heading
          as="h3"
          size="subtitle.lg"
          textAlign="center"
          maxW={"container.md"}
          color="whiteAlpha.700"
          fontWeight={400}
          fontSize="20px"
          mb={8}
        >
          {description}
        </Heading>
        <CodeSelector {...codeSelectorProps} />
      </Flex>
    </HomepageSection>
  );
};
