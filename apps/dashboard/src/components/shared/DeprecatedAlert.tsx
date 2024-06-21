import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
} from "@chakra-ui/react";
import {
  ArbitrumGoerli,
  ArbitrumSepolia,
  BaseGoerli,
  BaseSepoliaTestnet,
  type Chain,
  Goerli,
  Mumbai,
  OpSepoliaTestnet,
  OptimismGoerli,
  PolygonAmoyTestnet,
  Sepolia,
} from "@thirdweb-dev/chains";
import { Link, Text } from "tw-components";

interface DeprecatedAlertProps {
  chain: Chain | undefined;
}

const TO_BE_DEPRECATED_CHAINS: Record<number, { date: Date }> = {
  [Mumbai.chainId]: {
    date: new Date("2024-04-08"),
  },
};

const RECOMMENDED_CHAINS: Record<number, Chain> = {
  [Goerli.chainId]: Sepolia,
  [BaseGoerli.chainId]: BaseSepoliaTestnet,
  [OptimismGoerli.chainId]: OpSepoliaTestnet,
  [ArbitrumGoerli.chainId]: ArbitrumSepolia,
  [Mumbai.chainId]: PolygonAmoyTestnet,
};

export const DeprecatedAlert: React.FC<DeprecatedAlertProps> = ({ chain }) => {
  // the chain can *somehow* be `null` here!
  if (!chain) {
    return null;
  }
  const recommendedChain = RECOMMENDED_CHAINS[chain.chainId];
  const tobeDeprecatedChain = TO_BE_DEPRECATED_CHAINS[chain.chainId];

  if (
    (chain?.status !== "deprecated" && !tobeDeprecatedChain) ||
    !chain?.name
  ) {
    return null;
  }

  const isDeprecatedSoon =
    tobeDeprecatedChain &&
    tobeDeprecatedChain.date.getTime() > new Date().getTime();
  const message = isDeprecatedSoon
    ? `thirdweb services won't be available on this network after ${tobeDeprecatedChain.date.toLocaleDateString()}.`
    : "thirdweb services are not available on this network.";

  const cleanedChainName = chain?.name?.replace("Mainnet", "").trim();

  return (
    <Alert
      status="error"
      borderRadius="lg"
      backgroundColor="backgroundCardHighlight"
      borderLeftColor="red.500"
      borderLeftWidth={4}
      as={Flex}
      gap={1}
    >
      <AlertIcon />
      <Flex flexDir="column">
        <AlertTitle>
          {cleanedChainName}
          {isDeprecatedSoon ? " will be deprecated soon" : " is deprecated"}
        </AlertTitle>
        <AlertDescription as={Text}>
          {message}{" "}
          {recommendedChain && (
            <>
              <br />
              We recommend switching to{" "}
              <Link href={`/${recommendedChain.slug}`} color="primary.500">
                {recommendedChain.name}
              </Link>{" "}
              to continue testing your smart contracts.
            </>
          )}
        </AlertDescription>
      </Flex>
    </Alert>
  );
};
