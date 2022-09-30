import { Box, Fade, Flex, Stack, useDisclosure } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { StaticImageData } from "next/image";
import { Card, Text, TrackedLink } from "tw-components";

interface IProduct {
  name: string;
  label: string;
  description: string;
  link: string;
  icon: StaticImageData;
}

export const PRODUCTS: IProduct[] = [
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
    name: "UI Components",
    label: "ui-components",
    description: "Plug-and-play frontend components",
    link: "/ui-components",
    icon: require("public/assets/product-icons/ui-components.png"),
  },
];

export const Products: React.FC = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <Box onMouseEnter={onOpen} onMouseLeave={onClose}>
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
                {PRODUCTS.slice(0, 4).map((product, id) => (
                  <Product key={id} {...product} />
                ))}
              </Stack>
              <Stack width="300px">
                {PRODUCTS.slice(4, 8).map((product, id) => (
                  <Product key={id} {...product} />
                ))}
              </Stack>
            </Flex>
          </Card>
        </Fade>
      </Box>
    </Box>
  );
};

const Product: React.FC<IProduct> = ({
  name,
  description,
  label,
  link,
  icon,
}) => {
  return (
    <TrackedLink
      href={link}
      category="topnav"
      label={label}
      textDecor="none !important"
      isExternal={link.startsWith("http")}
    >
      <Box _hover={{ bg: "whiteAlpha.50" }} p="8px" borderRadius="md">
        <Stack direction="row" align="center" spacing={3}>
          <ChakraNextImage boxSize={7} mb="-4px" src={icon} alt="icon" />
          <Flex direction="column">
            <Text fontWeight="bold" color="white">
              {name}
            </Text>
            <Text color="whiteAlpha.500">{description}</Text>
          </Flex>
        </Stack>
      </Box>
    </TrackedLink>
  );
};
