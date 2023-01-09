import { Flex, Image } from "@chakra-ui/react";
import type { FC } from "react";
import { Heading, Text, TrackedLink } from "tw-components";

export const Resources: FC = () => {
  const resources = [
    {
      name: "GamingKit",
      link: "https://portal.thirdweb.com/gamingkit",
      image: "/assets/hackathon/resources/readyplayer3/gamingkit.png",
    },
    {
      name: "GamingKit Guides & Blog",
      link: "https://blog.thirdweb.com/tag/gaming",
      image: "/assets/hackathon/resources/readyplayer3/gamingkit-blogs.png",
    },
    {
      name: "GamingKit Quickstart",
      link: "/",
      image: "/assets/hackathon/resources/readyplayer3/quickstart.png",
    },
  ];

  return (
    <Flex flexDir="column">
      <Heading textAlign="center">Resources</Heading>
      <Flex gap={6} mt={4} align="center" justify="center">
        {resources.map(({ name, link, image }, i) => (
          <Flex flexDir="column" rounded="lg" bg="whiteAlpha.100" p={4} key={i}>
            <TrackedLink
              href={link}
              isExternal
              category="readyplayer3"
              label={name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={image}
                alt={name}
                w="full"
                objectFit="contain"
                rounded="lg"
              />
              <Text mt={2} color="white" ml={2}>
                {name}
              </Text>
            </TrackedLink>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
