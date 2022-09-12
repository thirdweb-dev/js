import { ContractType } from "../types";
import type { IThirdwebContract } from "@thirdweb-dev/contracts-js";
import IThirdwebContractABI from "@thirdweb-dev/contracts-js/dist/abis/IThirdwebContract.json";
import { Signer, providers, Contract } from "ethers";

/**
 * @internal
 *
 * @param contractAddress - the address of the contract to check for a valid contract type
 * @throws if the contract type cannot be determined
 * @returns the contract type
 */
export async function getContractTypeForAddress<
  TContractType extends ContractType,
>(
  contractAddress: string,
  signerOrProvider: Signer | providers.Provider,
): Promise<TContractType> {
  const contract = new Contract(
    contractAddress,
    IThirdwebContractABI,
    signerOrProvider,
  ) as IThirdwebContract;
  return (await contract.contractType()) as TContractType;
}
