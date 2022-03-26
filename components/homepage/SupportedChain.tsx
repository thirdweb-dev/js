import { Box, Grid, Heading, Stack, Text } from "@chakra-ui/layout";
import { ChakraNextImage } from "components/Image";
import { StaticImageData } from "next/image";
import AvalanchePng from "public/assets/chain-icons/avalanche.png";
import EthereumPng from "public/assets/chain-icons/ethereum.png";
import FantomPng from "public/assets/chain-icons/fantom.png";
import FlowPng from "public/assets/chain-icons/flow.png";
import PolygonPng from "public/assets/chain-icons/polygon.png";
import SolanaPng from "public/assets/chain-icons/solana.png";
import React from "react";

type SupportedChain =
  | "ethereum"
  | "polygon"
  | "avalanche"
  | "fantom"
  | "solana"
  | "flow";

interface ISupportedChain {
  title: string;
  icon: StaticImageData;
  available: boolean;
}

const supportedChainMap: Record<SupportedChain, ISupportedChain> = {
  ethereum: {
    title: "Ethereum",
    icon: EthereumPng,
    available: true,
  },
  polygon: {
    title: "Polygon",
    icon: PolygonPng,
    available: true,
  },
  avalanche: {
    title: "Avalanche",
    icon: AvalanchePng,
    available: true,
  },
  fantom: {
    title: "Fantom",
    icon: FantomPng,
    available: true,
  },
  solana: {
    title: "Solana",
    icon: SolanaPng,
    available: false,
  },
  flow: {
    title: "Flow",
    icon: FlowPng,
    available: false,
  },
};

export const SupportedChain: React.FC<{ type: SupportedChain }> = ({
  type,
}) => {
  const { title, icon, available } = supportedChainMap[type];
  return (
    <Stack spacing={6} align="center">
      <Grid
        bg="white"
        boxSize={{ base: "7rem", md: "7rem" }}
        placeItems="center"
        borderRadius="full"
      >
        <ChakraNextImage
          alt=""
          boxSize="60%"
          layout="fill"
          objectFit="contain"
          objectPosition="center"
          src={icon}
        />
      </Grid>
      <Stack spacing={3} align="center">
        <Heading color="#262A36" as="h4" size="title.sm" fontWeight="600">
          {title}
        </Heading>
        {!available && (
          <Box backgroundColor="rgba(173, 92, 255, 0.1)" p={1.5} rounded="lg">
            <Text
              size="label.md"
              color="purple.500"
              textAlign="center"
              lineHeight="120%"
            >
              Coming soon
            </Text>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};
