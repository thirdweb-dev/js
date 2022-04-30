import { useContractTypeOfContract } from "@3rdweb-sdk/react";
import { Container, Stack } from "@chakra-ui/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import { ChakraNextImage } from "components/Image";
import React from "react";
import { Heading } from "tw-components";

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
        <Heading size="label.xl" textAlign="center">
          {title}
        </Heading>
      </Stack>
    </Container>
  );
};
