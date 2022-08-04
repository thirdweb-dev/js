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
    name: "Web3 SDK",
    label: "web3-sdk",
    description: "Integrate web3 into your apps",
    link: "https://portal.thirdweb.com/web3-sdk",
    icon: require("public/assets/tw-icons/general.png"),
  },
  {
    name: "Pre-built Contracts",
    label: "pre-built-contracts",
    description: "Pre-built and audited contracts",
    link: "https://portal.thirdweb.com/pre-built-contracts",
    icon: require("public/assets/tw-icons/pack.png"),
  },
  {
    name: "Contract Extensions",
    label: "contract-extensions",
    description: "Build and extend smart contracts",
    link: "https://portal.thirdweb.com/contracts-sdk",
    icon: require("public/assets/tw-icons/edition.png"),
  },
  {
    name: "Dashboard",
    label: "dashboard",
    description: "Easily manage your contracts",
    link: "/dashboard",
    icon: require("public/assets/tw-icons/data.png"),
  },
  {
    name: "Auth",
    label: "auth",
    description: "Simple web3 login",
    link: "/auth",
    icon: require("public/assets/tw-icons/access-nft.png"),
  },
  {
    name: "Release",
    label: "release",
    description: "Publish your contract on-chain",
    link: "https://portal.thirdweb.com/release",
    icon: require("public/assets/tw-icons/marketplace.png"),
  },
  {
    name: "Deploy",
    label: "deploy",
    description: "Seamless contract deployment",
    link: "https://portal.thirdweb.com/deploy",
    icon: require("public/assets/tw-icons/dynamic-nft.png"),
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
          <ChakraNextImage boxSize={6} mb="-4px" src={icon} alt="icon" />
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
