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
