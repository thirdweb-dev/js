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
    name: "Adam Lee",
    twitter: "AdamLeeBG",
  },
  {
    name: "Adam Majmudar",
    twitter: "MajmudarAdam",
  },
  // {
  //   name: "Andrew Begafria",
  //   twitter: ""
  // },
  {
    name: "Anshu Tukol",
    twitter: "AnshuTukol",
  },
  {
    name: "Beverly Rivas",
    twitter: "BevRivas",
  },
  {
    name: "Bobby Wang",
  },
  {
    name: "Catty Berragan",
    twitter: "CathalUK",
  },
  {
    name: "Ciara Nightingale",
    twitter: "ciaranightingal",
  },
  // {
  //   name: "Devin Rattray",
  //   twitter: "",
  // }
  {
    name: "Eiman Abdelmoneim",
    twitter: "EimanAbdel",
  },
  {
    name: "Erika Khanna",
    twitter: "heyerikakhanna",
  },
  {
    name: "Jake Loo",
    twitter: "jake_loo",
  },
  {
    name: "Jarrod Watts",
    twitter: "jarrodwattsdev",
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
    name: "Jonas Daniels",
    twitter: "jnsdls",
  },
  {
    name: "Jorge Dalmendray",
    twitter: "dalmendray",
  },
  // {
  //   name: "Juan Leal",
  //   twitter: "",
  // },
  {
    name: "Krishang Nadgauda",
    twitter: "monkeymeaning",
  },
  {
    name: "Manan Tank",
    twitter: "MananTank_",
  },
  // {
  //   name: "Mariano Fuentes",
  //   twitter: "",
  // },
  // {
  //   name: "Muhammad Meigooni",
  //   twitter: ""
  // },
  {
    name: "Nacho Iacovino",
    twitter: "nachoiacovino",
  },
  {
    name: "Patrick Kearney",
    twitter: "theyoungpatrice",
  },
  {
    name: "Pengcheng Chen",
    twitter: "blockchainian",
  },
  {
    name: "Rahul Menon",
    twitter: "rahulphenomenon",
  },
  {
    name: "Rohit Ramesh",
    twitter: "@Rohit7101",
  },
  {
    name: "Samina Kabir",
    twitter: "saminacodes",
  },
  {
    name: "Sian Morton",
    twitter: "Sian_Morton",
  },
  {
    name: "Siddharth Adusumelli",
    twitter: "shift4id",
  },
  // {
  //   name: "Yan Giet",
  //   twitter: ""
  // },
  {
    name: "Yash Kumar",
    twitter: "yash09061",
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
        <Box mt="-80px" pt="100px" overflowX="hidden">
          <HomepageSection bottomPattern>
            <Aurora
              pos={{ left: "50%", top: "0%" }}
              size={{ width: "2400px", height: "2400px" }}
              color="hsl(289deg 78% 30% / 45%)"
            />

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
            <Flex gap={{ base: 8, md: 16 }} direction="column">
              <SimpleGrid
                placeItems="center"
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
                        backer.name === "Shrug" ||
                        backer.name === "Protocol Labs"
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
                        backer.name === "Shrug" ||
                        backer.name === "Protocol Labs"
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
        </Box>
      </Flex>
    </DarkMode>
  );
};

About.pageId = PageId.About;

export default About;
