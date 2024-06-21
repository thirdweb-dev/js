import {
  type FrameMetadataType,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";

type HubspotFields = [
  {
    name: "email";
    value: string;
  },
  {
    name: "superchain_chain";
    value: string;
  },
  {
    name: "website";
    value: string;
  },
  {
    name: "farcaster_handle";
    value: string;
  },
];

const validChains = z.union([
  z.literal("base"),
  z.literal("zora"),
  z.literal("fraxtal"),
  z.literal("op-mainnet"),
  z.literal("mode"),
]);

const validQueryType = z.union([
  z.literal("apply"),
  z.literal("chain"),
  z.literal("email"),
  z.literal("website"),
  z.literal("redirect"),
]);

// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: refactor to standalone functions
export class SuperChainFormFrame {
  static getQueryType = (type: string) => {
    return validQueryType.parse(type);
  };

  static getChain = (chain: string) => {
    let lowercaseChain = chain.toLowerCase();
    if (lowercaseChain === "op mainnet") {
      lowercaseChain = "op-mainnet";
    }
    return validChains.parse(lowercaseChain);
  };

  static getConvertedChain = (chain: string) => {
    let convertedChain: string;

    switch (chain) {
      case "base":
        convertedChain = "Base";
        break;

      case "fraxtal":
        convertedChain = "Frax";
        break;

      case "mode":
        convertedChain = "Mode";
        break;

      case "op-mainnet":
        convertedChain = "Optimism";
        break;

      case "zora":
        convertedChain = "Zora";
        break;

      default:
        throw new Error("Valid chain not found");
    }
    return convertedChain;
  };

  static getEmail = (email: string) => {
    return z.string().email().parse(email);
  };

  static getWebsiteUrl = (url: string) => {
    let _url = url;
    if (!_url.startsWith("http://") && !_url.startsWith("https://")) {
      _url = `https://${url}`;
    }
    // Validate URL
    new URL(_url);
    return _url;
  };

  public static htmlResponse = (frameMetaData: FrameMetadataType) => {
    return getFrameHtmlResponse(frameMetaData);
  };

  public static sendFormToHubspot = async (fields: HubspotFields) => {
    const response = await fetch(
      "https://api.hsforms.com/submissions/v3/integration/secure/submit/23987964/38c5be6b-b260-4a91-a09a-868ea324d995",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        },
        method: "POST",
        body: JSON.stringify({
          fields,
        }),
      },
    );

    if (!response.ok) {
      const resp = await response.json();
      const errMessage = `Failed to send form to email: ${fields[0].value} and farcaster handle: ${fields[3].value}`;
      Sentry.captureException(new Error(errMessage, { cause: resp }));
      throw new Error("Failed to send form");
    }
  };
}
