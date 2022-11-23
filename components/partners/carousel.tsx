import { PartnerLogo } from "./partner-logo";
import { Box, Container, GridItem, SimpleGrid } from "@chakra-ui/react";

export const PartnerCarousel: React.FC = () => {
  return (
    <Box zIndex={1} pointerEvents="none" userSelect="none">
      <Container position="relative" maxW="container.page">
        <SimpleGrid
          columns={{ base: 3, md: 9 }}
          py={12}
          px={{ base: 4, md: 0 }}
          gap={{ base: 8, md: 12 }}
        >
          <GridItem colSpan={1}>
            <PartnerLogo partner="rarible" />
          </GridItem>
          <GridItem colSpan={1}>
            <PartnerLogo partner="fractal" />
          </GridItem>
          <GridItem colSpan={1}>
            <PartnerLogo partner="buildspace" />
          </GridItem>
          <GridItem colSpan={1}>
            <PartnerLogo partner="shopify" />
          </GridItem>
          <GridItem colSpan={1}>
            <PartnerLogo partner="paradigm" />
          </GridItem>
          <GridItem colSpan={1}>
            <PartnerLogo partner="unlock" />
          </GridItem>
          <GridItem colSpan={1}>
            <PartnerLogo partner="minted" />
          </GridItem>
          <GridItem colSpan={1}>
            <PartnerLogo partner="nyfw" />
          </GridItem>
          <GridItem colSpan={1}>
            <PartnerLogo partner="gala_games" />
          </GridItem>
        </SimpleGrid>
      </Container>
    </Box>
  );
};
