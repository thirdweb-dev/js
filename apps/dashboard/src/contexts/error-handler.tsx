import { Code, Divider, Flex, Icon, useClipboard } from "@chakra-ui/react";
import { createContext, useCallback, useContext, useState } from "react";
import { FiAlertTriangle, FiCheck, FiCopy, FiHelpCircle } from "react-icons/fi";
import { toast } from "sonner";
import { Button, Drawer, Heading, LinkButton, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import type { ComponentWithChildren } from "types/component-with-children";
import { parseErrorToMessage } from "utils/errorParser";

interface ErrorContext {
  onError: (error: unknown, errorTitle?: string) => void;
  dismissError: () => void;
}

const ErrorContext = createContext<ErrorContext>({
  onError: () => undefined,
  dismissError: () => undefined,
});

// We have decided to not export this class from v5 because that area need to be reworked
// so this type is created as a workaround
// @internal
type TransactionError = {
  message: string;
  info?: {
    from: string;
    to: string;
    network?: {
      name: string;
      chainId: number;
    };
  };
  reason?: string;
};

type EnhancedTransactionError = TransactionError & {
  title: string;
};

export const ErrorProvider: ComponentWithChildren = ({ children }) => {
  const [currentError, setCurrentError] = useState<EnhancedTransactionError>();
  const dismissError = useCallback(() => setCurrentError(undefined), []);
  const onError = useCallback((err: unknown, title = "An error occurred") => {
    if (isTransactionError(err)) {
      // biome-ignore lint/suspicious/noExplicitAny: FIXME
      (err as any).title = title;
      setCurrentError(err as EnhancedTransactionError);
    } else {
      toast.error(parseErrorToMessage(err));
    }
  }, []);

  const { onCopy, hasCopied } = useClipboard(currentError?.message || "");

  return (
    <>
      <Drawer size="md" isOpen={!!currentError} onClose={dismissError}>
        <Flex direction="column" gap={4}>
          <Flex direction="row" gap={1} align="center">
            <Icon boxSize={5} as={FiAlertTriangle} color="red.500" />
            <Heading size="subtitle.md">
              Error: Failed to send transaction
            </Heading>
          </Flex>
          <Flex direction="column" gap={2}>
            <Heading size="label.md">From</Heading>
            <AddressCopyButton
              title="error"
              address={currentError?.info?.from}
            />
          </Flex>
          <Flex direction="column" gap={2}>
            <Heading size="label.md">To</Heading>
            <AddressCopyButton title="error" address={currentError?.info?.to} />
          </Flex>
          <Flex direction="column" gap={2}>
            <Heading size="label.md">Chain / Chain ID</Heading>
            <Text>
              {currentError?.info?.network?.name} (
              {currentError?.info?.network?.chainId})
            </Text>
          </Flex>
          <Flex direction="column" gap={2}>
            <Heading size="label.md">Root cause</Heading>
            <Code px={4} py={2} borderRadius="md" whiteSpace="pre-wrap">
              {currentError?.reason}
            </Code>
          </Flex>
          <Divider my={2} borderColor="borderColor" />
          <Heading size="subtitle.md">Need help with this error?</Heading>
          <LinkButton
            colorScheme="primary"
            isExternal
            noIcon
            href="/support"
            leftIcon={<Icon boxSize="1rem" as={FiHelpCircle} />}
          >
            Visit our support site
          </LinkButton>
          <Button
            onClick={onCopy}
            leftIcon={<Icon boxSize={3} as={hasCopied ? FiCheck : FiCopy} />}
          >
            {hasCopied ? "Copied!" : "Copy error to clipboard"}
          </Button>
          <Text fontStyle="italic">
            Copying the error message will let you report this error with all
            its details to our team.
          </Text>
        </Flex>
      </Drawer>

      <ErrorContext.Provider
        value={{
          onError,
          dismissError,
        }}
      >
        {children}
      </ErrorContext.Provider>
    </>
  );
};

export function useErrorHandler() {
  return useContext(ErrorContext);
}

function isTransactionError(error: unknown): error is TransactionError {
  return error instanceof Object && "reason" in error && "info" in error;
}
