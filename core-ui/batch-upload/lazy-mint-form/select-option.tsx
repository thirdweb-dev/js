import {
  Flex,
  Icon,
  Radio,
  Stack,
  StackProps,
  Tooltip,
} from "@chakra-ui/react";
import { AiOutlineInfoCircle } from "@react-icons/all-files/ai/AiOutlineInfoCircle";
import { MouseEventHandler } from "react";
import { Card, Heading, Text } from "tw-components";

interface SelectOptionProps extends StackProps {
  name: string;
  description?: string;
  isActive?: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
  disabledText?: string;
  infoText?: string | JSX.Element;
}

export const SelectOption: React.FC<SelectOptionProps> = ({
  name,
  description,
  isActive = true,
  onClick,
  disabled,
  disabledText,
  infoText,
  ...stackProps
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
        {...stackProps}
      >
        <Flex flexDirection="row" justifyContent="space-between">
          <Stack flexDirection="row" alignItems="start" spacing={0}>
            <Radio
              cursor="pointer"
              size="lg"
              colorScheme="primary"
              mt={0.5}
              mr={2.5}
              isChecked={isActive}
              isDisabled={disabled}
            />
            <Stack ml={4} flexDirection="column" alignSelf="start">
              <Heading
                size="subtitle.sm"
                fontWeight="700"
                mb={0}
                color={disabled ? "gray.600" : "inherit"}
              >
                {name}
              </Heading>
              {description && (
                <Text size="body.sm" mt="4px">
                  {description}
                </Text>
              )}
            </Stack>
          </Stack>
          {infoText && (
            <Flex>
              <Tooltip
                bg="transparent"
                boxShadow="none"
                p={0}
                shouldWrapChildren
                label={
                  <Card bgColor="backgroundHighlight">
                    <Text>{infoText}</Text>
                  </Card>
                }
              >
                <Flex alignItems="center">
                  <Icon as={AiOutlineInfoCircle} boxSize={5} />
                </Flex>
              </Tooltip>
            </Flex>
          )}
        </Flex>
      </Stack>
    </Tooltip>
  );
};
