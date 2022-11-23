import { ThirdwebNextPage } from "./_app";
import {
  Box,
  Center,
  Container,
  DarkMode,
  Divider,
  Flex,
  FormControl,
  Icon,
  IconButton,
  Input,
  LightMode,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Stack,
  useClipboard,
} from "@chakra-ui/react";
import { AiOutlineTeam } from "@react-icons/all-files/ai/AiOutlineTeam";
import { FiCheck } from "@react-icons/all-files/fi/FiCheck";
import { FiCopy } from "@react-icons/all-files/fi/FiCopy";
import { IoMdCheckmark } from "@react-icons/all-files/io/IoMdCheckmark";
import { ChakraNextImage } from "components/Image";
import { CLISection } from "components/homepage/CLISection";
import { PartnerCarousel } from "components/partners/carousel";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { CodeSelector } from "components/product-pages/homepage/CodeSelector";
import { DashboardCard } from "components/product-pages/homepage/DashboardCard";
import { HomepageFooter } from "components/product-pages/homepage/Footer";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { ExamplesSection } from "components/product-pages/homepage/examples/ExamplesSection";
import { MultiChainSVG } from "components/product-pages/homepage/multi-chain-svg";
import { GeneralCta } from "components/shared/GeneralCta";
import { useTrack } from "hooks/analytics/useTrack";
import type { StaticImageData } from "next/image";
import { PageId } from "page-id";
// images
import Analytics from "public/assets/landingpage/analytics.png";
import Contracts from "public/assets/landingpage/contracts.png";
import Hero from "public/assets/landingpage/hero.png";
import MobileHero from "public/assets/landingpage/mobile-hero.png";
import ThirdwebTeams from "public/assets/landingpage/thirdweb-teams.png";
import WhiteLogo from "public/assets/landingpage/white-logo.png";
import { useForm } from "react-hook-form";
// end images
import { BsLightningCharge, BsMenuButtonWide } from "react-icons/bs";
import { MdMarkEmailRead, MdOutlineAnalytics } from "react-icons/md";
import {
  Button,
  Card,
  Heading,
  LinkButton,
  Text,
  TrackedLink,
} from "tw-components";

const HomePage: ThirdwebNextPage = () => {
  const trackEvent = useTrack();

  const { onCopy, hasCopied } = useClipboard("npx thirdweb@latest");
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
                size="display.sm"
                textAlign={{ base: "center", md: "left" }}
              >
                The complete web3 development framework.
              </Heading>
              <Heading
                as="h3"
                size="subtitle.md"
                textAlign={{ base: "center", md: "left" }}
              >
                Smart contracts you control. Powerful SDKs and intuitive tools
                for developers. Ship on-chain faster.
              </Heading>

              <Flex direction="column">
                <LightMode>
                  <Flex
                    direction={{ base: "column", lg: "row" }}
                    align="center"
                    gap={6}
                  >
                    <LinkButton
                      href="/dashboard"
                      onClick={() =>
                        trackEvent({
                          category: "cta-button",
                          action: "click",
                          label: "start",
                          title: "Start building",
                        })
                      }
                      h="68px"
                      w={{ base: "100%", md: "290px" }}
                      fontSize="20px"
                      leftIcon={
                        <Icon as={BsLightningCharge} color="yellow.500" />
                      }
                      color="black"
                      flexShrink={0}
                      background="rgba(255,255,255,1)"
                      _hover={{
                        background: "rgba(255,255,255,0.9)!important",
                      }}
                    >
                      Start building
                    </LinkButton>
                    <Flex
                      background="rgba(255, 255, 255, 0.08)"
                      border="1px solid rgba(255, 255, 255, 0.2)"
                      pl="28px"
                      pr="14px"
                      borderRadius="md"
                      h="68px"
                      minW={{ base: "100%", lg: "240px" }}
                      gap={4}
                      align="center"
                    >
                      <Text
                        color="white"
                        fontFamily="mono"
                        fontSize="18px"
                        fontWeight="500"
                        whiteSpace="nowrap"
                      >
                        $ npx thirdweb@latest
                      </Text>
                      <IconButton
                        ml="auto"
                        borderRadius="md"
                        variant="ghost"
                        colorScheme="whiteAlpha"
                        size="sm"
                        aria-label="Copy npx command"
                        onClick={() => {
                          onCopy();
                          trackEvent({
                            category: "hero-section",
                            action: "copy",
                            label: "npx command",
                          });
                        }}
                        icon={
                          <Icon
                            as={hasCopied ? IoMdCheckmark : FiCopy}
                            fill={hasCopied ? "green.500" : undefined}
                          />
                        }
                      />
                    </Flex>
                  </Flex>
                </LightMode>
              </Flex>
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
                priority
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
        <PartnerCarousel />
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
                      Prebuilt
                    </Heading>
                  </Flex>
                  <Divider borderColor="rgba(255,255,255,0.1)" />

                  <ContractsDescriptorItem
                    title="Secure"
                    description="Contracts are audited and follow the highest security standards."
                    icon={require("public/assets/landingpage/icons/secure.png")}
                  />
                  <Divider borderColor="rgba(255,255,255,0.1)" />
                  <ContractsDescriptorItem
                    title="Optimized"
                    description="Up to 10x lower gas-fees for contract deployment delivering industry-leading efficiency."
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
                  <LinkButton
                    href="https://portal.thirdweb.com/contractkit"
                    variant="solid"
                    colorScheme="whiteAlpha"
                    bg="white"
                    color="black"
                    py={6}
                    isExternal
                    noIcon
                  >
                    Start building contracts
                  </LinkButton>
                </Card>
              </SimpleGrid>
            </Flex>
          </Flex>
        </HomepageSection>

        <NewsLetterSection />

        <HomepageSection id="sdks" bottomPattern middleGradient>
          <Flex
            flexDir="column"
            pt={{ base: 12, lg: 24 }}
            align="center"
            gap={{ base: 6, md: 8 }}
          >
            <Heading as="h2" size="display.sm" textAlign="center">
              Connect to web3 easily.
            </Heading>
            <Heading
              as="h3"
              size="subtitle.lg"
              textAlign="center"
              maxW="container.md"
            >
              Powerful SDKs to integrate decentralized technologies into your
              apps, backends, and games.
            </Heading>
            <CodeSelector />
          </Flex>
        </HomepageSection>

        <HomepageSection
          id="developers"
          py={{ base: 24, md: 48 }}
          middleGradient
          bottomGradient
        >
          <Flex
            flexDir="column"
            // pt={{ base: 12, lg: 1 }}
            align="center"
            gap={{ base: 6, md: 8 }}
          >
            <Heading as="h2" size="display.sm" textAlign="center" mb={24}>
              For developers, by developers.
            </Heading>
            <CLISection />
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
                Dashboards for{" "}
                <Heading as="span" fontSize="inherit" fontWeight={900}>
                  everything
                </Heading>
                .
              </Heading>
              {/* <Heading size="subtitle.lg" as="h3" textAlign="center">
                Everything you need, in one place.
              </Heading> */}
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
              Think multi-chain.
            </Heading>
            <Heading size="subtitle.lg" as="h3" textAlign="center">
              Continuously adding support for the most in-demand chains.
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
                We may introduce optional advanced features which you can decide
                to pay for in the future. We will always be transparent and
                clear about any paid features up front.
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
            <Heading as="h3" maxW="600px" textAlign="center" size="subtitle.lg">
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
    </DarkMode>
  );
};

HomePage.pageId = PageId.Homepage;

export default HomePage;

interface ContractsDescriptorItemProps {
  title: string;
  description: string | JSX.Element;
  icon: StaticImageData;
}

const ContractsDescriptorItem: React.FC<ContractsDescriptorItemProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <Flex gap={4} align="center">
      <ChakraNextImage boxSize={12} src={icon} alt="" flexShrink={0} />
      <Flex gap={1} direction="column">
        <Heading size="label.lg">{title}</Heading>
        <Text size="body.md">{description}</Text>
      </Flex>
    </Flex>
  );
};

const NewsLetterSection: React.FC = () => {
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  return (
    <Box bgColor="rgba(0,0,0,.6)" zIndex="100">
      <Container as="section" maxW="container.page" color="gray.500">
        <Stack
          spacing="8"
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          py={{ base: "12", md: "16" }}
          px={12}
        >
          <Stack direction="row" spacing={5} align="center">
            <Icon boxSize={8} color="white" as={MdMarkEmailRead} />
            <Stack>
              <Text color="white" size="label.lg">
                Sign up for our newsletter
              </Text>
              <Text>
                Join 40,000+ builders and stay up to date with our latest
                updates and news.
              </Text>
            </Stack>
          </Stack>

          <form
            onSubmit={form.handleSubmit(async (data) => {
              try {
                await fetch("/api/email-signup", {
                  method: "POST",
                  body: JSON.stringify({ email: data.email }),
                });
                form.setValue("email", "");
              } catch (err) {
                console.error(err);
              }
            })}
          >
            <Flex gap={0} minW={{ base: "100%", md: "350px" }}>
              <FormControl isRequired>
                <Input
                  borderRightRadius={0}
                  type="email"
                  borderColor="purple.500"
                  borderRight={0}
                  _hover={{ borderColor: "purple.500" }}
                  _focus={{ borderColor: "purple.500" }}
                  placeholder="Enter your email"
                  {...form.register("email")}
                  autoComplete="email"
                />
              </FormControl>
              <Button
                borderLeftRadius={0}
                flexShrink={0}
                isLoading={form.formState.isSubmitting}
                type="submit"
                mr={2}
                colorScheme="purple"
              >
                Sign up
              </Button>
            </Flex>
          </form>
        </Stack>
      </Container>
    </Box>
  );
};
