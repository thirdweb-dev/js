import {
  Flex,
  GridItem,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { ChakraNextImage as Image } from "components/Image";
import { PRODUCTS } from "components/product-pages/common/nav/data";
import { useTabHref } from "contract-ui/utils";
import {
  Card,
  Heading,
  Text,
  TrackedLink,
  TrackedLinkProps,
} from "tw-components";

const RENDERED_PRODUCTS = ["sdk", "storage", "ui-components", "auth"];

interface BuildYourAppProps {
  trackingCategory: TrackedLinkProps["category"];
}

export const BuildYourApp: React.FC<BuildYourAppProps> = ({
  trackingCategory,
}) => {
  const codeHref = useTabHref("code");

  return (
    <Card
      px={{ base: 4, md: 8 }}
      py={{ base: 6, md: 8 }}
      as={LinkBox}
      transition={"all 0.2s"}
      _hover={{ borderColor: "whiteAlpha.300" }}
    >
      <SimpleGrid {...{ columns: { base: 1, md: 2 } }} gap={8}>
        <GridItem as={Flex} direction="column" gap={4}>
          <Heading size="label.lg">Build your app</Heading>
          <Text size="body.md">
            <LinkOverlay
              as={TrackedLink}
              category={trackingCategory}
              label="build_your_app"
              href={codeHref}
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
              product &&
              product.icon && (
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
