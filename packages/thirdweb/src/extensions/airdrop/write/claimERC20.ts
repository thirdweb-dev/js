import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { claimERC20 as generatedClaimERC20 } from "../__generated__/Airdrop/write/claimERC20.js";
import { tokenMerkleRoot } from "../__generated__/Airdrop/read/tokenMerkleRoot.js";
import { fetchProofsrERC20 } from "../../../utils/extensions/airdrop/fetch-proofs-erc20.js";
import { ADDRESS_ZERO, isNativeTokenAddress } from "../../../constants/addresses.js";
import type { Address } from "../../../utils/address.js";
/**
 * Represents the parameters for claiming an ERC721 token.
 */
export type ClaimERC20Params = {
  tokenAddress: string;
  recipient: string;
};

export function claimERC20(options: BaseTransactionOptions<ClaimERC20Params>) {
  return generatedClaimERC20({
    contract: options.contract,
    asyncParams: async () => {
      const merkleRoot = await tokenMerkleRoot({
        contract: options.contract,
        tokenAddress: options.tokenAddress
      });

      const tokenAddress = options.tokenAddress;
      const tokenDecimals = await (async () => {
        if (isNativeTokenAddress(tokenAddress) || tokenAddress === ADDRESS_ZERO) {
          throw new Error("Token address can't be zero address or native token");
        }
        const [{ getContract }, { decimals: getDecimals }] = await Promise.all([
          import("../../../contract/contract.js"),
          import("../../erc20/read/decimals.js"),
        ]);
        const tokenContract = getContract({
          address: tokenAddress,
          chain: options.contract.chain,
          client: options.contract.client,
        });
        return await getDecimals({ contract: tokenContract });
      })();

      const merkleProof = await fetchProofsrERC20({
        contract: options.contract,
        recipient: options.recipient,
        merkleRoot,
        tokenDecimals
      });

      if(!merkleProof) {
        throw new Error("Proof not found for recipient address");
      }

      return {
        token: tokenAddress as Address,
        receiver: merkleProof.recipient as Address,
        quantity: merkleProof.quantity,
        proofs: merkleProof.proof
      } as const
    }
  });
}
