import { Container, Flex } from "@chakra-ui/react";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingGuidesShowcase } from "components/landing-pages/guide-showcase";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import { LandingIconSectionItem } from "components/landing-pages/icon-section-item";
import { LandingSectionHeading } from "components/landing-pages/section-heading";
import type { Metadata } from "next";
import { Card, TrackedLink } from "tw-components";
// images
import authIcon from "../../../../public/assets/product-icons/auth.png";
import iconBuild from "../../../../public/assets/product-pages-icons/wallets/icon-build.svg";
import iconDataCheck from "../../../../public/assets/product-pages-icons/wallets/icon-data-check.svg";
import iconEfficient from "../../../../public/assets/product-pages-icons/wallets/icon-efficient.svg";
import iconPrivate from "../../../../public/assets/product-pages-icons/wallets/icon-private.svg";
import iconSecure from "../../../../public/assets/product-pages-icons/wallets/icon-secure.svg";
import iconSimpleClick from "../../../../public/assets/product-pages-icons/wallets/icon-simple-click.svg";
import iconVerified from "../../../../public/assets/product-pages-icons/wallets/icon-verified.svg";
import iconWalletManagement from "../../../../public/assets/product-pages-icons/wallets/icon-wallet-management.svg";
// images
import desktopHeroAuthImage from "../../../../public/assets/product-pages/hero/desktop-hero-auth.png";
import mobileHeroAuthImage from "../../../../public/assets/product-pages/hero/mobile-hero-auth.png";
import { getAbsoluteUrl } from "../../../lib/vercel-utils";

const TRACKING_CATEGORY = "auth-landing";

const GUIDES = [
  {
    title: "How to Build a Web3 Creator Platform with a Web2 Backend",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/03/How-to-create-a-web3-creator----platform-with-a-web2-backend.png",
    link: "https://blog.thirdweb.com/guides/how-to-create-a-web3-creator-platform/",
  },
  {
    title: "Create An NFT Gated Website",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/08/thumbnail-31.png",
    link: "https://blog.thirdweb.com/guides/nft-gated-website/",
  },
  {
    title: "Accept Stripe Subscription Payments For Your Web3 App",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/03/Add-stripe-subscriptions--with-web3-auth-2.png",
    link: "https://blog.thirdweb.com/guides/add-stripe-subscriptions-with-web3-auth/",
  },
];

const title = "The Complete Toolkit for Web3 Authentication";
const description =
  "Auth for the most popular web3 wallets & web2 login flows. Verify your users' identities & prove wallet ownership to off-chain systems.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [
      {
        url: `${getAbsoluteUrl()}/assets/og-image/auth.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function Page() {
  return (
    <Container
      maxW="container.page"
      as={Flex}
      flexDir="column"
      gap={{ base: "80px", md: "120px" }}
    >
      <LandingHeroWithSideImage
        miniTitle="Auth"
        title="The complete toolkit for"
        titleWithGradient="Web3 Authentication"
        subtitle="Easy auth for the most popular web3 wallets and web2 login flows — so you can verify your users’ identities & prove wallet ownership to off-chain systems."
        trackingCategory={TRACKING_CATEGORY}
        ctaLink="https://portal.thirdweb.com/wallets/auth"
        contactUsTitle="Book Demo"
        gradient="linear(to-r, #4490FF, #4490FF)"
        image={desktopHeroAuthImage}
        mobileImage={mobileHeroAuthImage}
        miniImage={authIcon}
      />

      <LandingGridSection>
        <LandingIconSectionItem
          icon={iconSimpleClick}
          title="Instant onboarding"
          description="Enable any user to verify their identity using web2 sign-in flows such as an email, phone number, or social account — and auto-generate a wallet for them."
        />
        <LandingIconSectionItem
          icon={iconSecure}
          title="Web3-first auth"
          description="Build web3 apps with secure, self-custodied, web3-first authentication for your users."
        />
        <LandingIconSectionItem
          icon={iconBuild}
          title="Seamless DX"
          description="Powerful SDKs to integrate web3-compatible auth into your app — working with any backend, framework, or service."
        />
      </LandingGridSection>
      <LandingGridSection>
        <Card p={8}>
          <LandingIconSectionItem
            icon={iconVerified}
            title="Onchain identity verification"
            description={
              <>
                Built on the SIWE (
                <TrackedLink
                  href="https://eips.ethereum.org/EIPS/eip-4361"
                  category={TRACKING_CATEGORY}
                  label="siwe"
                  color="blue.500"
                  isExternal
                >
                  Sign-in with Ethereum
                </TrackedLink>
                ) standard. Securely verify a user&apos;s on-chain identity,
                without relying on a centralized database to verify their
                identity.
              </>
            }
          />
        </Card>
        <Card p={8}>
          <LandingIconSectionItem
            icon={iconWalletManagement}
            title="Comprehensive wallet management"
            description="Auth includes a wide range of key management infrastructure for wallets. "
          />
        </Card>
        <Card p={8}>
          <LandingIconSectionItem
            icon={iconPrivate}
            title="Secure token authentication"
            description={
              <>
                Secure your backend with a web3-compatible authentication system
                compliant with the widely used{" "}
                <TrackedLink
                  href="https://jwt.io/"
                  category={TRACKING_CATEGORY}
                  label="jwt"
                  color="blue.500"
                  isExternal
                >
                  JSON Web Token
                </TrackedLink>{" "}
                standard.
              </>
            }
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
            icon={iconEfficient}
            title="Passwordless auth"
            description="Enable users to seamlessly log into any app with just a web3 wallet or web2 login."
          />
        </Card>
        <Card p={8}>
          <LandingIconSectionItem
            icon={iconVerified}
            title="Identity verification systems"
            description="Securely verify a user's onchain identity & grant them access to gated resources, interaction with your app, and the ability to receive payments with ETH or ERC-20 tokens."
          />
        </Card>
        <Card p={8}>
          <LandingIconSectionItem
            icon={iconDataCheck}
            title="Onchain & offchain data"
            description="Understand your users better by merging their web2 and web3 identities — with rich on-chain data."
          />
        </Card>
      </LandingGridSection>

      <LandingGuidesShowcase
        title="Learn how to build"
        description="Check out our guides to learn how to build with Auth"
        solution="Auth"
        category={TRACKING_CATEGORY}
        guides={GUIDES}
      />

      <LandingEndCTA
        title="Start building"
        titleWithGradient="today."
        trackingCategory={TRACKING_CATEGORY}
        ctaLink="https://portal.thirdweb.com/wallets/auth"
        gradient="linear(to-r, #3385FF, #7BB0FF)"
      />
    </Container>
  );
}
