import { Flex } from "@chakra-ui/react";
import {
  CodeSelector,
  CodeSelectorProps,
} from "components/product-pages/homepage/CodeSelector";
import { Heading } from "tw-components";

interface SDKSectionProps {
  title?: string;
  description?: string;
  codeSelectorProps?: CodeSelectorProps;
}

export const SDKSection: React.FC<SDKSectionProps> = ({
  title = "Connect to web3 easily.",
  description = "Powerful SDKs to integrate decentralized technologies into your apps, backends, and games.",
  codeSelectorProps,
}) => {
  return (
    <Flex flexDir="column" align="center" gap={{ base: 6, md: 8 }}>
      <Heading as="h2" size="display.sm" textAlign="center">
        {title}
      </Heading>
      <Heading
        as="h3"
        size="subtitle.lg"
        textAlign="center"
        maxW="container.md"
      >
        {description}
      </Heading>
      <CodeSelector {...codeSelectorProps} />
    </Flex>
  );
};
