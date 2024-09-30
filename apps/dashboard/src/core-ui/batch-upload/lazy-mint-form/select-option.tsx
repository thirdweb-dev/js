import { cn } from "@/lib/utils";
import { Flex, Radio, Tooltip } from "@chakra-ui/react";
import { InfoIcon } from "lucide-react";
import type { MouseEventHandler } from "react";
import { Card, Heading, Text } from "tw-components";

interface SelectOptionProps {
  name: string;
  description?: string;
  isActive?: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
  disabledText?: string;
  infoText?: string | JSX.Element;
  className?: string;
}

export const SelectOption: React.FC<SelectOptionProps> = ({
  name,
  description,
  isActive = true,
  onClick,
  disabled,
  disabledText,
  infoText,
  className,
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
      <Card
        className={cn(
          "flex flex-col gap-2 rounded-md p-5",
          disabled
            ? "pointer-events-none cursor-not-allowed"
            : "cursor-pointer",
          className,
        )}
        width={{ base: "inherit", md: "350px" }}
        borderColor={isActive ? "primary.500" : undefined}
        bgColor={disabled ? "backgroundHighlight" : undefined}
        {...stackProps}
        onClick={onClick}
      >
        <Flex flexDirection="row" justifyContent="space-between">
          <div className="flex flex-row items-start gap-0">
            <Radio
              cursor="pointer"
              size="lg"
              colorScheme="primary"
              mt={0.5}
              mr={2.5}
              isChecked={isActive}
              isDisabled={disabled}
            />
            <div className="ml-4 flex flex-col gap-2 self-start">
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
            </div>
          </div>
          {infoText && (
            <div className="flex flex-row">
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
                  <InfoIcon className="size-4" />
                </Flex>
              </Tooltip>
            </div>
          )}
        </Flex>
      </Card>
    </Tooltip>
  );
};
