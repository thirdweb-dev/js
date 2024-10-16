import { z } from "zod";

export type EngineBackendWalletType = "local" | "aws-kms" | "gcp-kms";

export const EngineBackendWalletOptions: {
  key: EngineBackendWalletType;
  name: string;
}[] = [
  { key: "local", name: "Local" },
  { key: "aws-kms", name: "AWS KMS" },
  { key: "gcp-kms", name: "Google Cloud KMS" },
];

const engineUrl = process.env.THIRDWEB_ENGINE_URL as string;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.THIRDWEB_ENGINE_ACCESS_TOKEN as string}`,
  "x-backend-wallet-address": process.env.THIRDWEB_ENGINE_WALLET as string,
};

const ownedResponseSchema = z.object({
  result: z.array(
    z.object({
      owner: z.string().startsWith("0x"),
      type: z.string(),
      supply: z.string(),
    }),
  ),
});

const mintResponseSchema = z.object({
  result: z.object({
    queueId: z.string(),
  }),
});

export const httpMint = async (
  receiver: string,
  chainId: number,
  contractAddress: string,
) => {
  const response = await fetch(
    `${engineUrl}/contract/${chainId}/${contractAddress}/erc721/claim-to`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ receiver: receiver.toLowerCase(), quantity: "1" }),
    },
  );

  const result = await response.json();

  return mintResponseSchema.parse(result);
};

export const httpFetchOwned = async (
  address: string,
  chainId: number,
  contractAddress: string,
) => {
  const response = await fetch(
    `${engineUrl}/contract/${chainId}/${contractAddress}/erc721/get-owned?walletAddress=${address.toLowerCase()}`,
    {
      method: "GET",
      headers,
    },
  );

  const result = await response.json();

  return ownedResponseSchema.parse(result);
};
