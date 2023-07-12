import { ThirdwebStorage } from "@thirdweb-dev/storage";
import invariant from "tiny-invariant";
import { getChainProvider } from "../../constants/urls";
import { isContractDeployed } from "./isContractDeployed";
import { predictThirdwebContractAddress } from "./predictThirdwebContractAddress";

/**
 *
 * @public
 * @param contractName
 * @param chainId
 * @param storage
 * @param apiKey
 */
export async function getThirdwebContractAddress(
  contractName: string,
  chainId: number,
  storage: ThirdwebStorage,
  apiKey?: string,
): Promise<string> {
  const provider = getChainProvider(chainId, {
    apiKey: apiKey,
  });
  const contractAddress = await predictThirdwebContractAddress(
    contractName,
    chainId,
    storage,
    apiKey,
  );
  const isDeployed = await isContractDeployed(contractAddress, provider);
  invariant(isDeployed, "Contract not deployed yet");

  return contractAddress;
}
