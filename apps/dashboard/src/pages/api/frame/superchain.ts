import { SuperChainFrame } from "classes/SuperChainFrame";
import { validateFrameMessage } from "lib/farcaster-frames";
import {
  finalGrowthPlanFrameMetaData,
  growthPlanFrameMetaData,
} from "lib/superchain-frames";
import type { NextRequest } from "next/server";
import {
  errorResponse,
  redirectResponse,
  successHtmlResponse,
} from "utils/api";

export const config = {
  runtime: "edge",
};

const superchainLandingUrl = "https://thirdweb.com/grant/superchain";

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

  const queryAction = searchParams.get("action");

  const action = SuperChainFrame.validateAction(queryAction as string);

  if (action === "check") {
    const buttonIndex = SuperChainFrame.validateButtonIndex(message.button, 4);

    if (buttonIndex === 4) {
      return redirectResponse(superchainLandingUrl, 302);
    }

    const chainName = SuperChainFrame.chainNameByButtonIndex(buttonIndex);

    const htmlResponse = SuperChainFrame.htmlResponse(
      growthPlanFrameMetaData(chainName),
    );

    return successHtmlResponse(htmlResponse, 200);
  }

  if (action === "growth") {
    const buttonIndex = SuperChainFrame.validateButtonIndex(message.button, 3);

    const queryChain = searchParams.get("chain");

    const chain = SuperChainFrame.validateChain(queryChain as string);

    const plan = SuperChainFrame.planByButtonIndex(buttonIndex);

    const transactionImage = SuperChainFrame.avgTransactionImage(chain, plan);

    const htmlResponse = SuperChainFrame.htmlResponse(
      finalGrowthPlanFrameMetaData(transactionImage),
    );

    return successHtmlResponse(htmlResponse, 200);
  }

  if (action === "final") {
    return redirectResponse(superchainLandingUrl, 302);
  }
}
