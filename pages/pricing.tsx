import {
  Box,
  Container,
  Flex,
  GridItem,
  Icon,
  SimpleGrid,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { LandingLayout } from "components/landing-pages/layout";
import { PageId } from "page-id";
import { Card, Heading, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";
import { IoCheckmarkCircle } from "react-icons/io5";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { LandingFAQ } from "components/landing-pages/faq";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PricingSection } from "components/homepage/sections/PricingSection";
import { FAQ_GENERAL, FAQ_PRICING, SECTIONS } from "utils/pricing";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useLocalStorage } from "hooks/useLocalStorage";
import { useRouter } from "next/router";
import { useEffect } from "react";

const TRACKING_CATEGORY = "pricing-page";

const Pricing: ThirdwebNextPage = () => {
  const router = useRouter();
  const [claimGrowth, setClaimedGrowth] = useLocalStorage(
    "claim-growth-trial",
    false,
    true,
  );

  const isMobile = useBreakpointValue({ base: true, lg: false }) as boolean;

  useEffect(() => {
    const { claimGrowth: claimGrowthQuery } = router.query;

    if (claimGrowthQuery !== undefined) {
      setClaimedGrowth(true);
      router.replace("/pricing");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <LandingLayout
      seo={{
        title: "thirdweb Growth: Build production-grade web3 apps at scale",
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
        gap={{ base: "80px", lg: "120px" }}
      >
        <PricingSection
          trackingCategory={TRACKING_CATEGORY}
          canTrialGrowth={claimGrowth}
        />

        <Flex flexDir="column" gap={20}>
          {SECTIONS.map((section) => (
            <Flex flexDir="column" key={section.title} gap={4}>
              <SimpleGrid columns={isMobile ? 2 : 4}>
                <Flex gap={2} alignItems="center" pl={4}>
                  <Text color="white" size="body.lg">
                    {section.title}
                  </Text>
                </Flex>

                {!isMobile && (
                  <>
                    <Text size="body.lg" color="gray.600" textAlign="center">
                      Starter
                    </Text>
                    <Text size="body.lg" color="gray.600" textAlign="center">
                      Growth
                    </Text>
                    <Text size="body.lg" color="gray.600" textAlign="center">
                      Pro
                    </Text>
                  </>
                )}
              </SimpleGrid>

              <Flex flexDir="column">
                {section.items.map((item) => {
                  const isShared = !isMobile && item.starter === item.growth;

                  return (
                    <SimpleGrid
                      columns={{ base: 1, lg: 4 }}
                      key={item.title}
                      alignItems="center"
                    >
                      <Flex justifyContent="space-between">
                        <Card
                          borderRadius="none"
                          borderColor={{ base: "transparent", lg: "gray.900" }}
                          borderWidth={0.5}
                          borderLeft="none"
                          as={Flex}
                          alignItems="center"
                          flex={1}
                        >
                          <Flex
                            gap={2}
                            h={isMobile ? "auto" : 6}
                            flexDir={isMobile ? "column" : "row"}
                          >
                            <Text color="white" size="body.md" noOfLines={1}>
                              {item.title}
                            </Text>
                            {(item as any)?.hint && (
                              <>
                                {isMobile ? (
                                  <Text color="gray.700">{item.hint}</Text>
                                ) : (
                                  <Tooltip
                                    label={
                                      <Card
                                        py={2}
                                        px={4}
                                        bgColor="backgroundHighlight"
                                        borderRadius="lg"
                                      >
                                        <Text size="label.sm" lineHeight={1.5}>
                                          {item.hint}
                                        </Text>
                                      </Card>
                                    }
                                    p={0}
                                    bg="transparent"
                                    boxShadow="none"
                                  >
                                    <Box pt={0.5}>
                                      <Icon
                                        as={IoIosInformationCircleOutline}
                                        boxSize={4}
                                        color="blue.500"
                                      />
                                    </Box>
                                  </Tooltip>
                                )}
                              </>
                            )}
                            {(item as any)?.comingSoon && (
                              <Text color="gray.800" size="body.md">
                                Coming Soon
                              </Text>
                            )}
                          </Flex>
                        </Card>
                      </Flex>
                      {isShared ? (
                        <GridItem colSpan={2}>
                          <Item
                            plan="Starter"
                            title={item.starter}
                            isMobile={isMobile}
                          />
                        </GridItem>
                      ) : (
                        <>
                          <Item
                            plan="Starter"
                            title={item.starter}
                            isMobile={isMobile}
                          />
                          <Item
                            plan="Growth"
                            title={item.growth}
                            isMobile={isMobile}
                          />
                        </>
                      )}
                      <Item plan="Pro" title={item.pro} isMobile={isMobile} />
                    </SimpleGrid>
                  );
                })}
              </Flex>
            </Flex>
          ))}
        </Flex>
        <Flex gap={4} flexDir="column" alignItems="center">
          <Heading size="title.xl" color="white">
            FAQ
          </Heading>
          <LandingFAQ
            title="General"
            faqs={FAQ_GENERAL}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
          />
          <LandingFAQ
            title="Key Terminologies"
            faqs={FAQ_PRICING}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
          />
        </Flex>
      </Container>
    </LandingLayout>
  );
};

const Item = ({
  title,
  plan,
  isMobile,
}: {
  title: string | string[];
  plan?: string;
  isMobile?: boolean;
}) => {
  const titleStr = Array.isArray(title) ? title[0] : title;
  const titleEl = (
    <Text
      w="full"
      color="gray.600"
      size="body.md"
      textAlign={{ base: "right", lg: "center" }}
    >
      {titleStr === "checkmark" ? (
        <Icon as={IoCheckmarkCircle} boxSize={4} color="blue.500" />
      ) : (
        titleStr
      )}
    </Text>
  );

  return (
    <Card
      borderColor={{
        base: "transparent",
        lg: "gray.900",
      }}
      borderRadius="none"
      borderWidth={0.5}
      borderRight="none"
      py={isMobile ? 1 : 4}
    >
      <Flex
        justifyContent={{
          base: "space-between",
          lg: "center",
        }}
        borderBottomWidth={isMobile ? 1 : 0}
        borderBottomColor="gray.900"
        pb={isMobile ? 2 : 0}
        h={isMobile ? "auto" : 6}
      >
        {isMobile && plan && <Text>{plan}</Text>}
        {Array.isArray(title) ? (
          <Flex
            alignItems={isMobile ? "flex-end" : "center"}
            justifyItems="center"
            gap={2}
          >
            {titleEl}
            {isMobile ? (
              <Text color="gray.700" minW="max-content">
                {title[1]}
              </Text>
            ) : (
              <Tooltip
                label={
                  <Card
                    py={2}
                    px={4}
                    bgColor="backgroundHighlight"
                    borderRadius="lg"
                  >
                    <Text size="label.sm" lineHeight={1.5}>
                      {title[1]}
                    </Text>
                  </Card>
                }
                p={0}
                bg="transparent"
                boxShadow="none"
              >
                <Box pt={1}>
                  <Icon
                    as={AiOutlineDollarCircle}
                    boxSize={4}
                    color="blue.500"
                  />
                </Box>
              </Tooltip>
            )}
          </Flex>
        ) : (
          titleEl
        )}
      </Flex>
    </Card>
  );
};

Pricing.pageId = PageId.Pricing;

export default Pricing;
