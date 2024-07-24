import type { FrameMetadataType } from "@coinbase/onchainkit";
import { getAbsoluteUrl } from "./vercel-utils";

export const superchainFrameChains = {
  optimism: {
    name: "optimism",
    frameContentText: "OP Mainnet",
  },
  base: {
    name: "base",
    frameContentText: "Base",
  },
  zora: {
    name: "zora",
    frameContentText: "Zora",
  },
  other: {
    name: "other",
    frameContentText: "Other",
  },
};

export const growthPlanFrameMetaData = (
  chainName: string,
): FrameMetadataType => {
  return {
    buttons: [
      {
        label: "$250",
        action: "post",
      },
      {
        label: "$2,500",
        action: "post",
      },
      {
        label: "$3,000",
        action: "post",
      },
    ],
    image: `${getAbsoluteUrl()}/assets/dashboard/growth.png`,
    post_url: `${getAbsoluteUrl()}/api/frame/superchain?action=growth&chain=${chainName}`,
  };
};

export const finalGrowthPlanFrameMetaData = (
  imgUrl: string,
): FrameMetadataType => {
  return {
    buttons: [
      {
        label: "Apply for Superchain credits",
        action: "post_redirect",
      },
    ],
    image: imgUrl,
    post_url: `${getAbsoluteUrl()}/api/frame/superchain?action=final`,
  };
};
