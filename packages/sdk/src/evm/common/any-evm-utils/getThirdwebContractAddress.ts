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
 * @param clientId
 */
export async function getThirdwebContractAddress(
  contractName: string,
  chainId: number,
  storage: ThirdwebStorage,
  contractVersion: string = "latest",
  clientId?: string,
  secretKey?: string,
): Promise<string> {
  const provider = getChainProvider(chainId, {
    clientId: clientId,
    secretKey: secretKey,
  });
  const contractAddress = await predictThirdwebContractAddress(
    contractName,
    chainId,
    storage,
    contractVersion,
    clientId,
    secretKey,
  );
  const isDeployed = await isContractDeployed(contractAddress, provider);
  invariant(isDeployed, "Contract not deployed yet");

  return contractAddress;
}
