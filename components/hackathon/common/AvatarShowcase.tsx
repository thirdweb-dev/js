import { Avatar, Flex, VStack } from "@chakra-ui/react";
import { Heading, Text, TrackedLink } from "tw-components";

interface AvatarShowcaseProps {
  title: string;
  avatars: {
    name: string;
    image: string;
    company: string;
    twitter: string;
  }[];
  trackingCategory: string;
}

export const AvatarShowcase: React.FC<AvatarShowcaseProps> = ({
  title,
  avatars,
  trackingCategory,
}) => {
  return (
    <VStack mb={20} spacing={12}>
      <Heading size="title.2xl">{title}</Heading>
      <Flex
        maxW="container.md"
        wrap="wrap"
        gap={{ base: 8, md: 16 }}
        justifyContent="space-evenly"
        placeContent="center"
      >
        {avatars.map((avatar) => (
          <Flex
            key={avatar.name}
            flexDir="column"
            gap={5}
            alignItems="center"
            zIndex={2}
            w={{
              base: "45vw",
              md: "auto",
            }}
          >
            <Avatar
              src={avatar.image}
              rounded="full"
              name={avatar.name}
              boxSize={{ base: 32, md: 40 }}
            />
            <Flex flexDir="column" gap={2} alignItems="center">
              <Heading size="title.sm" textAlign="center">
                {avatar.name}
              </Heading>
              <Text size="body.lg" color="gray.500">
                {avatar.company}
              </Text>
              <TrackedLink
                href={`https://twitter.com/${avatar.twitter}`}
                isExternal
                category={trackingCategory}
                label={avatar.name}
              >
                <Text size="label.md" color="gray.500">
                  @{avatar.twitter}
                </Text>
              </TrackedLink>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </VStack>
  );
};
