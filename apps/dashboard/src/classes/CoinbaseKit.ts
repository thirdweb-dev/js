import { type FrameRequest, getFrameMessage } from "@coinbase/onchainkit";

// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: refactor to standalone functions
export class CoinbaseKit {
  public static validateMessage = async (body: FrameRequest) => {
    const { isValid, message } = await getFrameMessage(body, {
      neynarApiKey: process.env.NEYNAR_API_KEY,
    });

    return { isValid, message };
  };
}
