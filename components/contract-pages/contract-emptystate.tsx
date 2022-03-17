import { Container, Heading, Stack } from "@chakra-ui/layout";
import { ChakraNextImage } from "components/Image";
import React from "react";

export interface IContractEmptyState {
  title: string;
}

export const ContractEmptyState: React.FC<IContractEmptyState> = ({
  title,
}) => {
  return (
    <Container maxW="lg" py={14}>
      <Stack spacing={7} align="center">
        <ChakraNextImage
          src={require("public/assets/illustrations/empty-state.png")}
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
