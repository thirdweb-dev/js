import { NavCard, NavCardProps } from "./NavCard";
import { Box, Fade, Flex, Stack, useDisclosure } from "@chakra-ui/react";
import { Card, Text } from "tw-components";

export const PRODUCTS: NavCardProps[] = [
  {
    name: "SDKs",
    label: "sdk",
    description: "Integrate web3 into your app",
    link: "/sdk",
    icon: require("public/assets/product-icons/sdks.png"),
  },
  {
    name: "Smart Contracts",
    label: "smart-contracts",
    description: "Prebuilt and audited",
    link: "/smart-contracts",
    icon: require("public/assets/product-icons/contracts.png"),
  },
  {
    name: "ContractKit",
    label: "contractkit",
    description: "Building blocks for your contracts",
    link: "/contractkit",
    icon: require("public/assets/product-icons/extensions.png"),
  },
  {
    name: "Dashboards",
    label: "dashboards",
    description: "On-chain analytics and management",
    link: "/dashboards",
    icon: require("public/assets/product-icons/dashboards.png"),
  },
  {
    name: "UI Components",
    label: "ui-components",
    description: "Plug-and-play frontend components",
    link: "/ui-components",
    icon: require("public/assets/product-icons/ui-components.png"),
  },
  {
    name: "Auth",
    label: "auth",
    description: "Decentralized login for your app",
    link: "/auth",
    icon: require("public/assets/product-icons/auth.png"),
  },
  {
    name: "Release",
    label: "release",
    description: "Publish your contracts on-chain",
    link: "/release",
    icon: require("public/assets/product-icons/release.png"),
  },
  {
    name: "Deploy",
    label: "deploy",
    description: "Seamless contract deployment",
    link: "/deploy",
    icon: require("public/assets/product-icons/deploy.png"),
  },
  {
    name: "Storage",
    label: "storage",
    description: "Fast, reliable, decentralized storage",
    link: "/storage",
    icon: require("public/assets/product-icons/storage.png"),
  },
];

export const Products: React.FC = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <Box onMouseEnter={onOpen} onMouseLeave={onClose} zIndex={isOpen ? 10 : 1}>
      <Text
        color="white"
        fontWeight="bold"
        fontSize="16px"
        cursor="pointer"
        py={3}
        opacity={isOpen ? 0.8 : 1}
        transition="opacity 0.1s"
      >
        Products
      </Text>

      <Box position="relative">
        <Fade in={isOpen}>
          <Card
            pointerEvents={isOpen ? "all" : "none"}
            p="20px"
            onMouseEnter={onOpen}
            position="absolute"
            top={0}
            left="-280px"
            borderColor="whiteAlpha.100"
            bg="black"
            borderWidth="2px"
          >
            <Flex>
              <Stack width="300px">
                {PRODUCTS.slice(0, Math.ceil(PRODUCTS.length / 2)).map(
                  (product, id) => (
                    <NavCard key={id} {...product} />
                  ),
                )}
              </Stack>
              <Stack width="300px">
                {PRODUCTS.slice(
                  Math.ceil(PRODUCTS.length / 2),
                  PRODUCTS.length,
                ).map((product, id) => (
                  <NavCard key={id} {...product} />
                ))}
              </Stack>
            </Flex>
          </Card>
        </Fade>
      </Box>
    </Box>
  );
};
