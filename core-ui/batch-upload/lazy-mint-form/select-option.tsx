import { Radio, Stack, Tooltip } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { Card, Heading, Text } from "tw-components";

interface SelectOptionProps {
  name: string;
  description: string;
  isActive: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
  disabledText?: string;
}

export const SelectOption: React.FC<SelectOptionProps> = ({
  name,
  description,
  isActive,
  onClick,
  disabled,
  disabledText,
}) => {
  return (
    <Tooltip
      label={
        disabled && (
          <Card bgColor="backgroundHighlight">
            <Text>{disabledText}</Text>
          </Card>
        )
      }
      bg="transparent"
      boxShadow="none"
      p={0}
      shouldWrapChildren
    >
      <Stack
        as={Card}
        padding={5}
        width={{ base: "inherit", md: "350px" }}
        borderRadius="md"
        borderColor={isActive ? "primary.500" : undefined}
        onClick={onClick}
        cursor={disabled ? "not-allowed" : "pointer"}
        pointerEvents={disabled ? "none" : undefined}
        bgColor={disabled ? "backgroundHighlight" : undefined}
      >
        <Stack flexDirection="row" alignItems="start" spacing={0} cursor="">
          <Radio
            cursor="pointer"
            size="lg"
            colorScheme="blue"
            mt={0.5}
            mr={2.5}
            isChecked={isActive}
            isDisabled={disabled}
          />
          <Stack ml={4} flexDirection="column" alignSelf="start">
            <Heading size="subtitle.sm" fontWeight="700" mb={0}>
              {name}
            </Heading>
            <Text size="body.sm" mt="4px">
              {description}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Tooltip>
  );
};
