import { Flex, useColorMode } from "@chakra-ui/react";
import { Heading, Text } from "tw-components";

type CustomToolTipProps = {
  time: string;
  hoverKey: string;
  values: Record<string, number>;
};

const formattingOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export const StackToolTip: React.FC<CustomToolTipProps> = ({
  time,
  values,
  hoverKey,
}) => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      py={1.5}
      px={2.5}
      backdropFilter="blur(10px)"
      bg="transparent"
      flexDirection="column"
      gap={1}
      border="none"
      outline="none"
      borderRadius="lg"
      _dark={{
        bg: "rgba(0,0,0,0.2)",
      }}
      _light={{
        bg: "rgba(255,255,255,0.2)",
      }}
    >
      <Flex direction="column" gap={0.5}>
        <Heading as="label" size="label.sm">
          Date
        </Heading>
        <Text size="body.sm">
          {new Date(time).toLocaleDateString(undefined, formattingOptions)}
        </Text>
      </Flex>

      <Flex direction="column" gap={0.5}>
        {Object.entries(values)
          .reverse()
          .map(([key, value]) => (
            <Text
              key={key}
              fontSize="12px"
              color={colorMode === "dark" ? "white" : "#333"}
              opacity={hoverKey && key !== hoverKey ? 0.8 : 1}
            >
              {hoverKey && key !== hoverKey ? (
                `${key}: `
              ) : (
                <strong>{key}: </strong>
              )}
              {value.toLocaleString()}
            </Text>
          ))}
      </Flex>
    </Flex>
  );
};
