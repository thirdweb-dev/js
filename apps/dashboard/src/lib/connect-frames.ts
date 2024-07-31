import { getAbsoluteUrl } from "./vercel-utils";

interface Frame {
  imageUrl: string;
}

export const connectFrames: Record<number, Frame> = {
  1: {
    imageUrl: `${getAbsoluteUrl()}/assets/connect/frames/frame-1.png`,
  },
  2: {
    imageUrl: `${getAbsoluteUrl()}/assets/connect/frames/frame-2.png`,
  },
  3: {
    imageUrl: `${getAbsoluteUrl()}/assets/connect/frames/frame-3.png`,
  },
  4: {
    imageUrl: `${getAbsoluteUrl()}/assets/connect/frames/frame-4.png`,
  },
  5: {
    imageUrl: `${getAbsoluteUrl()}/assets/connect/frames/frame-5.png`,
  },
  6: {
    imageUrl: `${getAbsoluteUrl()}/assets/connect/frames/frame-6.png`,
  },
  7: {
    imageUrl: `${getAbsoluteUrl()}/assets/connect/frames/frame-7.png`,
  },
};
