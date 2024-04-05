import { CoinbaseKit } from "classes/CoinbaseKit";
import { getFrameHtmlResponse } from "@coinbase/onchainkit";
import { errorResponse } from "utils/api";
import { getFarcasterAccountAddress } from "utils/tx-frame";
import { ThirdwebDegenEngine } from "classes/ThirdwebDegenEngine";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { shortenAddress } from "@thirdweb-dev/react";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return errorResponse("Invalid method", 400);
  }

  const { isValid, message } = await CoinbaseKit.validateMessage(req.body);

  if (!isValid || !message) {
    return res.status(400).send("Invalid message");
  }

  const faracsterAddress = getFarcasterAccountAddress(message.interactor);

  const isNftOwned = await ThirdwebDegenEngine.isNFTOwned(faracsterAddress);

  if (isNftOwned) {
    const htmlResponse = getFrameHtmlResponse({
      buttons: [
        {
          label: `NFT already minted`,
          action: `post`,
        },
      ],
      image: `${getAbsoluteUrl()}/assets/og-image/degen-enchine-frame.png`,
    });

    return res.status(200).send(htmlResponse);
  }

  await ThirdwebDegenEngine.mint(faracsterAddress);

  const htmlResponse = getFrameHtmlResponse({
    buttons: [
      {
        label: `Successfully minted to address ${shortenAddress(faracsterAddress)}`,
        action: `post`,
      },
    ],
    image: `${getAbsoluteUrl()}/assets/og-image/degen-enchine-frame.png`,
  });

  return res.status(200).send(htmlResponse);
}
