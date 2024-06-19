import { Flex } from "@chakra-ui/react";
import { Heading, Text } from "tw-components";

type CustomToolTipProps = {
  valueLabel: string;
  active?: boolean;
  payload?: any;
  valueFormatter?: (value: any) => string;
};

const formattingOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export const CustomToolTip: React.FC<CustomToolTipProps> = ({
  active,
  payload,
  valueLabel,
  valueFormatter,
}) => {
  if (active && payload && payload.length) {
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
        {payload[0]?.payload?.time && (
          <Flex direction="column" gap={0.5}>
            <Heading as="label" size="label.sm">
              Date
            </Heading>
            <Text size="body.sm">
              {new Date(payload[0].payload.time).toLocaleDateString(
                undefined,
                formattingOptions,
              )}
            </Text>
          </Flex>
        )}
        <Flex direction="column" gap={0.5}>
          <Heading as="label" size="label.sm">
            {valueLabel}
          </Heading>
          <Text size="body.sm" fontFamily="mono">
            {valueFormatter
              ? valueFormatter(payload[0].value)
              : payload[0].value.toLocaleString()}
          </Text>
        </Flex>
      </Flex>
    );
  }

  return null;
};
