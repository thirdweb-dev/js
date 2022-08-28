import { IThirdwebContract__factory } from "@thirdweb-dev/contracts-js";

import { Signer, providers } from "ethers";
import { ContractType } from "../types";

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
  const contract = IThirdwebContract__factory.connect(
    contractAddress,
    signerOrProvider,
  );
  return (await contract.contractType()) as TContractType;
}
