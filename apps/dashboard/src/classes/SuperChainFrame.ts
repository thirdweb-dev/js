import {
  type FrameMetadataType,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit";
import { superchainFrameChains } from "lib/superchain-frames";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { z } from "zod";

const validAction = z.union([
  z.literal("check"),
  z.literal("growth"),
  z.literal("final"),
]);

const validChains = z.union([
  z.literal(superchainFrameChains.optimism.name),
  z.literal(superchainFrameChains.base.name),
  z.literal(superchainFrameChains.zora.name),
]);

// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: refactor to standalone functions
export class SuperChainFrame {
  public static validateAction = (action: string) => {
    return validAction.parse(action);
  };

  public static validateChain = (chain: string) => {
    return validChains.parse(chain);
  };

  public static validateButtonIndex = (buttonIndex: number, max: number) => {
    return z.number().min(1).max(max).parse(buttonIndex);
  };

  public static chainNameByButtonIndex = (buttonIndex: number) => {
    switch (buttonIndex) {
      case 1:
        return "optimism";

      case 2:
        return "base";

      case 3:
        return "zora";

      default:
        throw new Error("Invalid button index");
    }
  };

  public static planByButtonIndex = (buttonIndex: number) => {
    switch (buttonIndex) {
      case 1:
        return "250";

      case 2:
        return "2500";

      case 3:
        return "3000";

      default:
        throw new Error("Invalid button index");
    }
  };

  public static avgTransactionImage = (chainName: string, plan: string) => {
    return `${getAbsoluteUrl()}/assets/dashboard/${chainName}-${plan}.png`;
  };

  public static htmlResponse = (frameMetaData: FrameMetadataType) => {
    return getFrameHtmlResponse(frameMetaData);
  };
}
