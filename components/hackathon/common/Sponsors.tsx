import { Flex, Image, SimpleGrid } from "@chakra-ui/react";
import { Text, TrackedLink } from "tw-components";

interface Sponsor {
  name: string;
  logo: string;
  link: string;
}

interface SponsorProps {
  sponsors: Sponsor[];
  hackathonName: string;
}

export const Sponsors: React.FC<SponsorProps> = ({
  sponsors,
  hackathonName,
}) => {
  return (
    <Flex w="full" pb={20} flexDir="column" mx="auto" gap={4} mt={24}>
      <Text size="label.lg" textAlign="center">
        OUR PARTNERS
      </Text>
      <SimpleGrid
        columns={{ base: 2, md: sponsors?.length || 2 }}
        gap={8}
        placeItems="center"
      >
        {sponsors.map(({ name, link, logo }) => (
          <TrackedLink
            key={name}
            href={link}
            isExternal
            category={hackathonName}
            label={name}
          >
            <Image
              w="164px"
              h="50px"
              objectFit="contain"
              src={logo}
              alt={name}
            />
          </TrackedLink>
        ))}
      </SimpleGrid>
    </Flex>
  );
};
