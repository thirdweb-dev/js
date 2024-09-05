import { Flex, Stack } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import type { ThirdwebContract } from "thirdweb";
import { Heading, Text } from "tw-components";
import { ClaimConditionsForm } from "./claim-conditions-form/index";

interface ClaimConditionsProps {
  contract: ThirdwebContract;
  tokenId?: string;
  isColumn?: true;
  isERC20: boolean;
}
export const ClaimConditions: React.FC<ClaimConditionsProps> = ({
  contract,
  tokenId,
  isColumn,
  isERC20,
}) => {
  const contractQuery = useContract(contract.address);

  return (
    <Stack spacing={8}>
      <Flex p={0} position="relative">
        <Flex
          pt={{ base: isColumn ? 0 : 6, md: 6 }}
          direction="column"
          gap={8}
          w="full"
        >
          {/* Info */}
          <Flex as="section" direction="column" gap={4}>
            <Flex direction="column">
              <Heading size="title.md">Set Claim Conditions</Heading>
              <Text size="body.md" fontStyle="italic" mt={2}>
                Control when the {isERC20 ? "tokens" : "NFTs"} get dropped, how
                much they cost, and more.
              </Text>
            </Flex>
          </Flex>

          {/* Set Claim Conditions */}
          {contractQuery.contract && (
            <ClaimConditionsForm
              isErc20={isERC20}
              contract={contractQuery.contract}
              tokenId={tokenId}
              isColumn={isColumn}
              contractV5={contract}
              // always multi phase!
              isMultiPhase={true}
            />
          )}
        </Flex>
      </Flex>
    </Stack>
  );
};
