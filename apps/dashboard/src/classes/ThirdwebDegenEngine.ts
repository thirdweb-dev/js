import { z } from "zod";

const mintResponseSchema = z.object({
  result: z.object({
    queueId: z.string(),
  }),
});

const ownedResponseSchema = z.object({
  result: z.string(),
});

const validAction = z.union([z.literal("mint"), z.literal("redirect")]);

const thirdwebEngineUrl = process.env.THIRDWEB_ENGINE_URL;
const thirdwebEngineWallet = process.env.DEGEN_THIRDWEB_ENGINE_WALLET;
const thirdwebEngineAccessToken = process.env.THIRDWEB_ACCESS_TOKEN;

const degenChainId = 666666666;
const degenNftContractAddress = "0x1efacE838cdCD5B19d8D0CC4d22d7AEFdDfB0d6f";

// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: refactor to standalone functions
export class ThirdwebDegenEngine {
  public static mint = async (receiver: string) => {
    const response = await fetch(
      `${thirdwebEngineUrl}/contract/${degenChainId}/${degenNftContractAddress}/erc721/claim-to`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${thirdwebEngineAccessToken}`,
          "x-backend-wallet-address": thirdwebEngineWallet as string,
        },
        body: JSON.stringify({
          receiver: receiver.toLowerCase(),
          quantity: "1",
        }),
      },
    );

    const result = await response.json();

    return mintResponseSchema.parse(result);
  };

  public static isNFTOwned = async (receiver: string) => {
    const response = await fetch(
      `${thirdwebEngineUrl}/contract/${degenChainId}/${degenNftContractAddress}/erc721/balance-of?walletAddress=${receiver.toLowerCase()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${thirdwebEngineAccessToken}`,
          "x-backend-wallet-address": thirdwebEngineWallet as string,
        },
      },
    );

    const result = await response.json();

    const parsedResult = ownedResponseSchema.parse(result);

    return parsedResult.result !== "0";
  };

  public static validateAction = (action: string) => {
    return validAction.parse(action);
  };
}
