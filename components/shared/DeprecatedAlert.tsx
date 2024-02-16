import {
  Alert,
  AlertIcon,
  Flex,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { getChainByChainId } from "@thirdweb-dev/chains";
import { Text } from "tw-components";

interface DeprecatedAlertProps {
  chainName: string;
  description?: string;
  recommendedChainId?: number;
}

export const DeprecatedAlert: React.FC<DeprecatedAlertProps> = ({
  chainName,
  description = "thirdweb services are not available on this network.",
  recommendedChainId,
}) => {
  const recommendedChainName = recommendedChainId
    ? getChainByChainId(recommendedChainId).name
    : undefined;

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
        <AlertTitle>{chainName} is deprecated</AlertTitle>
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
