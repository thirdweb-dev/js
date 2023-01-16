import { ButtonGroup, Flex, useColorMode } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { Heading, LinkButton, Text, TrackedLink } from "tw-components";

export const ReleaseUpsellCard: React.FC = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      borderRadius="3xl"
      border="1px solid rgba(255, 255, 255, 0.1);"
      p={{ base: 8, md: 10 }}
      gap={12}
      bg="linear-gradient(158.84deg, rgba(255, 255, 255, 0.05) 13.95%, rgba(255, 255, 255, 0) 38.68%)"
      bgColor={colorMode === "dark" ? "transparent" : "backgroundHighlight"}
    >
      <Flex flexDir="column" gap={6}>
        <Heading>Want your contract featured here?</Heading>
        <Text>
          Publishing your contract is the best way to share it with the world.
        </Text>
        <Flex gap={2}>
          <ChakraNextImage
            boxSize={6}
            src={require("/public/assets/product-pages/release/hero-icon-3.png")}
            alt=""
          />
          <Text>
            <Text fontWeight="bold">
              Get your protocol in front of our community of builders.
            </Text>
            Over 50,000 web3 devs visit this page every month. Your contract
            will get deploys.
          </Text>
        </Flex>
        <Flex gap={2}>
          <ChakraNextImage
            boxSize={6}
            src={require("/public/assets/product-pages/release/hero-icon-1.png")}
            alt=""
          />

          <Text>
            <Text fontWeight="bold">Save development time.</Text>
            Eliminate the need for building tedious middleware and focus on your
            protocol. Our published contracts provide access to thirdweb tools
            that makes it easy for developers to create applications on top of.
          </Text>
        </Flex>
        <ButtonGroup size="size" spacing={4}>
          <LinkButton
            as={TrackedLink}
            {...{
              category: "release_upsell",
              label: "contact_us",
            }}
            bg="accent.900"
            color="accent.100"
            borderColor="accent.900"
            borderWidth="1px"
            href="https://form.typeform.com/to/FAwehBFl"
            isExternal
            noIcon
            _hover={{
              bg: "transparent",
              color: "accent.900",
            }}
          >
            Submit Contract
          </LinkButton>
          <LinkButton
            as={TrackedLink}
            {...{
              category: "release_upsell",
              label: "learn_more",
            }}
            variant="ghost"
            href="https://portal.thirdweb.com/release"
            isExternal
            noIcon
            borderColor="borderColor"
            borderWidth="1px"
          >
            Learn More
          </LinkButton>
        </ButtonGroup>
      </Flex>
      <ChakraNextImage
        display={{ base: "none", md: colorMode === "dark" ? "block" : "none" }}
        w="40%"
        src={require("public/assets/landingpage/explore-featured.png")}
        alt=""
      />
    </Flex>
  );
};
