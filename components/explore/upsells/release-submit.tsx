import { Box, ButtonGroup, Flex } from "@chakra-ui/react";
import { Card, Heading, LinkButton, Text, TrackedLink } from "tw-components";

export const ReleaseUpsellCard: React.FC = () => {
  return (
    <Box
      bg="linear-gradient(147.15deg, #410AB6 30.17%, #D45CFF 100.01%)"
      my={3}
      borderRadius="lg"
      p="16px"
      mx="-16px"
      boxShadow="inset 0 0 12px 12px var(--chakra-colors-backgroundBody), inset 0 0 3px 2px var(--chakra-colors-backgroundBody)"
    >
      <Card
        bg="black"
        borderColor="transparent"
        _light={{
          bg: "white",
          borderColor: "borderColor",
        }}
        p={8}
        borderRadius="lg"
        as={Flex}
        gap={4}
        flexDirection="column"
      >
        <Heading as="h3" size="title.xl">
          Get your protocol featured here.
        </Heading>
        <Text size="body.lg">
          Releasing your contract on thirdweb is the best way to get your
          protocol in front of 60k+ web3 developers.
        </Text>

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
            Contact us
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
          >
            Learn More
          </LinkButton>
        </ButtonGroup>
      </Card>
    </Box>
  );
};
