"use server";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { SERVER_WALLET } from "@/lib/server-wallet";
import { Engine, defineChain, encode, getContract } from "thirdweb";
import { multicall } from "thirdweb/extensions/common";
import * as ERC20 from "thirdweb/extensions/erc20";
import * as ERC1155 from "thirdweb/extensions/erc1155";

export async function airdrop_tokens_with_engine(params: {
  contractAddress: string;
  chainId: number;
  receivers: {
    toAddress: string;
    amount: string;
  }[];
}) {
  const contract = getContract({
    address: params.contractAddress,
    chain: defineChain(params.chainId),
    client: THIRDWEB_CLIENT,
  });
  const data = await Promise.all(
    params.receivers.map((receiver) =>
      encode(
        ERC20.mintTo({
          contract,
          to: receiver.toAddress,
          amount: receiver.amount,
        }),
      ),
    ),
  );
  const tx = multicall({
    contract,
    data,
  });

  const res = await SERVER_WALLET.enqueueTransaction({ transaction: tx });

  return res.transactionId;
}

export async function get_engine_tx_status(queueId: string) {
  const status = await Engine.getTransactionStatus({
    client: THIRDWEB_CLIENT,
    transactionId: queueId,
  });
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
  const tx = ERC1155.mintTo({
    contract: getContract({
      address: params.contractAddress,
      chain: defineChain(params.chainId),
      client: THIRDWEB_CLIENT,
    }),
    nft: params.metadataWithSupply.metadata,
    to: params.toAddress,
    supply: BigInt(params.metadataWithSupply.supply),
  });
  const res = await SERVER_WALLET.enqueueTransaction({ transaction: tx });

  return res.transactionId;
}

type ClaimNFTParams = {
  contractAddress: string;
  chainId: number;
  receiverAddress: string;
  quantity: number;
  tokenId: string;
};

export async function claim_erc1155_nft_with_engine(params: ClaimNFTParams) {
  const tx = ERC1155.claimTo({
    contract: getContract({
      address: params.contractAddress,
      chain: defineChain(params.chainId),
      client: THIRDWEB_CLIENT,
    }),
    to: params.receiverAddress,
    tokenId: BigInt(params.tokenId),
    quantity: BigInt(params.quantity),
  });
  const res = await SERVER_WALLET.enqueueTransaction({ transaction: tx });

  return res.transactionId;
}
