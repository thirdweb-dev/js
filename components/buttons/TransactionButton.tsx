import { MismatchButton } from "./MismatchButton";
import { Center, Flex, Tooltip } from "@chakra-ui/react";
import React from "react";
import useDimensions from "react-cool-dimensions";
import { BiTransferAlt } from "react-icons/bi";
import { ButtonProps, Text } from "tw-components";

export interface TransactionButtonProps extends ButtonProps {
  transactionCount: number;
}

export const TransactionButton: React.FC<TransactionButtonProps> = ({
  children,
  transactionCount,
  isLoading,
  size,
  colorScheme,
  variant,
  ...restButtonProps
}) => {
  const { observe, width } = useDimensions<HTMLSpanElement | null>();
  return (
    <MismatchButton
      borderRadius="md"
      position="relative"
      role="group"
      colorScheme={colorScheme}
      isLoading={isLoading}
      size={size}
      variant={variant}
      {...restButtonProps}
      overflow="hidden"
      pl={
        isLoading
          ? undefined
          : `calc(${width * 2}px + var(--chakra-space-${
              size === "sm" ? 3 : size === "lg" ? 6 : size === "xs" ? 2 : 4
            }))`
      }
    >
      {children}
      <Tooltip
        label={`This action will trigger ${transactionCount} ${
          transactionCount > 1 ? "transactions" : "transaction"
        }.`}
      >
        <Center
          _groupHover={{
            bg:
              variant === "solid" || !variant
                ? `${colorScheme}.800`
                : `${colorScheme}.200`,
          }}
          transitionProperty="var(--chakra-transition-property-common)"
          transitionDuration="var(--chakra-transition-duration-normal)"
          ref={observe}
          as="span"
          bg={
            variant === "solid" || !variant
              ? `${colorScheme}.700`
              : `${colorScheme}.100`
          }
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          px={4}
        >
          <Flex
            as="span"
            color="whiteAlpha.900"
            justify="center"
            gap={1}
            align="center"
          >
            <Text color="inherit" size="label.sm">
              {transactionCount}
            </Text>
            <BiTransferAlt />
          </Flex>
        </Center>
      </Tooltip>
    </MismatchButton>
  );
};
