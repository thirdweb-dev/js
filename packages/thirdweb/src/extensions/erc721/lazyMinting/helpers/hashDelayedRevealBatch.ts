import { encodePacked } from "viem/utils";
import type { ThirdwebContract } from "../../../../contract/contract.js";
import { keccak256 } from "../../../../utils/hashing/keccak256.js";

/**
 * @internal
 */
export const hashDelayedRevealPassword = async (
  batchTokenIndex: bigint,
  password: string,
  contract: ThirdwebContract,
) => {
  const chainId = BigInt(contract.chain.id);
  const contractAddress = contract.address;
  return keccak256(
    encodePacked(
      ["string", "uint256", "uint256", "address"],
      [password, chainId, batchTokenIndex, contractAddress],
    ),
  );
};
