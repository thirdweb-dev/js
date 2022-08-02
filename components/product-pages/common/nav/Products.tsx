import { Box, Flex, Stack, useDisclosure } from "@chakra-ui/react";
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
    link: "https://portal.thirdweb.com/building-web3-apps/setting-up-the-sdk",
    icon: require("public/assets/tw-icons/general.png"),
  },
  {
    name: "Pre-built Contracts",
    label: "pre-built-contracts",
    description: "Pre-built and audited contracts",
    link: "https://portal.thirdweb.com/smart-contracts/pre-built-contracts-overview",
    icon: require("public/assets/tw-icons/pack.png"),
  },
  {
    name: "Contract Extensions",
    label: "contract-extensions",
    description: "Build and extend smart contracts",
    link: "https://portal.thirdweb.com/thirdweb-deploy/contract-extensions",
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
    link: "/authentication",
    icon: require("public/assets/tw-icons/access-nft.png"),
  },
  {
    name: "Release",
    label: "release",
    description: "Publish your contract on-chain",
    link: "https://portal.thirdweb.com/thirdweb-cli#release",
    icon: require("public/assets/tw-icons/marketplace.png"),
  },
  {
    name: "Deploy",
    label: "deploy",
    description: "Seamless contract deployment",
    link: "https://portal.thirdweb.com/thirdweb-cli#deploy",
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
      >
        Products
      </Text>

      <Box position="relative">
        {isOpen && (
          <Card
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
        )}
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
