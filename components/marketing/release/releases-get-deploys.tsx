import { AspectRatio, Box, Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { Heading, LinkButton, Text, TrackedLink } from "tw-components";

export const ReleasesGetDeploysCard: React.FC = () => {
  return (
    <Box
      w="full"
      background="linear-gradient(158.84deg, rgba(255, 255, 255, 0.05) 13.95%, rgba(255, 255, 255, 0) 38.68%)"
      border="1px solid rgba(255, 255, 255, 0.1)"
      borderRadius="24px"
      px={{ base: "25px", md: "50px" }}
      overflow="hidden"
    >
      <Flex
        justify="space-between"
        direction={{ base: "column", md: "row" }}
        gap={{ base: 6, md: 12 }}
      >
        <Flex
          order={{ base: 2, md: 1 }}
          py={{ base: "25px", md: "50px" }}
          gap="24px"
          direction="column"
          maxW={{ base: "full", md: "40%" }}
        >
          <Heading color="white" as="h3" size="title.lg" fontWeight={600}>
            Releases get deploys.
          </Heading>
          <Text color="white" size="body.lg">
            Interesting releases get added to the explore page. Over 60,000 web3
            devs visit this page every month.
          </Text>
          <Text color="white" size="body.lg">
            Looking for devs to start building on top of your protocol? Get in
            touch!
          </Text>
          <Flex gap="12px" direction={{ base: "column", md: "row" }}>
            <LinkButton
              as={TrackedLink}
              {...{
                category: "releases_get_deploys",
                label: "contact_us",
              }}
              bg="white"
              color="black"
              href="https://form.typeform.com/to/FAwehBFl"
              isExternal
              noIcon
              _hover={{ bg: "rgba(255,255,255,.8)" }}
              boxShadow="0px 4px 4px rgba(0, 0, 0, 0.05)"
            >
              Contact us
            </LinkButton>
            <LinkButton
              as={TrackedLink}
              {...{
                category: "releases_get_deploys",
                label: "explore",
              }}
              href="/explore"
              color="#fff"
              bg="transparent"
              border="1px solid rgba(255, 255, 255, 0.15)"
              filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.05))"
              _hover={{ bg: "rgba(255,255,255,.1)" }}
            >
              Explore contracts
            </LinkButton>
          </Flex>
        </Flex>
        <AspectRatio
          order={{ base: 1, md: 2 }}
          w="450px"
          maxW="100%"
          ratio={450 / 360}
        >
          <ChakraNextImage src={require("./releases-get-deploys.png")} alt="" />
        </AspectRatio>
      </Flex>
    </Box>
  );
};
