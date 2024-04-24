import {
  ADDRESS_ZERO,
  isNativeTokenAddress,
} from "../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Address } from "../../../utils/address.js";
import { fetchProofsrERC20 } from "../../../utils/extensions/airdrop/fetch-proofs-erc20.js";
import { tokenMerkleRoot } from "../__generated__/Airdrop/read/tokenMerkleRoot.js";
import { claimERC20 as generatedClaimERC20 } from "../__generated__/Airdrop/write/claimERC20.js";

export type ClaimERC20Params = {
  tokenAddress: string;
  recipient: string;
};

/**
 * Claim airdrop of ERC20 tokens for allowlisted addresses. (Pull based airdrop)
 * @param options - The transaction options.
 * @example
 * ```ts
 * import { claimERC20 } from "thirdweb/extensions/airdrop";
 *
 * const tokenAddress = "0x..." // Address of airdropped tokens to claim
 * const recipient = "0x..."  // Address of the allowlisted recipient
 *
 * const claimTransaction = claimERC20({
 *    contract,
 *    tokenAddress,
 *    recipient
 * });
 *
 * await sendTransaction({ claimTransaction, account });
 *
 * ```
 * @extension Airdrop
 * @returns A promise that resolves to the transaction result.
 */
export function claimERC20(options: BaseTransactionOptions<ClaimERC20Params>) {
  return generatedClaimERC20({
    contract: options.contract,
    asyncParams: async () => {
      const merkleRoot = await tokenMerkleRoot({
        contract: options.contract,
        tokenAddress: options.tokenAddress,
      });

      const tokenAddress = options.tokenAddress;
      const tokenDecimals = await (async () => {
        if (
          isNativeTokenAddress(tokenAddress) ||
          tokenAddress === ADDRESS_ZERO
        ) {
          throw new Error(
            "Token address can't be zero address or native token",
          );
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
        tokenDecimals,
      });

      if (!merkleProof) {
        throw new Error("Proof not found for recipient address");
      }

      return {
        token: tokenAddress as Address,
        receiver: merkleProof.recipient as Address,
        quantity: merkleProof.quantity,
        proofs: merkleProof.proof,
      } as const;
    },
  });
}
