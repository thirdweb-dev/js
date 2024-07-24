import type { FrameMetadataType } from "@coinbase/onchainkit";
import { getAbsoluteUrl } from "lib/vercel-utils";

export const getApplyFrameMetaData = (): FrameMetadataType => {
  return {
    buttons: [
      {
        label: "Confirm",
        action: "post",
      },
    ],
    input: {
      text: "Choose your chain",
    },
    image: `${getAbsoluteUrl()}/assets/superchain/frame-2.png`,
    post_url: `${getAbsoluteUrl()}/api/superchain/frame?type=chain`,
  };
};

export const getEmailMetaData = (chain: string): FrameMetadataType => {
  return {
    buttons: [
      {
        label: "Confirm",
        action: "post",
      },
    ],
    input: {
      text: "Enter email address",
    },
    image: `${getAbsoluteUrl()}/assets/superchain/frame-3.png`,
    post_url: `${getAbsoluteUrl()}/api/superchain/frame?type=email&chain=${chain}`,
  };
};

export const getWebsiteMetaData = (
  chain: string,
  email: string,
): FrameMetadataType => {
  return {
    buttons: [
      {
        label: "Confirm",
        action: "post",
      },
    ],
    input: {
      text: "Enter your project's website",
    },
    image: `${getAbsoluteUrl()}/assets/superchain/frame-4.png`,
    post_url: `${getAbsoluteUrl()}/api/superchain/frame?type=website&chain=${chain}&email=${encodeURIComponent(email)}`,
  };
};

export const getSuccessMetaData = (): FrameMetadataType => {
  return {
    buttons: [
      {
        label: "Explore thirdweb",
        action: "post_redirect",
      },
    ],
    image: `${getAbsoluteUrl()}/assets/superchain/frame-5.png`,
    post_url: `${getAbsoluteUrl()}/api/superchain/frame?type=redirect`,
  };
};
