import { ContractWrapper } from "../core/classes/contract-wrapper";
import { hasFunction } from "./feature-detection";
import type { IThirdwebContract } from "@thirdweb-dev/contracts-js";
import IThirdwebContractABI from "@thirdweb-dev/contracts-js/dist/abis/IThirdwebContract.json";
import { ethers } from "ethers";

// TODO (cc) use this everywhere
export async function isPrebuilt(
  contractWrapper: ContractWrapper<any>,
  contractType: string,
  maxVersion: number,
): Promise<boolean> {
  if (hasFunction<IThirdwebContract>("contractType", contractWrapper)) {
    try {
      const [type, version] = await Promise.all([
        ethers.utils.toUtf8String(
          await contractWrapper.readContract.contractType(),
        ),
        await contractWrapper.readContract.contractVersion(),
      ]);
      const nameMatch = type.includes(contractType);
      const versionMatch = maxVersion ? maxVersion <= version : true;
      return nameMatch && versionMatch;
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
}

export async function getPrebuiltInfo(
  address: string,
  provider: ethers.providers.Provider,
): Promise<{ type: string; version: number } | undefined> {
  try {
    const contract = new ethers.Contract(
      address,
      IThirdwebContractABI,
      provider,
    );
    const [type, version] = await Promise.all([
      ethers.utils
        .toUtf8String(await contract.contractType()) // eslint-disable-next-line no-control-regex
        .replace(/\x00/g, ""),
      await contract.contractVersion(),
    ]);
    return {
      type,
      version,
    };
  } catch (e) {
    return undefined;
  }
}
