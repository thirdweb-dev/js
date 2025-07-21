import Link from "next/link";

import type { JSX } from "react";

const PLEASE_REACH_OUT_MESSAGE = (
  <span>
    If you believe this is incorrect or the error persists, please{" "}
    <Link
      className="font-semibold underline"
      href="/team/~/~/support"
      rel="noopener noreferrer"
      target="_blank"
    >
      contact support
    </Link>
    .
  </span>
);

const UNKNOWN_ERROR_MESSAGE = "An unknown error occurred, please try again.";

export function parseErrorToMessage(error: unknown): string | JSX.Element {
  const message = parseError(error);

  return (
    <div className="flex flex-col gap-4">
      <span className="line-clamp-3">{message}</span>
      <span className="italic">{PLEASE_REACH_OUT_MESSAGE}</span>
    </div>
  );
}

export function parseError(error: unknown): string {
  // if the error is a straight string just return it
  if (typeof error === "string") {
    return error;
  }

  // biome-ignore lint/suspicious/noExplicitAny: FIXME: remove any
  if ((error as any)?.error?.message?.includes("execution reverted:")) {
    // biome-ignore lint/suspicious/noExplicitAny: FIXME: remove any
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

  // handle rpc errors
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  // everything that falls through here should be logged and sent to posthog
  console.error("unknown error", error);
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

function parseErrorCode(error: ErrorWithCode): string | undefined {
  switch (error.code) {
    case "CALL_EXCEPTION": {
      if (error.reason) {
        return `The following error happened on the underlying Smart Contract: ${error.reason}`;
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
        error?.data?.message ||
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
