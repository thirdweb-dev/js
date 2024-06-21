import { z } from "zod";
import { hostnameEndsWith } from "../utils/url";

// Neynar's api
const apiUrl = "https://api.neynar.com";
const apiKey = process.env.NEYNAR_API_KEY as string;

const validateMessageSchema = z.object({
  // has to be true
  valid: z.literal(true),
});

export const untrustedMetaDataSchema = z.object({
  url: z.string().refine((url) => {
    return hostnameEndsWith(url, "thirdweb.com");
  }),
});

// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: refactor to standalone functions
export class Warpcast {
  public static async validateMessage(messageBytes: string) {
    const url = `${apiUrl}/v2/farcaster/frame/validate`;

    const response = await fetch(url, {
      headers: {
        api_key: apiKey,
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        message_bytes_in_hex: messageBytes,
      }),
    });

    await response
      .json()
      .then((res) => res)
      .then(validateMessageSchema.parse);
  }
}
