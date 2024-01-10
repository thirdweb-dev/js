import { Box, Divider, Flex } from "@chakra-ui/react";
import {
  Card,
  CodeBlock,
  Heading,
  LinkButton,
  TrackedLink,
} from "tw-components";

export const DeployUpsellCard: React.FC = () => {
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
        as="section"
        display="flex"
        bg="black"
        borderColor="transparent"
        _light={{
          bg: "white",
          borderColor: "borderColor",
        }}
        p={8}
        borderRadius="lg"
        gap={6}
        flexDirection="column"
      >
        <Heading as="h3" size="title.md">
          Didn&apos;t find what you&apos;re looking for? Build your own!
        </Heading>

        <Flex direction="column" gap={4}>
          <Flex
            gap={1}
            align="center"
            direction={{ base: "column", md: "row" }}
          >
            <Heading size="label.md" as="h4">
              Create a contract with a single command.
            </Heading>
            <LinkButton
              as={TrackedLink}
              {...{
                category: "deploy_upsell",
                label: "contract_kit",
              }}
              fontWeight={400}
              _light={{ color: "blue.500", _hover: { color: "blue.500" } }}
              _dark={{ color: "blue.400", _hover: { color: "blue.500" } }}
              size="sm"
              href="https://portal.thirdweb.com/contracts/build/overview"
              isExternal
              variant="link"
            >
              Learn more about the Solidity SDK
            </LinkButton>
          </Flex>

          <CodeBlock
            code="npx thirdweb create contract"
            language="bash"
            prefix="$"
          />
        </Flex>
        <Divider />
        <Flex direction="column" gap={4}>
          <Flex
            gap={1}
            align="center"
            direction={{ base: "column", md: "row" }}
          >
            <Heading size="label.md" as="h4">
              Deploy a contract with a single command.
            </Heading>
            <LinkButton
              as={TrackedLink}
              {...{
                category: "deploy_upsell",
                label: "portal_deploy",
              }}
              size="sm"
              fontWeight={400}
              _light={{ color: "blue.500", _hover: { color: "blue.500" } }}
              _dark={{ color: "blue.400", _hover: { color: "blue.500" } }}
              href="https://portal.thirdweb.com/contracts/deploy/overview"
              isExternal
              variant="link"
            >
              Learn more about Deploy
            </LinkButton>
          </Flex>

          <CodeBlock code="npx thirdweb deploy" language="bash" prefix="$" />
        </Flex>
      </Card>
    </Box>
  );
};
