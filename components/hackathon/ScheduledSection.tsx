import { Flex, Icon, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { AiOutlineBuild } from "@react-icons/all-files/ai/AiOutlineBuild";
import { BiRightArrowAlt } from "@react-icons/all-files/bi/BiRightArrowAlt";
import { useTrack } from "hooks/analytics/useTrack";
import { Badge, Heading, Text } from "tw-components";

export const ScheduleSection: React.FC = () => {
  const trackEvent = useTrack();
  const items = [
    {
      day: 13,
      title: "Introduction to Solana",
      href: "https://lu.ma/sol-1",
    },
    {
      day: 19,
      title: "Solana-thon NYC Kickoff",
      href: "https://lu.ma/solanathonkickoff.thirdweb",
      irl: "NYC",
    },
    {
      day: 20,
      title: "Introduction to Phantom Wallet",
      href: "https://lu.ma/tw-phantom",
    },
  ];

  return (
    <Flex
      flexDir="column"
      mt={{ base: 4, md: 12 }}
      px={{ base: 6, md: 20 }}
      alignItems="center"
    >
      <Heading size="title.2xl">Schedule</Heading>
      <Flex
        w="full"
        justify="space-between"
        flexDir="column"
        align="center"
        mt={8}
        borderRadius="lg"
        overflow="hidden"
      >
        {items.map(({ day, title, href, irl }) => (
          <Flex
            role="group"
            as={LinkBox}
            key={title}
            align="center"
            justify="space-between"
            w="full"
            px={10}
            bg="whiteAlpha.100"
            _hover={{ bg: "whiteAlpha.200" }}
            py={2}
          >
            <Flex flexDir="column">
              <Heading size="title.lg" color="white">
                {day}
              </Heading>
              <Text color="gray.300">Oct</Text>
            </Flex>
            <Flex gap={4} width={96} alignItems="center">
              <Icon
                as={AiOutlineBuild}
                boxSize={6}
                color="gray.300"
                display={{ base: "none", md: "block" }}
              />
              <LinkOverlay
                href={href}
                isExternal
                onClick={() =>
                  trackEvent({
                    category: "solanathon",
                    action: "event",
                    label: title,
                  })
                }
              >
                <Flex
                  alignItems="center"
                  width={{ base: "full", md: "500px" }}
                  gap={2}
                >
                  <Heading
                    textAlign={{ base: "right", md: "left" }}
                    mt={1}
                    fontSize="20px"
                    maxW="350px"
                    fontWeight={500}
                  >
                    {title}
                  </Heading>
                  {irl && (
                    <Badge
                      display={{ base: "none", md: "block" }}
                      colorScheme="purple"
                    >
                      At our {irl} Office!
                    </Badge>
                  )}
                </Flex>
              </LinkOverlay>
            </Flex>
            <Icon
              as={BiRightArrowAlt}
              boxSize={6}
              color="gray.300"
              _groupHover={{ color: "purple.500" }}
              display={{ base: "none", md: "block" }}
            />
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
