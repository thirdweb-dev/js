import {
  Box,
  Container,
  Flex,
  GridItem,
  Icon,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { LandingLayout } from "components/landing-pages/layout";
import { PageId } from "page-id";
import { Card, Heading, Link, Text, TrackedLinkButton } from "tw-components";
import { ThirdwebNextPage } from "utils/types";
import { IoCheckmarkCircle } from "react-icons/io5";
import { LandingFAQ } from "components/landing-pages/faq";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PricingSection } from "components/homepage/sections/PricingSection";

const TRACKING_CATEGORY = "pricing-page";

const SECTIONS = [
  {
    title: "Infrastructure",
    icon: require("public/assets/product-icons/infrastructure.png"),
    items: [
      {
        title: "RPC Requests",
        starter: "Unlimited",
        pro: "Unlimited",
      },
      {
        title: "RPC Rate Limit",
        starter: "100 Requests Per Second",
        pro: "2000 Requests Per Second",
      },
      {
        title: "Storage Gateway Requests",
        starter: "Unlimited",
        pro: "Unlimited",
      },
      {
        title: "Storage Gateway Rate Limit",
        starter: "100 Requests Per Second",
        pro: "2000 Requests Per Second",
      },
      {
        title: "Storage Pinning",
        starter: "Free up to 50 GB +$0.10 per GB after",
        pro: "Free up to 50 GB +$0.10 per GB after",
      },
      {
        title: "Storage Pinning File Size",
        starter: "5GB (per file size)",
        pro: "25GB (per file size)",
      },
    ],
  },
  {
    title: "Wallets",
    icon: require("public/assets/product-icons/wallets.png"),
    items: [
      {
        title: "Email Wallet (Self-Recovery)",
        starter: "Unlimited",
        pro: "Unlimited",
      },
      {
        title: "Email Wallet (Managed Recovery)",
        starter:
          "Free up to 10,000 Monthly Active Wallets ($0.02 per Wallet after)",
        pro: "Free up to 10,000 Monthly Active Wallets ($0.02 per Wallet after)",
      },
      {
        title: "Device Wallet",
        starter: "Unlimited",
        pro: "Unlimited",
      },
      {
        title: "Smart Wallet",
        starter: "Unlimited",
        pro: "Unlimited",
      },
    ],
  },
  {
    title: "Payments",
    icon: require("public/assets/product-icons/payments.png"),
    items: [
      {
        title: "Checkout - Seller Fee",
        starter: "Free",
        pro: "Free",
      },
      {
        title: "Checkout - Buyer Fee (By Fiat)",
        starter: "4.9% + $0.30",
        pro: "4.9% + $0.30",
      },
      {
        title: "Checkout - Buyer Fee (By Crypto)",
        starter: "1%",
        pro: "1%",
      },
      {
        title: "Checkout - Transaction Limit",
        starter: "$2,500 Per Transaction Limit",
        pro: "$15,000 Per Transaction Limit ",
      },
      {
        title: "Sponsored transactons - Bundler",
        starter: "Free",
        pro: "Free",
      },
      {
        title: "Sponsored transactons - Paymaster",
        starter: "10% premium on top of network fee",
        pro: "10% premium on top of network fee",
      },
      {
        title: "Sponsored transactions - Gasless Relayer",
        starter: "10% premium on top of network fee",
        pro: "10% premium on top of network fee",
      },
    ],
  },
  /* {
    title: "Platform",
    icon: require("public/assets/product-icons/dashboards.png"),
    items: [
      {
        title: "Custom RPC / IPFS Domains",
        comingSoon: true,
        starter: "--",
        pro: "checkmark",
      },
      {
        title: "White labelling",
        comingSoon: true,
        starter: "--",
        pro: "checkmark",
      },
      {
        title: "Team Seats",
        comingSoon: true,
        starter: "--",
        pro: "checkmark",
      },
      {
        title: "Appchain/Subnet Support",
        comingSoon: true,
        starter: "--",
        pro: "checkmark",
      },
      {
        title: "Single Sign-on",
        comingSoon: true,
        starter: "--",
        pro: "checkmark",
      },
      {
        title: "HTML files for IPFS",
        comingSoon: true,
        starter: "--",
        pro: "checkmark",
      },
    ],
  }, */
  {
    title: "Support",
    icon: require("public/assets/product-icons/support.png"),
    items: [
      {
        title: "Infrastructure SLAs",
        starter: "--",
        pro: "99.9% Uptime",
      },
      {
        title: "Customer support SLAs",
        starter: "--",
        pro: "24 hours Dedicated Support",
      },
      {
        title: "Prioritized Customer Support",
        starter: "--",
        pro: "checkmark",
      },
      {
        title: "Dedicated Slack support channel",
        starter: "Discord Support Only",
        pro: "checkmark",
      },
    ],
  },
];

const generalFaqs = [
  {
    title: "How do I get started?",
    description: (
      <Text>
        thirdweb Starter plan is open and completely self-serve. We&apos;ve made
        it easy for you to get started — simply connect your wallet to start
        using thirdweb platform. You only need to create an account with your
        email address and add payment method when you&apos;re approaching your
        monthly free usage limits (so that we can send you billing updates if
        you go over).
      </Text>
    ),
  },
  {
    title: "How do I sign up for thirdweb pro plan?",
    description: (
      <Text>
        To sign for a thirdweb pro plan,{" "}
        <Link href="/contact-us" color="blue.500">
          Contact Sales
        </Link>{" "}
        team to learn about thirdweb pro features and get a quote for monthly
        subscription fee.
      </Text>
    ),
  },
  {
    title: "How do I update my payment method?",
    description: (
      <Text>
        Go to thirdweb Settings &gt; Billing in{" "}
        <Link href="/dashboard/settings/billing" color="blue.500">
          Dashboard
        </Link>
      </Text>
    ),
  },
  {
    title: "Where can I see my usage history?",
    description: (
      <Text>
        Go to thirdweb Settings &gt; Billing in{" "}
        <Link href="/dashboard/settings/billing" color="blue.500">
          Dashboard
        </Link>
      </Text>
    ),
  },
];

const pricingFaqs = [
  {
    title: "How are RPCs calculated?",
    description: (
      <Text>
        RPC usage is calculated by requests per second. For the starter plan,
        users are allowed 100 requests per second rate limit for free. For the
        pro plan, this rate limit increases 2,000 requests per second rate
        limit. Contact sales to upgrade to thirdweb pro plan.
      </Text>
    ),
  },
  {
    title: "How is Storage Pinning calculated?",
    description: (
      <Text>
        Storage pinning usage is calculated by GB per file size. For the starter
        plan, users receive 50GB monthly free limit + 5GB per file size rate
        limit. For the pro plan, this rate limit increases to 25GB per file size
        rate limit. Contact sales to upgrade to thirdweb pro plan.
      </Text>
    ),
  },
  {
    title: "How is Storage Gateway calculated?",
    description: (
      <Text>
        Storage gateway usage is calculated by GB per file size. For the starter
        plan, users get 100 requests per second rate limit for free. For the pro
        plan, this rate limit increases to 2000 requests per second rate limit.
        Contact sales to upgrade to thirdweb pro plan.
      </Text>
    ),
  },
  {
    title: "How is Email Wallet (managed recovery code) calculated?",
    description: (
      <Text>
        Email wallet (with managed recovery code) usage is calculated by monthly
        active wallets (i.e. active as defined by at least 1 user log-in via
        email or social within the billing period month). For both the starter
        and pro plan, users receive 10,000 free monthly active wallets + charged
        $0.02 per incremental monthly active wallet after. Note that wallets
        with self recovery code is completely free to use.
      </Text>
    ),
  },
  {
    title: "How is Payments Gasless calculated?",
    description: (
      <Text>
        Gasless is calculated by sponsored network fees. For both the starter
        and pro plan, users are charged 10% premium on top of sponsored network
        fees.
      </Text>
    ),
  },
  {
    title: "How is Payments Paymaster calculated?",
    description: (
      <Text>
        Paymaster usage is calculated by sponsored network fees. For both the
        starter and pro plan, users are charged 10% premium on top of sponsored
        network fees.
      </Text>
    ),
  },
  {
    title: "How is Payments Bundler calculated?",
    description: (
      <Text>
        Bundler usage is calculated by sponsored network fees. For both the
        starter and pro plan, users are charged 10% premium on top of sponsored
        network fees.
      </Text>
    ),
  },
];

const Pricing: ThirdwebNextPage = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <LandingLayout
      seo={{
        title: "thirdweb Pro: Build production-grade web3 apps at scale",
        description:
          "The most efficient way to build web3 apps for millions of users — with a robust infrastructure stack that scales as you grow. Learn more.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/thirdweb-pro.png`,
              width: 1200,
              height: 630,
              alt: "thirdweb Pro",
            },
          ],
        },
      }}
    >
      <Container
        maxW="container.page"
        as={Flex}
        flexDir="column"
        gap={{ base: "80px", md: "120px" }}
      >
        <PricingSection TRACKING_CATEGORY={TRACKING_CATEGORY} />
        <Flex flexDir="column" gap={20}>
          {SECTIONS.map((section) => (
            <Flex flexDir="column" key={section.title} gap={4}>
              <SimpleGrid columns={3}>
                <Flex gap={2} alignItems="center">
                  <ChakraNextImage src={section.icon} boxSize={5} alt="" />{" "}
                  <Text color="white" size="body.xl">
                    {section.title}
                  </Text>
                </Flex>
                {!isMobile && (
                  <>
                    <Text size="body.xl" color="gray.600" textAlign="center">
                      Starter
                    </Text>
                    <Text
                      size="body.xl"
                      color="gray.600"
                      textAlign="center"
                      bgGradient="linear(to-r, #4830A4, #9786DF)"
                      bgClip="text"
                    >
                      Pro
                    </Text>
                  </>
                )}
              </SimpleGrid>
              <Flex flexDir="column">
                {section.items.map((item) => (
                  <SimpleGrid
                    columns={{ base: 1, md: 3 }}
                    key={item.title}
                    alignItems="center"
                  >
                    <Card
                      borderRadius="none"
                      borderColor={{ base: "transparent", md: "gray.900" }}
                      borderLeft="none"
                      as={Flex}
                      alignItems="center"
                    >
                      <Flex gap={2}>
                        <Text color="white" size="body.lg">
                          {item.title}
                        </Text>
                        {(item as any)?.comingSoon && (
                          <Text color="gray.800" size="body.lg">
                            Coming Soon
                          </Text>
                        )}
                      </Flex>
                    </Card>
                    {item.starter === item.pro ? (
                      <GridItem colSpan={2}>
                        <Card
                          borderColor={{ base: "transparent", md: "gray.900" }}
                          borderRadius="none"
                          borderRight="none"
                        >
                          <Text
                            color="gray.600"
                            size="body.lg"
                            textAlign="center"
                          >
                            {item.starter === "checkmark" ? (
                              <Icon
                                as={IoCheckmarkCircle}
                                boxSize={4}
                                color="blue.500"
                              />
                            ) : (
                              item.starter
                            )}
                          </Text>
                        </Card>
                      </GridItem>
                    ) : (
                      <>
                        <Card
                          borderColor={{ base: "transparent", md: "gray.900" }}
                          borderRadius="none"
                        >
                          <Flex
                            justifyContent={{
                              base: "space-between",
                              md: "inherit",
                            }}
                          >
                            {isMobile && <Text size="body.lg">Starter</Text>}
                            <Text
                              w="full"
                              color="gray.600"
                              size="body.lg"
                              textAlign={{ base: "right", md: "center" }}
                            >
                              {item.starter === "checkmark" ? (
                                <Icon
                                  as={IoCheckmarkCircle}
                                  boxSize={4}
                                  color="blue.500"
                                />
                              ) : (
                                item.starter
                              )}
                            </Text>
                          </Flex>
                        </Card>
                        <Card
                          borderColor={{ base: "transparent", md: "gray.900" }}
                          borderRadius="none"
                          borderRight="none"
                        >
                          <Flex
                            justifyContent={{
                              base: "space-between",
                              md: "inherit",
                            }}
                          >
                            {isMobile && <Text size="body.lg">Pro</Text>}
                            <Text
                              color="gray.600"
                              size="body.lg"
                              textAlign={{ base: "right", md: "center" }}
                              w="full"
                            >
                              {item.pro === "checkmark" ? (
                                <Icon
                                  as={IoCheckmarkCircle}
                                  boxSize={4}
                                  color="blue.500"
                                />
                              ) : (
                                item.pro
                              )}
                            </Text>
                          </Flex>
                        </Card>
                      </>
                    )}
                  </SimpleGrid>
                ))}
              </Flex>
            </Flex>
          ))}
          {!isMobile && (
            <SimpleGrid columns={3} mt={-14}>
              <Box>&nbsp;</Box>
              <TrackedLinkButton
                mx={6}
                variant="outline"
                borderColor="gray.900"
                py={6}
                category={TRACKING_CATEGORY}
                label="starter"
                href="/dashboard/settings/billing"
              >
                Get Started
              </TrackedLinkButton>
              <TrackedLinkButton
                mx={6}
                bgColor="white"
                _hover={{
                  bgColor: "white",
                  opacity: 0.8,
                }}
                color="black"
                py={6}
                category={TRACKING_CATEGORY}
                label="pro"
                href="/contact-us"
              >
                Contact Sales
              </TrackedLinkButton>
            </SimpleGrid>
          )}
        </Flex>
        <Flex gap={4} flexDir="column" alignItems="center">
          <Heading size="title.xl" color="white">
            FAQ
          </Heading>
          <LandingFAQ
            title="General"
            faqs={generalFaqs}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
          />
          <LandingFAQ
            title="Pricing"
            faqs={pricingFaqs}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
          />
        </Flex>
      </Container>
    </LandingLayout>
  );
};

Pricing.pageId = PageId.Pricing;

export default Pricing;
