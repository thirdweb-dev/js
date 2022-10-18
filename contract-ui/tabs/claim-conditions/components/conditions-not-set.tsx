import { AdminOnly } from "@3rdweb-sdk/react";
import { Flex, Stack } from "@chakra-ui/react";
import { useClaimConditions, useContract } from "@thirdweb-dev/react";
import { detectFeatures } from "components/contract-components/utils";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useState } from "react";
import { Button, LinkButton, Text } from "tw-components";

interface ConditionsNotSetProps {
  address: string;
}

export const ConditionsNotSet: React.FC<ConditionsNotSetProps> = ({
  address,
}) => {
  const { contract } = useContract(address);
  const [dismissed, setDismissed] = useState(false);
  const isClaimable = detectFeatures(contract, [
    "ERC721ClaimableWithConditions",
  ]);
  const claimConditions = useClaimConditions(
    isClaimable ? contract : undefined,
  );

  const noClaimConditions =
    !claimConditions.isLoading &&
    (!claimConditions?.data?.length ||
      claimConditions.data.every((cc) => cc.maxQuantity === "0"));

  const chainName = useSingleQueryParam("networkOrAddress");

  if (dismissed || !isClaimable || !noClaimConditions || !contract) {
    return null;
  }

  return (
    <AdminOnly contract={contract}>
      <Flex
        padding="20px"
        borderRadius="xl"
        bg="orange.500"
        opacity={0.8}
        direction="column"
        mb={8}
      >
        <Text color="white">
          You need to set claim conditions in order for users to claim your
          NFTs.
        </Text>
        <Stack direction="row" mt="8px">
          <LinkButton
            size="sm"
            bg="white"
            color="orange.800"
            href={`/${chainName}/${contract?.getAddress()}/claim-conditions`}
            onClick={() => setDismissed(false)}
          >
            Set Claim Conditions
          </LinkButton>
          <Button
            size="sm"
            bg="white"
            color="orange.800"
            onClick={() => setDismissed(true)}
          >
            Dismiss
          </Button>
        </Stack>
      </Flex>
    </AdminOnly>
  );
};
