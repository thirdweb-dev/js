import { Button } from "@/components/ui/button";
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
import { EngineTierCard } from "components/engine/tier-card";
import { PricingSection } from "components/homepage/sections/PricingSection";
import { LandingFAQ } from "components/landing-pages/faq";
import { LandingLayout } from "components/landing-pages/layout";
import { useTrack } from "hooks/analytics/useTrack";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { ArrowRightIcon, ChevronRight } from "lucide-react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoCheckmarkCircle } from "react-icons/io5";
import {
  Card,
  Heading,
  Link,
  Text,
  TrackedIconButton,
  TrackedLink,
} from "tw-components";
import { EcosystemWalletPricingCard } from "../app/(dashboard)/dashboard/connect/ecosystem/create/components/pricing-card";
import { FAQ_GENERAL, FAQ_PRICING, PRICING_SECTIONS } from "../utils/pricing";
import type { ThirdwebNextPage } from "../utils/types";

const TRACKING_CATEGORY = "pricing-page";

const Pricing: ThirdwebNextPage = () => {
  const isMobile = useBreakpointValue({ base: true, lg: false }) as boolean;

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
          canTrialGrowth={true}
        />

        <Flex flexDir="column" gap={20}>
          {PRICING_SECTIONS.map((section) => (
            <Flex flexDir="column" key={section.title} gap={4}>
              <SimpleGrid columns={isMobile ? 2 : 4}>
                <Flex gap={2} alignItems="center" pl={4}>
                  <Text color="white" size="body.xl">
                    {section.title}
                  </Text>
                </Flex>

                {!isMobile && (
                  <>
                    <Text size="body.xl" color="white" textAlign="center">
                      Starter
                    </Text>
                    <Text size="body.xl" color="white" textAlign="center">
                      Growth
                    </Text>
                    <Text size="body.xl" color="white" textAlign="center">
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
                            alignItems="center"
                          >
                            <Text color="white" size="body.md" noOfLines={1}>
                              {item.title}
                            </Text>
                            {item?.learnMore && (
                              <TrackedIconButton
                                as={Link}
                                href={item.learnMore}
                                isExternal
                                color="primary.500"
                                category="pricing-page"
                                label="learn-more"
                                trackingProps={{
                                  title: item.title,
                                }}
                                icon={<Icon as={FiExternalLink} />}
                                variant="ghost"
                                aria-label="Learn More"
                              >
                                Learn More
                              </TrackedIconButton>
                            )}
                            {item?.hint && (
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

        <Flex gap={{ base: 4, lg: 6 }} flexDir="column" alignItems="center">
          <Heading as="h2" size="title.xl" color="white">
            Add-ons
          </Heading>
          <Flex flexDir="column" gap={0} w="full">
            <Heading as="h3" size="subtitle.lg">
              Engine
            </Heading>
            <EnginePricing isMobile={isMobile} />
          </Flex>

          <EcosystemPricing />
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

const EnginePricing = ({ isMobile }: { isMobile: boolean }) => {
  const track = useTrack();
  const router = useRouter();

  return (
    <Flex flexDir="column" gap={4}>
      <Text>
        Host Engine on thirdweb with no setup or maintenance required.{" "}
        <TrackedLink
          href="https://portal.thirdweb.com/engine"
          isExternal
          color="blue.500"
          fontSize="small"
          category={TRACKING_CATEGORY}
          label="clicked-docs"
        >
          Learn more about Engine &rarr;
        </TrackedLink>
      </Text>
      <SimpleGrid columns={isMobile ? 1 : 3} gap={6}>
        <EngineTierCard
          tier="STARTER"
          ctaText="Get Started"
          onClick={() => {
            track({
              category: TRACKING_CATEGORY,
              action: "click",
              label: "clicked-cloud-hosted",
              tier: "STANDARD",
            });
            router.push("/dashboard/engine");
          }}
        />

        <EngineTierCard
          tier="PREMIUM"
          isPrimaryCta
          ctaText="Get Started"
          onClick={() => {
            track({
              category: TRACKING_CATEGORY,
              action: "click",
              label: "clicked-cloud-hosted",
              tier: "PREMIUM",
            });
            router.push("/dashboard/engine");
          }}
        />

        <EngineTierCard
          tier="ENTERPRISE"
          previousTier="Premium Engine"
          onClick={() => {
            track({
              category: TRACKING_CATEGORY,
              action: "click",
              label: "clicked-cloud-hosted",
              tier: "ENTERPRISE",
            });
            router.push("/contact-us");
          }}
        />
      </SimpleGrid>
    </Flex>
  );
};

const EcosystemPricing = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
      <h3 className="font-medium text-3xl col-span-1 lg:col-span-2 row-start-1 flex lg:hidden order-1">
        Ecosystem Wallets
      </h3>
      <div className="col-span-1 lg:col-span-2 flex flex-col gap-4 order-3 lg:order-2">
        <h3 className="font-medium text-3xl col-span-1 lg:col-span-2 row-start-1 hidden lg:flex">
          Ecosystem Wallets
        </h3>
        <p>
          Your own managed in-app wallet service that allows you to create a
          branded wallet and login system, and allow any number of partners to
          spin up in-app wallets.
        </p>
        <p>
          Ecosystem Wallets start at $250/mo per instance. Instances allow for
          up to 30,000 monthly active in-app wallets and $0.02 per additional
          monthly active in-app wallet.
        </p>
        <div className="flex flex-row gap-4">
          <Button size="lg" asChild className="gap-2">
            <NextLink href="/dashboard/connect/ecosystem/create">
              <span>Get Started</span>
              <ChevronRight className="size-4" />
            </NextLink>
          </Button>
          <Button size="lg" variant="outline" className="gap-2" asChild>
            <NextLink
              href="https://portal.thirdweb.com/connect/ecosystems/overview"
              target="_blank"
            >
              <span>Learn More</span>
              <ArrowRightIcon className="size-4 opacity-50 -rotate-45" />
            </NextLink>
          </Button>
        </div>
      </div>
      <EcosystemWalletPricingCard className="col-span-1 order-2 lg:order-3" />
    </div>
  );
};

Pricing.pageId = PageId.Pricing;

export default Pricing;
