import { resolveEnsNameToAddress } from "../ens/resolve";
import type { Client } from "viem";
import { readContract } from "viem/actions";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";

// snippet of *just* the erc721 tokenuri function abi
const ERC721_TOKEN_URI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export async function getERC721Token({
  viemClient,
  storage,
  tokenId,
  contractAddress,
}: {
  viemClient: Client;
  storage: ThirdwebStorage;
  tokenId: bigint;
  contractAddress: string;
}) {
  const resolvedContractAddress = await resolveEnsNameToAddress(
    contractAddress,
  );
  if (!resolvedContractAddress) {
    throw new Error(`Not a valid contractAddress: ${contractAddress}`);
  }

  const tokenUri = await readContract(viemClient, {
    address: resolvedContractAddress,
    abi: ERC721_TOKEN_URI,
    functionName: "tokenURI",
    args: [tokenId],
  });

  // TODO migrate the full logic piece here obviously
  return await storage.downloadJSON(tokenUri);
}
