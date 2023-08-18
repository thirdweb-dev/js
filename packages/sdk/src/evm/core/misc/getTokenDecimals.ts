import { IERC20Metadata } from "@thirdweb-dev/contracts-js";
import { detectContractFeature } from "../../common/feature-detection/detectContractFeature";
import {
  BaseClaimConditionERC721,
  BaseDropERC20,
  PrebuiltNFTDrop,
  PrebuiltTokenDrop,
} from "../../types/eips";
import { ContractWrapper } from "../classes/contract-wrapper";
export async function getTokenDecimals(
  contractWrapper: ContractWrapper<
    | PrebuiltNFTDrop
    | PrebuiltTokenDrop
    | BaseClaimConditionERC721
    | BaseDropERC20
  >,
): Promise<number> {
  if (detectContractFeature<IERC20Metadata>(contractWrapper, "ERC20")) {
    return contractWrapper.readContract.decimals();
  } else {
    return Promise.resolve(0);
  }
}
