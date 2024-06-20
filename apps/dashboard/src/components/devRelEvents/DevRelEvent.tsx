import { Box, Flex, Icon, Image } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { FiCalendar, FiClock } from "react-icons/fi";
import { Card, Heading, LinkButton, Text } from "tw-components";

interface EventProps {
  title: string;
  timestamp: string;
  description: string;
  link: string;
  image: string;
}

export const DevRelEvent: React.FC<EventProps> = ({
  title,
  timestamp,
  description,
  link,
  image,
}) => {
  const trackEvent = useTrack();

  return (
    <Card
      bgColor="backgroundCardHighlight"
      gap={4}
      p={0}
      overflow="hidden"
      minH="324px"
    >
      <Image src={image} alt={title} objectFit="cover" />

      <Flex
        as={Flex}
        flexDir="column"
        justifyContent="space-between"
        gap={4}
        p={4}
        h="inherit"
      >
        <Flex flexDir="column">
          <Heading textAlign="left" size="title.md">
            {title}
          </Heading>
          <Text noOfLines={2}>{description}</Text>
          <Flex
            justify="flex-start"
            gap={4}
            mt={2}
            flexDir={{
              base: "column",
              md: "row",
            }}
          >
            <Flex align="center" gap={1} wrap="wrap">
              <Icon as={FiCalendar} color="gray.300" />
              <Text color="gray.300">
                {new Date(timestamp).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </Flex>
            <Flex align="center" gap={1}>
              <Icon as={FiClock} color="gray.300" />
              <Text color="gray.300">
                {new Date(timestamp).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: false,
                })}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box>
          <LinkButton
            href={link}
            onClick={() =>
              trackEvent({
                category: `events-${title}`,
                action: "click",
                label: "register",
              })
            }
            flexShrink={0}
            noIcon
            isExternal
            variant="outline"
          >
            Register
          </LinkButton>
        </Box>
      </Flex>
    </Card>
  );
};
