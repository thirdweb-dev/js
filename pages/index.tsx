import { ConsolePage } from "./_app";
import {
  Box,
  Container,
  Flex,
  LightMode,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  Marketplace,
  NFTCollection,
  NFTDrop,
  Pack,
  Split,
  Token,
} from "@thirdweb-dev/sdk";
import { ChakraNextImage } from "components/Image";
import { CodeExamples } from "components/homepage/CodeExamples";
import { HomepageFeatureCard } from "components/homepage/FeatureCard";
import { HomepageFooter } from "components/homepage/Footer";
import { OctopusCard } from "components/homepage/OctopusCard";
import { HomepageSection } from "components/homepage/Section";
import { SupportedChain } from "components/homepage/SupportedChain";
import { HomepageTopNav } from "components/homepage/Topnav";
import { UpcomingFeature } from "components/homepage/UpcomingFeatureCard";
import { WhatCanYouBuild } from "components/homepage/WhatCanYouBuild";
import { GeneralCta } from "components/shared/GeneralCta";
import { LinkButton } from "components/shared/LinkButton";
import { FeaturesBackground } from "components/svgs/FeaturesBackground";
import { useTrack } from "hooks/analytics/useTrack";
// images
import Octopus from "public/assets/landingpage/octopus.png";
import Scissors from "public/assets/landingpage/scissors.png";
// end images
import React from "react";
import { FiCheck } from "react-icons/fi";

const Home: ConsolePage = () => {
  const { Track } = useTrack({ page: "home" });
  return (
    <LightMode>
      <Track>
        <Flex justify="center" flexDir="column" as="main" bg="#fff">
          <HomepageTopNav />
          <HomepageSection
            id="home"
            hero
            title="Build web3 apps, easily."
            subtitle={
              <>
                Smart contracts you control. Tools that accelerate your
                workflow.
                <Box display={{ base: "none", md: "block" }} /> Intuitive SDKs
                and widgets for developers.
              </>
            }
            bottomGradient="animated"
            paddingBottom
          >
            <Stack w="100%" spacing={["64px", "64px", "100px"]} pb="30rem">
              <GeneralCta size="lg" />
            </Stack>
          </HomepageSection>
          <Flex
            position="relative"
            zIndex={3}
            overflow="hidden"
            mt={{ base: "-40rem", md: "-48rem" }}
            py={{ base: 0, md: 0 }}
            id="features"
          >
            <FeaturesBackground position="absolute" bottom={0} />
            <Container
              maxW="container.page"
              position="relative"
              pb={["75px", "75px", "150px"]}
            >
              <Stack
                w="100%"
                align="center"
                spacing={{ base: "2.5rem", md: "5.5rem" }}
              >
                <SimpleGrid
                  w="100%"
                  placeItems="stretch"
                  columns={{ base: 1, md: 2, lg: 3 }}
                  spacing={6}
                >
                  <HomepageFeatureCard type={NFTCollection.contractType} />
                  <HomepageFeatureCard type={Marketplace.contractType} />
                  <HomepageFeatureCard type={Token.contractType} />
                  <HomepageFeatureCard type={Pack.contractType} />
                  <HomepageFeatureCard type={NFTDrop.contractType} />
                  <HomepageFeatureCard type={Split.contractType} />
                </SimpleGrid>
              </Stack>
            </Container>
          </Flex>

          <WhatCanYouBuild />

          <HomepageSection
            id="permissions"
            title="Permissions for your team"
            subtitle={
              <Box mt={-5}>
                Each contract lets you finely tune permissions to control who
                can
                <br />
                access your contracts and modify settings.
              </Box>
            }
          >
            <Flex flexDirection={{ base: "column", md: "row" }}>
              <Stack spacing={{ base: 4, md: 20 }} mr={{ base: 0, md: 2 }}>
                <OctopusCard
                  title="admin"
                  address="0x386...23c2"
                  description="Has full permissions for your project"
                />
                <OctopusCard
                  title="minter"
                  address="0x4F5...61b3"
                  description="Can mint new tokens on your contracts"
                />
              </Stack>
              <ChakraNextImage
                alt=""
                maxW={96}
                w={96}
                mt={24}
                display={{ base: "none", md: "block" }}
                placeholder="empty"
                src={Octopus}
              />
              <Stack
                spacing={{ base: 4, md: 14 }}
                mt={{ base: 4, md: 0 }}
                ml={{ base: 0, md: 2 }}
              >
                <OctopusCard
                  title="pauser"
                  address="0x27d...4Eb6"
                  description="Can enable and disable external interaction with your contracts"
                />
                <OctopusCard
                  title="transferrer"
                  address="0x4gh...5692"
                  description="Can transfer and receive assets through your contract"
                />
              </Stack>
            </Flex>
          </HomepageSection>

          <CodeExamples />

          <HomepageSection
            id="networks"
            bottomGradient="animated"
            title="thirdweb supports a multi-chain ecosystem of blockchains"
          >
            <Stack spacing="5rem" align="center">
              <SimpleGrid
                columns={[3, 3, 6]}
                spacing={{ base: "1.5rem", md: "4rem" }}
                mt={8}
              >
                <SupportedChain type="ethereum" />
                <SupportedChain type="polygon" />
                <SupportedChain type="avalanche" />
                <SupportedChain type="fantom" />
                <SupportedChain type="solana" />
                <SupportedChain type="flow" />
              </SimpleGrid>
              <LinkButton
                w="auto"
                flexGrow={0}
                size="lg"
                fontSize={{ base: "md", md: "lg" }}
                colorScheme="primary"
                borderRadius="full"
                href="https://portal.thirdweb.com"
              >
                Learn more
              </LinkButton>
            </Stack>
          </HomepageSection>

          <HomepageSection
            title="Powerful functionality"
            isDark
            topGradient="static"
          >
            <SimpleGrid
              w="100%"
              placeItems="stretch"
              columns={{ base: 1, md: 2, lg: 4 }}
            >
              <UpcomingFeature type="analytics" />
              <UpcomingFeature type="permissions" />
              <UpcomingFeature type="advanced_nfts" />
              <UpcomingFeature type="data" />
            </SimpleGrid>
          </HomepageSection>

          <HomepageSection
            id="fees"
            title="Free to use"
            leftAlignedTitle
            subtitle={
              <>
                <List
                  spacing={3}
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  textAlign="left"
                >
                  <ListItem>
                    <ListIcon as={FiCheck} color="green.500" />
                    We take zero fees on any smart contracts deployed
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FiCheck} color="green.500" />
                    You keep 100% of the money you make
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FiCheck} color="green.500" />
                    Gain access to fresh features each month{" "}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FiCheck} color="green.500" />
                    Only pay blockchain-specific gas fees
                  </ListItem>
                </List>
                <Text mt={4} textAlign="left">
                  In the future, we will introduce advanced features which you
                  can decide to pay for. We&apos;ll always be clear and
                  transparent with how much these features will cost.
                </Text>
              </>
            }
            titleSm
            subtitleMd
            childrenOnRightSide
          >
            <Flex justifyContent="center" alignItems="center">
              <ChakraNextImage
                alt=""
                maxW={52}
                w={52}
                display={{ base: "none", md: "block" }}
                placeholder="empty"
                src={Scissors}
              />
            </Flex>
          </HomepageSection>

          <HomepageFooter />
        </Flex>
      </Track>
    </LightMode>
  );
};

export default Home;
