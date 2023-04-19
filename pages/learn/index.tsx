import {
  Box,
  Center,
  DarkMode,
  Flex,
  Icon,
  LightMode,
  SimpleGrid,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { HomepageFooter } from "components/footer/Footer";
import { NewsletterSection } from "components/homepage/sections/NewsletterSection";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductSection } from "components/product-pages/common/ProductSection";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { useTrack } from "hooks/analytics/useTrack";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import WhiteLogo from "public/assets/landingpage/white-logo.png";
import HeroImage from "public/assets/learn/hero.png";
import { BsLightningCharge } from "react-icons/bs";
import { Heading, LinkButton } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "learn";

const SEO = {
  title: "Learn Web3 Development | Web3 Course",
  description:
    "Learn everything you need to know about web3 development — whether you're a beginner or a full-stack developer. Get started with thirdweb.",
};

const Learn: ThirdwebNextPage = () => {
  const trackEvent = useTrack();

  return (
    <DarkMode>
      <NextSeo {...SEO} />
      <Flex
        sx={{
          // overwrite the theme colors because the home page is *always* in "dark mode"
          "--chakra-colors-heading": "#F2F2F7",
          "--chakra-colors-paragraph": "#AEAEB2",
          "--chakra-colors-borderColor": "rgba(255,255,255,0.1)",
          "--product-accent-color": "rgba(24, 67, 78, 0.8)",
        }}
        justify="center"
        flexDir="column"
        as="main"
        bg="#000"
      >
        <HomepageTopNav />
        {/* pull it up by as much as the topnav is tall */}
        <Box mt="-80px" overflowX="hidden">
          <Hero
            name="Web3 & thirdweb SDK"
            title="Learn. Build. Grow."
            description={
              <>
                Accelerate your journey to become a web3 developer with our
                expert-led program.
                <br />
                <br />
                Join the waitlist now! We are working on tailoring the
                experience best for you.
              </>
            }
            trackingCategory={TRACKING_CATEGORY}
            buttonText="Join waitlist"
            type="Learn"
            buttonLink="https://forms.gle/7WfLNoFJ7dp67HeKA"
            gradient="linear-gradient(145.96deg, rgb(142 14 255) 5.07%, #16bdf0 100%)"
            image={HeroImage}
          ></Hero>
          <ProductSection py={{ base: 12, md: 24 }}>
            <Heading size="title.2xl" as="h2" textAlign="center">
              Program Benefits
            </Heading>

            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap={{ base: 12, md: 6 }}
              py={{ base: 12, md: 24 }}
            >
              <ProductCard
                title="Domain Expertise"
                icon={require("/public/assets/product-pages/sdk/hero-icon-3.png")}
              >
                Our program will help you enhance your technical skills and
                knowledge, enabling you to excel in web3 development and become
                a master in the field.
              </ProductCard>
              <ProductCard
                title="Community Building"
                icon={require("/public/assets/product-pages/dashboard/hero-icon-2.png")}
              >
                Connect with a network of web3 developers and content matter
                experts through our program. Build lasting relationships and
                gain valuable insights to help you grow your career in web3.
              </ProductCard>
              <ProductCard
                title="Career Launch"
                icon={require("/public/assets/product-pages/sdk/hero-icon-2.png")}
              >
                Get access to valuable resources to help you find your next job
                or start your own web3 company.
              </ProductCard>
              <ProductCard
                title="Comprehensive curriculum"
                icon={require("/public/assets/product-pages/deploy/hero-icon-1.png")}
              >
                Learn essential web3 concepts and gain in-depth knowledge of the
                thirdweb SDK that empowers you to build secure decentralized
                applications.
              </ProductCard>
              <ProductCard
                title="Expert-Led Training"
                icon={require("/public/assets/product-pages/authentication/verify.png")}
              >
                Learn from industry-leading web3 developers who bring real-world
                experience and insights into the classroom.
              </ProductCard>
              <ProductCard
                title="Flexible Program Formats"
                icon={require("/public/assets/product-pages/dashboard/hero-icon-3.png")}
              >
                Choose from a range of program formats, including self-paced
                courses, virtual workshops, or live bootcamps, to suit your
                goals.
              </ProductCard>
            </SimpleGrid>
          </ProductSection>
          <ProductSection py={{ base: 12, md: 24 }}>
            <Heading size="title.2xl" as="h2" textAlign="center">
              Pick a Path
            </Heading>

            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap={{ base: 12, md: 6 }}
              py={{ base: 12, md: 24 }}
            >
              <ProductCard
                title="Product Manager"
                icon={require("/public/assets/product-pages/dashboard/hero-icon-1.png")}
              >
                Learn how to create, manage, and integrate NFTs and other
                digital assets into dApps and platforms using thirdweb
                technologies.
              </ProductCard>
              <ProductCard
                title="Web3 Developer"
                icon={require("/public/assets/product-pages/dashboard/hero-icon-1.png")}
              >
                For both front and back-end engineers to learn how to build
                secure and scalable dApps using the thirdweb SDK and relevant
                programming languages.
              </ProductCard>
              <ProductCard
                title="Back-end Engineer"
                icon={require("/public/assets/product-pages/dashboard/hero-icon-1.png")}
              >
                Gain expertise in developing web3 services by reviewing common
                server-side workflows as well as creating and integrating smart
                contracts using thirdweb&apos;s Solidity SDK.
              </ProductCard>
            </SimpleGrid>
          </ProductSection>
          <Box
            h="1px"
            bg="linear-gradient(93.96deg, rgba(25, 26, 27, 0.8) 17.14%, rgba(24, 67, 78, 0.8) 36.78%, rgba(108, 47, 115, 0.8) 61%, rgba(25, 26, 27, 0.8) 79.98%)"
            opacity="0.8"
          />
          <Box
            h="1px"
            bg="linear-gradient(93.96deg, rgba(25, 26, 27, 0.8) 17.14%, rgba(24, 67, 78, 0.8) 36.78%, rgba(108, 47, 115, 0.8) 61%, rgba(25, 26, 27, 0.8) 79.98%)"
            opacity="0.8"
          />
        </Box>
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
              Ready to learn more?
            </Heading>
            <LightMode>
              <LinkButton
                role="group"
                leftIcon={
                  <Icon
                    as={BsLightningCharge}
                    color="#1D64EF"
                    transitionDuration="slow"
                    transitionTimingFunction="easeOut"
                    _groupHover={{ color: "#E0507A" }}
                  />
                }
                color="black"
                px={20}
                py={{ base: 5, md: 7 }}
                onClick={() =>
                  trackEvent({
                    category: "cta-button",
                    action: "click",
                    label: "start",
                    title: "Join the waitlist",
                  })
                }
                textAlign="center"
                variant="gradient"
                fromcolor="#1D64EF"
                tocolor="#E0507A"
                size="lg"
                borderRadius="md"
                href="https://forms.gle/7WfLNoFJ7dp67HeKA"
              >
                <Box as="span" py={0.5}>
                  Join waitlist
                </Box>
              </LinkButton>
            </LightMode>
          </Flex>
        </HomepageSection>
        <NewsletterSection />
        <HomepageFooter />
      </Flex>
    </DarkMode>
  );
};

Learn.pageId = PageId.Learn;

export default Learn;
