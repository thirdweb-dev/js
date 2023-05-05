import { GradientText } from "./GradientText";
import { KeyFeatureLayout } from "./KeyFeatureLayout";
import {
  Flex,
  GridItem,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { ChakraNextImage as Image } from "components/Image";
import { Aurora } from "components/homepage/Aurora";
import { Heading, Text } from "tw-components";

const TRACKING_CATEGORY = "launch_section";

export const LaunchSection: React.FC = () => {
  return (
    <KeyFeatureLayout
      title="Launch"
      titleGradient="linear-gradient(65deg, #C35AB1, #E9A8D9)"
      headline="Contracts on any chain."
      description=""
    >
      <SimpleGrid columns={{ md: 2 }} gap={6}>
        <LinkBox
          as={GridItem}
          bg="#070707"
          rounded="lg"
          position="relative"
          overflow="hidden"
        >
          <Aurora
            zIndex="auto"
            size={{ width: "150%", height: "200%" }}
            pos={{ top: "10%", left: "50%" }}
            color="#C45DC060"
          />
          <Aurora
            zIndex="auto"
            size={{ width: "150%", height: "200%" }}
            pos={{ top: "100%", left: "50%" }}
            color="#C45DC060"
          />
          <Flex
            position="relative"
            flexDir="column"
            justify="space-between"
            py={12}
            px={14}
            gap={6}
            h="full"
            _hover={{ textDecoration: "none" }}
          >
            <Flex gap={6} flexDir="column">
              <Heading size="label.xl" fontSize="22" lineHeight="1.2" as="h4">
                Ship your contracts on-chain effortlessly with{" "}
                <GradientText
                  as={LinkOverlay}
                  href="/deploy"
                  category={TRACKING_CATEGORY}
                  label="deploy"
                  stopOne="#C35AB1"
                  stopTwo="#E9A8D9"
                >
                  Deploy
                </GradientText>
              </Heading>
              <Text
                color="whiteAlpha.700"
                textAlign={{ base: "center", md: "left" }}
              >
                A deployment workflow designed for you to collaborate easily
                with your dev team.
              </Text>
            </Flex>
            <Image
              pointerEvents="none"
              w="full"
              src={require("/public/assets/landingpage/launch-deploy.png")}
              alt=""
            />
          </Flex>
        </LinkBox>
        <LinkBox
          as={GridItem}
          bg="#070707"
          rounded="lg"
          position="relative"
          overflow="hidden"
        >
          <Aurora
            zIndex="auto"
            size={{ width: "150%", height: "200%" }}
            pos={{ top: "10%", left: "50%" }}
            color="#C45DC060"
          />
          <Aurora
            zIndex="auto"
            size={{ width: "150%", height: "200%" }}
            pos={{ top: "100%", left: "50%" }}
            color="#C45DC060"
          />
          <Flex
            position="relative"
            flexDir="column"
            justify="space-between"
            py={12}
            px={14}
            gap={6}
            h="full"
            _hover={{ textDecoration: "none" }}
          >
            <Flex gap={6} flexDir="column">
              <Heading size="label.xl" fontSize="22" lineHeight="1.2" as="h4">
                Make your contracts discoverable with{" "}
                <GradientText
                  as={LinkOverlay}
                  href="/publish"
                  category={TRACKING_CATEGORY}
                  label="release"
                  stopOne="#C35AB1"
                  stopTwo="#E9A8D9"
                >
                  Publish
                </GradientText>
              </Heading>
              <Text
                color="whiteAlpha.700"
                textAlign={{ base: "center", md: "left" }}
              >
                Be discovered by our community of over 70k+ world-class web3
                developers.
              </Text>
            </Flex>
            <Image
              pointerEvents="none"
              w="full"
              src={require("/public/assets/landingpage/launch-publish.png")}
              alt=""
            />
          </Flex>
        </LinkBox>
      </SimpleGrid>
    </KeyFeatureLayout>
  );
};
