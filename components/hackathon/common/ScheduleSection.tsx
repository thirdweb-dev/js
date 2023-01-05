import { Flex, Icon, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { AiOutlineBuild } from "@react-icons/all-files/ai/AiOutlineBuild";
import { BiRightArrowAlt } from "@react-icons/all-files/bi/BiRightArrowAlt";
import { useTrack } from "hooks/analytics/useTrack";
import { Badge, Heading, LinkButton, Text } from "tw-components";

interface ScheduleItem {
  day: number;
  month: string;
  title: string;
  href: string;
  irl?: string;
}

interface ScheduleSectionProps {
  scheduleItems: ScheduleItem[];
  addToCalendar?: string;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  scheduleItems,
  addToCalendar,
}) => {
  const trackEvent = useTrack();

  return (
    <Flex
      flexDir="column"
      mt={{ base: 4, md: 12 }}
      px={{ base: 0, md: 20 }}
      alignItems="center"
    >
      <Flex justifyContent="center" alignItems="center">
        <Heading size="title.2xl">Schedule & Workshops</Heading>
        {addToCalendar ? (
          <LinkButton href={addToCalendar} ml={4} isExternal>
            Add to Calendar
          </LinkButton>
        ) : null}
      </Flex>
      <Flex
        w="full"
        justify={{ base: "center", md: "space-between" }}
        flexDir="column"
        align="center"
        mt={8}
        borderRadius="lg"
        overflow="hidden"
      >
        {scheduleItems.map(({ day, month, title, href, irl }) => (
          <Flex
            role="group"
            as={LinkBox}
            key={title}
            align="center"
            justify="space-between"
            w="full"
            px={{ base: 4, md: 8 }}
            bg="whiteAlpha.100"
            _hover={{ bg: "whiteAlpha.200" }}
            py={2}
            gap={4}
          >
            <Flex flexDir="column">
              <Text color="gray.300" textTransform="uppercase">
                {month}
              </Text>
              <Heading size="title.lg" color="white">
                {day}
              </Heading>
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
                  <Heading size="subtitle.sm" fontWeight={500}>
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
