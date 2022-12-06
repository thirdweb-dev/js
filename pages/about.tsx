import { DarkMode, Flex, Image, SimpleGrid } from "@chakra-ui/react";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { HomepageFooter } from "components/product-pages/homepage/Footer";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { PageId } from "page-id";
import { Heading, Text, TrackedLink } from "tw-components";
import { MaskedAvatar } from "tw-components/masked-avatar";
import { ThirdwebNextPage } from "utils/types";

const employees = [
  {
    name: "Jake Loo",
    twitter: "jake_loo",
  },
  {
    name: "Krishang Nadgauda",
    twitter: "monkeymeaning",
  },
  {
    name: "Adam Majmudar",
    twitter: "MajmudarAdam",
  },
  {
    name: "Catty Berragan",
    twitter: "CathalUK",
  },
  {
    name: "Jonas Daniels",
    twitter: "jnsdls",
  },
  {
    name: "Nacho Iacovino",
    twitter: "nachoiacovino",
  },
  {
    name: "Eiman Abdelmoneim",
    twitter: "EimanAbdel",
  },
  {
    name: "Patrick Kearney",
    twitter: "theyoungpatrice",
  },
  {
    name: "Joaquim Verges",
    twitter: "joenrv",
  },
  {
    name: "Devin Scott",
    twitter: "dvnsctt",
  },
  {
    name: "Adam Lee",
    twitter: "AdamLeeBG",
  },
  {
    name: "Samina Kabir",
    twitter: "saminacodes",
  },
  {
    name: "Anshu Tukol",
    twitter: "AnshuTukol",
  },
  {
    name: "Jarrod Watts",
    twitter: "jarrodwattsdev",
  },
  {
    name: "Yash Kumar",
    twitter: "yash09061",
  },
  {
    name: "Rahul Menon",
    twitter: "rahulphenomenon",
  },
  {
    name: "Sian Morton",
    twitter: "Sian_Morton",
  },
  {
    name: "Beverly Rivas",
    twitter: "BevRivas",
  },
].sort((a, b) => a.name.localeCompare(b.name));

const vcs = [
  {
    name: "Haun Ventures",
    logo: "/assets/investors/haun.svg",
    link: "https://haun.co",
  },
  {
    name: "Coinbase Ventures",
    logo: "/assets/investors/coin-ventures.png",
    link: "https://coinbase.com",
  },
  {
    name: "Shopify",
    logo: "/assets/investors/shopify.svg",
    link: "https://shopify.com",
  },
  {
    name: "Polygon",
    logo: "/assets/investors/polygon.svg",
    link: "https://polygon.technology/",
  },
  {
    name: "Founders, Inc.",
    logo: "/assets/investors/f-inc.png",
    link: "https://f.inc",
  },
  {
    name: "Protocol Labs",
    logo: "/assets/investors/protocol-labs.svg",
    link: "https://protocol.ai/",
  },
  {
    name: "Shrug",
    logo: "/assets/investors/shrug-vc.png",
    link: "https://shrug.vc",
  },
] as const;

const About: ThirdwebNextPage = () => {
  return (
    <DarkMode>
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
        <HomepageSection topGradient bottomPattern>
          <Flex
            pt={24}
            mb={{ base: 24, md: -24 }}
            flexDir="column"
            gap={{ base: 6, md: 8 }}
            align={{ base: "initial", md: "start" }}
          >
            <Heading
              as="h2"
              size="display.md"
              textAlign={{ base: "center", md: "left" }}
            >
              About Us
            </Heading>
            <Heading
              as="h3"
              size="subtitle.md"
              textAlign={{ base: "center", md: "left" }}
              maxW="container.sm"
            >
              We provide developer tools to build, manage and analyze web3 apps.
              Our tooling is open-source, decentralized, and permissionless.
            </Heading>
          </Flex>
        </HomepageSection>
        <HomepageSection py={14}>
          <Heading size="display.sm" mb={12}>
            Founded By
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <Flex gap={6} align="center">
              <MaskedAvatar
                src={"/assets/landingpage/furqan-rydhan.png"}
                alt=""
                boxSize={40}
              />

              <Flex flexDir="column" gap={2} justifyContent="center">
                <Heading
                  size="title.lg"
                  bgGradient="linear(to-r, #B8EEFF, #8689E3)"
                  bgClip="text"
                >
                  Furqan Rydhan
                </Heading>
                <TrackedLink
                  href="https://twitter.com/FurqanR"
                  isExternal
                  category="team"
                  label="Furqan Rydhan"
                >
                  <Text size="label.md" color="gray.500">
                    @FurqanR
                  </Text>
                </TrackedLink>
              </Flex>
            </Flex>
            <Flex gap={6} align="center">
              <MaskedAvatar
                src={"/assets/landingpage/steven-bartlett.jpeg"}
                alt=""
                boxSize={40}
              />

              <Flex flexDir="column" gap={2} justifyContent="center">
                <Heading
                  size="title.lg"
                  bgGradient="linear(to-r, #B8EEFF, #8689E3)"
                  bgClip="text"
                >
                  Steven Bartlett
                </Heading>
                <TrackedLink
                  href="https://twitter.com/SteveBartlettSC"
                  isExternal
                  category="team"
                  label="Steven Bartlett"
                >
                  <Text size="label.md" color="gray.500">
                    @SteveBartlettSC
                  </Text>
                </TrackedLink>
              </Flex>
            </Flex>
          </SimpleGrid>
        </HomepageSection>
        <HomepageSection pb={32}>
          <Heading size="display.sm" mb={12}>
            The Team
          </Heading>
          <SimpleGrid
            columns={{ base: 2, md: 4 }}
            gap={8}
            justifyContent="space-evenly"
          >
            {employees.map((employee) => (
              <Flex key={employee.name} flexDir="column" gap={1}>
                <Heading size="title.sm">{employee.name}</Heading>
                <TrackedLink
                  href={`https://twitter.com/${employee.twitter}`}
                  isExternal
                  category="team"
                  label={employee.name}
                >
                  <Text size="label.md" color="gray.500">
                    @{employee.twitter}
                  </Text>
                </TrackedLink>
              </Flex>
            ))}
          </SimpleGrid>
        </HomepageSection>
        <HomepageSection pb={32}>
          <Heading size="display.sm" mb={12}>
            Investors
          </Heading>
          <Flex gap={16} direction="column">
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap={8}
              justifyContent="space-evenly"
            >
              {vcs.slice(0, 3).map((backer) => (
                <TrackedLink
                  key={backer.name}
                  href={backer.link}
                  isExternal
                  category="backer"
                  label={backer.name}
                >
                  <Image
                    filter={
                      backer.name === "Shrug" || backer.name === "Protocol Labs"
                        ? "invert(1)"
                        : undefined
                    }
                    w="164px"
                    h="50px"
                    objectFit="contain"
                    src={backer.logo}
                    alt={backer.name}
                  />
                </TrackedLink>
              ))}
            </SimpleGrid>
            <SimpleGrid
              columns={{ base: 2, md: 4 }}
              gap={8}
              justifyContent="space-evenly"
            >
              {vcs.slice(3, vcs.length).map((backer) => (
                <TrackedLink
                  key={backer.name}
                  href={backer.link}
                  isExternal
                  category="backer"
                  label={backer.name}
                >
                  <Image
                    filter={
                      backer.name === "Shrug" || backer.name === "Protocol Labs"
                        ? "invert(1)"
                        : undefined
                    }
                    w="164px"
                    h="50px"
                    objectFit="contain"
                    src={backer.logo}
                    alt={backer.name}
                  />
                </TrackedLink>
              ))}
            </SimpleGrid>
          </Flex>
        </HomepageSection>
        <HomepageFooter />
      </Flex>
    </DarkMode>
  );
};

About.pageId = PageId.About;

export default About;
