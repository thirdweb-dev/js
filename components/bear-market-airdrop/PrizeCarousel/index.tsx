import { PrizeCard } from "./PrizeCard";
import { Box } from "@chakra-ui/react";
import { Marquee } from "components/partners/carousel";

export const PrizesCarousel: React.FC = () => {
  return (
    <Box
      overflow="hidden"
      zIndex={10}
      position="relative"
      pointerEvents="none"
      userSelect="none"
      sx={{
        maskImage: `linear-gradient(to right, hsl(0 0% 0% / 0), hsl(0 0% 0% / 1) 10%, hsl(0 0% 0% / 1) 90%, hsl(0 0% 0% / 0));`,
      }}
      pt={10}
      mb={{ base: 20, md: 24 }}
    >
      {/* desktop - 1 row with all logos */}
      <Marquee display={{ base: "none", lg: "flex" }}>
        <PrizeCard prize="thirdwebProEarlyAccessNft" />
        <PrizeCard prize="1Matic" />
        <PrizeCard prize="0.1Eth" />
        <PrizeCard prize="clubIrlNft" />
        <PrizeCard prize="1Eth" />
        <PrizeCard prize="1kAwsCredits" />
        <PrizeCard prize="cpg" />
        <PrizeCard prize="bearMarketBuilderNft" />
        <PrizeCard prize="consensusPass" />
        <PrizeCard prize="5Matic" />
        <PrizeCard prize="lexicaAiArtPass" />
        <PrizeCard prize="quicknode900" />
        <PrizeCard prize="quicknode5000" />
        <PrizeCard prize="quicknode25000" />
        <PrizeCard prize="lexicaAiArtPass" />
        <PrizeCard prize="lexicaAiArtPass" />
      </Marquee>

      {/* mobile - 2 rows with logos split in two rows */}
      <Marquee display={{ base: "flex", lg: "none" }}>
        <PrizeCard prize="1Matic" />
        <PrizeCard prize="thirdwebProEarlyAccessNft" />
        <PrizeCard prize="1kAwsCredits" />
        <PrizeCard prize="5Matic" />
        <PrizeCard prize="consensusPass" />
        <PrizeCard prize="0.1Eth" />
        <PrizeCard prize="quicknode900" />
      </Marquee>

      <Marquee
        animationDirection="reverse"
        display={{ base: "flex", lg: "none" }}
      >
        <PrizeCard prize="cpg" />
        <PrizeCard prize="lexicaAiArtPass" />
        <PrizeCard prize="1Eth" />
        <PrizeCard prize="clubIrlNft" />
        <PrizeCard prize="bearMarketBuilderNft" />
        <PrizeCard prize="quicknode5000" />
        <PrizeCard prize="quicknode25000" />
      </Marquee>
    </Box>
  );
};
