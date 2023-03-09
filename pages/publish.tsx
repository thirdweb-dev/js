import { Flex, SimpleGrid } from "@chakra-ui/react";
import { GuidesShowcase } from "components/product-pages/common/GuideShowcase";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { SolutionsTextImage } from "components/product-pages/common/SolutionsTextImage";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { LinkButton, Text, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "publish";

const PUBLISH_GUIDES = [
  {
    title: "Introducing thirdweb Publish",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/02/publish-ogimage.png",
    link: "https://blog.thirdweb.com/thirdweb-release/",
  },
  {
    title: "Share your smart contracts with thirdweb Publish",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/03/Publish-your-smart-contracts-to-all-of-web3-2.png",
    link: "https://blog.thirdweb.com/guides/register-your-contract-using-thirdweb-release/",
  },
];

const Publish: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Publish",
        description:
          "Accelerate your protocol's growth. Publishing your contract is the best way to get your contracts in front of our 70k+ community of web3 developers.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/publish.png`,
              width: 2334,
              height: 1260,
              alt: "thirdweb Publish",
            },
          ],
        },
      }}
    >
      <Hero
        trackingCategory={TRACKING_CATEGORY}
        name="Publish"
        title="Share your contracts with the world."
        description="Accelerate your protocol's growth. Publishing your contract is the best way to get your contracts in front of our 70k+ community of web3 developers."
        buttonText="Get started"
        buttonLink="https://portal.thirdweb.com/publish"
        image={require("public/assets/product-pages/publish/hero.png")}
        gradient="linear-gradient(147.15deg, #410AB6 30.17%, #FBFF5C 100.01%)"
      >
        <Flex direction="column" gap={24}>
          <SimpleGrid
            justifyContent="flex-start"
            w="100%"
            columns={{ base: 1, md: 3 }}
            gap={{ base: 12, md: 6 }}
          >
            <ProductCard
              title="Save development time"
              icon={require("/public/assets/product-pages/publish/hero-icon-1.png")}
            >
              Focus on protocol development and save time by not having to build
              middleware layer yourself.
            </ProductCard>
            <ProductCard
              title="Unlock powerful tooling"
              icon={require("/public/assets/product-pages/publish/hero-icon-2.png")}
            >
              When your end users deploy your contracts from Explore, they
              unlock access to thirdweb tools that makes it easier to build on
              top of your contracts.
            </ProductCard>
            <ProductCard
              title="Shareable landing page"
              icon={require("/public/assets/product-pages/publish/hero-icon-3.png")}
            >
              <Text size="body.lg">
                By publishing a contract, it becomes easily shareable with a
                landing page for your contract. E.g.{" "}
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  label="unlock-protocol"
                  href="/unlock-protocol.eth/PublicLock"
                  textDecoration="underline"
                >
                  Unlock Protocol
                </TrackedLink>
                .
              </Text>
            </ProductCard>
          </SimpleGrid>

          <SolutionsTextImage
            image={require("/public/assets/product-pages/pre-builts/solution-cut.png")}
            title="Accelerate your protocol's growth."
          >
            <Text color="white" size="body.lg">
              Do you want to feature your contracts alongside world-class
              protocols & engineers? Get your contract in front of the 70k+ web3
              devs that visit this page every month. Get in touch!
            </Text>
            <Flex gap="12px" direction={{ base: "column", md: "row" }}>
              <LinkButton
                as={TrackedLink}
                {...{
                  category: "releases_get_deploys",
                  label: "contact_us",
                }}
                bg="white"
                color="black"
                href="https://form.typeform.com/to/FAwehBFl"
                isExternal
                noIcon
                _hover={{ bg: "rgba(255,255,255,.8)" }}
                boxShadow="0px 4px 4px rgba(0, 0, 0, 0.05)"
              >
                Submit contract
              </LinkButton>
              <LinkButton
                as={TrackedLink}
                {...{
                  category: "releases_get_deploys",
                  label: "explore",
                }}
                href="/explore"
                color="#fff"
                bg="transparent"
                border="1px solid rgba(255, 255, 255, 0.15)"
                filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.05))"
                _hover={{ bg: "rgba(255,255,255,.1)" }}
              >
                Explore contracts
              </LinkButton>
            </Flex>
          </SolutionsTextImage>

          <GuidesShowcase
            title="Learn how to publish contracts"
            category={TRACKING_CATEGORY}
            description="Check out our guides on how to publish contracts"
            solution="Publish"
            guides={PUBLISH_GUIDES}
          />
        </Flex>
      </Hero>
    </ProductPage>
  );
};

Publish.pageId = PageId.PublishLanding;

export default Publish;
