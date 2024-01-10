import { Container, Flex } from "@chakra-ui/react";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingGuidesShowcase } from "components/landing-pages/guide-showcase";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import { LandingIconSectionItem } from "components/landing-pages/icon-section-item";
import { LandingLayout } from "components/landing-pages/layout";
import { LandingSectionHeading } from "components/landing-pages/section-heading";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Card, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "build-landing";

const GUIDES = [
  {
    title: "Build An ERC721A NFT Collection using Solidity",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/08/thumbnail-19.png",
    link: "https://blog.thirdweb.com/guides/get-started-with-the-contracts-sdk/",
  },
  {
    title: "Create A Generative Art NFT Collection Using Solidity & JavaScript",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/03/Create-A-Generative-Art-NFT-Collection-with-Solidity-and-JavaScript-2.png",
    link: "https://blog.thirdweb.com/guides/create-a-generative-art-nft-collection-using-solidity-javascript/",
  },
  {
    title: "Build a Blockchain Game using our Solidity SDK",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/03/Build-a-Blockchain-Game-using-ContractKit.png",
    link: "https://blog.thirdweb.com/guides/build-a-blockchain-game-using-contractkit/",
  },
];

const CASE_STUDIES = [
  {
    title: "Layer 3",
    description:
      "Rewarded millions of users with NFTs for participating in crypto, powered by thirdweb's NFT smart contracts.",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/12/Layer3--2-.png",
    link: "https://blog.thirdweb.com/case-studies/layer3-powers-web3-adoption-through-gamified-experiences-nft-rewards/",
  },
  {
    title: "EVEN",
    description:
      'Built a custom smart contract solution to enable innovative "pay what you want" NFTs. ',
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/12/EVEN-Empowers-Fans-to-Support-their-Favorite-Music-Artists-through-NFTs.png",
    link: "https://blog.thirdweb.com/case-studies/even-empowers-fans-to-support-their-favorite-music-artists-through-nfts/",
  },
  {
    title: "Dreamworks",
    description:
      "Released playable digital collectibles for one of their world's most beloved movie franchises.",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/10/DreamWorks-Launches-NFT-Avatars-with-Gala-s-VOX---thirdweb-Case-Study-2.png",
    link: "https://blog.thirdweb.com/case-studies/dreamworks-launches-nft-avatars-for-web3-games-with-gala-and-the-sims-creators-voxverse/",
  },
];

const BuildLanding: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "The Complete Smart Contract Development Toolkit",
        description:
          "Build smart contracts easily with a library of audited pre-built bases, or write your own with our Solidity SDK & deploy to any EVM chain.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/build.png`,
              width: 1200,
              height: 630,
              alt: "The Complete Smart Contract Development Toolkit",
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
        <LandingHeroWithSideImage
          miniTitle="Build"
          title="Build smart contracts with Solidity, "
          titleWithGradient="fast"
          subtitle="Deploy pre-built audited smart contracts — or write your own with our Solidity SDK. Available on any EVM chain."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/contracts/build/overview"
          contactUsTitle="Book Demo"
          gradient="linear(to-r,  #F856C8, #F856C8)"
          image={require("public/assets/product-pages/hero/desktop-hero-build.png")}
          mobileImage={require("public/assets/product-pages/hero/mobile-hero-build.png")}
          miniImage={require("public/assets/product-icons/extensions.png")}
        />

        <LandingGridSection>
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/contracts/icon-ship.svg")}
            title="Ship onchain faster"
            description="Reduce development time with pre-built contracts which work out-of-the box, or use our SDK to build custom contracts with advanced functionality from scratch."
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/contracts/icon-tool.svg")}
            title="Built for developers"
            description="Bespoke tools for your contracts, based on the extensions you choose - including higher level functionality in our SDK, tailored data feeds and intuitive error messages."
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/contracts/icon-secure.svg")}
            title="Complete security"
            description={
              <>
                Keep your user&apos;s accounts and funds secure with audited and
                battle-tested contracts. Every pre-built contract has undergone
                a full audit by our security partners,{" "}
                <TrackedLink
                  href="https://0xmacro.com/"
                  category={TRACKING_CATEGORY}
                  label="0xmacro"
                  color="blue.500"
                  isExternal
                >
                  0xMacro
                </TrackedLink>
                .
              </>
            }
          />
        </LandingGridSection>
        <LandingGridSection>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-contract.svg")}
              title="Base contracts"
              description="Pre-built smart contracts for the most popular Ethereum standards (ERC-721, ERC-1155, ERC-20) to build on top of or modify — that you can deploy in clicks, work out-of-the-box, and do not require any functions to be implemented."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-extension.svg")}
              title="Extensions"
              description="Solidity interfaces and industry standards that are recognizable by the Dashboard and unlock functionality in the SDKs. They are composable pieces of logic that can be added to base contracts easily."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-evm.svg")}
              title="Any Chain"
              description="Smart contracts that work with any EVM-compatible chain out of the box — so you can build any web3 app on Ethereum mainnet, a layer 2 networks, or your own custom appchain."
            />
          </Card>
        </LandingGridSection>

        <LandingGridSection
          title={
            <LandingSectionHeading
              title="What You Can Build"
              blackToWhiteTitle=""
            />
          }
        >
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-digital-collectible.svg")}
              title="Digital Collectibles"
              description={
                <>
                  Launch collections of NFTs that bring you closer to your
                  audiences & grow your brand&apos;s digital presence. Create
                  custom mint experiences for any customer with allowlists,
                  dynamic pricing, delayed artwork reveal, and more custom
                  features. (
                  <TrackedLink
                    href="/explore/nft"
                    category={TRACKING_CATEGORY}
                    label="nft-contracts"
                    color="blue.500"
                    isExternal
                  >
                    NFT Contracts
                  </TrackedLink>
                  ).
                </>
              }
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-marketplace.svg")}
              title="Marketplace"
              description={
                <>
                  Build your own fully-customizable marketplace — where you can
                  sell directly to your audiences, create auctions that users
                  can bid on, and enable anyone to trade digital assets. (
                  <TrackedLink
                    href="/explore/marketplace"
                    category={TRACKING_CATEGORY}
                    label="marketplace-contracts"
                    color="blue.500"
                    isExternal
                  >
                    Marketplace Contracts
                  </TrackedLink>
                  ).
                </>
              }
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-game.svg")}
              title="Web3 Games"
              description="Build blockchain powered games where users can collect digital assets as NFTs — creating thriving in-game economies, increasing retention, and generating more revenue."
            />
          </Card>
        </LandingGridSection>

        <LandingGuidesShowcase
          title="Learn how to build smart contracts with Solidity"
          category={TRACKING_CATEGORY}
          description="Start building with pre-built smart contracts, or build your own with our Solidity SDK"
          solution="Solidity SDK"
          guides={GUIDES}
        />

        <LandingGuidesShowcase
          title="The best web3 apps use thirdweb's smart contract tools"
          category={TRACKING_CATEGORY}
          description="Build customizable smart contracts with the most popular extensions, using our world-class SDK."
          guides={CASE_STUDIES}
          caseStudies
        />

        <LandingEndCTA
          title="Start building"
          titleWithGradient="today."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/contracts/build/overview"
          gradient="linear(to-r,  #F213A4, #F97CCE)"
        />
      </Container>
    </LandingLayout>
  );
};

BuildLanding.pageId = PageId.BuildLanding;

export default BuildLanding;
