import { type FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit";
import { CoinbaseKit } from "classes/CoinbaseKit";
import { ThirdwebDegenEngine } from "classes/ThirdwebDegenEngine";
import { getAbsoluteUrl } from "lib/vercel-utils";
import type { NextRequest } from "next/server";
import {
  errorResponse,
  redirectResponse,
  successHtmlResponse,
} from "utils/api";
import { getFarcasterAccountAddress } from "utils/farcaster";
import { shortenAddress } from "utils/string";

const postUrl = `${getAbsoluteUrl()}/api/frame/degen/mint`;
const imageUrl = `${getAbsoluteUrl()}/assets/og-image/degen-enchine-frame.png`;

const thirdwebDashboardContractUrl =
  "https://thirdweb.com/degen-chain/0x1efacE838cdCD5B19d8D0CC4d22d7AEFdDfB0d6f";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return errorResponse("Invalid method", 400);
  }

  const body = (await req.json()) as FrameRequest;

  const { isValid, message } = await CoinbaseKit.validateMessage(body);

  if (!isValid || !message) {
    return errorResponse("Invalid message", 400);
  }

  const { searchParams } = new URL(req.url);

  const queryAction = searchParams.get("action");

  const action = ThirdwebDegenEngine.validateAction(queryAction as string);

  if (action === "mint") {
    const faracsterAddress = getFarcasterAccountAddress(message.interactor);

    const isNftOwned = await ThirdwebDegenEngine.isNFTOwned(faracsterAddress);

    if (isNftOwned) {
      const htmlResponse = getFrameHtmlResponse({
        buttons: [
          {
            label: "NFT already minted",
            action: "post_redirect",
          },
        ],
        image: imageUrl,
        post_url: `${postUrl}?action=redirect`,
      });

      return successHtmlResponse(htmlResponse, 200);
    }

    await ThirdwebDegenEngine.mint(faracsterAddress);

    const htmlResponse = getFrameHtmlResponse({
      buttons: [
        {
          label: `Successfully minted to address ${shortenAddress(faracsterAddress)}`,
          action: "post_redirect",
        },
      ],
      image: imageUrl,
      post_url: `${postUrl}?action=redirect`,
    });

    return successHtmlResponse(htmlResponse, 200);
  }

  return redirectResponse(thirdwebDashboardContractUrl, 302);
}
