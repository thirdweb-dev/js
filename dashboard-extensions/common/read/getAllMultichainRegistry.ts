import { isAddress } from "thirdweb";
import { readContract } from "thirdweb";
import type { BaseTransactionOptions } from "thirdweb";
import { isAddressZero } from "utils/zeroAddress";

const GetAllABI = {
  "type": "function",
  "name": "getAll",
  "inputs": [
    {
      "type": "address",
      "name": "_deployer",
      "internalType": "address"
    }
  ],
  "outputs": [
    {
      "type": "tuple[]",
      "name": "allDeployments",
      "components": [
        {
          "type": "address",
          "name": "deploymentAddress",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "chainId",
          "internalType": "uint256"
        },
        {
          "type": "string",
          "name": "metadataURI",
          "internalType": "string"
        }
      ],
      "internalType": "struct ITWMultichainRegistry.Deployment[]"
    }
  ],
  "stateMutability": "view"
} as const;

export type GetAllMultichainRegistryParams = {
  address: string;
};

/**
 * Retrieves the contract addresses for the given wallet address.
 * @param options The transaction options.
 * @returns A promise that resolves to the list of contract addresses.
 * @extension
 * @example
 * ```ts
 * const getAll = await getAllMultichainRegistry({ address });
 * ```
 */
export async function getAllMultichainRegistry(
  options: BaseTransactionOptions<GetAllMultichainRegistryParams>
) {
  const contracts = await readContract({
    ...options,
    method: GetAllABI,
    params: [options.address]
  });

  const contractsFiltered = [...contracts.filter(
    ({ deploymentAddress, chainId }) =>
      isAddress(deploymentAddress) && !isAddressZero(deploymentAddress.toLowerCase()) && chainId
  )].reverse();

  return contractsFiltered.map(contractFiltered => {
    return ({
      address: contractFiltered.deploymentAddress,
      chainId: Number(contractFiltered.chainId),
    });
  });
}
