import {
  Box,
  Center,
  Code,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { detectContractFeature } from "@thirdweb-dev/sdk";
import type { FeatureName } from "@thirdweb-dev/sdk/dist/src/constants/contract-features";
import type { ContractWrapper } from "@thirdweb-dev/sdk/dist/src/core/classes/contract-wrapper";
import { DetectableFeature } from "@thirdweb-dev/sdk/dist/src/core/interfaces/DetectableFeature";
import React, { useRef } from "react";
import { FiCode } from "react-icons/fi";
import {
  Button,
  ButtonProps,
  Card,
  CodeBlock,
  Heading,
  LinkButton,
  Text,
} from "tw-components";

export interface FeatureDetectButtonProps
  extends ButtonProps,
    ExtensionDetectedStateParams {}
export interface ExtensionDetectedStateParams {
  /**
   * The feature or features to check
   */
  feature: FeatureName | FeatureName[];

  /**
   * The contract instance to check
   */
  contract: ReturnType<typeof useContract> | DetectableFeature;

  /**
   * the feature match stragegy (default: any)
   * - any: any of the features must be available
   * - all: all of the features must be available
   */
  matchStrategy?: "any" | "all";
}

export type ExtensionDetectedState = "enabled" | "disabled" | "loading";

export function extensionDetectedState({
  contract,
  feature,
  matchStrategy = "any",
}: ExtensionDetectedStateParams): ExtensionDetectedState {
  // if contract is loading return "loading"
  if ("contract" in contract && contract.isLoading) {
    return "loading";
  }

  const actualContract = "contract" in contract ? contract.contract : contract;

  // we're not loading but don't have a contract, so we'll assumed feture is disabled (really this is an error state?)
  if (!actualContract) {
    return "disabled";
  }

  const contractWrapper = (actualContract as any)
    .contractWrapper as ContractWrapper<any>;

  if (!Array.isArray(feature)) {
    return detectContractFeature(contractWrapper, feature)
      ? "enabled"
      : "disabled";
  }

  if (matchStrategy === "all") {
    return feature.every((f) => detectContractFeature(contractWrapper, f))
      ? "enabled"
      : "disabled";
  }
  return feature.some((f) => detectContractFeature(contractWrapper, f))
    ? "enabled"
    : "disabled";
}

export const ExtensionDetectButton = React.forwardRef<
  HTMLButtonElement,
  FeatureDetectButtonProps
>(
  (
    {
      children,
      isDisabled,
      onClick,
      loadingText,
      type,
      feature,
      contract,
      matchStrategy = "any",
      isLoading,
      leftIcon,
      rightIcon,
      colorScheme,
      // variant,
      ...restProps
    },
    ref,
  ) => {
    const detectedState = extensionDetectedState({
      contract,
      feature,
      matchStrategy,
    });

    const initialFocusRef = useRef<HTMLButtonElement>(null);

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
      <Popover
        initialFocusRef={initialFocusRef}
        isLazy
        isOpen={isOpen}
        onOpen={detectedState === "disabled" ? onOpen : undefined}
        onClose={onClose}
      >
        <PopoverTrigger>
          <Button
            {...restProps}
            colorScheme={detectedState === "disabled" ? undefined : colorScheme}
            // variant={detectedState === "disabled" ? "outline" : variant}
            leftIcon={
              detectedState === "disabled" ? <Icon as={FiCode} /> : leftIcon
            }
            rightIcon={detectedState === "disabled" ? undefined : rightIcon}
            type={detectedState === "disabled" ? "button" : type}
            loadingText={
              detectedState === "loading" ? "Detecting..." : loadingText
            }
            isLoading={detectedState === "loading" || isLoading}
            onClick={detectedState === "disabled" ? undefined : onClick}
            ref={ref}
            isDisabled={isDisabled}
          >
            {children}
          </Button>
        </PopoverTrigger>
        <Card
          w="auto"
          as={PopoverContent}
          bg="backgroundCardHighlight"
          mx={6}
          boxShadow="0px 0px 2px 0px var(--popper-arrow-shadow-color)"
        >
          <PopoverArrow bg="backgroundCardHighlight" />
          <PopoverBody>
            <ExtensionMissingContent
              feature={feature}
              matchStrategy={matchStrategy}
            />
          </PopoverBody>
        </Card>
      </Popover>
    );
  },
);

ExtensionDetectButton.displayName = "ExtensionDetectButton";

interface ExtensionMissingContentProps
  extends Omit<ExtensionDetectedStateParams, "contract"> {}

const ExtensionMissingContent: React.FC<ExtensionMissingContentProps> = ({
  feature,
  matchStrategy,
}) => {
  const arrayFeatures = Array.isArray(feature) ? feature : [feature];
  return (
    <Flex direction="column" gap={4}>
      <Box>
        <Heading size="title.sm">How to enable this functionality</Heading>
        <Text>
          Please add{" "}
          {arrayFeatures.length === 1 ? (
            "this extension"
          ) : (
            <>
              <strong>{matchStrategy === "any" ? "one of" : ""}</strong> these
              extensions
            </>
          )}{" "}
          to your contract.
        </Text>
      </Box>

      <Flex gap={4} direction="column">
        {arrayFeatures.map((feat, idx, arr) => (
          <React.Fragment key={feat}>
            <Flex direction="column" gap={2}>
              <Flex gap={4} justify="space-between" align="center">
                <Heading size="subtitle.sm">{feat}</Heading>
                <LinkButton
                  size="sm"
                  href="https://portal.thirdweb.com"
                  isExternal
                  variant="ghost"
                  borderRadius="md"
                >
                  Learn more
                </LinkButton>
              </Flex>

              <CodeBlock
                language="solidity"
                code={`// import the extension
import ${feat} from "@thirdweb-dev/contracts/${feat}";

// add the extension to your contract
contract YourContract is ${feat} {
 // ...
}`}
              />
            </Flex>
            {arr.length - 1 !== idx && (
              <Center>
                <Code
                  colorScheme={matchStrategy === "any" ? "purple" : "orange"}
                  px={4}
                  py={2}
                  borderRadius="md"
                >
                  <Text size="label.md">
                    {matchStrategy === "any" ? "OR" : "AND"}
                  </Text>
                </Code>
              </Center>
            )}
          </React.Fragment>
        ))}
      </Flex>
    </Flex>
  );
};
