import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiCalendar, FiChevronDown, FiClock } from "react-icons/fi";
import { Badge, Heading, LinkButton, Text } from "tw-components";

interface EventProps {
  type: string;
  title: string;
  timestamp: string;
  location: string;
  description: string;
  link: string;
  isPast?: boolean;
}

export const DevRelEvent: React.FC<EventProps> = ({
  type,
  title,
  timestamp,
  location,
  description,
  link,
  isPast,
}) => {
  const trackEvent = useTrack();

  return (
    <AccordionItem
      _hover={{
        borderColor: "whiteAlpha.200",
      }}
      transition="border 0.2s"
      borderWidth="1px"
      borderColor="transparent"
      bg="whiteAlpha.100"
      my={4}
      rounded="lg"
      pb={10}
    >
      <AccordionButton
        gap={6}
        _hover={{
          bg: "transparent",
        }}
        px={{
          base: 6,
          md: 10,
        }}
        pt={10}
        display="flex"
        flexDir={{
          base: "column",
          md: "row",
        }}
        rounded="lg"
      >
        <Badge
          h="min"
          alignSelf={{
            base: "flex-start",
          }}
          w={32}
        >
          {type}
        </Badge>
        <Flex flexDir="column" w="full">
          <Heading textAlign="left" size="title.md">
            {title}
          </Heading>

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
                  hour12: true,
                })}
              </Text>
            </Flex>

            <Flex align="center" gap={1}>
              <Icon as={FaMapMarkerAlt} color="gray.300" />
              <Text color="gray.300">{location}</Text>
            </Flex>
          </Flex>
        </Flex>
        <Icon boxSize={6} as={FiChevronDown} />
      </AccordionButton>

      <AccordionPanel
        pb={4}
        display="flex"
        flexDir="column"
        alignItems="flex-start"
        gap={4}
        ml={{
          base: 2,
          md: "10rem",
        }}
        justifyContent="left"
      >
        <Text textAlign="left">{description}</Text>
        <LinkButton
          href={link}
          onClick={() =>
            trackEvent({
              category: `events-${title}`,
              action: "click",
              label: "register",
            })
          }
          w={60}
          fontSize="20px"
          color="black"
          flexShrink={0}
          background="white"
          _hover={
            isPast
              ? {}
              : {
                  background: "whiteAlpha.800",
                }
          }
          noIcon
          isExternal
          isDisabled={isPast}
        >
          Register
        </LinkButton>
      </AccordionPanel>
    </AccordionItem>
  );
};
