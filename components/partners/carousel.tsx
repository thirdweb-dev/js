import { PartnerLogo } from "./partner-logo";
import styles from "./partner-logo.module.css";
import { Box, LayoutProps } from "@chakra-ui/react";
import React from "react";

const gap = { base: "40px", lg: "60px" };

const MarqueeGroup: React.FC<{
  ariaHidden: boolean;
  animationDirection?: "normal" | "reverse";
  children: React.ReactNode;
}> = ({ ariaHidden, children, animationDirection = "normal" }) => {
  return (
    <Box
      display="flex"
      gap={gap}
      overflow="hidden"
      flexShrink={0}
      aria-hidden={ariaHidden}
      className={styles.marqueeGroup}
      sx={{
        animationDirection,
      }}
    >
      {children}
    </Box>
  );
};

const Marquee: React.FC<{
  children: React.ReactNode;
  animationDirection?: "normal" | "reverse";
  display?: LayoutProps["display"];
}> = ({ children, display, animationDirection }) => {
  return (
    <Box gap={gap} overflow="hidden" py={4} display={display}>
      <MarqueeGroup animationDirection={animationDirection} ariaHidden={false}>
        {children}
      </MarqueeGroup>
      <MarqueeGroup animationDirection={animationDirection} ariaHidden={true}>
        {children}
      </MarqueeGroup>
    </Box>
  );
};

export const PartnerCarousel: React.FC = () => {
  return (
    <Box
      zIndex={10}
      position="relative"
      pointerEvents="none"
      userSelect="none"
      // slightly larger than container.lg
      maxW="1200px"
      mx="auto"
      sx={{
        maskImage: `linear-gradient(to right, hsl(0 0% 0% / 0), hsl(0 0% 0% / 1) 10%, hsl(0 0% 0% / 1) 90%, hsl(0 0% 0% / 0));`,
      }}
      pt={10}
      mb={{ base: 20, md: 24 }}
    >
      {/* desktop - 1 row with all logos */}
      <Marquee display={{ base: "none", lg: "flex" }}>
        <PartnerLogo partner="rarible" />
        <PartnerLogo partner="fractal" />
        <PartnerLogo partner="buildspace" />
        <PartnerLogo partner="shopify" />
        <PartnerLogo partner="paradigm" />
        <PartnerLogo partner="unlock" />
        <PartnerLogo partner="minted" />
        <PartnerLogo partner="nyfw" />
        <PartnerLogo partner="gala_games" />
        <PartnerLogo partner="mirror" />
        <PartnerLogo partner="heroic_story" />
        <PartnerLogo partner="layer3" />
      </Marquee>

      {/* mobile - 2 rows with logos split in two rows */}
      <Marquee display={{ base: "flex", lg: "none" }}>
        <PartnerLogo partner="rarible" />
        <PartnerLogo partner="fractal" />
        <PartnerLogo partner="buildspace" />
        <PartnerLogo partner="shopify" />
        <PartnerLogo partner="paradigm" />
        <PartnerLogo partner="unlock" />
      </Marquee>

      <Marquee
        animationDirection="reverse"
        display={{ base: "flex", lg: "none" }}
      >
        <PartnerLogo partner="minted" />
        <PartnerLogo partner="nyfw" />
        <PartnerLogo partner="gala_games" />
        <PartnerLogo partner="mirror" />
        <PartnerLogo partner="heroic_story" />
        <PartnerLogo partner="layer3" />
      </Marquee>
    </Box>
  );
};
