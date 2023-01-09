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
      name: "GamingKit Guides & Tutorials",
      link: "https://blog.thirdweb.com/tag/gaming",
      image: "/assets/hackathon/resources/readyplayer3/gamingkit-blogs.png",
    },
    {
      name: "GamingKit Quickstart",
      link: "https://portal.thirdweb.com/gamingkit/quickstart",
      image: "/assets/hackathon/resources/readyplayer3/quickstart.png",
    },
  ];

  return (
    <Flex flexDir="column">
      <Heading textAlign="center">Resources</Heading>
      <Flex gap={6} mt={4} align="center" justify="center" wrap="wrap">
        {resources.map(({ name, link, image }, i) => (
          <TrackedLink
            href={link}
            isExternal
            category="readyplayer3"
            label={name}
            target="_blank"
            rel="noopener noreferrer"
            key={i}
          >
            <Flex
              flexDir={{
                base: "row",
                md: "column",
              }}
              w={{
                base: "90vw",
                md: "auto",
              }}
              rounded="lg"
              bg="whiteAlpha.100"
              p={{
                base: 2,
                md: 4,
              }}
              align="center"
            >
              <Image
                src={image}
                alt={name}
                w={{
                  base: "45%",
                  md: "auto",
                }}
                objectFit="contain"
                rounded="lg"
              />
              <Text
                mt={2}
                color="white"
                ml={{
                  base: 4,
                  md: 2,
                }}
                fontSize="2xl"
              >
                {name}
              </Text>
            </Flex>
          </TrackedLink>
        ))}
      </Flex>
    </Flex>
  );
};
