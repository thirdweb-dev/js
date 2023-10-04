import { Box, DarkMode, Flex, Image, SimpleGrid } from "@chakra-ui/react";
import { HomepageFooter } from "components/footer/Footer";
import { Aurora } from "components/homepage/Aurora";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { PageId } from "page-id";
import { Heading, Text, TrackedLink } from "tw-components";
import { MaskedAvatar } from "tw-components/masked-avatar";
import { ThirdwebNextPage } from "utils/types";

const employees = [
  {
    name: "Abbas Khan",
    twitter: "KhanAbbas201",
  },
  {
    name: "Adam Majmudar",
    twitter: "MajmudarAdam",
  },
  {
    name: "Atif Khan",
    twitter: "atifkhan31",
  },
  {
    name: "Avneesh Agarwal",
    twitter: "avneesh0612",
  },
  {
    name: "Beverly Rivas",
    twitter: "BevRivas",
  },
  {
    name: "Bobby Wang",
    twitter: "PartTimePlug",
  },
  {
    name: "Carmen Li",
    twitter: "someorsalt",
  },
  {
    name: "Catty Berragan",
    twitter: "cattybk",
  },
  {
    name: "Ciara Nightingale",
    twitter: "ciaranightingal",
  },
  {
    name: "Devin Rattray",
    twitter: "dvnsctt",
  },
  {
    name: "Dustin Turska",
    twitter: "DustinTurska",
  },
  {
    name: "Edward Sun",
    twitter: "eedwardsun",
  },
  {
    name: "Eiman Abdelmoneim",
    twitter: "EimanAbdel",
  },
  {
    name: "Erika Khanna",
    twitter: "heyerikakhanna",
  },
  {
    name: "Gerry Saporito",
    twitter: "SaporitoEth",
  },
  {
    name: "Farhan Khwaja",
    twitter: "farhan_khwaja",
  },
  {
    name: "Firekeeper",
  },
  {
    name: "Isaac Dubuque",
    twitter: "isaac_dubuque",
  },
  {
    name: "Jake Loo",
    twitter: "jake_loo",
  },
  {
    name: "James Sun",
    twitter: "JamesZmSun",
  },
  {
    name: "Jason Hitchcock",
    twitter: "jasonhitchcock",
  },
  {
    name: "Joaquim Verges",
    twitter: "joenrv",
  },
  {
    name: "Joher Khan",
    twitter: "joherkhan",
  },
  {
    name: "Jonas Daniels",
    twitter: "jnsdls",
  },
  {
    name: "Jorge Dalmendray",
    twitter: "dalmendray",
  },
  {
    name: "Juan Leal",
    twitter: "juandoleal",
  },
  {
    name: "Krishang Nadgauda",
    twitter: "monkeymeaning",
  },
  {
    name: "Manan Tank",
    twitter: "MananTank_",
  },
  {
    name: "Matt Cheong",
  },
  {
    name: "Mike Shin",
    twitter: "mdjshin",
  },
  {
    name: "Muhammad Meigooni",
    twitter: "mmeigooni",
  },
  {
    name: "Nacho Iacovino",
    twitter: "nachoiacovino",
  },
  {
    name: "Phillip Ho",
    twitter: "arcoraven",
  },
  {
    name: "Rahul Menon",
    twitter: "rahulphenomenon",
  },
  {
    name: "Samina Kabir",
    twitter: "saminacodes",
  },
  {
    name: "Sean Watase",
    twitter: "watase_eth",
  },
  {
    name: "Sian Morton",
    twitter: "Sian_Morton",
  },
  {
    name: "Tair Asim",
    twitter: "tair",
  },
  {
    name: "Waren Gonzaga",
    twitter: "warengonzaga",
  },
  {
    name: "Winston Yeo",
    twitter: "winston_yeo",
  },
  {
    name: "Yan Giet",
    twitter: "yangiet_",
  },
  {
    name: "Yash Kumar",
    twitter: "yash09061",
  },
].sort((a, b) => a.name.localeCompare(b.name));

const vcs = [
  {
    name: "Haun Ventures",
    logo: "/assets/about/haun.svg",
    link: "https://haun.co",
  },
  {
    name: "Coinbase Ventures",
    logo: "/assets/about/coin-ventures.svg",
    link: "https://coinbase.com",
  },
  {
    name: "Shopify",
    logo: "/assets/about/shopify.svg",
    link: "https://shopify.com",
  },
  {
    name: "Mark Cuban",
    logo: "/assets/about/mark-cuban.svg",
    link: "https://markcuban.com/",
  },
  {
    name: "Founders, Inc.",
    logo: "/assets/about/f-inc.svg",
    link: "https://f.inc",
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
        <Box mt="-80px" pt="100px" overflowX="hidden">
          <HomepageSection bottomPattern>
            <Aurora
              pos={{ left: "50%", top: "0%" }}
              size={{ width: "2400px", height: "2400px" }}
              color="hsl(289deg 78% 30% / 45%)"
            />

            <Flex
              pt={24}
              mb={{ base: 24, lg: -24 }}
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
                We provide developer tools to build, manage and analyze web3
                apps. Our tooling is open-source, decentralized, and
                permissionless.
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
                  {employee.twitter && (
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
                  )}
                </Flex>
              ))}
            </SimpleGrid>
          </HomepageSection>
          <HomepageSection pb={32}>
            <Heading size="display.sm" mb={12}>
              Investors
            </Heading>
            <Flex gap={{ base: 8, md: 16 }} direction="column">
              <SimpleGrid
                columns={{ base: 2, md: 5 }}
                gap={8}
                justifyContent="space-evenly"
              >
                {vcs.map((backer) => (
                  <TrackedLink
                    key={backer.name}
                    href={backer.link}
                    isExternal
                    category="backer"
                    label={backer.name}
                  >
                    <Image
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
        </Box>
      </Flex>
    </DarkMode>
  );
};

About.pageId = PageId.About;

export default About;
