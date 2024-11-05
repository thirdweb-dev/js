import { Flex, SimpleGrid } from "@chakra-ui/react";
import { Heading, Text, TrackedLink } from "tw-components";
import { MaskedAvatar } from "tw-components/masked-avatar";

interface JudgesProps {
  TRACKING_CATEGORY: string;
}

export const Judges = ({ TRACKING_CATEGORY }: JudgesProps) => {
  const judges = [
    {
      name: "Furqan Rydhan",
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
      name: "Parker Jou",
      twitter: "theappletucker",
      description: "Founder & CTO, Caldera",
      image: "/assets/landingpage/parker.jpg",
    },
    {
      name: "Franklin Bi",
      twitter: "FranklinBi",
      description: "Partner, Pantera Capital",
      image: "/assets/landingpage/franklin.jpg",
    },
  ];

  return (
    <div className="container relative flex max-w-[1200px] flex-col gap-8">
      <Heading size="title.2xl">Judges</Heading>
      <SimpleGrid
        columns={{ base: 1, lg: 4 }}
        gap={{ base: 8, md: 24 }}
        justifyContent="space-evenly"
        px={4}
      >
        {judges.map((judge) => (
          <Flex key={judge.name} flexDir="column" gap={2} alignItems="center">
            <MaskedAvatar
              src={judge.image}
              alt={judge.name}
              className="size-52"
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
    </div>
  );
};
