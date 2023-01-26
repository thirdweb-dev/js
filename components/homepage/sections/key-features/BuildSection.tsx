import { Aurora } from "../../Aurora";
import { GradientText } from "./GradientText";
import { KeyFeatureLayout } from "./KeyFeatureLayout";
import {
  Box,
  Flex,
  GridItem,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { ChakraNextImage as Image } from "components/Image";
import { Heading, Text } from "tw-components";

export const BuildSection: React.FC = () => {
  return (
    <KeyFeatureLayout
      title="Build"
      titleGradient="linear-gradient(70deg, #805AA8, #BAA2D4)"
      headline="Accelerate your web3 development."
      description="Leverage our easy-to-use SDKs, developer tools, and integrations with best-in-class partner providers."
    >
      <SimpleGrid columns={{ md: 5 }} gap={6}>
        <LinkBox
          as={GridItem}
          colSpan={{ md: 2 }}
          bg="#070707"
          rounded="lg"
          position="relative"
          overflow="hidden"
        >
          <Aurora
            zIndex="auto"
            size={{ width: "100%", height: "100%" }}
            pos={{ top: "80%", left: "0%" }}
            color="#380D3F60"
          />
          <Aurora
            zIndex="auto"
            size={{ width: "100%", height: "100%" }}
            pos={{ top: "0%", left: "10%" }}
            color="#380D3F60"
          />

          <Heading as="h4" size="label.xl" lineHeight="1.2" py={12} px={14}>
            Create your own contracts with our{" "}
            <GradientText
              as={LinkOverlay}
              href="/contractkit"
              stopOne="#805AA8"
              stopTwo="#BAA2D4"
            >
              ContractKit
            </GradientText>
          </Heading>
          <Image
            pointerEvents="none"
            pl={14}
            w="full"
            src={require("/public/assets/landingpage/build-contractkit.png")}
            alt=""
          />
        </LinkBox>
        <LinkBox
          as={GridItem}
          colSpan={{ md: 3 }}
          bg="#070707"
          rounded="lg"
          position="relative"
          overflow="hidden"
        >
          <Aurora
            zIndex="auto"
            size={{ width: "100%", height: "100%" }}
            pos={{ top: "20%", left: "100%" }}
            color="#380D3F60"
          />
          <Aurora
            zIndex="auto"
            size={{ width: "100%", height: "100%" }}
            pos={{ top: "0%", left: "0%" }}
            color="#380D3F60"
          />
          <Aurora
            zIndex="auto"
            size={{ width: "100%", height: "100%" }}
            pos={{ top: "100%", left: "0%" }}
            color="#380D3F60"
          />

          <Heading
            as="h4"
            lineHeight="1.2"
            textAlign="center"
            size="label.xl"
            px={14}
            py={12}
          >
            Discover ready-to-deploy <br />
            contracts in{" "}
            <GradientText
              as={LinkOverlay}
              href="/explore"
              stopOne="#805AA8"
              stopTwo="#BAA2D4"
            >
              Explore
            </GradientText>
          </Heading>
          <Image
            pointerEvents="none"
            w="full"
            src={require("/public/assets/landingpage/build-explore.png")}
            alt=""
          />
        </LinkBox>
        <LinkBox
          as={GridItem}
          colSpan={{ md: 5 }}
          bg="#070707"
          rounded="lg"
          position="relative"
          overflow="hidden"
        >
          <Aurora
            zIndex="auto"
            size={{ width: "100%", height: "150%" }}
            pos={{ top: "50%", left: "70%" }}
            color="#380D3F60"
          />
          <Aurora
            zIndex="auto"
            size={{ width: "100%", height: "150%" }}
            pos={{ top: "50%", left: "0%" }}
            color="#380D3F60"
          />
          <SimpleGrid columns={{ md: 2 }} h="full" position="relative">
            <Flex
              flexDir="column"
              justify="center"
              px={14}
              py={12}
              w="full"
              gap={6}
              _hover={{ textDecoration: "none" }}
            >
              <Heading
                lineHeight="1.2"
                size="label.xl"
                textAlign={{ base: "center", md: "left" }}
                as="h4"
              >
                Integrate web3 technologies into your apps and games with our{" "}
                <GradientText
                  as={LinkOverlay}
                  href="/sdk"
                  stopOne="#805AA8"
                  stopTwo="#BAA2D4"
                >
                  easy-to-use SDKs
                </GradientText>
              </Heading>
              <Text
                color="whiteAlpha.700"
                textAlign={{ base: "center", md: "left" }}
              >
                Supports Javascript. Python. Go. Unity. C#.
              </Text>
            </Flex>
            <Box px={14} py={6}>
              <Image
                pointerEvents="none"
                maxH={200}
                h="full"
                src={require("/public/assets/landingpage/build-sdk.png")}
                alt=""
              />
            </Box>
          </SimpleGrid>
        </LinkBox>
        <GridItem
          colSpan={{ md: 5 }}
          bg="#070707"
          rounded="lg"
          position="relative"
          overflow="hidden"
        >
          <Aurora
            zIndex="auto"
            size={{ width: "100%", height: "150%" }}
            pos={{ top: "50%", left: "75%" }}
            color="#380D3F60"
          />
          <Aurora
            zIndex="auto"
            size={{ width: "100%", height: "150%" }}
            pos={{ top: "50%", left: "0%" }}
            color="#380D3F60"
          />
          <SimpleGrid columns={{ md: 2 }} h="full" position="relative">
            <Flex
              h="full"
              flexDir="column"
              justify="center"
              px={14}
              py={12}
              w="full"
              gap={6}
            >
              <Heading
                lineHeight="1.2"
                size="label.xl"
                textAlign={{ base: "center", md: "left" }}
                as="h4"
              >
                <GradientText stopOne="#805AA8" stopTwo="#BAA2D4">
                  Fully managed infrastructure services
                </GradientText>{" "}
                in a single toolkit to enable developers to build for scale
              </Heading>
            </Flex>
            <Box px={14} py={10}>
              <Image
                h="full"
                maxH={150}
                src={require("/public/assets/landingpage/build-infrastructure.png")}
                alt=""
              />
            </Box>
          </SimpleGrid>
        </GridItem>
      </SimpleGrid>
    </KeyFeatureLayout>
  );
};
