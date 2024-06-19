import { Container, DarkMode, Flex } from "@chakra-ui/react";
import { Heading } from "tw-components";
import { ContextAIBotButton } from "./context-ai-button";

export const NeedSomeHelp = () => {
  return (
    <Flex
      bgGradient="linear(to-r, #8052e2, #74049d)"
      pt={{ base: 12, md: 24 }}
      pb={{ base: 8, md: 12 }}
      mt={{ base: -6, md: -12 }}
    >
      <Container maxW={{ base: "auto", md: "600px" }}>
        <Flex flexDir="column" gap={6}>
          <DarkMode>
            <Heading size="title.lg" textAlign="center">
              Hi there, need some help?
            </Heading>
          </DarkMode>

          <ContextAIBotButton />
        </Flex>
      </Container>
    </Flex>
  );
};
