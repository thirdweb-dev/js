import { Flex, SimpleGrid, VStack } from "@chakra-ui/react";
import { Heading, Text, TrackedLink } from "tw-components";
import { MaskedAvatar } from "tw-components/masked-avatar";

interface JudgesProps {
  TRACKING_CATEGORY: string;
}

export const Judges = ({ TRACKING_CATEGORY }: JudgesProps) => {
  const judges = [
    {
      name: "Furqan Rhydan",
      twitter: "FurqanR",
      description: "Founder, thirdweb",
      image: "/assets/landingpage/furqan-rydhan.png",
    },
    {
      name: "Chris Ahn",
      twitter: "ahnchrisj",
      description: "Partner, Haun Ventures",
      image: "/assets/landingpage/chris.png",
    },
    {
      name: "Michael Anderson",
      twitter: "im_manderson",
      description: "Partner, Framework Ventures",
      image: "/assets/landingpage/manderson.jpg",
    },
    {
      name: "Dan Kim",
      twitter: "DANKIMdigital",
      description: "VP Business Development, Coinbase",
      image: "/assets/landingpage/dan-kim.jpg",
    },
  ];

  return (
    <VStack spacing={8} position="relative">
      <Heading size="title.2xl">Judges</Heading>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4 }}
        gap={{ base: 8, md: 24 }}
        justifyContent="space-evenly"
        px={4}
      >
        {judges.map((judge) => (
          <Flex key={judge.name} flexDir="column" gap={2} alignItems="center">
            <MaskedAvatar
              boxSize={40}
              objectFit="cover"
              src={judge.image}
              alt={judge.name}
              borderRadius="full"
            />
            <Heading size="title.sm" mt={4} textAlign="center">
              {judge.name}
            </Heading>
            <Text size="body.md" textAlign="center">
              {judge.description}
            </Text>
            <TrackedLink
              href={`https://twitter.com/${judge.twitter}`}
              isExternal
              category={TRACKING_CATEGORY}
              label={judge.name}
              textAlign="center"
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
