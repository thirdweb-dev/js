import { Card, Divider, Flex, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { StaticImageData } from "next/image";
import { Heading, LinkButton, Text, TrackedLink } from "tw-components";

interface ContractsDescriptorItemProps {
  title: string;
  description: string | JSX.Element;
  icon: StaticImageData;
}

export function ContractsDescriptorItem(props: ContractsDescriptorItemProps) {
  const { title, description, icon } = props;
  return (
    <Flex gap={4} align="center">
      <ChakraNextImage boxSize={12} src={icon} alt="" flexShrink={0} />
      <Flex gap={1} direction="column">
        <Heading size="label.lg">{title}</Heading>
        <Text size="body.md">{description}</Text>
      </Flex>
    </Flex>
  );
}

/**
 * Highlights prebuild contracts and ways to create custom contracts
 */
export function ContractsSection() {
  return (
    <HomepageSection id="contracts" middleGradient>
      <Flex
        flexDir="column"
        gap={{ base: 6, md: 8 }}
        py={{ base: 12, lg: 24 }}
        pt={{ base: 24, lg: 0 }}
        align="center"
      >
        <Flex
          p={{ base: 0, md: 12 }}
          pt={{ base: 0, md: 24 }}
          flexDir="column"
          gap={{ base: 6, md: 8 }}
        >
          <Heading textAlign="center" size="display.sm" as="h2">
            <Heading as="span" size="display.sm">
              It all starts with contracts.
            </Heading>
          </Heading>

          <SimpleGrid
            flexDir="column"
            justifyContent="stretch"
            w="100%"
            columns={{ base: 1, md: 2 }}
            gap={{ base: 12, md: 8 }}
            py={12}
            px={0}
          >
            <Card
              border="1px solid black"
              boxShadow="md"
              bg="rgba(0,0,0,0.6)"
              p={10}
              as={Flex}
              flexDir="column"
              gap={8}
            >
              <Flex direction="column" gap={1.5}>
                <Heading w="100%" size="title.lg" lineHeight={1.2}>
                  Explore
                </Heading>
              </Flex>
              <Divider borderColor="rgba(255,255,255,0.1)" />

              <ContractsDescriptorItem
                title="Discover"
                description="The front page for contracts. Get inspired by contracts built by other web3 developers. Find contracts for your specific app's use case."
                icon={require("public/assets/landingpage/icons/secure.png")}
              />
              <Divider borderColor="rgba(255,255,255,0.1)" />
              <ContractsDescriptorItem
                title="Powerful"
                description="Deploy contracts to take full advantage of our product suite. Unlock access to powerful SDKs and Dashboard to easily build your app."
                icon={require("public/assets/landingpage/icons/optimized.png")}
              />
              <Divider borderColor="rgba(255,255,255,0.1)" />
              <ContractsDescriptorItem
                title="Convenient"
                description="One-click deployment. No need for private keys or scripts."
                icon={require("public/assets/landingpage/icons/no-code.png")}
              />
              <Divider borderColor="rgba(255,255,255,0.1)" />
              <LinkButton
                href="/explore"
                variant="solid"
                colorScheme="whiteAlpha"
                bg="white"
                color="black"
                py={6}
              >
                Explore contracts
              </LinkButton>
            </Card>
            <Card
              border="1px solid black"
              boxShadow="md"
              bg="rgba(0,0,0,0.6)"
              p={10}
              as={Flex}
              flexDir="column"
              gap={8}
            >
              <Flex direction="column" gap={1.5}>
                <Heading size="title.lg" lineHeight={1.2}>
                  Build your own
                </Heading>
              </Flex>
              <Divider borderColor="rgba(255,255,255,0.1)" />
              <ContractsDescriptorItem
                title="Starter Templates"
                description={
                  <>
                    Implement core standards such as{" "}
                    <TrackedLink
                      href="https://portal.thirdweb.com/contracts-sdk/base-contracts/erc-20/erc20base"
                      category="landing-contracts"
                      label="base-erc20"
                      borderBottom="1px solid"
                      isExternal
                      _hover={{
                        textDecoration: "none",
                        opacity: 0.8,
                      }}
                    >
                      ERC20
                    </TrackedLink>
                    ,{" "}
                    <TrackedLink
                      href="https://portal.thirdweb.com/contracts-sdk/base-contracts/erc-721/erc721base"
                      category="landing-contracts"
                      label="base-erc721"
                      borderBottom="1px solid"
                      isExternal
                      _hover={{
                        textDecoration: "none",
                        opacity: 0.8,
                      }}
                    >
                      ERC721
                    </TrackedLink>{" "}
                    and{" "}
                    <TrackedLink
                      href="https://portal.thirdweb.com/contracts-sdk/base-contracts/erc-1155/erc1155base"
                      category="landing-contracts"
                      label="base-erc1155"
                      borderBottom="1px solid"
                      isExternal
                      _hover={{
                        textDecoration: "none",
                        opacity: 0.8,
                      }}
                    >
                      ERC1155
                    </TrackedLink>{" "}
                    with our contract bases.
                  </>
                }
                icon={require("public/assets/landingpage/icons/contract-base.png")}
              />
              <Divider borderColor="rgba(255,255,255,0.1)" />
              <ContractsDescriptorItem
                title="ContractKit"
                description={
                  <>
                    Add features such as{" "}
                    <TrackedLink
                      href="https://portal.thirdweb.com/contractkit/extension-contracts/permissions"
                      category="landing-contracts"
                      label="extension-permissions"
                      borderBottom="1px solid"
                      _hover={{
                        textDecoration: "none",
                        opacity: 0.8,
                      }}
                    >
                      permission controls
                    </TrackedLink>
                    ,{" "}
                    <TrackedLink
                      href="https://portal.thirdweb.com/contractkit/extension-contracts/royalty"
                      category="landing-contracts"
                      label="extension-royalties"
                      borderBottom="1px solid"
                      _hover={{
                        textDecoration: "none",
                        opacity: 0.8,
                      }}
                    >
                      royalties
                    </TrackedLink>
                    ,{" "}
                    <TrackedLink
                      href="https://portal.thirdweb.com/contractkit/interfaces/erc721revealable"
                      category="landing-contracts"
                      label="extension-delayed-reveal"
                      borderBottom="1px solid"
                      _hover={{
                        textDecoration: "none",
                        opacity: 0.8,
                      }}
                    >
                      delayed reveal
                    </TrackedLink>
                    , and more.
                  </>
                }
                icon={require("public/assets/landingpage/icons/contract-extension.png")}
              />
              <Divider borderColor="rgba(255,255,255,0.1)" />
              <ContractsDescriptorItem
                title="Dashboards & SDKs"
                description="Get auto-generated dashboards & SDKs for your contracts."
                icon={require("public/assets/landingpage/icons/sdk-dashboard.png")}
              />
              <Divider borderColor="rgba(255,255,255,0.1)" />
              <Flex h="full" alignItems="end">
                <LinkButton
                  href="https://portal.thirdweb.com/contractkit"
                  variant="solid"
                  colorScheme="whiteAlpha"
                  bg="white"
                  color="black"
                  py={6}
                  isExternal
                  noIcon
                  w="full"
                >
                  Start building contracts
                </LinkButton>
              </Flex>
            </Card>
          </SimpleGrid>
        </Flex>
      </Flex>
    </HomepageSection>
  );
}
