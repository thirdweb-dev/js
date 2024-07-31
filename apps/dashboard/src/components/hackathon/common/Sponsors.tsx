import { Box, Flex, Image } from "@chakra-ui/react";
import { Heading, TrackedLink } from "tw-components";

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
    <Flex w="full" flexDir="column" mx="auto" gap={12}>
      <Heading
        fontSize={{ base: "24px", md: "32px" }}
        textAlign="center"
        fontWeight={700}
      >
        Our Partners
      </Heading>
      <Box
        gap={{ base: 8, md: 14 }}
        justifyContent="center"
        // 2 column grid on mobile, flex on desktop
        display={{ base: "grid", md: "flex" }}
        gridTemplateColumns={{ base: "1fr 1fr", md: "none" }}
        flexWrap="wrap"
        alignItems={"center"}
      >
        {sponsors.map(({ name, link, logo }) => (
          <TrackedLink
            key={name}
            href={link}
            isExternal
            category={hackathonName}
            label={name}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              maxW="150px"
              h={{ base: "35px", md: "45px" }}
              objectFit="contain"
              src={logo}
              alt={name}
            />
          </TrackedLink>
        ))}
      </Box>
    </Flex>
  );
};
