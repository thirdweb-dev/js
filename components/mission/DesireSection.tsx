import { Flex } from "@chakra-ui/react";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingIconSectionItem } from "components/landing-pages/icon-section-item";
import React from "react";
import { Heading } from "tw-components";

const DesireSection = () => {
  return (
    <Flex
      w="full"
      flexDir={{ base: "column", xl: "row" }}
      alignItems={{ base: "center", xl: "flex-start" }}
      gap="60px"
    >
      <Heading
        size="title.lg"
        fontWeight="semibold"
        flex="1"
        textAlign={{ base: "center", xl: "left" }}
      >
        thirdweb will...
      </Heading>
      <Flex maxW="2xl">
        <LandingGridSection desktopColumns={2}>
          <LandingIconSectionItem
            shouldShowNoBorder
            iconWidth="102px"
            icon={require("public/assets/product-pages/mission/icon-unlock.svg")}
            title="Expand web3"
            description="Building a better developer experience will expand the potential of blockchain technology.
            By lowering the barrier to entry for builders, we will increase the velocity that great teams can ship and unlock new experiences with web3."
          />

          <LandingIconSectionItem
            shouldShowNoBorder
            iconWidth="102px"
            icon={require("public/assets/product-pages/mission/icon-simple-click.svg")}
            title="Give ownership to users"
            description="Ownership is inherent to the human experience. We believe that people should have the same property rights over their digital assets as they do their physical assets. We are enabling the next generation of apps which will unlock digital ownership for 5 billion+ internet users."
          />
          <LandingIconSectionItem
            shouldShowNoBorder
            iconWidth="102px"
            icon={require("public/assets/product-pages/mission/icon-control.svg")}
            title="Give control to developers"
            description="Developers should have full control over their stack. thirdweb is designed to to allow developers to assemble and reassemble different parts of our tools and provide their own configurations. thirdweb has no servers, and every contract or app is owned by the developer."
          />

          <LandingIconSectionItem
            shouldShowNoBorder
            iconWidth="102px"
            icon={require("public/assets/product-pages/mission/icon-open-source.svg")}
            title="Open-source web3"
            description="There is infinite upside to building in open. Open-sourcing all of our tools increases transparency and security for the whole industry. Anybody can contribute to thirdweb by proposing new features, identifying bugs and optimising gas."
          />
        </LandingGridSection>
      </Flex>
    </Flex>
  );
};

export default DesireSection;
