import { Container, Flex } from "@chakra-ui/react";
import React from "react";
import { Heading, Text } from "tw-components";

const Reason = () => {
  return (
    <Container maxW={907} mt={28}>
      <Heading as="h1" size="title.2xl" mb={6} textAlign="center">
        Why?
      </Heading>

      <Flex flexDir="column" gap={8}>
        <Text textAlign="left" size="body.xl" color="white">
          The next wave of web3 mass adoption is already happening.{" "}
          <b>
            If you want to be one of the next big crypto apps, the time to build
            is now!
          </b>
        </Text>

        <Text textAlign="left" size="body.xl" color="white">
          We&apos;re partnering with Base to host the{" "}
          <b>Consumer Crypto Hackathon</b> — bringing the hungriest builders to
          San Francisco to{" "}
          <b>discover the next billion-dollar web3 consumer app.</b>&nbsp;Get
          resources & expertise from top operators, find your next co-founder,
          and meet VCs & industry leaders from{" "}
          <b>Coinbase, Haun Ventures, Founders Inc</b>. and&nbsp;
          <b>Framework Ventures.</b>
        </Text>
      </Flex>
    </Container>
  );
};

export default Reason;
