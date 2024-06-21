import { Box, Flex, type LayoutProps } from "@chakra-ui/react";
import type { ComponentWithChildren } from "types/component-with-children";
import { PartnerLogo } from "./partner-logo";
import styles from "./partner-logo.module.css";

const gap = { base: "40px", lg: "60px" };

const MarqueeGroup: ComponentWithChildren<{
  ariaHidden: boolean;
  animationDirection?: "normal" | "reverse";
}> = ({ ariaHidden, children, animationDirection = "normal" }) => {
  return (
    <Flex
      flexDir="row"
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
    </Flex>
  );
};

const Marquee: ComponentWithChildren<{
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
        maskImage:
          "linear-gradient(to right, hsl(0 0% 0% / 0), hsl(0 0% 0% / 1) 10%, hsl(0 0% 0% / 1) 90%, hsl(0 0% 0% / 0));",
      }}
      pt={20}
      mb={{ base: 20, md: 24 }}
    >
      <Marquee display="flex">
        <PartnerLogo partner="coinbase" />
        <PartnerLogo partner="polygon" />
        <PartnerLogo partner="aws" />
        <PartnerLogo partner="rarible" />
        <PartnerLogo partner="coolcats" />
        <PartnerLogo partner="xai" />
        <PartnerLogo partner="myna" />
        <PartnerLogo partner="aavegotchi" />
        <PartnerLogo partner="shopify" />
        <PartnerLogo partner="avacloud" />
        <PartnerLogo partner="infinigods" />
        <PartnerLogo partner="paradigm" />
      </Marquee>

      <Marquee animationDirection="reverse" display="flex">
        <PartnerLogo partner="animoca" />
        <PartnerLogo partner="treasure" />
        <PartnerLogo partner="pixels" />
        <PartnerLogo partner="mcfarlane" />
        <PartnerLogo partner="nyfw" />
        <PartnerLogo partner="gala_games" />
        <PartnerLogo partner="mirror" />
        <PartnerLogo partner="ztx" />
        <PartnerLogo partner="paima" />
        <PartnerLogo partner="torque" />
        <PartnerLogo partner="layer3" />
      </Marquee>
    </Box>
  );
};
