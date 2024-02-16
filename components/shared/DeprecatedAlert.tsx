import {
  Alert,
  AlertIcon,
  Flex,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { Chain, getChainByChainId } from "@thirdweb-dev/chains";
import { Text } from "tw-components";

interface DeprecatedAlertProps {
  chain: Chain;
  description?: string;
  recommendedChainId?: number;
}

export const DeprecatedAlert: React.FC<DeprecatedAlertProps> = ({
  chain,
  description = "thirdweb services are not available on this network.",
  recommendedChainId,
}) => {
  const recommendedChainName = recommendedChainId
    ? getChainByChainId(recommendedChainId).name
    : undefined;

  if (chain?.status !== "deprecated" || !chain?.name) {
    return null;
  }

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
        <AlertTitle>{cleanedChainName} is deprecated</AlertTitle>
        <AlertDescription as={Text}>
          {description}{" "}
          {recommendedChainId && (
            <>
              We recommend switching to <strong>{recommendedChainName}</strong>{" "}
              to continue testing your smart contracts.
            </>
          )}
        </AlertDescription>
      </Flex>
    </Alert>
  );
};
