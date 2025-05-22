import { cn } from "@/lib/utils";
import { Flex, Radio, Tooltip } from "@chakra-ui/react";
import { InfoIcon } from "lucide-react";
import type { JSX, MouseEventHandler } from "react";
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
}) => {
  return (
    <Tooltip
      label={
        disabled && (
          <Card className="bg-backgroundHighlight">
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
          "flex flex-col gap-2 rounded-md p-5 md:w-[350px]",
          disabled
            ? "pointer-events-none cursor-not-allowed bg-backgroundHighlight"
            : "cursor-pointer",
          isActive && "border-primary-500",
          className,
        )}
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
                  <Card className="bg-backgroundHighlight">
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
