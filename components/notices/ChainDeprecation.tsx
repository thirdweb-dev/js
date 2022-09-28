import { useActiveChainId } from "@3rdweb-sdk/react";
import { Flex } from "@chakra-ui/react";
import { SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import { deprecatedChains } from "constants/mappings";
import { Text } from "tw-components";

export const ChainDeprecation = () => {
  const currentDate = new Date();
  const deprecationDate = new Date("2021-10-05T00:00:00.000Z");
  const chainId = useActiveChainId();

  if (!deprecatedChains.includes(chainId as SUPPORTED_CHAIN_ID)) {
    return null;
  }

  return (
    <Flex
      padding="20px"
      borderRadius="xl"
      bg="red.600"
      opacity={0.8}
      direction="column"
      mb={8}
    >
      <Text color="white">
        {currentDate < deprecationDate
          ? "This network is deprecated. Please migrate your contract to a new network."
          : "This network is being deprecated October 5th. Please migrate your contract to a new network before then."}
      </Text>
    </Flex>
  );
};
