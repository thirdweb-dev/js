import { Box, Flex, List, ListItem, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import React, { Fragment } from "react";
import { Heading, Text } from "tw-components";

const reasons = [
  {
    title: "Web1",
    src: require("public/assets/landingpage/mobile/web1.png"),
    list: [
      "Read only",
      "Collection of protocols anyone can build",
      "Open-source",
      "Permissionless",
    ],
  },
  // arrow
  true,
  {
    title: "Web2",
    src: require("public/assets/landingpage/mobile/web2.png"),
    list: [
      "Read-write",
      "Collection of platforms aggregating traffic",
      "Closed",
      "Permissioned",
    ],
  },
  // arrow
  true,
  {
    title: "Web3",
    src: require("public/assets/landingpage/mobile/web3.png"),
    list: [
      "Read-Write-Own",
      "Collection of protocols anyone can build",
      "Open-source",
      "Permissionless",
      "Decentralized",
    ],
  },
];

const Arrow = () => {
  return (
    <Box display={{ base: "none", lg: "flex" }} mt="50%" justifySelf="center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="93"
        height="14"
        viewBox="0 0 93 14"
        fill="none"
      >
        <path
          d="M92.5865 7.66776C92.9399 7.31434 92.9399 6.74132 92.5865 6.3879L86.8271 0.628516C86.4737 0.275091 85.9006 0.275091 85.5472 0.628516C85.1938 0.98194 85.1938 1.55495 85.5472 1.90838L90.6667 7.02783L85.5472 12.1473C85.1938 12.5007 85.1938 13.0737 85.5472 13.4271C85.9006 13.7806 86.4737 13.7806 86.8271 13.4271L92.5865 7.66776ZM0 7.93283H91.9465V6.12283H0V7.93283Z"
          fill="white"
          fill-opacity="0.4"
        />
      </svg>
    </Box>
  );
};

const ReasonWeb3Section = () => {
  return (
    <Flex flexDir="column" alignItems="center" px={6}>
      <Heading textAlign="center" size="title.lg">
        Why web3?
      </Heading>
      <Text mt={6} maxW="648px" size="body.xl" textAlign="center">
        Web3 will unlock the true potential of the internet by enabling digital
        ownership for users and generating more revenue for builders.
      </Text>

      <SimpleGrid
        columns={{ base: 1, lg: 5 }}
        mt={14}
        alignItems="flex-start"
        gap={{ base: "60px", lg: 0 }}
      >
        {reasons.map((reason, idx) => {
          // if is arrow
          if (typeof reason === "boolean") {
            return <Arrow key={idx} />;
          }

          return (
            <Flex key={idx} flexDir="column">
              <ChakraNextImage
                w="full"
                src={reason.src}
                maxH="205px"
                alt="web-generation"
              />

              <Heading size="title.sm" mt={14}>
                {reason.title}
              </Heading>

              <List marginTop={6} listStyleType="initial">
                {reason.list.map((list, _idx) => {
                  return <ListItem key={_idx}>{list}</ListItem>;
                })}
              </List>
            </Flex>
          );
        })}
      </SimpleGrid>
    </Flex>
  );
};

export default ReasonWeb3Section;
