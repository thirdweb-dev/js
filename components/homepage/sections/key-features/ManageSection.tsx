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
import React from "react";
import { Heading } from "tw-components";

const TRACKING_CATEGORY = "manage_section";

export const ManageSection: React.FC = () => {
  return (
    <KeyFeatureLayout
      title="Manage"
      titleGradient="linear-gradient(70deg, #4F3DA5, #8E81D0)"
      headline="Manage and interact with your web3 apps."
      description="Get insights and interact with all your contracts that are deployed on thirdweb from a single place."
    >
      <SimpleGrid columns={{ md: 11 }} gap={6}>
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
            size={{ width: "125%", height: "200%" }}
            pos={{ top: "40%", left: "30%" }}
            color="#9786DF60"
          />
          <Aurora
            zIndex="auto"
            size={{ width: "125%", height: "200%" }}
            pos={{ top: "20%", left: "100%" }}
            color="#9786DF60"
          />
          <Flex
            position="relative"
            flexDir="column"
            justify="space-between"
            px={14}
            _hover={{ textDecoration: "none" }}
          >
            <Heading
              size="label.xl"
              fontSize="22"
              lineHeight="1.2"
              py={12}
              as="h4"
            >
              Monitor and configure your contracts from your{" "}
              <GradientText
                as={LinkOverlay}
                href="/dashboards"
                category={TRACKING_CATEGORY}
                label="dashboard"
                stopOne="#4F3DA5"
                stopTwo="#8E81D0"
              >
                Dashboard
              </GradientText>
            </Heading>
            <Image
              pointerEvents="none"
              w="full"
              src={require("/public/assets/landingpage/manage-dashboard.png")}
              alt=""
            />
          </Flex>
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
            size={{ width: "125%", height: "200%" }}
            pos={{ top: "40%", left: "30%" }}
            color="#9786DF40"
          />
          <Aurora
            zIndex="auto"
            size={{ width: "125%", height: "200%" }}
            pos={{ top: "40%", left: "100%" }}
            color="#9786DF60"
          />
          <Flex h="full" position="relative" flexDir="column" px={14}>
            <Heading
              size="label.xl"
              fontSize="22"
              lineHeight="1.2"
              py={12}
              as="h4"
            >
              Collaborate with your team and{" "}
              <GradientText
                category={TRACKING_CATEGORY}
                label="manage_permissions"
                stopOne="#4F3DA5"
                stopTwo="#8E81D0"
              >
                manage permissions
              </GradientText>
            </Heading>
            <Box py={6} my="auto">
              <Image
                w="full"
                src={require("/public/assets/landingpage/manage-permissions.png")}
                alt=""
              />
            </Box>
          </Flex>
        </GridItem>
        <GridItem
          colSpan={{ md: 11 }}
          bg="#070707"
          rounded="lg"
          position="relative"
          overflow="hidden"
        >
          <Aurora
            zIndex="auto"
            size={{ width: "125%", height: "200%" }}
            pos={{ top: "60%", left: "0%" }}
            color="#9786DF40"
          />
          <Aurora
            zIndex="auto"
            size={{ width: "125%", height: "200%" }}
            pos={{ top: "40%", left: "70%" }}
            color="#9786DF40"
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
                maxW={320}
                textAlign={{ base: "center", md: "left" }}
                as="h4"
              >
                <GradientText
                  category={TRACKING_CATEGORY}
                  label="reports"
                  stopOne="#4F3DA5"
                  stopTwo="#8E81D0"
                >
                  Automatic pre-built reports
                </GradientText>{" "}
                with on-chain analytics.
              </Heading>
            </Flex>
            <Box pt={6} px={8}>
              <Image
                h="full"
                src={require("/public/assets/landingpage/manage-reports.png")}
                alt=""
              />
            </Box>
          </SimpleGrid>
        </GridItem>
      </SimpleGrid>
    </KeyFeatureLayout>
  );
};
