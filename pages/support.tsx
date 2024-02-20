import {
  Box,
  Container,
  Flex,
  GridItem,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import { ContactSupportModal } from "components/help/contact-support-modal";
import { NeedSomeHelp } from "components/help/need-some-help";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { FiArrowRight } from "react-icons/fi";
import { Card, Heading, Link, LinkButton, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const helpProducts = [
  {
    title: "Connect",
    icon: require("public/assets/support/wallets.svg"),
    viewAllUrl: "https://support.thirdweb.com/wallets/dwWCB7ZD5sNcHEAj4rFFui",
    helpArticles: [
      {
        title: "Smart Wallet FAQ",
        url: "https://support.thirdweb.com/wallets/dwWCB7ZD5sNcHEAj4rFFui/smart-wallet-faqs/64y68nzTQkUZw6r6FryFgK",
      },
      {
        title: "Embedded Wallet FAQ",
        url: "https://support.thirdweb.com/wallets/dwWCB7ZD5sNcHEAj4rFFui/embedded-wallet-faqs/rhkKeknMUEdyDbRPnLFz1s",
      },
    ],
  },
  {
    title: "Contracts",
    icon: require("public/assets/support/contracts.svg"),
    viewAllUrl:
      "https://support.thirdweb.com/smart-contracts/rtHYyzspnPaHmmANmJQz1k/",
    helpArticles: [
      {
        title: "Contract Verification",
        url: "https://support.thirdweb.com/other-faqs/tFbbEYCSbJ1GTeXoPs4QFw/how-to-verify-thirdweb-prebuilt-contracts/4VGyYhzjaSJ9JjmVQ6WNL6",
      },
      {
        title: "Batch Upload Troubleshooting",
        url: "https://support.thirdweb.com/smart-contracts/rtHYyzspnPaHmmANmJQz1k/batch-upload-troubleshooting/5WMQFqfaUTU1C8NM8FtJ2X",
      },
      {
        title: "Contract Verification with Blockscout API",
        url: "https://support.thirdweb.com/other-faqs/tFbbEYCSbJ1GTeXoPs4QFw/blockscout-api-contract-verification/qpa9r79QkgH31HFsvGissC",
      },
    ],
  },
  {
    title: "Infrastructure",
    icon: require("public/assets/support/engine.svg"),
    viewAllUrl:
      "https://support.thirdweb.com/infrastructure/eRgkLPBdL1WJJLzAbuWrPZ",
    helpArticles: [
      {
        title: "Storage FAQ",
        url: "https://support.thirdweb.com/infrastructure/eRgkLPBdL1WJJLzAbuWrPZ/storage-faqs/6AX8F9vCWuiAhVGqttRo8E",
      },
      {
        title: "RPC Edge FAQ",
        url: "https://support.thirdweb.com/infrastructure/eRgkLPBdL1WJJLzAbuWrPZ/rpc-edge-faqs/tfYpb77UP8c4qw83qGsjFY",
      },
      {
        title: "Add Custom RPC to your app",
        url: "https://support.thirdweb.com/infrastructure/eRgkLPBdL1WJJLzAbuWrPZ/adding-a-custom-rpc-to-your-app/aQSJ8nDisLwUe49zY2KqrF",
      },
    ],
  },
  {
    title: "Payments",
    icon: require("public/assets/support/payments.svg"),
    viewAllUrl: "https://support.thirdweb.com/payments/dsjpUFZYNivScVEb3PZGrj/",
    helpArticles: [
      {
        title: "Checkout buyer FAQ",
        url: "https://support.thirdweb.com/payments/dsjpUFZYNivScVEb3PZGrj/paper-buyer-faq/dejjmXeDPPAEJsA6n35pCi",
      },
      {
        title: "NFT Checkout Buyer FAQ",
        url: "https://support.thirdweb.com/payments/dsjpUFZYNivScVEb3PZGrj/nft-checkout-faqs/pC2JvfwLpXdeH9Dncv5dUm",
      },
    ],
  },
  {
    title: "Account",
    icon: require("public/assets/support/account.svg"),
    viewAllUrl: "https://portal.thirdweb.com/account",
    helpArticles: [
      {
        title: "Manage billing",
        url: "https://portal.thirdweb.com/account/billing/manage-billing",
      },
      {
        title: "Upgrade plans",
        url: "https://portal.thirdweb.com/account/billing/upgrade-plan",
      },
      {
        title: "Account Info",
        url: "https://portal.thirdweb.com/account/billing/account-info",
      },
    ],
  },
  {
    title: "MISC",
    icon: require("public/assets/support/misc.svg"),
    viewAllUrl: "https://support.thirdweb.com/",
    helpArticles: [
      {
        title: "Troubleshooting error messages",
        url: "https://support.thirdweb.com/troubleshooting-errors/7Y1BqKNvtLdBv5fZkRZZB3",
      },
      {
        title: "Add EVM to thirdweb chainlist",
        url: "https://support.thirdweb.com/other-faqs/tFbbEYCSbJ1GTeXoPs4QFw/how-to-add-your-evm-chain-to-thirdweb%E2%80%99s-chainlist-/3HMqrwyxXUFxQYaudDJffT",
      },
      {
        title: "API Keys",
        url: "https://portal.thirdweb.com/account/api-keys",
      },
    ],
  },
];

const SuppportPage: ThirdwebNextPage = () => {
  const title = "Support Page";
  const description = "thirdweb support page.";

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
          /*           images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/help.png`,
              width: 1200,
              height: 630,
              alt: title,
            },
          ], */
        }}
      />
      <NeedSomeHelp />
      <Container maxW="container.page" mb={{ base: 12, md: 40 }} mt={12}>
        <SimpleGrid columns={{ base: 1, md: 12 }} gap={{ base: 4, md: 12 }}>
          <GridItem colSpan={{ base: 1, md: 8 }}>
            <Flex
              direction="column"
              mx="auto"
              pb={8}
              overflowX="hidden"
              gap={{ base: 4, md: 8 }}
            >
              <Heading size="title.md">Popular links by products</Heading>
              <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: 4, md: 6 }}>
                {helpProducts.map((product) => (
                  <Card key={product.title} as={Flex} flexDir="column" gap={4}>
                    <Flex justifyContent="space-between">
                      <Flex gap={2} alignItems="center">
                        {product.icon && (
                          <ChakraNextImage
                            boxSize={6}
                            src={product.icon}
                            alt="icon"
                          />
                        )}
                        <Heading size="label.lg">{product.title}</Heading>
                      </Flex>
                      <Link
                        href={product.viewAllUrl}
                        _hover={{
                          textDecoration: "none",
                          opacity: 0.8,
                        }}
                        isExternal
                        noIcon
                      >
                        <Flex alignItems="center" gap={1}>
                          <Text color="blue.500" size="body.md">
                            View all
                          </Text>
                          <Icon
                            as={FiArrowRight}
                            color="blue.500"
                            boxSize={3}
                          />
                        </Flex>
                      </Link>
                    </Flex>
                    <Flex flexDir="column" gap={2}>
                      {product.helpArticles.map((article) => (
                        <Link
                          key={article.title}
                          href={article.url}
                          _hover={{
                            textDecoration: "none",
                            opacity: 0.8,
                          }}
                          isExternal
                          noIcon
                        >
                          <Heading
                            size="label.md"
                            color="blue.500"
                            fontWeight="normal"
                          >
                            {article.title}
                          </Heading>
                        </Link>
                      ))}
                    </Flex>
                  </Card>
                ))}
              </SimpleGrid>
              <Card
                as={Flex}
                flexDir="column"
                p={6}
                bgColor="#291a37"
                _light={{
                  bgColor: "#d4bbeb",
                }}
                gap={{ base: 4, md: 0 }}
              >
                <Flex justifyContent="space-between">
                  <Flex flexDir="column" gap={4}>
                    <Heading size="title.sm">
                      The thirdweb Discord community
                    </Heading>
                    <Text>
                      Join our Discord community for thirdweb developers!
                    </Text>
                    <Box>
                      <LinkButton
                        href="https://discord.gg/thirdweb"
                        isExternal
                        colorScheme="primary"
                        variant="outline"
                        noIcon
                        borderColor="#3e3344"
                        _light={{
                          borderColor: "#7e7d86",
                        }}
                      >
                        Join Discord
                      </LinkButton>
                    </Box>
                  </Flex>
                  <ChakraNextImage
                    display={{
                      base: "none",
                      md: "block",
                    }}
                    boxSize={48}
                    src={require("public/assets/support/discord-illustration.png")}
                    alt="icon"
                  />
                </Flex>
                <Text>
                  Please note that our Discord server is managed by our
                  community moderators and does not offer official support.
                </Text>
              </Card>
            </Flex>
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 4 }}>
            <Flex flexDir="column" gap={8}>
              <Flex
                flexDir="column"
                gap={4}
                display={{
                  base: "none",
                  md: "flex",
                }}
              >
                <Heading size="title.sm">Contact Support</Heading>
                <Text>
                  We are here to help. Ask product questions, report problems,
                  or leave feedback.
                </Text>
                <ContactSupportModal />
              </Flex>
              <Flex flexDir="column" gap={6}>
                <Flex flexDir="column" gap={2}>
                  <Text>
                    Questions about our plans, pricing, or request a demo?
                  </Text>
                  <Link
                    href="/contact-us"
                    _hover={{
                      textDecoration: "none",
                      opacity: 0.8,
                    }}
                    isExternal
                    noIcon
                  >
                    <Flex alignItems="center" gap={1}>
                      <Text color="primary.500" size="body.md">
                        Talk to Sales
                      </Text>
                      <Icon as={FiArrowRight} color="primary.500" boxSize={3} />
                    </Flex>
                  </Link>
                </Flex>
                <Flex flexDir="column" gap={2}>
                  <Text>
                    Get an overview of thirdweb products, features, and how to
                    use them.
                  </Text>
                  <Link
                    href="https://portal.thirdweb.com"
                    _hover={{
                      textDecoration: "none",
                      opacity: 0.8,
                    }}
                    isExternal
                    noIcon
                  >
                    <Flex alignItems="center" gap={1}>
                      <Text color="primary.500" size="body.md">
                        Visit Docs
                      </Text>
                      <Icon as={FiArrowRight} color="primary.500" boxSize={3} />
                    </Flex>
                  </Link>
                </Flex>
              </Flex>
              <Flex
                display={{
                  base: "flex",
                  md: "none",
                }}
              >
                <ContactSupportModal />
              </Flex>
            </Flex>
          </GridItem>
        </SimpleGrid>
      </Container>
    </>
  );
};

export default SuppportPage;
SuppportPage.pageId = PageId.Support;
SuppportPage.getLayout = (page, props) => {
  return (
    <AppLayout
      layout="custom-contract"
      noSEOOverride
      dehydratedState={props.dehydratedState}
    >
      {page}
    </AppLayout>
  );
};
