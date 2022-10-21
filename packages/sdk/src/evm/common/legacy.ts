import { ContractWrapper } from "../core/classes/contract-wrapper";
import { hasFunction } from "./feature-detection";
import { DropERC721 } from "@thirdweb-dev/contracts-js";
import { ethers } from "ethers";

// TODO (cc) use this everywhere
export async function isPrebuilt(
  contractWrapper: ContractWrapper<any>,
  contractType: string,
  maxVersion: number,
): Promise<boolean> {
  if (hasFunction<DropERC721>("contractType", contractWrapper)) {
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
