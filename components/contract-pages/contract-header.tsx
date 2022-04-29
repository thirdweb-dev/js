import { useContractTypeOfContract } from "@3rdweb-sdk/react";
import { Box, ButtonGroup, Flex, Image, Stack } from "@chakra-ui/react";
import { ValidContractClass } from "@thirdweb-dev/sdk";
import { ChakraNextImage } from "components/Image";
import { FeatureIconMap } from "constants/mappings";
import React, { PropsWithChildren } from "react";
import { C } from "ts-toolbelt";
import { AddressCopyButton, Heading } from "tw-components";
import { z } from "zod";

interface IContractHeaderProps<
  TContract extends ValidContractClass,
  TMetadata extends z.infer<TContract["schema"]["output"]>,
> {
  contract?: C.Instance<TContract>;
  contractMetadata?: TMetadata;
  primaryAction?: JSX.Element;
  secondaryAction?: JSX.Element;
  tertiaryAction?: JSX.Element;
}

export const ContractHeader = <
  TContract extends ValidContractClass,
  TMetadata extends z.infer<TContract["schema"]["output"]>,
>({
  contractMetadata,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  contract,
}: PropsWithChildren<IContractHeaderProps<TContract, TMetadata>>) => {
  const contractType = useContractTypeOfContract(contract);
  const address = contract?.getAddress();
  const renderName = contractMetadata?.name || address || "";
  const contractImage = contractMetadata?.image;
  const image = contractType && FeatureIconMap[contractType];
  return (
    <Flex flexDirection={"row"} justify="space-between" align="center">
      <Flex gap={2} direction="row" align="center">
        <Box display={{ base: "none", md: "block" }}>
          {contractImage ? (
            <Image
              src={contractImage}
              objectFit="contain"
              boxSize="64px"
              alt={renderName}
            />
          ) : image ? (
            <ChakraNextImage boxSize="64px" src={image} alt={renderName} />
          ) : null}
        </Box>
        <Flex direction="column" alignItems="flex-start">
          <Heading>{renderName}</Heading>
          {address && (
            <Flex
              justifyContent="center"
              alignItems="center"
              my={2}
              flexDir={{ base: "column", md: "row" }}
              mr={{ base: 2, md: 0 }}
            >
              <AddressCopyButton variant="solid" address={address} />
            </Flex>
          )}
        </Flex>
      </Flex>
      <Stack direction={{ base: "column", md: "row" }} as={ButtonGroup}>
        {tertiaryAction}
        {secondaryAction}
        {primaryAction}
      </Stack>
    </Flex>
  );
};
