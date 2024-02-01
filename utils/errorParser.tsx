import { Flex, Link } from "@chakra-ui/react";
import posthog from "posthog-js-opensource";
import { Text } from "tw-components";

const PLEASE_REACH_OUT_MESSAGE = (
  <Text as="span" color="inherit">
    If you believe this is incorrect or the error persists, please visit our{" "}
    <Link fontWeight="700" href="/support" isExternal textDecor="underline">
      support site
    </Link>
    .
  </Text>
);

const UNKNOWN_ERROR_MESSAGE = "An unknown error occurred, please try again.";

export function parseErrorToMessage(error: unknown): string | JSX.Element {
  const message = parseError(error);

  return (
    <Flex gap={4} flexDir="column">
      <Text as="span" color="inherit" noOfLines={3}>
        {message}
      </Text>
      <Text fontStyle="italic" as="span" color="inherit">
        {PLEASE_REACH_OUT_MESSAGE}
      </Text>
    </Flex>
  );
}

function parseError(error: unknown): string | JSX.Element {
  // if the error is a straight string just return it
  if (typeof error === "string") {
    return error;
  }

  if ((error as any)?.error?.message?.includes("execution reverted:")) {
    return (error as any)?.error?.message;
  }

  // errors with code top level
  if (isErrorWithCode(error)) {
    const err = parseErrorCode(error);
    if (err) {
      return err;
    }
  }

  // handle generic error instances
  if (error instanceof Error) {
    return error.message;
  }

  // everything that falls through here should be logged and sent to posthog
  console.error("unknown error", error);
  posthog.capture("unknown_error", { error });
  // worst case scenario send a generic error message back
  return UNKNOWN_ERROR_MESSAGE;
}

interface ErrorWithCode extends Error {
  code: number | string;
  data: { code: number; message: string };
  stack?: string;
  reason?: string;
}

function isErrorWithCode(error: unknown): error is ErrorWithCode {
  return (error as ErrorWithCode)?.code !== undefined;
}

function parseErrorCode(error: ErrorWithCode): string | JSX.Element | void {
  switch (error.code) {
    case "CALL_EXCEPTION": {
      if (error.reason) {
        return (
          <>
            The following error happened on the underlying Smart Contract:
            <br />
            <strong>{error.reason}</strong>
          </>
        );
      }
      return "An error occurred on the underlying Smart Contract.";
    }
    case -32602: {
      return "You denied the transaction request.";
    }
    case -32603: {
      if (error.message.includes("LEDGER_LOCKED")) {
        return "This app does not currently work with ledger, please connect another way.";
      }

      if (error.message.includes("MetaMask Message Signature")) {
        return `
          There was an error with the metamask signature. 
          If you are using a Ledger wallet, make sure you go to settings 
          and enable the "Allow Contract Data" setting
        `;
      }

      if (error.data?.message?.includes("max code size exceeded")) {
        return `
          This contract is bigger than the size limit (24,567 bytes). 
          You need to reduce the size of the contract before deploying. 
          We recommend enabling the optimizer in your compiler.
        `;
      }

      return (
        error?.data.message ||
        error?.message ||
        "An internal error occurred with your transaction."
      );
    }
    case -32002: {
      return "There is already a pending request on your wallet to do that. Please check your wallet.";
    }
    case 4001: {
      return "You denied the transaction request.";
    }
  }
}
