import { Flex, Icon, LinkBox, LinkOverlay } from "@chakra-ui/react";
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
  TRACKING_CATEGORY: string;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  scheduleItems,
  addToCalendar,
  TRACKING_CATEGORY,
}) => {
  const trackEvent = useTrack();

  return (
    <Flex
      flexDir="column"
      mt={{ base: 4, md: 12 }}
      alignItems="center"
      maxW="800px"
      ml="auto"
      mr="auto"
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        mb={{ base: 8, md: 12 }}
      >
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
        borderRadius="lg"
        overflow="hidden"
        boxShadow="0 0 0 1px rgba(255, 255, 255, 0.1)"
      >
        {scheduleItems.map(({ day, month, title, href, irl }) => (
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
              <Text color="gray.300" textTransform="uppercase">
                {month}
              </Text>
              <Heading size="title.lg" color="white">
                {day}
              </Heading>
            </Flex>
            <Flex gap={4} alignItems="center">
              <LinkOverlay
                href={href}
                isExternal
                onClick={() =>
                  trackEvent({
                    category: TRACKING_CATEGORY,
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
                  <Heading size="subtitle.sm" fontWeight={500} color="white">
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
              _groupHover={{ color: "#e984f3" }}
              display={{ base: "none", md: "block" }}
              marginLeft="auto"
            />
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
