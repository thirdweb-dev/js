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

const TRACKING_CATEGORY = "build_section";

export const BuildSection: React.FC = () => {
  return (
    <KeyFeatureLayout
      title="Build"
      titleGradient="linear-gradient(70deg, #805AA8, #BAA2D4)"
      headline="Accelerate your web3 development."
      description="Leverage our easy-to-use SDKs, developer tools, and integrations with best-in-class partner providers."
    >
      <SimpleGrid columns={{ md: 9 }} gap={6}>
        <LinkBox
          as={GridItem}
          colSpan={{ md: 4 }}
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
          <Flex
            w="full"
            h="full"
            flexDir="column"
            align="center"
            justify="space-between"
          >
            <Heading
              as="h4"
              size="label.xl"
              fontSize="22"
              lineHeight="1.2"
              py={12}
              px={14}
            >
              Create your own contracts with our{" "}
              <GradientText
                as={LinkOverlay}
                href="/contractkit"
                category={TRACKING_CATEGORY}
                label="contractkit"
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
              mt="auto"
              src={require("/public/assets/landingpage/build-contractkit.png")}
              alt=""
            />
          </Flex>
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
          <Flex
            w="full"
            h="full"
            flexDir="column"
            align="center"
            justify="space-between"
          >
            <Heading
              as="h4"
              lineHeight="1.2"
              textAlign="center"
              size="label.xl"
              fontSize="22"
              px={14}
              py={12}
            >
              Discover ready-to-deploy <br />
              contracts in{" "}
              <GradientText
                as={LinkOverlay}
                href="/explore"
                category={TRACKING_CATEGORY}
                label="explore"
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
          </Flex>
        </LinkBox>
        <LinkBox
          as={GridItem}
          colSpan={{ md: 6 }}
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
          <SimpleGrid
            columns={{ md: 2 }}
            px={14}
            gap={{ md: 14 }}
            h="full"
            position="relative"
          >
            <Flex
              as={GridItem}
              flexDir="column"
              justify="center"
              py={12}
              w="full"
              gap={6}
              _hover={{ textDecoration: "none" }}
            >
              <Heading
                lineHeight="1.2"
                size="label.xl"
                fontSize="22"
                textAlign={{ base: "center", md: "left" }}
                as="h4"
              >
                Integrate web3 technologies into your apps and games with our{" "}
                <GradientText
                  as={LinkOverlay}
                  href="/sdk"
                  category={TRACKING_CATEGORY}
                  label="sdk"
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
            <Flex align="center" justify="center" py={6}>
              <Image
                pointerEvents="none"
                h="full"
                maxH={200}
                src={require("/public/assets/landingpage/build-sdk.png")}
                alt=""
              />
            </Flex>
          </SimpleGrid>
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
            pos={{ top: "50%", left: "0%" }}
            color="#380D3F60"
          />
          <Heading
            as="h4"
            size="label.xl"
            fontSize="22"
            lineHeight="1.2"
            pt={6}
            pb={8}
            px={10}
          >
            Plug-and-play frontend{" "}
            <GradientText
              as={LinkOverlay}
              href="/ui-components"
              category={TRACKING_CATEGORY}
              label="ui_components"
              stopOne="#805AA8"
              stopTwo="#BAA2D4"
            >
              web3 components
            </GradientText>
          </Heading>
          <Image
            pointerEvents="none"
            pl={10}
            pb={10}
            w="full"
            src={require("/public/assets/landingpage/build-ui-components.png")}
            alt=""
          />
        </LinkBox>
        <GridItem
          colSpan={{ md: 9 }}
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
                fontSize="22"
                textAlign={{ base: "center", md: "left" }}
                as="h4"
              >
                <GradientText
                  category={TRACKING_CATEGORY}
                  label="infrastructure"
                  stopOne="#805AA8"
                  stopTwo="#BAA2D4"
                >
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
