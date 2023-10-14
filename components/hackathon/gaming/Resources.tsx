import { Flex, SimpleGrid } from "@chakra-ui/react";
import { Heading, TrackedLink } from "tw-components";

export const Resources: React.FC = () => {
  const resources = [
    {
      name: "Gaming",
      link: "https://portal.thirdweb.com/gamingkit",
      image: "/assets/hackathon/resources/readyplayer3/gamingkit.png",
    },
    {
      name: "Gaming Guides & Tutorials",
      link: "https://blog.thirdweb.com/tag/gaming",
      image: "/assets/hackathon/resources/readyplayer3/gamingkit-blogs.png",
    },
    {
      name: "Gaming Quickstart",
      link: "https://portal.thirdweb.com/gamingkit/quickstart",
      image: "/assets/hackathon/resources/readyplayer3/quickstart.png",
    },
  ];

  return (
    <Flex flexDir="column">
      <Heading textAlign="center" size="title.2xl" mb={12}>
        Resources
      </Heading>
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8}>
        {resources.map(({ name, link, image }, i) => (
          <TrackedLink
            overflow={"hidden"}
            href={link}
            isExternal
            category="readyplayer3"
            label={name}
            target="_blank"
            rel="noopener noreferrer"
            key={i}
            position="relative"
            backgroundImage={`linear-gradient(to bottom, hsl(319deg 98% 10%), hsl(300deg 100% 8% / 52%)), url(${image})`}
            backgroundPosition="center"
            backgroundSize={"100%"}
            height={{ base: "150px", md: "220px" }}
            borderRadius={"12px"}
            transition="background-size 200ms ease"
            _hover={{
              backgroundSize: "110%",
            }}
            color="white"
            fontSize={{ base: "24px", md: "32px" }}
            lineHeight={1.3}
            textAlign="center"
            p={6}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            fontWeight={700}
          >
            {name}
          </TrackedLink>
        ))}
      </SimpleGrid>
    </Flex>
  );
};
