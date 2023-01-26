import { Aurora } from "../../Aurora";
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
import { Heading, Text } from "tw-components";

export const LaunchSection: React.FC = () => {
  return (
    <KeyFeatureLayout
      title="Launch"
      titleGradient="linear-gradient(65deg, #C77FBE, #D19FD4)"
      headline="Simplified workflow to launch contracts on-chain."
      description="Deploy your contracts on-chain easily with a single command or through our Dashboard without requiring private keys."
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
            color="#E8A7D960"
          />
          <Aurora
            zIndex="auto"
            size={{ width: "150%", height: "200%" }}
            pos={{ top: "100%", left: "50%" }}
            color="#E8A7D960"
          />
          <Flex
            position="relative"
            flexDir="column"
            justify="space-between"
            py={12}
            px={14}
            gap={6}
            _hover={{ textDecoration: "none" }}
          >
            <Heading size="label.xl" lineHeight="1.2" as="h4">
              Ship your contracts on-chain effortlessly with{" "}
              <GradientText
                as={LinkOverlay}
                href="/deploy"
                stopOne="#C77FBE"
                stopTwo="#D19FD4"
              >
                Deploy
              </GradientText>
            </Heading>
            <Text
              color="whiteAlpha.700"
              textAlign={{ base: "center", md: "left" }}
            >
              A deployment workflow designed for you to collaborate easily with
              your dev team.
            </Text>
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
            color="#E8A7D960"
          />
          <Aurora
            zIndex="auto"
            size={{ width: "150%", height: "200%" }}
            pos={{ top: "100%", left: "50%" }}
            color="#E8A7D960"
          />
          <Flex
            position="relative"
            flexDir="column"
            justify="space-between"
            py={12}
            px={14}
            gap={6}
            _hover={{ textDecoration: "none" }}
          >
            <Heading size="label.xl" lineHeight="1.2" as="h4">
              Publish your contracts with{" "}
              <GradientText
                as={LinkOverlay}
                href="/release"
                stopOne="#C77FBE"
                stopTwo="#D19FD4"
              >
                Release
              </GradientText>
            </Heading>
            <Text
              color="whiteAlpha.700"
              textAlign={{ base: "center", md: "left" }}
            >
              Be discovered by our community of over 70k+ world-class web3
              developers.
            </Text>
            <Image
              pointerEvents="none"
              w="full"
              src={require("/public/assets/landingpage/launch-release.png")}
              alt=""
            />
          </Flex>
        </LinkBox>
      </SimpleGrid>
    </KeyFeatureLayout>
  );
};
