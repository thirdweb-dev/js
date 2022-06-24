import {
  Box,
  Center,
  DarkMode,
  Flex,
  LightMode,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { CodeSelector } from "components/homepage/CodeSelector";
import { ContractCard } from "components/homepage/ContractCard";
import { DashboardCard } from "components/homepage/DashboardCard";
import { HomepageFooter } from "components/homepage/Footer";
import { HomepageSection } from "components/homepage/Section";
import { HomepageTopNav } from "components/homepage/Topnav";
import { ExamplesSection } from "components/homepage/examples/ExamplesSection";
import { MultiChainSVG } from "components/homepage/multi-chain-svg";
import { GeneralCta } from "components/shared/GeneralCta";
import { useTrack } from "hooks/analytics/useTrack";
// images
import Analytics from "public/assets/landingpage/analytics.png";
import Contracts from "public/assets/landingpage/contracts.png";
import Hero from "public/assets/landingpage/hero.png";
import MobileHero from "public/assets/landingpage/mobile-hero.png";
import ThirdwebTeams from "public/assets/landingpage/thirdweb-teams.png";
import WhiteLogo from "public/assets/landingpage/white-logo.png";
// end images
import React from "react";
import { AiOutlineTeam } from "react-icons/ai";
import { BsMenuButtonWide } from "react-icons/bs";
import { FiCheck } from "react-icons/fi";
import { MdOutlineAnalytics } from "react-icons/md";
import { Heading, Link, Text, TrackedLink } from "tw-components";

export default function Home() {
  const { Track } = useTrack({ page: "home" });

  return (
    <DarkMode>
      <Track>
        <Flex
          sx={{
            // overwrite the theme colors because the home page is *always* in "dark mode"
            "--chakra-colors-heading": "#F2F2F7",
            "--chakra-colors-paragraph": "#AEAEB2",
            "--chakra-colors-borderColor": "rgba(255,255,255,0.1)",
          }}
          justify="center"
          flexDir="column"
          as="main"
          bg="#000"
        >
          <HomepageTopNav />
          <HomepageSection id="home" topGradient bottomPattern>
            <SimpleGrid
              pt={{
                base: 24,
                md: 48,
              }}
              columns={{ base: 1, md: 2 }}
              spacing={{ base: 6, md: 8 }}
            >
              <Flex
                flexDir="column"
                gap={{ base: 6, md: 8 }}
                align={{ base: "initial", md: "start" }}
              >
                <Heading
                  as="h2"
                  size="display.md"
                  textAlign={{ base: "center", md: "left" }}
                >
                  Build web3 apps, easily.
                </Heading>
                <Heading
                  as="h3"
                  size="subtitle.md"
                  textAlign={{ base: "center", md: "left" }}
                >
                  Smart contracts you control. Powerful SDKs and intuitive tools
                  for developers. Ship on-chain faster.
                </Heading>
                <LightMode>
                  <Flex flexDir="column" align="center" gap={6}>
                    <GeneralCta size="lg" />
                    <Link
                      href="#fees"
                      borderBottomWidth="1px"
                      _hover={{
                        textDecor: "none",
                        opacity: 1,
                      }}
                      opacity={0.8}
                    >
                      <Text size="body.lg">thirdweb is 100% free</Text>
                    </Link>
                  </Flex>
                </LightMode>
              </Flex>
              <Flex
                display={{ base: "none", md: "flex" }}
                justifyContent="flex-end"
              >
                <ChakraNextImage
                  alt=""
                  maxW={96}
                  w={96}
                  mt={8}
                  src={Hero}
                  mr={12}
                />
              </Flex>
              <Flex
                display={{ base: "flex", md: "none" }}
                justifyContent="center"
              >
                <ChakraNextImage
                  alt=""
                  maxW={96}
                  w={96}
                  mt={8}
                  px={4}
                  src={MobileHero}
                />
              </Flex>
            </SimpleGrid>
          </HomepageSection>

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
                  <Heading
                    as="span"
                    bgGradient="linear(to-r, #B8EEFF, #8689E3)"
                    bgClip="text"
                    size="display.sm"
                    _hover={{ opacity: 0.8 }}
                    textDecoration="underline"
                  >
                    <TrackedLink
                      isExternal
                      href="https://portal.thirdweb.com/thirdweb-deploy"
                      category="thirdweb-deloy"
                      label="heading"
                    >
                      thirdweb deploy
                    </TrackedLink>
                  </Heading>
                </Heading>
                <Heading size="subtitle.lg" as="h3" textAlign="center">
                  Bring your own contracts, unlock the power of thirdweb.
                </Heading>
                <SimpleGrid
                  flexDir="column"
                  justifyContent="space-between"
                  w="100%"
                  columns={{ base: 1, md: 3 }}
                  gap={{ base: 12, md: 6 }}
                  py={12}
                  px={{ base: 6, md: 0 }}
                >
                  <Stack spacing={4}>
                    <ChakraNextImage
                      src={require("/public/assets/landingpage/keys.svg")}
                      placeholder="empty"
                      alt=""
                      w={12}
                    />
                    <Heading size="title.sm">
                      Private keys are dangerous
                    </Heading>
                    <Text size="body.lg">
                      Deploy as a team seamlessly with a multi-sig or as a solo
                      dev with your favorite wallet. Never accidentally leak
                      your private keys again.
                    </Text>
                  </Stack>

                  <Stack spacing={4}>
                    <ChakraNextImage
                      src={require("/public/assets/landingpage/extensions.svg")}
                      placeholder="empty"
                      alt=""
                      w={12}
                    />
                    <Heading size="title.sm">
                      Power up with{" "}
                      <TrackedLink
                        href="https://portal.thirdweb.com/thirdweb-deploy/contract-features"
                        category="thirdweb-deploy"
                        label="extensions"
                        borderBottom="1px solid"
                        _hover={{ opacity: 0.9 }}
                      >
                        extensions
                      </TrackedLink>
                    </Heading>
                    <Text size="body.lg">
                      Building blocks for your smart contracts:{" "}
                      <TrackedLink
                        category="thirdweb-deploy"
                        borderBottom="1px solid"
                        href="https://portal.thirdweb.com/thirdweb-deploy/contract-features/permissions"
                        isExternal
                        _hover={{ opacity: 0.9 }}
                        label="permissions"
                      >
                        Permissions & Roles
                      </TrackedLink>
                      ,{" "}
                      <TrackedLink
                        category="thirdweb-deploy"
                        borderBottom="1px solid"
                        href="https://portal.thirdweb.com/thirdweb-deploy/contract-features/royalty"
                        isExternal
                        _hover={{ opacity: 0.9 }}
                        label="royalties"
                      >
                        Royalties
                      </TrackedLink>
                      ,{" "}
                      <TrackedLink
                        category="thirdweb-deploy"
                        borderBottom="1px solid"
                        href="https://portal.thirdweb.com/thirdweb-deploy/contract-features"
                        isExternal
                        _hover={{ opacity: 0.9 }}
                        label="delayed-reveal"
                      >
                        Delayed Reveal
                      </TrackedLink>
                      ,{" "}
                      <TrackedLink
                        category="thirdweb-deploy"
                        borderBottom="1px solid"
                        href="https://portal.thirdweb.com/thirdweb-deploy/contract-features"
                        isExternal
                        _hover={{ opacity: 0.9 }}
                        label="signature-minting"
                      >
                        Signature Minting
                      </TrackedLink>
                      ,{" "}
                      <TrackedLink
                        category="thirdweb-deploy"
                        borderBottom="1px solid"
                        href="https://portal.thirdweb.com/thirdweb-deploy/contract-features"
                        isExternal
                        _hover={{ opacity: 0.9 }}
                        label="primary-sales"
                      >
                        Primary Sales
                      </TrackedLink>
                      ,{" "}
                      <TrackedLink
                        category="thirdweb-deploy"
                        borderBottom="1px solid"
                        href="https://portal.thirdweb.com/thirdweb-deploy/contract-features"
                        isExternal
                        _hover={{ opacity: 0.9 }}
                        label="more"
                      >
                        and more...
                      </TrackedLink>{" "}
                    </Text>
                  </Stack>

                  <Stack spacing={4}>
                    <ChakraNextImage
                      src={require("/public/assets/landingpage/list.svg")}
                      placeholder="empty"
                      alt=""
                      w={12}
                    />
                    <Heading size="title.sm">
                      Powerful SDKs and dashboards
                    </Heading>
                    <Text size="body.lg">
                      Fully featured SDKs for your contracts so you can focus on
                      building your app. Easy-to-use dashboards to manage and
                      track your contracts on-chain.
                    </Text>
                  </Stack>
                </SimpleGrid>

                <Heading size="subtitle.lg" as="h3" textAlign="center">
                  Get started with our{" "}
                  <TrackedLink
                    href="https://portal.thirdweb.com/pre-built-contracts"
                    category="pre-built-contract"
                    label="heading"
                    borderBottom="1px solid"
                    isExternal
                    _hover={{ opacity: 0.9 }}
                  >
                    pre-built contracts
                  </TrackedLink>
                </Heading>
                <SimpleGrid
                  columns={{ base: 2, md: 3, lg: 4 }}
                  spacing={{ base: 3, md: 4 }}
                >
                  <ContractCard
                    icon="nft-drop"
                    title="NFTs"
                    urlPath="nfts"
                    description="ERC721 and ERC1155, minted or lazy minted so your audience can claim them."
                  />
                  <ContractCard
                    icon="token"
                    title="Tokens"
                    urlPath="tokens"
                    description="ERC20 tokens, minted or lazy minted so your audience can claim them."
                  />
                  <ContractCard
                    icon="marketplace"
                    title="Marketplace"
                    urlPath="marketplace"
                    description="NFT marketplace, either open to any collection or limited to the collections you want."
                  />
                  <ContractCard
                    icon="split"
                    title="More"
                    urlPath="other"
                    description="Governance on-chain, splitting revenue, and more."
                  />
                </SimpleGrid>
              </Flex>
            </Flex>
          </HomepageSection>

          <HomepageSection id="developers" bottomPattern middleGradient>
            <Flex
              flexDir="column"
              pt={{ base: 12, lg: 24 }}
              align="center"
              gap={{ base: 6, md: 8 }}
            >
              <Heading as="h2" size="display.sm" textAlign="center">
                Powerful SDKs.
              </Heading>
              <Heading as="h3" size="subtitle.lg" textAlign="center">
                Easily integrate into web, mobile, backend, games, etc.
              </Heading>
              <CodeSelector />
            </Flex>
          </HomepageSection>

          <HomepageSection id="features">
            <Flex
              flexDir="column"
              pb={{ base: 12, lg: 24 }}
              pt={24}
              align="center"
              gap={{ base: 12, lg: 24 }}
            >
              <Flex flexDir="column" gap={4}>
                <Heading as="h2" size="display.sm" textAlign="center">
                  Dashboards to
                  <br />
                  control{" "}
                  <Heading as="span" fontSize="inherit" fontWeight={900}>
                    everything
                  </Heading>
                  .
                </Heading>
                <Heading size="subtitle.lg" as="h3" textAlign="center">
                  Everything you need, in one place.
                </Heading>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                <DashboardCard
                  headingTitle="teams"
                  headingIcon={AiOutlineTeam}
                  title={
                    <>
                      Built with a focus on{" "}
                      <Heading
                        as="span"
                        bgGradient="linear(to-l, #48BCA8, #A998FF)"
                        bgClip="text"
                        display="inline"
                        size="title.sm"
                      >
                        empowering your team
                      </Heading>
                    </>
                  }
                  subtitle="Deploy and manage your contracts with your multi-sig, manage permissions, and more."
                  rightImage={ThirdwebTeams}
                  gradientBGs={{
                    topGradient:
                      "linear-gradient(135.89deg, #E21E12 17.67%, #00FFE0 59.03%)",
                    bottomGradient: "#C512E2",
                  }}
                />
                <DashboardCard
                  headingTitle="Contract manager"
                  headingIcon={BsMenuButtonWide}
                  title={
                    <>
                      <Heading
                        as="span"
                        bgGradient="linear(to-l, #E483F4, #FAC588)"
                        bgClip="text"
                        display="inline"
                        size="title.sm"
                      >
                        Your contracts
                      </Heading>
                      , at your fingertips
                    </>
                  }
                  subtitle="Keep track of your contracts, easily deploy new versions, perform transactions and more."
                  rightImage={Contracts}
                  gradientBGs={{
                    rightGradient: "#E28F12",
                    leftGradient: "#C512E2",
                  }}
                />
                <DashboardCard
                  headingTitle="analytics"
                  headingIcon={MdOutlineAnalytics}
                  title={
                    <>
                      Automatic reports with
                      <br />
                      <Heading
                        as="span"
                        bgGradient="linear(to-l, #585EE9, #E487D0)"
                        bgClip="text"
                        display="inline"
                        size="title.sm"
                      >
                        on-chain analytics
                      </Heading>
                    </>
                  }
                  subtitle="Pre-built reports for all of your contracts. Understand how your contracts are being used."
                  rightImage={Analytics}
                  gradientBGs={{
                    rightGradient: "#C512E2",
                    bottomGradient: "#00FFE0",
                  }}
                />
              </SimpleGrid>
            </Flex>
          </HomepageSection>

          <HomepageSection id="networks" middleGradient>
            <Flex
              flexDir="column"
              py={{ base: 12, lg: 24 }}
              align="center"
              gap={{ base: 6, md: 8 }}
            >
              <Heading
                bgGradient="linear(to-l, #7EB6FF, #F0C5FF)"
                bgClip="text"
                as="h2"
                size="display.sm"
                textAlign="center"
              >
                Think Multi-Chain.
              </Heading>
              <Heading size="subtitle.lg" as="h3" textAlign="center">
                Major chains are supported. More are coming soon.
              </Heading>
              <MultiChainSVG />
            </Flex>
          </HomepageSection>

          <HomepageSection id="fees">
            <SimpleGrid
              py={{ base: 12, lg: 24 }}
              columns={{ base: 1, lg: 2 }}
              spacing={{ base: 6, md: 8 }}
              alignItems="center"
            >
              <Flex gap={{ base: 6, md: 8 }} flexDir="column">
                <Heading
                  size="display.sm"
                  textAlign={{ base: "center", md: "left" }}
                >
                  Transparent pricing. No hidden fees.
                  <br />
                </Heading>
                <Text
                  size="body.xl"
                  fontStyle="italic"
                  textAlign={{ base: "center", md: "left" }}
                >
                  We may introduce optional advanced features which you can
                  decide to pay for in the future. We will always be transparent
                  and clear about any paid features up front.
                </Text>
              </Flex>
              <Box
                border=".5px solid"
                borderColor="#4953AF"
                p={12}
                borderRadius="lg"
                backgroundColor="#0000004d"
              >
                <Heading
                  bgGradient="linear(to-r, #FFB8E6, #8689E3)"
                  bgClip="text"
                  size="display.lg"
                  mb={6}
                >
                  Free.
                </Heading>
                <List
                  spacing={3}
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  textAlign="left"
                  color="gray.400"
                  mb={16}
                >
                  <ListItem>
                    <ListIcon as={FiCheck} color="green.500" />
                    Zero fees on contract deployments
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FiCheck} color="green.500" />
                    Zero fees on transactions
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FiCheck} color="green.500" />
                    New features added every week
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FiCheck} color="green.500" />
                    Save on gas fees with advanced optimizations
                  </ListItem>
                </List>
                <LightMode>
                  <GeneralCta title="Start building today" size="lg" w="100%" />
                </LightMode>
              </Box>
            </SimpleGrid>
          </HomepageSection>

          <HomepageSection id="examples" middleGradient>
            <Flex
              flexDir="column"
              py={{ base: 12, lg: 24 }}
              align="center"
              gap={{ base: 12, lg: 24 }}
            >
              <Heading
                as="h2"
                bgGradient="linear(to-r, #907EFF, #C5D8FF)"
                bgClip="text"
                size="display.md"
                textAlign="center"
              >
                Build anything.
              </Heading>
              <ExamplesSection />
            </Flex>
          </HomepageSection>
          <HomepageSection id="get-started" bottomPattern>
            <Flex
              flexDir="column"
              pt={{ base: 12, lg: 24 }}
              pb={{ base: 24, lg: 0 }}
              align="center"
              gap={{ base: 6, md: 8 }}
            >
              <Center mb={6} pt={{ base: 8, lg: 24 }}>
                <Center p={2} position="relative" mb={6}>
                  <Box
                    position="absolute"
                    bgGradient="linear(to-r, #F213A4, #040BBF)"
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    borderRadius="3xl"
                    overflow="visible"
                    filter="blur(15px)"
                  />

                  <ChakraNextImage
                    alt=""
                    boxSize={{ base: 24, md: 32 }}
                    placeholder="empty"
                    src={WhiteLogo}
                  />
                </Center>
              </Center>
              <Heading as="h2" size="display.md" textAlign="center">
                Get started with thirdweb
              </Heading>
              <Heading
                as="h3"
                maxW="600px"
                textAlign="center"
                size="subtitle.lg"
              >
                Build web3 apps with ease. Get instant access.
              </Heading>
              <LightMode>
                <GeneralCta
                  title="Start building for free"
                  size="lg"
                  w={{ base: "full", md: "inherit" }}
                />
              </LightMode>
            </Flex>
          </HomepageSection>

          <HomepageFooter />
        </Flex>
      </Track>
    </DarkMode>
  );
}
