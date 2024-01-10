import { ButtonGroup, Flex, useColorMode } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { Heading, LinkButton, Text, TrackedLink } from "tw-components";

export const PublishUpsellCard: React.FC = () => {
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
        <Heading>Accelerate your protocol&apos;s growth.</Heading>
        <Text>
          Publishing your contract is the best way to get your contracts in
          front of our 70k+ community of web3 developers.
        </Text>
        <Flex gap={2}>
          <ChakraNextImage
            boxSize={6}
            src={require("/public/assets/product-pages/publish/hero-icon-1.png")}
            alt=""
          />

          <Text>
            <Text fontWeight="bold" as="span">
              Save development time.{" "}
            </Text>
            Focus on protocol development and save time by not having to build
            middleware layer yourself.
          </Text>
        </Flex>
        <Flex gap={2}>
          <ChakraNextImage
            boxSize={6}
            src={require("/public/assets/product-pages/publish/hero-icon-2.png")}
            alt=""
          />
          <Text>
            <Text fontWeight="bold" as="span">
              Shareable landing page.{" "}
            </Text>
            By publishing your contract, your contracts become easily shareable
            with a landing page for your contract.
          </Text>
        </Flex>
        <ButtonGroup size="size" spacing={4}>
          <LinkButton
            as={TrackedLink}
            {...{
              category: "publish_upsell",
              label: "contact_us",
            }}
            bg="accent.900"
            color="accent.100"
            borderColor="accent.900"
            borderWidth="1px"
            href="/contact-us"
            noIcon
            _hover={{
              bg: "transparent",
              color: "accent.900",
            }}
          >
            Get In Touch
          </LinkButton>
          <LinkButton
            as={TrackedLink}
            {...{
              category: "publish_upsell",
              label: "learn_more",
            }}
            variant="ghost"
            href="https://portal.thirdweb.com/contracts/publish/overview"
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
