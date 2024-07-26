import type { FrameValidationData } from "@coinbase/onchainkit";
import type { SmartContract } from "@thirdweb-dev/sdk";
import { type BaseContract, Wallet } from "ethers";
import { getDashboardChainRpc } from "lib/rpc";
import { getThirdwebSDK } from "lib/sdk";
import { base } from "thirdweb/chains";

export const getContractForErc721OpenEdition = async (
  contractAddress: string,
) => {
  // Create a random signer. This is required to encode erc721 tx data
  const signer = Wallet.createRandom();

  // Initialize sdk
  const sdk = getThirdwebSDK(
    base.id,
    getDashboardChainRpc(base.id),
    undefined,
    signer,
  );

  // Get contract instance
  const contract = await sdk.getContract(contractAddress);

  // Return contract instance
  return contract;
};

export const getErc721PreparedEncodedData = async (
  walletAddress: string,
  contract: SmartContract<BaseContract>,
) => {
  // Prepare erc721 transaction data. Takes in destination address and quantity as parameters
  const transaction = await contract.erc721.claimTo.prepare(walletAddress, 1);

  // Encode transaction data
  const encodedTransactionData = await transaction.encode();

  // Return encoded transaction data
  return encodedTransactionData;
};

export const getFarcasterAccountAddress = (
  interactor: FrameValidationData["interactor"],
) => {
  // Get the first verified account or custody account if first verified account doesn't exist
  return interactor.verified_accounts[0] ?? interactor.custody_address;
};
