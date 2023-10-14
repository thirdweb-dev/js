import { Container, Flex } from "@chakra-ui/react";
import { LandingDesktopMobileImage } from "components/landing-pages/desktop-mobile-image";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingGuidesShowcase } from "components/landing-pages/guide-showcase";
import { LandingHero } from "components/landing-pages/hero";
import { LandingIconSectionItem } from "components/landing-pages/icon-section-item";
import { LandingLayout } from "components/landing-pages/layout";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Card, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "minting_kit";

const CASE_STUDIES = [
  {
    title:
      "Base Launches its First Builder Quest & Brings New Developers Onchain",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/05/Base-Launches-its-First-Builder-Quest-and-Brings-New-Developers-Onchain---thirdweb-Case-Study-1.png",
    link: "https://blog.thirdweb.com/case-studies/base-builder-quest-brings-developers-onchain/",
  },
  {
    title:
      "Mirror Empowers Creators to Build Engaged Audiences with Subscriber NFTs",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/02/Mirror-case-study.png",
    link: "https://blog.thirdweb.com/case-studies/mirror-creators-build-loyal-audiences-with-subscriber-nfts/",
  },
  {
    title:
      "Layer3 Powers Web3 Adoption through Gamified Experiences & NFT Rewards",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/12/Layer3--2-.png",
    link: "https://blog.thirdweb.com/case-studies/layer3-powers-web3-adoption-through-gamified-experiences-nft-rewards/",
  },
];

const SolutionsMinting: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "Minting API: The #1 Toolkit for NFTs",
        description:
          "Deploy NFT smart contracts for every use case, on any blockchain. Integrate into your app or site, in minutes. Try Minting API — it's free.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/minting-solutions.png`,
              width: 1200,
              height: 630,
              alt: "Minting API: The #1 Toolkit for NFTs",
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
        <LandingHero
          title="Mint and distribute NFTs"
          titleWithGradient="easily"
          subtitle="Enable your users to mint, deploy and distribute NFTS through your app with only a few lines of code."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/minting/getting-started/deploying-smart-contract"
          gradient="linear(to-r, #8E0EFF, #16bdf0)"
          image={require("public/assets/product-pages/hero/desktop-hero-minting.png")}
          mobileImage={require("public/assets/product-pages/hero/mobile-hero-minting.png")}
          contactUsTitle="Book Demo"
        />

        <LandingGridSection>
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/icons/icon-ship.svg")}
            title="Go-to-market fasters"
            description="A Web3 API that allows you to easily interact with contracts and integrate with your existing web2 systems. Simplify the development process by consolidating multiple libraries, vendors, and contract interactions into a single SDK."
          />
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/icons/icon-build.svg")}
            title="Flexible Configuration"
            description="Build your own minting solution with embeddable SDKs, self-hosted minting API or use thirdweb managed service minting API."
          />
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/icons/icon-verified.svg")}
            title="Owned By You"
            description="Non-custodial ownership model. Apps and contracts built with our tools are completely owned by you. No other parties have control over your apps and contracts."
          />
        </LandingGridSection>
        <LandingDesktopMobileImage
          image={require("/public/assets/solutions-pages/minting/what-can-you-build.png")}
          mobileImage={require("/public/assets/solutions-pages/minting/what-can-you-build-mobile.png")}
        />

        <LandingGridSection>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-library.svg")}
              title="Explore"
              description={
                <>
                  A broad set of options for{" "}
                  <TrackedLink
                    category={TRACKING_CATEGORY}
                    href="https://portal.thirdweb.com/typescript/extensions"
                    color="primary.500"
                  >
                    distributing NFTs
                  </TrackedLink>{" "}
                  including claimable drops, private/public sales, airdrops,
                  open editions, delayed reveals.
                </>
              }
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-marketplace.svg")}
              title="Interact"
              description={
                <>
                  Integrate minting into applications using a variety of web3
                  API configurations including as an{" "}
                  <TrackedLink
                    category={TRACKING_CATEGORY}
                    href="https://portal.thirdweb.com/embedded-wallet"
                    color="primary.500"
                  >
                    distributing NFTs
                  </TrackedLink>{" "}
                  , self-hosted via a web3 REST API or as a managed service.
                </>
              }
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-fee.svg")}
              title="Gasless"
              description="Enable free/gasless mints using a Gasless Relayer."
            />
          </Card>
        </LandingGridSection>

        <LandingGuidesShowcase
          title="The best web3 apps use thirdweb's smart contract tools"
          category={TRACKING_CATEGORY}
          description="Seamlessly integrate your smart contracts into any app so you can focus on building a great user experience."
          guides={CASE_STUDIES}
          caseStudies
        />

        <LandingEndCTA
          title="Start building"
          titleWithGradient="today."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/minting/getting-started/deploying-smart-contract"
          gradient="linear(to-r, #8E0EFF, #16bdf0)"
          contactUsTitle="Book Demo"
        />
      </Container>
    </LandingLayout>
  );
};

SolutionsMinting.pageId = PageId.SolutionsMinting;

export default SolutionsMinting;
