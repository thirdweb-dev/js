import { Flex, Image, SimpleGrid } from "@chakra-ui/react";
import { Text, TrackedLink } from "tw-components";

const sponsors = [
  {
    name: "Solana University",
    logo: "/assets/hackathon/sponsors/solanauniversity.png",
    link: "https://www.solanau.org/",
  },
  {
    name: "Phantom",
    logo: "/assets/hackathon/sponsors/phantom.png",
    link: "https://phantom.app/",
  },
  {
    name: "buildspace",
    logo: "/assets/hackathon/sponsors/buildspace.png",
    link: "https://buildspace.so/",
  },
  {
    name: "Superteam",
    logo: "/assets/hackathon/sponsors/superteam.png",
    link: "https://superteam.fun/",
  },
] as const;

export const Sponsors: React.FC = () => {
  return (
    <Flex w="full" pb={20} flexDir="column" mx="auto" gap={4} mt={24}>
      <Text size="label.lg" textAlign="center">
        OUR PARTNERS
      </Text>
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={8} placeItems="center">
        {sponsors.map((sponsor) => (
          <TrackedLink
            key={sponsor.name}
            href={sponsor.link}
            isExternal
            category="solanathon"
            label={sponsor.name}
          >
            <Image
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
