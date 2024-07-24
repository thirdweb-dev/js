import type { FrameRequest } from "@coinbase/onchainkit";
import * as Sentry from "@sentry/nextjs";
import { CoinbaseKit } from "classes/CoinbaseKit";
import { SuperChainFormFrame } from "classes/SuperchainFormFrame";
import type { NextRequest } from "next/server";
import {
  errorResponse,
  redirectResponse,
  successHtmlResponse,
} from "utils/api";
import {
  getApplyFrameMetaData,
  getEmailMetaData,
  getSuccessMetaData,
  getWebsiteMetaData,
} from "utils/superchain-embed-frame";

export const config = {
  runtime: "edge",
};

const dashboardUrl = "https://thirdweb.com/dashboard";

export default async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return errorResponse("Invalid method", 400);
  }

  try {
    const body = (await req.json()) as FrameRequest;

    const { isValid, message } = await CoinbaseKit.validateMessage(body);

    if (!isValid || !message) {
      return errorResponse("Invalid message", 400);
    }

    const { searchParams } = new URL(req.url);

    const queryType = searchParams.get("type");

    const type = SuperChainFormFrame.getQueryType(queryType as string);

    if (type === "apply") {
      const frameMetaData = getApplyFrameMetaData();
      return successHtmlResponse(
        SuperChainFormFrame.htmlResponse(frameMetaData),
        200,
      );
    }

    if (type === "chain") {
      const chain = SuperChainFormFrame.getChain(message.input?.toLowerCase());
      const emailMetaData = getEmailMetaData(chain);
      return successHtmlResponse(
        SuperChainFormFrame.htmlResponse(emailMetaData),
        200,
      );
    }

    if (type === "email") {
      const queryChain = searchParams.get("chain");
      const chain = SuperChainFormFrame.getChain(queryChain as string);
      const email = SuperChainFormFrame.getEmail(message.input);

      const websiteMetaData = getWebsiteMetaData(chain, email);
      return successHtmlResponse(
        SuperChainFormFrame.htmlResponse(websiteMetaData),
        200,
      );
    }

    if (type === "website") {
      const queryChain = searchParams.get("chain");
      const queryEmail = searchParams.get("email");

      const chain = SuperChainFormFrame.getChain(queryChain as string);
      const email = SuperChainFormFrame.getEmail(queryEmail as string);

      const website = SuperChainFormFrame.getWebsiteUrl(message.input);

      await SuperChainFormFrame.sendFormToHubspot([
        { name: "email", value: email },
        {
          name: "superchain_chain",
          value: SuperChainFormFrame.getConvertedChain(chain),
        },
        { name: "website", value: website },
        {
          name: "farcaster_handle",
          value: message.raw.action.interactor.username ?? "unknown",
        },
      ]);

      const websiteMetaData = getSuccessMetaData();
      return successHtmlResponse(
        SuperChainFormFrame.htmlResponse(websiteMetaData),
        200,
      );
    }

    if (type === "redirect") {
      return redirectResponse(dashboardUrl, 302);
    }

    return errorResponse("Type not valid", 400);
  } catch (err) {
    const errMessage = "Superchain frame embedded form failed";
    Sentry.captureException(new Error(errMessage, { cause: err }));
    return errorResponse("Something went wrong!", 500);
  }
}
