import { Flex, Icon, SimpleGrid } from "@chakra-ui/react";
import { Aurora } from "../Aurora";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { Heading, Text, TrackedLink, TrackedLinkButton } from "tw-components";
import { ChakraNextImage } from "components/Image";
import styles from "../category/categories.module.css";
import { BsFillLightningChargeFill } from "react-icons/bs";

interface HeroSectionProps {
  TRACKING_CATEGORY: string;
}
const thirdwebRepoUrl = "https://github.com/thirdweb-dev";

const GithubIcon = () => {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      // eslint-disable-next-line react/forbid-dom-props
      className={styles.githubIcon}
    >
      <g id="github-mark-white 1" clipPath="url(#clip0_3418_4084)">
        <path
          id="Vector"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.3538 0.537842C4.62843 0.537842 0 5.20039 0 10.9686C0 15.5794 2.96559 19.4824 7.07966 20.8638C7.59402 20.9676 7.78243 20.6394 7.78243 20.3632C7.78243 20.1214 7.76547 19.2925 7.76547 18.4289C4.88529 19.0507 4.28552 17.1855 4.28552 17.1855C3.82265 15.9766 3.13684 15.6659 3.13684 15.6659C2.19415 15.0269 3.2055 15.0269 3.2055 15.0269C4.25118 15.096 4.79988 16.0976 4.79988 16.0976C5.7254 17.6863 7.21678 17.2374 7.81676 16.961C7.90238 16.2875 8.17684 15.8212 8.46825 15.5623C6.17109 15.3204 3.7542 14.4225 3.7542 10.4159C3.7542 9.27609 4.16535 8.34358 4.81684 7.61834C4.71405 7.35936 4.35397 6.28846 4.91984 4.85515C4.91984 4.85515 5.79406 4.57879 7.76526 5.92584C8.6092 5.69752 9.47954 5.58137 10.3538 5.58039C11.2281 5.58039 12.1192 5.7014 12.9422 5.92584C14.9136 4.57879 15.7878 4.85515 15.7878 4.85515C16.3537 6.28846 15.9934 7.35936 15.8906 7.61834C16.5592 8.34358 16.9534 9.27609 16.9534 10.4159C16.9534 14.4225 14.5366 15.3031 12.2222 15.5623C12.5995 15.8903 12.925 16.5119 12.925 17.4964C12.925 18.8951 12.9081 20.0178 12.9081 20.363C12.9081 20.6394 13.0967 20.9676 13.6108 20.864C17.7249 19.4822 20.6905 15.5794 20.6905 10.9686C20.7074 5.20039 16.0621 0.537842 10.3538 0.537842Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_3418_4084">
          <rect
            width="20.7695"
            height="20.3457"
            fill="white"
            transform="translate(0 0.537842)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export const HeroSection = ({ TRACKING_CATEGORY }: HeroSectionProps) => {
  return (
    <HomepageSection id="home">
      {/* top */}
      <Aurora
        pos={{ left: "50%", top: "0%" }}
        size={{ width: "2400px", height: "1400px" }}
        color="hsl(260deg 78% 35% / 40%)"
      />

      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        gap={{ base: 12, md: 8 }}
        mt={{ base: 4, md: 20 }}
        placeItems="center"
      >
        <Flex flexDir="column" gap={{ base: 6, md: 8 }}>
          <Flex flexDir="column" gap={4}>
            <Heading
              as="h1"
              size="title.2xl"
              fontWeight={800}
              px={{ base: 2, md: 0 }}
              fontSize={{ base: "36px", sm: "45px" }}
            >
              Full-stack,{" "}
              <TrackedLink
                label="open-source"
                category={TRACKING_CATEGORY}
                href={thirdwebRepoUrl}
                isExternal
              >
                <span
                  // eslint-disable-next-line react/forbid-dom-props
                  className={styles.animatedGradient}
                >
                  open-source <GithubIcon />
                </span>
              </TrackedLink>{" "}
              web3 development platform
            </Heading>
          </Flex>
          <Text size="body.xl" mr={6}>
            Frontend, backend, and onchain tools to build complete web3 apps —
            on every EVM chain.
          </Text>

          <Flex
            flexDirection={{ base: "column", sm: "row" }}
            gap={{ base: 4, md: 6 }}
          >
            <TrackedLinkButton
              leftIcon={<Icon as={BsFillLightningChargeFill} boxSize={4} />}
              py={6}
              px={8}
              w="full"
              bgColor="white"
              _hover={{
                bgColor: "white",
                opacity: 0.8,
              }}
              color="black"
              href="/dashboard"
              category={TRACKING_CATEGORY}
              label="get-started"
              fontWeight="bold"
              maxW={{ base: "full", sm: "fit-content" }}
            >
              Get started
            </TrackedLinkButton>

            <TrackedLinkButton
              variant="outline"
              w="full"
              py={6}
              px={8}
              href="https://portal.thirdweb.com"
              category={TRACKING_CATEGORY}
              label="see-docs"
              maxW={{ base: "full", sm: "fit-content" }}
              isExternal
            >
              See the docs
            </TrackedLinkButton>
          </Flex>
        </Flex>
        <Flex
          minW={{ base: "auto", md: "420px" }}
          maxW={{ base: "280px", sm: "400px", md: "500px" }}
          position="relative"
          className={styles.heroContainer}
        >
          <TrackedLink
            href="/connect"
            category={TRACKING_CATEGORY}
            label="connect-icon"
          >
            <ChakraNextImage
              src={require("../../../../public/assets/landingpage/desktop/icon-frontend.png")}
              alt="icon-frontend"
              maxW={{ base: "45px", sm: "60px", md: "75px" }}
              zIndex={2}
              cursor="pointer"
              className={styles.connect}
            />
          </TrackedLink>

          <TrackedLink
            href="/engine"
            category={TRACKING_CATEGORY}
            label="backend-icon"
          >
            <ChakraNextImage
              src={require("../../../../public/assets/landingpage/desktop/icon-backend.png")}
              alt="icon-backend"
              maxW={{ base: "45px", sm: "60px", md: "75px" }}
              position="absolute"
              zIndex={2}
              cursor="pointer"
              className={styles.backend}
            />
          </TrackedLink>

          <TrackedLink
            href="/contracts"
            category={TRACKING_CATEGORY}
            label="onchain-icon"
          >
            <ChakraNextImage
              src={require("../../../../public/assets/landingpage/desktop/icon-onchain.png")}
              alt="icon-onchain"
              maxW={{ base: "45px", sm: "60px", md: "75px" }}
              position="absolute"
              zIndex={2}
              cursor="pointer"
              className={styles.onchain}
            />
          </TrackedLink>

          <ChakraNextImage
            src={require("../../../../public/assets/landingpage/desktop/hero-homepage.png")}
            alt="hero-image"
            className={styles.heroImageV1}
          />

          <ChakraNextImage
            src={require("../../../../public/assets/landingpage/desktop/hero-homepage-v2.png")}
            alt="hero-image"
            className={styles.heroImageV2}
          />
        </Flex>
      </SimpleGrid>
    </HomepageSection>
  );
};
