import { Box, Container, Flex } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { Heading, LinkButton } from "tw-components";

export const CodeExamples: React.FC = () => {
  const { trackEvent } = useTrack();

  return (
    <Flex id="developers" direction="column" bg="backgroundDark" pb="-100px">
      <Container
        maxW="container.page"
        position="relative"
        py={["75px", "75px", "150px"]}
      >
        <Flex w="100%" align="center" direction="column" position="relative">
          <Flex
            maxW="container.lg"
            px={0}
            alignItems="center"
            direction="column"
          >
            <Heading
              w="100%"
              as="h2"
              mb="16px"
              textAlign="center"
              size="display.md"
              color="#F2FBFF"
            >
              Powerful SDKs for all your needs
            </Heading>
            <Heading
              color="rgba(242, 251, 255, 0.8)"
              textAlign="center"
              size="subtitle.lg"
            >
              Use our robust SDKs to take things into your own hands
              <Box display={{ base: "none", md: "block" }} /> and easily
              implement web3 features directly into your projects.
            </Heading>

            <LinkButton
              noIcon
              borderRadius="full"
              href="https://portal.thirdweb.com/learn"
              bgGradient="linear(to-r, #CC25B3 0%, #418DFF 101.52%)"
              color="white"
              _hover={{ opacity: 0.8 }}
              _focus={{ bgColor: "purple.600" }}
              _active={{ bgColor: "purple.600" }}
              mt={12}
              px={12}
              size="lg"
              onClick={() =>
                trackEvent({
                  category: "home",
                  action: "click",
                  label: "explore-docs",
                })
              }
            >
              Explore documentation & guides
            </LinkButton>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
};
