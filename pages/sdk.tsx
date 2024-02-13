import { Flex, Icon, SimpleGrid } from "@chakra-ui/react";
import { Aurora } from "components/homepage/Aurora";
import { SDKSection } from "components/homepage/sections/SDKSection";
import { LOGO_OPTIONS } from "components/product-pages/common/CodeOptionButton";
import { GuidesShowcase } from "components/product-pages/common/GuideShowcase";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductLearnMoreCard } from "components/product-pages/common/ProductLearnMoreCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { ProductSection } from "components/product-pages/common/ProductSection";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Link } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const SDK_GUIDES = [
  {
    title: "Interact with Any Smart Contract in the SDK using ABIs",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/10/how-to-use-any-contract-3.png",
    link: "https://blog.thirdweb.com/guides/how-to-use-any-smart-contract-with-thirdweb-sdk-using-abi/",
  },
  {
    title: "How to Render NFT Metadata In a React App",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/11/This-is-the-one--18-.png",
    link: "https://blog.thirdweb.com/guides/how-to-render-nft-metadata-in-a-react-app-using-thirdwebnftmedia/",
  },
  {
    title: "Get Started with the Unity SDK",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/12/This-is-the-one--36-.png",
    link: "https://blog.thirdweb.com/guides/get-started-with-thirdwebs-unity-sdk/",
  },
];

const TRACKING_CATEGORY = "sdks";

const Web3SDK: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Powerful SDKs for every stack",
        description:
          "Build web3 applications that can interact with your smart contracts using our powerful SDKs and CLI.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/sdk.png`,
              width: 2334,
              height: 1260,
              alt: "thirdweb SDKs",
            },
          ],
        },
      }}
    >
      <Hero
        trackingCategory={TRACKING_CATEGORY}
        name="SDKs"
        title="Powerful SDKs for every stack"
        description="Build web3 applications that can interact with your smart contracts using our powerful SDKs and CLI."
        buttonText="Get started"
        buttonLink="https://portal.thirdweb.com/contracts/interact/overview"
        image={require("public/assets/product-pages/sdk/hero.png")}
        gradient="linear-gradient(147.15deg, #410AB6 30.17%, #5BFF40 100.01%)"
      >
        <SimpleGrid
          justifyContent="flex-start"
          w="100%"
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
        >
          <ProductCard
            title="Speaks your language"
            icon={require("/public/assets/product-pages/sdk/hero-icon-1.png")}
          >
            Use SDKs in programming languages that you are most comfortable
            with.
            <Flex
              mt={"auto"}
              pt={8}
              justifyContent="flex-end"
              alignItems="flex-end"
              gap={3}
            >
              {Object.keys(LOGO_OPTIONS).map((key) => (
                <Icon
                  boxSize={6}
                  key={key}
                  as={LOGO_OPTIONS[key as keyof typeof LOGO_OPTIONS].icon}
                  fill={LOGO_OPTIONS[key as keyof typeof LOGO_OPTIONS].fill}
                />
              ))}
            </Flex>
          </ProductCard>
          <ProductCard
            title="Go-to-market faster"
            icon={require("/public/assets/product-pages/sdk/hero-icon-2.png")}
          >
            Utilities for common use cases so that you do not have to reinvent
            the wheel every time and have faster development cycles.
          </ProductCard>
          <ProductCard
            title="Simplifying web3 complexity"
            icon={require("/public/assets/product-pages/sdk/hero-icon-3.png")}
          >
            Build apps and games that interact with contracts easily. Thorough
            developer documentation on following best practices. No need to
            configure manually for each partner provider.
          </ProductCard>
        </SimpleGrid>
      </Hero>
      <ProductSection py={{ base: 12, lg: 24 }}>
        <SDKSection title="Integrate web3 into your apps and games." />

        <Aurora
          pos={{ left: "50%", top: "40%" }}
          size={{ width: "2000px", height: "1300px" }}
          color={"hsl(223deg 40% 15%)"}
        />
      </ProductSection>

      <ProductSection>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          gap={{ base: 12, md: 6 }}
          py={{ base: 12, md: 24 }}
        >
          <ProductLearnMoreCard
            title="Web3 SDK"
            category={TRACKING_CATEGORY}
            description={
              <>
                Interact with your contracts from your app in the programming
                language that you’re familiar with our{" "}
                <Link
                  color="blue.500"
                  href="https://portal.thirdweb.com/react/latest"
                >
                  React
                </Link>
                ,{" "}
                <Link
                  color="blue.500"
                  href="https://portal.thirdweb.com/react-native/latest"
                >
                  ReactNative
                </Link>
                ,{" "}
                <Link
                  color="blue.500"
                  href="https://portal.thirdweb.com/python"
                >
                  Python
                </Link>
                ,{" "}
                <Link
                  color="blue.500"
                  href="https://portal.thirdweb.com/typescript/latest"
                >
                  TypeScript
                </Link>
                ,{" "}
                <Link color="blue.500" href="https://portal.thirdweb.com/go">
                  Go
                </Link>{" "}
                SDKs.
              </>
            }
            icon={require("/public/assets/product-pages/dashboard/hero-icon-3.png")}
            href="https://portal.thirdweb.com/"
          />
          <ProductLearnMoreCard
            title="UI Components SDK"
            category={TRACKING_CATEGORY}
            description="Plug-and-play UI Components for common web3 use cases, e.g. Connect Wallet button, Web3 button, NFT renderer, and IPFS renderer."
            icon={require("/public/assets/product-pages/dashboard/hero-icon-3.png")}
            href="/ui-components"
          />
          <ProductLearnMoreCard
            title="Game Engine SDK"
            category={TRACKING_CATEGORY}
            description="Unity SDK includes all supported platforms: Native (Windows, Mac, Linux), Mobile (iOS, Android), Console (PS, Xbox), Browser (WebGL). Unreal SDK coming soon."
            icon={require("/public/assets/product-pages/dashboard/hero-icon-3.png")}
            href="https://portal.thirdweb.com/unity"
          />
          <ProductLearnMoreCard
            title="Mobile SDK"
            category={TRACKING_CATEGORY}
            description="Integrate web3 into mobile apps with our React Native SDK. Comes with hooks and UI components that let you easily build native apps for iOS and Android."
            icon={require("/public/assets/product-pages/dashboard/hero-icon-3.png")}
            href="https://portal.thirdweb.com/react-native/latest"
          />
        </SimpleGrid>
      </ProductSection>

      <GuidesShowcase
        title="Learn how to build"
        category={TRACKING_CATEGORY}
        description="Check out our SDK guides to start building web3 apps."
        solution="SDK"
        guides={SDK_GUIDES}
      />
    </ProductPage>
  );
};

Web3SDK.pageId = PageId.Web3SDKLanding;

export default Web3SDK;
