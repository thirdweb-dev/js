import { Aurora } from "../Aurora";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";

interface HeroSectionProps {
  TRACKING_CATEGORY: string;
}
export const HeroSection = ({ TRACKING_CATEGORY }: HeroSectionProps) => {
  return (
    <HomepageSection id="home" bottomPattern>
      {/* top */}
      <Aurora
        pos={{ left: "50%", top: "0%" }}
        size={{ width: "2400px", height: "1400px" }}
        color="hsl(260deg 78% 35% / 20%)"
      />

      <LandingHeroWithSideImage
        titleWithGradient=""
        title="Build web3 apps fast, on any EVM chain."
        subtitle="The full stack web3 development platform. Onboard users with wallets, build & deploy smart contracts, accept fiat with payments, and scale apps with infrastructure."
        trackingCategory={TRACKING_CATEGORY}
        ctaLink="/dashboard"
        ctaText="Get started"
        noContactUs
        gradient="linear(to-r, #9786DF, #9786DF)"
        image={require("public/assets/landingpage/desktop/hero-homepage.png")}
        mobileImage={require("public/assets/landingpage/mobile/hero-homepage.png")}
        mt={{ base: 4, md: 20 }}
      />
    </HomepageSection>
  );
};
