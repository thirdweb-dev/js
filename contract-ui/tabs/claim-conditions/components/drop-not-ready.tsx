import { Flex, Stack } from "@chakra-ui/react";
import { useClaimConditions, useProgram } from "@thirdweb-dev/react/solana";
import { useState } from "react";
import { Button, Text } from "tw-components";

interface DropNotReadyProps {
  address: string;
}

export const DropNotReady: React.FC<DropNotReadyProps> = ({ address }) => {
  const { data: program } = useProgram(address, "nft-drop");
  const [dismissed, setDismissed] = useState(false);
  const isClaimable = program?.accountType === "nft-drop";

  const claimConditions = useClaimConditions(isClaimable ? program : undefined);

  const dropNotReady =
    claimConditions.data?.lazyMintedSupply !==
    claimConditions.data?.totalAvailableSupply;

  const maxClaimableZero = claimConditions.data?.maxClaimable === "0";

  if (
    dismissed ||
    !isClaimable ||
    (!dropNotReady && !maxClaimableZero) ||
    !program
  ) {
    return null;
  }

  return (
    <Flex
      padding="20px"
      borderRadius="xl"
      bg="orange.500"
      opacity={0.8}
      direction="column"
      mb={8}
    >
      {dropNotReady ? (
        <Text color="white">
          The supply you&apos;ve set for your drop is{" "}
          <b>{claimConditions.data?.totalAvailableSupply}</b>{" "}
          {claimConditions.data?.lazyMintedSupply === 0
            ? "and you have not uploaded NFTs any yet."
            : ` but you have only uploaded ${
                claimConditions.data?.lazyMintedSupply
              } NFT${
                claimConditions.data?.lazyMintedSupply === 1 ? "" : "s"
              }.`}{" "}
          <br />
          You need to <strong>upload all of your NFTs</strong> and{" "}
          <strong>set your claim conditions</strong> in order for users to start
          claiming them.
        </Text>
      ) : (
        <Text color="white">
          You need to <strong>set your claim conditions</strong> in order for
          users to start claiming your lazy minted NFTs.
        </Text>
      )}
      <Stack direction="row" mt="8px">
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
  );
};
