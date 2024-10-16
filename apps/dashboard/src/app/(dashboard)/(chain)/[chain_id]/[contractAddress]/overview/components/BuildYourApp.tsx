import {
  Flex,
  GridItem,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { ChakraNextImage as Image } from "components/Image";
import { PRODUCTS } from "components/product-pages/common/nav/data";
import { Card, Text, TrackedLink, type TrackedLinkProps } from "tw-components";

const RENDERED_PRODUCTS = ["sdk", "storage", "ui-components", "auth"];

interface BuildYourAppProps {
  trackingCategory: TrackedLinkProps["category"];
  contractAddress: string;
  chainSlug: string;
}

export const BuildYourApp: React.FC<BuildYourAppProps> = ({
  trackingCategory,
  contractAddress,
  chainSlug,
}) => {
  return (
    <Card
      px={{ base: 4, md: 8 }}
      py={{ base: 6, md: 8 }}
      as={LinkBox}
      transition="all 0.2s"
      _hover={{ borderColor: "whiteAlpha.300" }}
    >
      <SimpleGrid {...{ columns: { base: 1, md: 2 } }} gap={8}>
        <GridItem as={Flex} direction="column" gap={4}>
          <h2 className="font-semibold text-2xl tracking-tight">
            Build your app
          </h2>
          <Text size="body.md">
            <LinkOverlay
              as={TrackedLink}
              category={trackingCategory}
              label="build_your_app"
              href={`/${chainSlug}/${contractAddress}/code`}
              color="blue.500"
            >
              Learn more
            </LinkOverlay>{" "}
            about how you can use thirdweb tools to build apps on top of this
            contract.
          </Text>
        </GridItem>
        <GridItem as={Flex} align="center" justify="end" gap={3}>
          {RENDERED_PRODUCTS.map((p) => {
            const product = PRODUCTS.find((item) => item.label === p);
            return (
              product?.icon && (
                <Flex
                  key={product.name}
                  rounded="full"
                  bg="#0E0E10"
                  align="center"
                  justify="center"
                  w={14}
                  h={14}
                >
                  <Image boxSize={7} src={product.icon} alt={product.name} />
                </Flex>
              )
            );
          })}
        </GridItem>
      </SimpleGrid>
    </Card>
  );
};
