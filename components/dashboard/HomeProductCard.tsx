import { LinkBox, Flex, LinkOverlay } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { SectionItemProps } from "components/product-pages/common/nav/types";
import { useTrack } from "hooks/analytics/useTrack";
import { Card, Text } from "tw-components";

interface HomeProductCardProps {
  product: SectionItemProps;
  isFromLandingPage?: boolean;
  TRACKING_CATEGORY: string;
}

export const HomeProductCard: React.FC<HomeProductCardProps> = ({
  product,
  TRACKING_CATEGORY,
  isFromLandingPage,
}) => {
  const trackEvent = useTrack();
  return (
    <LinkBox
      onClick={() => {
        trackEvent({
          category: TRACKING_CATEGORY,
          action: "click",
          label: "select-product",
          product: product.name,
        });
      }}
    >
      <Card
        p={4}
        overflow="hidden"
        bgColor="backgroundCardHighlight"
        borderWidth={0.5}
        borderColor="borderColor"
        transition="border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease"
        _hover={{
          borderColor: "blue.500",
          boxShadow: "0 0 16px hsl(215deg 100% 60% / 30%)",
          transform: "scale(1.01)",
        }}
        h="full"
        minHeight={{ base: "full", md: 28 }}
      >
        <Flex flexDir="column">
          <Flex gap={2} alignItems="center">
            {product.icon && (
              <ChakraNextImage alt="" boxSize={6} src={product.icon} />
            )}
            <LinkOverlay
              href={isFromLandingPage ? product.link : product.dashboardLink}
            >
              <Text size="label.md" m={0} color="bgBlack">
                {product?.dashboardName || product.name}
              </Text>
            </LinkOverlay>
          </Flex>
          <Text mt={3} color="faded">
            {product.description}
          </Text>
        </Flex>
      </Card>
    </LinkBox>
  );
};
