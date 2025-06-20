import { ApiError } from "../../../bridge/types/Errors.js";

type UiError = {
  code: string;
  title: string;
  message: string;
};

export function getErrorMessage(err: unknown): UiError {
  if (err instanceof ApiError) {
    if (err.code === "INTERNAL_SERVER_ERROR") {
      return {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unknown error occurred. Please try again.",
        title: "Failed to Find Quote",
      };
    }
    return {
      code: err.code,
      message: getErrorMessageFromBridgeApiError(err),
      title: "Failed to Find Quote",
    };
  }

  if (err instanceof Error) {
    return {
      code: "UNABLE_TO_GET_PRICE_QUOTE",
      message:
        err.message ||
        "We couldn't get a quote for this token pair. Select another token or pay with card.",
      title: "Failed to Find Quote",
    };
  }

  return {
    code: "UNABLE_TO_GET_PRICE_QUOTE",
    message:
      "We couldn't get a quote for this token pair. Select another token or pay with card.",
    title: "Failed to Find Quote",
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
