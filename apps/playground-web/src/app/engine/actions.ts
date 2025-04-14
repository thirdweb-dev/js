"use server";

import { Engine } from "@thirdweb-dev/engine";

const BACKEND_WALLET_ADDRESS = process.env.ENGINE_BACKEND_WALLET as string;

const engine = new Engine({
  url: process.env.ENGINE_URL as string,
  accessToken: process.env.ENGINE_ACCESS_TOKEN as string,
});

export async function airdrop_tokens_with_engine(params: {
  contractAddress: string;
  chainId: number;
  receivers: {
    toAddress: string;
    amount: string;
  }[];
}) {
  const res = await engine.erc20.mintBatchTo(
    params.chainId.toString(),
    params.contractAddress,
    BACKEND_WALLET_ADDRESS,
    {
      data: params.receivers,
    },
  );

  return res.result;
}

export async function get_engine_tx_status(queueId: string) {
  const status = await engine.transaction.status(queueId);
  return status;
}

type MintNFTParams = {
  contractAddress: string;
  chainId: number;
  toAddress: string;
  metadataWithSupply: {
    metadata: {
      name: string;
      description?: string;
      image: string;
    };
    supply: string;
  };
};

export async function mint_erc1155_nft_with_engine(params: MintNFTParams) {
  const res = await engine.erc1155.mintTo(
    params.chainId.toString(),
    params.contractAddress,
    BACKEND_WALLET_ADDRESS,
    {
      receiver: params.toAddress,
      metadataWithSupply: params.metadataWithSupply,
    },
  );

  return res.result;
}

type ClaimNFTParams = {
  contractAddress: string;
  chainId: number;
  receiverAddress: string;
  quantity: number;
  tokenId: string;
};

export async function claim_erc1155_nft_with_engine(params: ClaimNFTParams) {
  const res = await engine.erc1155.claimTo(
    params.chainId.toString(),
    params.contractAddress,
    BACKEND_WALLET_ADDRESS,
    {
      receiver: params.receiverAddress,
      quantity: params.quantity.toString(),
      tokenId: params.tokenId,
    },
  );

  return res.result;
}
