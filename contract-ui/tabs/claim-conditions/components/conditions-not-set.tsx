import { AdminOnly, useActiveChainId } from "@3rdweb-sdk/react";
import { Flex, Stack } from "@chakra-ui/react";
import { useClaimConditions } from "@thirdweb-dev/react";
import { SmartContract, ValidContractInstance } from "@thirdweb-dev/sdk";
import { detectClaimable } from "contract-ui/tabs/nfts/components/nft-drawer";
import { useState } from "react";
import { Button, LinkButton, Text } from "tw-components";

interface ConditionsNotSetProps {
  contract: SmartContract | null;
}

export const ConditionsNotSet: React.FC<ConditionsNotSetProps> = ({
  contract,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const isClaimable = detectClaimable(contract?.nft);
  const claimConditions = useClaimConditions(contract?.nft);

  const noClaimConditions =
    !claimConditions?.data?.length ||
    claimConditions.data.every((cc) => cc.maxQuantity === "0");

  const chain = useActiveChainId();

  if (dismissed || !isClaimable || !noClaimConditions) {
    return null;
  }

  return (
    <AdminOnly contract={contract as unknown as ValidContractInstance}>
      <Flex
        padding="20px"
        borderRadius="md"
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
            href={`/${chain}/${contract?.getAddress()}/claim-conditions`}
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
