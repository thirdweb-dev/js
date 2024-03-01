import { Box, Flex, LinkBox } from "@chakra-ui/react";
import { Heading, Text } from "tw-components";

export const ScheduleSectionEarn: React.FC = () => {
  const items = [
    {
      day: 17,
      title: "Location: thirdweb Offices, San Francisco",
      secondTitle: "12PM - 1:30PM Lunch",
      thirdTitle: "1:30PM - 3PM Game Presentations",
      fourthTitle: "3PM Awards",
    },
  ];

  return (
    <Flex flexDir="column" alignItems="center">
      <Heading size="title.2xl" mb={{ base: 8, md: 12 }}>
        Schedule
      </Heading>
      <Flex
        w="full"
        justify={{ base: "center", md: "space-between" }}
        flexDir="column"
        align="center"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="0 0 0 1px rgba(255, 255, 255, 0.1)"
        maxW={907}
      >
        <Box
          pointerEvents={"none"}
          width="100vw"
          height={{ base: "1400px", md: "2200px" }}
          position="absolute"
          zIndex={-1}
          top="55%"
          left="50%"
          transform="translate(-50%, -50%)"
          backgroundImage={`radial-gradient(ellipse at center, hsl(300deg 90% 50% / 15%), transparent 60%)`}
        />
        {items.map(({ day, title, secondTitle, thirdTitle, fourthTitle }) => (
          <Flex
            role="group"
            as={LinkBox}
            key={title}
            align="center"
            justify="flex-start"
            w="full"
            px={{ base: 4, md: 8 }}
            bg="transparent"
            boxShadow="0 0 0 1px rgba(255, 255, 255, 0.1)"
            _hover={{ bg: "whiteAlpha.50" }}
            py={3}
            gap={{ base: 4, md: 12 }}
          >
            <Flex
              flexDir="column"
              alignItems="center"
              w={"60px"}
              flexShrink={0}
            >
              <Text size="body.md" color="gray.300" textTransform="uppercase">
                MARCH
              </Text>
              <Heading size="title.lg" color="white">
                {day}
              </Heading>
            </Flex>
            <Flex justifyContent="center" gap={2} ml={4} flexDir={"column"}>
              <Heading
                size="subtitle.sm"
                fontWeight={500}
                color="white"
                textDecor="underline"
              >
                {title}
              </Heading>
              {secondTitle && (
                <Heading size="subtitle.sm" fontWeight={500} color="white">
                  {secondTitle}
                </Heading>
              )}
              {thirdTitle && (
                <Heading size="subtitle.sm" fontWeight={500} color="white">
                  {thirdTitle}
                </Heading>
              )}
              {fourthTitle && (
                <Heading size="subtitle.sm" fontWeight={500} color="white">
                  {fourthTitle}
                </Heading>
              )}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
