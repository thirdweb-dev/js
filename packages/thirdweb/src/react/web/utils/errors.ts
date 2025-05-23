import { ApiError } from "../../../bridge/types/Errors.js";

type UiError = {
  code: string;
  title: string;
  message: string;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function getErrorMessage(err: any): UiError {
  if (err instanceof ApiError) {
    if (err.code === "INTERNAL_SERVER_ERROR") {
      return {
        code: "INTERNAL_SERVER_ERROR",
        title: "Failed to Find Quote",
        message: "An unknown error occurred. Please try again.",
      };
    }
    return {
      code: err.code,
      title: "Failed to Find Quote",
      message: getErrorMessageFromBridgeApiError(err),
    };
  }

  return {
    code: "UNABLE_TO_GET_PRICE_QUOTE",
    title: "Failed to Find Quote",
    message:
      err.message ||
      "We couldn't get a quote for this token pair. Select another token or pay with card.",
  };
}

function getErrorMessageFromBridgeApiError(err: ApiError) {
  let msg = err.message;
  if (msg.includes("Details")) {
    msg = msg.substring(0, msg.indexOf("Details"));
  }
  if (msg.includes("{")) {
    msg = msg.substring(0, msg.indexOf("{"));
  }
  return msg;
}
