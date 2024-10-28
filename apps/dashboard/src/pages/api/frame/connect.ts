import { ConnectFrame } from "classes/ConnectFrame";
import {
  getFarcasterAccountAddress,
  validateFrameMessage,
} from "lib/farcaster-frames";
import type { NextRequest } from "next/server";
import {
  errorResponse,
  redirectResponse,
  successHtmlResponse,
} from "utils/api";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return errorResponse("Invalid method", 400);
  }

  const body = await req.json();
  const { isValid, message } = await validateFrameMessage(body);

  if (!isValid || !message) {
    return errorResponse("Invalid message", 400);
  }

  const { searchParams } = new URL(req.url);

  const queryStep = searchParams.get("step");

  const step = ConnectFrame.getParsedStep(queryStep);
  const buttonIdx = ConnectFrame.getParsedButtonIndex(message.button);

  const shouldMint = buttonIdx === 2 && step === "7";

  if (shouldMint) {
    const faracsterAddress = getFarcasterAccountAddress(message.interactor);
    const mintFrameHtmlResponse =
      await ConnectFrame.mintNftWithFrameHtmlResponse(faracsterAddress);
    return successHtmlResponse(mintFrameHtmlResponse, 200);
  }

  const shouldGoNext = ConnectFrame.getShouldGoNext(step, message.button);
  const shouldGoBack = ConnectFrame.getShouldGoBack(step, message.button);

  const shouldContinueSlideShow = shouldGoNext || shouldGoBack;

  if (shouldContinueSlideShow) {
    const frameHtmlResponse = ConnectFrame.getFrameHtmlResponse(
      step,
      shouldGoNext ? "next" : "back",
    );
    return successHtmlResponse(frameHtmlResponse, 200);
  }

  return redirectResponse(ConnectFrame.getRedirectUrl(step), 302);
}
