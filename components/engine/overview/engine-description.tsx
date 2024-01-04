import { Stack, useColorMode } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { Heading } from "tw-components";

export const EngineOverviewDescription = () => {
  const { colorMode } = useColorMode();

  return (
    <Stack spacing={2} maxW={600} p={4}>
      <Heading size="title.xs" p={1} opacity={0.4}>
        Backend Wallets
      </Heading>
      <ChakraNextImage
        src={
          colorMode === "dark"
            ? require("public/assets/engine/hero-backendwallets-dark.webp")
            : require("public/assets/engine/hero-backendwallets-light.webp")
        }
        alt="Backend wallets"
      />
      <Heading size="title.xs" p={1} opacity={0.4}>
        Transactions
      </Heading>
      <ChakraNextImage
        src={
          colorMode === "dark"
            ? require("public/assets/engine/hero-transactions-dark.webp")
            : require("public/assets/engine/hero-transactions-light.webp")
        }
        alt="Transactions"
      />
    </Stack>
  );
};
