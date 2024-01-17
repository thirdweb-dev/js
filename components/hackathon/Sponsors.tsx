import { Flex, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { Text, TrackedLink } from "tw-components";

const sponsors = [
  {
    name: "Caldera",
    logo: require("public/assets/landingpage/caldera.png"),
    link: "https://base.org/",
  },
  {
    name: "Founders.Inc",
    logo: require("public/assets/landingpage/founders.png"),
    link: "https://f.inc/",
  },
  {
    name: "Haun Ventures",
    logo: require("public/assets/landingpage/haun.svg"),
    link: "https://www.haun.co/",
  },
];

interface SponsorsProps {
  TRACKING_CATEGORY: string;
}

export const Sponsors = ({ TRACKING_CATEGORY }: SponsorsProps) => {
  return (
    <Flex w="full" pb={20} flexDir="column" mx="auto" gap={4} mt={24}>
      <Text size="label.lg" textAlign="center">
        OUR PARTNERS
      </Text>
      <SimpleGrid
        mt={4}
        columns={{ base: 2, md: 3 }}
        gap={8}
        placeItems="center"
      >
        {sponsors.map((sponsor) => (
          <TrackedLink
            key={sponsor.name}
            href={sponsor.link}
            isExternal
            category={TRACKING_CATEGORY}
            label={sponsor.name}
          >
            <ChakraNextImage
              w="164px"
              h="50px"
              objectFit="contain"
              src={sponsor.logo}
              alt={sponsor.name}
            />
          </TrackedLink>
        ))}
      </SimpleGrid>
    </Flex>
  );
};
