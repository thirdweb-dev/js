import { Center, Divider, Flex } from "@chakra-ui/react";
import React from "react";
import { Heading, Text } from "tw-components";

export const PrizeSection: React.FC = () => {
  const prizes = [
    {
      title: "1st Place",
      prize: "$5,000",
    },
    {
      title: "2nd Place",
      prize: "$3,000",
    },
    {
      title: "3rd Place",
      prize: "$2,000",
    },
  ];
  return (
    <Flex w="full" my={20} justifyContent="center" gap={{ base: 6, md: 8 }}>
      {prizes.map(({ title, prize }, i) => (
        <React.Fragment key={title}>
          <Flex flexDir="column" key={title} align="center">
            <Heading size="title.lg">{prize}</Heading>
            <Text mt={1} size="label.lg" color="gray.500">
              {title}
            </Text>
          </Flex>
          {i < prizes.length - 1 && (
            <Center height={14}>
              <Divider orientation="vertical" />
            </Center>
          )}
        </React.Fragment>
      ))}
    </Flex>
  );
};
