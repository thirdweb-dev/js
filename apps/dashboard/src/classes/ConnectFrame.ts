import { getFrameHtmlResponse } from "@coinbase/onchainkit";
import { connectFrames } from "lib/connect-frames";
import * as engine from "lib/engine";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { z } from "zod";

const validSteps = z.union([
  z.literal("1"),
  z.literal("2"),
  z.literal("3"),
  z.literal("4"),
  z.literal("5"),
  z.literal("6"),
  z.literal("7"),
]);

type Step = z.infer<typeof validSteps>;

const nftContractAddress = "0x9D96603334B1e97554b846CA916a6b72161a5323";

// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: refactor to standalone functions
export class ConnectFrame {
  static getParsedButtonIndex = (buttonIndex: unknown) => {
    return z.number().min(1).max(3).parse(buttonIndex);
  };

  static getParsedStep = (step: unknown) => {
    return validSteps.parse(step);
  };

  static getShouldGoNext = (step: Step, buttonIndex: number): boolean => {
    const buttonIdx = z.number().min(1).max(3).parse(buttonIndex);

    if (step === "1") {
      return buttonIdx === 1;
    }
    if (step === "7") {
      return false;
    }

    return buttonIdx === 3;
  };

  static getShouldGoBack = (step: Step, buttonIndex: number) => {
    const buttonIdx = z.number().min(1).max(3).parse(buttonIndex);
    return step !== "1" && buttonIdx === 1;
  };

  static mintNftWithFrameHtmlResponse = async (address: string) => {
    const owned = await engine.httpFetchOwned(
      address,
      8453,
      nftContractAddress,
    );

    if (!owned.result.length) {
      await engine.httpMint(address, 8453, nftContractAddress);
    }

    return getFrameHtmlResponse({
      buttons: [
        {
          label: "← Back",
          action: "post",
        },
        {
          label: "NFT Minted",
          action: "post",
        },
        {
          label: "Start building",
          action: "post_redirect",
        },
      ],
      image: connectFrames["7"].imageUrl,
      // hardcode to "7"
      post_url: `${getAbsoluteUrl()}/api/frame/connect?step=7`,
    });
  };

  static getFrameHtmlResponse = (step: Step, direction: "next" | "back") => {
    const readyStepNum =
      direction === "next" ? Number(step) + 1 : Number(step) - 1;
    const frameImg = connectFrames[readyStepNum]?.imageUrl;

    if (!frameImg) {
      throw new Error(`Image frame not found for step: ${step}`);
    }

    return getFrameHtmlResponse(
      readyStepNum === 7
        ? {
            buttons: [
              {
                label: "← Back",
                action: "post",
              },
              {
                label: "Mint NFT",
                action: "post",
              },
              {
                label: "Start building",
                action: "post_redirect",
              },
            ],
            image: frameImg,
            // hardcode to "7"
            post_url: `${getAbsoluteUrl()}/api/frame/connect?step=7`,
          }
        : readyStepNum === 1
          ? {
              buttons: [
                {
                  label: "Features →",
                  action: "post",
                },
                {
                  label: "Start building",
                  action: "post_redirect",
                },
              ],
              image: frameImg,
              // hardcode to "2"
              post_url: `${getAbsoluteUrl()}/api/frame/connect?step=1`,
            }
          : {
              buttons: [
                {
                  label: "← Back",
                  action: "post",
                },
                {
                  label: "Start building",
                  action: "post_redirect",
                },
                {
                  label: "Next →",
                  action: "post",
                },
              ],
              image: frameImg,
              post_url: `${getAbsoluteUrl()}/api/frame/connect?step=${readyStepNum}`,
            },
    );
  };

  static getRedirectUrl = (step: Step) => {
    return step === "6"
      ? "https://portal.thirdweb.com/typescript/v5"
      : `${getAbsoluteUrl()}/connect`;
  };
}
