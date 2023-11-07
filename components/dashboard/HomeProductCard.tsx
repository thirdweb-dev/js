import { LinkBox, Flex, LinkOverlay } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { SectionItemProps } from "components/product-pages/common/nav/types";
import { useTrack } from "hooks/analytics/useTrack";
import { Card, Heading, Text } from "tw-components";

interface HomeProductCardProps {
  product: SectionItemProps;
  TRACKING_CATEGORY: string;
}

export const HomeProductCard: React.FC<HomeProductCardProps> = ({
  product,
  TRACKING_CATEGORY,
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
        overflow="hidden"
        bgColor="backgroundCardHighlight"
        borderColor="borderColor"
        transition="border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease"
        _hover={{
          borderColor: "blue.500",
          boxShadow: "0 0 16px hsl(215deg 100% 60% / 30%)",
          transform: "scale(1.01)",
        }}
        h={{ base: "full", md: 28 }}
      >
        <Flex flexDir="column" gap={2}>
          <Flex gap={2} alignItems="center">
            {product.icon && (
              <ChakraNextImage alt="" boxSize={6} src={product.icon} />
            )}
            <LinkOverlay href={product.dashboardLink}>
              <Heading size="title.xs" m={0}>
                {product.name}
              </Heading>
            </LinkOverlay>
          </Flex>
          <Text>{product.description}</Text>
        </Flex>
      </Card>
    </LinkBox>
  );
};
