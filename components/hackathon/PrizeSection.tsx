import { Container } from "@chakra-ui/react";
import { Stat } from "components/homepage/sections/StatsSection";
import React from "react";
import { Heading } from "tw-components";

export const PrizeSection: React.FC = () => {
  return (
    <Container maxW={"container.page"} mt={28}>
      <Heading as="h1" size="title.2xl" mb={6} textAlign="center">
        Grand Prize
      </Heading>
      <Stat title="$10,000" description="in thirdweb credits" />
    </Container>
  );
};
