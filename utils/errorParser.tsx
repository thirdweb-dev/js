import { Link } from "@chakra-ui/react";
import posthog from "posthog-js";
import React from "react";
import { Text } from "tw-components";

const PLEASE_REACH_OUT_MESSAGE = (
  <>
    <br />
    <br />
    <Text as="span" color="inherit">
      If you believe this is incorrect or the error persists, please reach out
      in{" "}
      <Link
        fontWeight="700"
        href="https://discord.gg/thirdweb"
        isExternal
        textDecor="underline"
      >
        discord
      </Link>
      .
    </Text>
  </>
);

const UNKNWON_ERROR_MESSAGE = "An unknown error occurred, please try again.";

export function parseErrorToMessage(error: unknown): string | JSX.Element {
  const message = parseError(error);

  return (
    <Text as="span" color="inherit">
      {message}
      <i>{PLEASE_REACH_OUT_MESSAGE}</i>
    </Text>
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

  // errors with data.code
  if (isErrorWithDataCode(error)) {
    const err = parseErrorDataCode(error);
    if (err) {
      return err;
    }
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
  return UNKNWON_ERROR_MESSAGE;
}

interface ErrorWithCode extends Error {
  code: number | string;
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
            The following error happened on the underlying smart contract:
            <br />
            <strong>{error.reason}</strong>
          </>
        );
      }
      return "An error occurred on the underlying smart contract.";
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

      return "An internal error occured with your transaction.";
    }
    case -32002: {
      return "There is already a pending request on your wallet to do that. Please check your wallet.";
    }
    case 4001: {
      return "You denied the transaction request.";
    }
  }
}

interface ErrorWithDataCode extends Error {
  data: ErrorWithCode;
}
function isErrorWithDataCode(error: unknown): error is ErrorWithDataCode {
  return (error as ErrorWithDataCode)?.data?.code !== undefined;
}

function parseErrorDataCode(
  error: ErrorWithDataCode,
): string | JSX.Element | void {
  switch (error.data.code) {
    case -32000: {
      return "Your wallet has insufficient funds to complete this action.";
    }
    case 4001: {
      return "You denied the transaction request.";
    }
    case 3: {
      if (error.data.message) {
        return error.data.message;
      }
    }
  }
}
