import { polygon } from "../../../chains/chain-definitions/polygon.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { readContract } from "../../../transaction/read-contract.js";
import { getContract } from "../../contract.js";

const ContractPublisherAddress = "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808"; // Polygon only
export const THIRDWEB_DEPLOYER = "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024";

/**
 * @internal
 */
export async function fetchPublishedContract(args: {
  client: ThirdwebClient;
  contractId: string;
  publisherAddress?: string;
}) {
  const { client, publisherAddress, contractId } = args;
  const contractPublisher = getContract({
    client,
    chain: polygon,
    address: ContractPublisherAddress,
  });
  // TODO support mutliple contract versions
  return readContract({
    contract: contractPublisher,
    method: GET_PUBLISHED_CONTRACT_ABI,
    params: [publisherAddress || THIRDWEB_DEPLOYER, contractId],
  });
}

const GET_PUBLISHED_CONTRACT_ABI = {
  inputs: [
    {
      internalType: "address",
      name: "_publisher",
      type: "address",
    },
    {
      internalType: "string",
      name: "_contractId",
      type: "string",
    },
  ],
  name: "getPublishedContract",
  outputs: [
    {
      components: [
        {
          internalType: "string",
          name: "contractId",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "publishTimestamp",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "publishMetadataUri",
          type: "string",
        },
        {
          internalType: "bytes32",
          name: "bytecodeHash",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "implementation",
          type: "address",
        },
      ],
      internalType: "struct IContractPublisher.CustomContractInstance",
      name: "published",
      type: "tuple",
    },
  ],
  stateMutability: "view",
  type: "function",
} as const;
