import { useContractTypeOfContract } from "@3rdweb-sdk/react";
import { Container, Heading, Stack } from "@chakra-ui/layout";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import { ChakraNextImage } from "components/Image";
import React from "react";

export interface IContractEmptyState {
  title?: string;
  contract?: ValidContractInstance;
}

export const ContractEmptyState: React.FC<IContractEmptyState> = ({
  title = "There is nothing here.",
  contract,
}) => {
  const contractType =
    useContractTypeOfContract(contract) || ("invalid-contract" as const);

  const image = contractType === "marketplace" ? "listing" : "new-nft";

  return (
    <Container maxW="lg" py={14}>
      <Stack spacing={7} align="center">
        <ChakraNextImage
          src={require(`public/assets/illustrations/${image}.png`)}
          alt="Empty state illustration"
          w="130px"
        />
        <Heading size="label.lg" fontSize="label.2xl" textAlign="center">
          {title}
        </Heading>
      </Stack>
    </Container>
  );
};
