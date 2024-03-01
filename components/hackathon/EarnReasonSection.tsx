import { Container, Flex, List, ListItem } from "@chakra-ui/react";
import React from "react";
import { Heading, Text } from "tw-components";

const EarnReasonSection = () => {
  return (
    <Container maxW={907} mt={28}>
      <Heading as="h1" size="title.2xl" mb={6} textAlign="center">
        Why?
      </Heading>

      <Flex flexDir="column" gap={8}>
        <Text textAlign="left" size="body.xl" color="white" lineHeight="36px">
          The digital landscape is evolving, and with it, the future of web3
          gaming. This is your invitation to lead the forefront of immersive
          gaming experiences that promise to captivate a global audience. Earn
          Alliance and thirdweb are excited to announce a pioneering hackathon
          aimed at web3 gaming enthusiasts and innovative developers. We
          challenge you to create a mini web3 game that not only entertains but
          deeply engages over 400K gamers within the Earn Alliance community.
        </Text>

        <Text textAlign="left" size="body.xl" color="white" lineHeight="36px">
          Leverage the advanced blockchain platforms of Earn Alliance and
          thirdweb, along with the power of Unity3D, to develop a captivating
          and innovative gaming experience. This is a golden opportunity to
          either showcase your skills or jump into the exciting realm of web3
          game development, offering a chance to innovate, shine, and
          potentially transform the gaming world.
        </Text>

        <Text size="body.xl" color="white" fontWeight="bold">
          Why You Should Participate
        </Text>

        <Flex fontSize={{ base: "18px", md: "20px" }}>
          <List color="white" styleType="none" spacing={3}>
            <ListItem>Connect with fellow creators</ListItem>
            <ListItem>Gain insights from industry leaders</ListItem>
            <ListItem>
              Influence the web3 gaming future at the Pre-GDC Hackathon
            </ListItem>
          </List>
        </Flex>
      </Flex>
    </Container>
  );
};

export default EarnReasonSection;
