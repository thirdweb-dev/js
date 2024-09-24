import type { FrameValidationData } from "@coinbase/onchainkit";
import { type ThirdwebContract, encode } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc721";

export async function getErc721PreparedEncodedData(
  walletAddress: string,
  contract: ThirdwebContract,
) {
  // Prepare erc721 transaction data. Takes in destination address and quantity as parameters
  const transaction = claimTo({ contract, to: walletAddress, quantity: 1n });

  // Encode transaction data
  const encodedTransactionData = await encode(transaction);

  // Return encoded transaction data
  return encodedTransactionData;
}

export const getFarcasterAccountAddress = (
  interactor: FrameValidationData["interactor"],
) => {
  // Get the first verified account or custody account if first verified account doesn't exist
  return interactor.verified_accounts[0] ?? interactor.custody_address;
};
