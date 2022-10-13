import { Flex, SimpleGrid, VStack } from "@chakra-ui/react";
import { MaskedAvatar } from "components/contract-components/releaser/masked-avatar";
import { Heading, Text, TrackedLink } from "tw-components";

export const Judges: React.FC = () => {
  const judges = [
    {
      name: "Samina Kabir",
      twitter: "saminacodes",
      image: "/assets/landingpage/samina.jpeg",
      company: "thirdweb",
    },
    {
      name: "Farza Majeed",
      twitter: "FarzaTV",
      image: "/assets/landingpage/farza.jpeg",
      company: "buildspace",
    },
    {
      name: "Noah Hein",
      twitter: "nheindev",
      image: "/assets/landingpage/noah.png",
      company: "Phantom",
    },
    {
      name: "Chris Ahn",
      twitter: "ahnchrisj",
      image: "/assets/landingpage/chris.jpg",
      company: "Haun Ventures",
    },
  ];

  return (
    <VStack mb={20} spacing={8}>
      <Heading size="title.2xl">Judges</Heading>
      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        gap={{ base: 8, md: 24 }}
        justifyContent="space-evenly"
      >
        {judges.map((judge) => (
          <Flex key={judge.name} flexDir="column" gap={2} alignItems="center">
            <MaskedAvatar src={judge.image} alt="" boxSize={40} />
            <Heading size="title.sm">{judge.name}</Heading>
            <Text size="body.lg" color="gray.500">
              {judge.company}
            </Text>
            <TrackedLink
              href={`https://twitter.com/${judge.twitter}`}
              isExternal
              category="solanathon"
              label={judge.name}
            >
              <Text size="label.md" color="gray.500">
                @{judge.twitter}
              </Text>
            </TrackedLink>
          </Flex>
        ))}
      </SimpleGrid>
    </VStack>
  );
};
