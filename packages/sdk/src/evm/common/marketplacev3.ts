import {
  InterfaceId_IERC1155,
  InterfaceId_IERC721,
} from "../constants/contract";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import type { IERC1155, IERC165, IERC721 } from "@thirdweb-dev/contracts-js";
import ERC165Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC165.json";
import ERC721Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC721.json";
import ERC1155Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC1155.json";
import { BigNumberish, Contract, providers } from "ethers";

/**
 * This method checks if the given token is approved for the transferrerContractAddress contract.
 * This is particularly useful for contracts that need to transfer NFTs on the users' behalf
 *
 * @internal
 * @param provider - The connected provider
 * @param transferrerContractAddress - The address of the marketplace contract
 * @param assetContract - The address of the asset contract.
 * @param tokenId - The token id of the token.
 * @param owner - The address of the account that owns the token.
 * @returns - True if the transferrerContractAddress is approved on the token, false otherwise.
 */
export async function isTokenApprovedForTransfer(
  provider: providers.Provider,
  transferrerContractAddress: string,
  assetContract: string,
  tokenId: BigNumberish,
  owner: string,
): Promise<boolean> {
  try {
    const erc165 = new Contract(assetContract, ERC165Abi, provider) as IERC165;
    const isERC721 = await erc165.supportsInterface(InterfaceId_IERC721);
    const isERC1155 = await erc165.supportsInterface(InterfaceId_IERC1155);
    if (isERC721) {
      const asset = new Contract(assetContract, ERC721Abi, provider) as IERC721;

      const approved = await asset.isApprovedForAll(
        owner,
        transferrerContractAddress,
      );
      if (approved) {
        return true;
      }
      return (
        (await asset.getApproved(tokenId)).toLowerCase() ===
        transferrerContractAddress.toLowerCase()
      );
    } else if (isERC1155) {
      const asset = new Contract(
        assetContract,
        ERC1155Abi,
        provider,
      ) as IERC1155;
      return await asset.isApprovedForAll(owner, transferrerContractAddress);
    } else {
      console.error("Contract does not implement ERC 1155 or ERC 721.");
      return false;
    }
  } catch (err: any) {
    console.error("Failed to check if token is approved", err);
    return false;
  }
}

/**
 * Checks if the marketplace is approved to make transfers on the assetContract
 * If not, it tries to set the approval.
 * @param contractWrapper
 * @param marketplaceAddress
 * @param assetContract
 * @param tokenId
 * @param from
 */
export async function handleTokenApproval(
  contractWrapper: ContractWrapper<any>,
  marketplaceAddress: string,
  assetContract: string,
  tokenId: BigNumberish,
  from: string,
): Promise<void> {
  const erc165 = new ContractWrapper<IERC165>(
    contractWrapper.getSignerOrProvider(),
    assetContract,
    ERC165Abi,
    contractWrapper.options,
  );
  const isERC721 = await erc165.readContract.supportsInterface(
    InterfaceId_IERC721,
  );
  const isERC1155 = await erc165.readContract.supportsInterface(
    InterfaceId_IERC1155,
  );
  // check for token approval
  if (isERC721) {
    const asset = new ContractWrapper<IERC721>(
      contractWrapper.getSignerOrProvider(),
      assetContract,
      ERC721Abi,
      contractWrapper.options,
    );
    const approved = await asset.readContract.isApprovedForAll(
      from,
      marketplaceAddress,
    );
    if (!approved) {
      const isTokenApproved =
        (await asset.readContract.getApproved(tokenId)).toLowerCase() ===
        marketplaceAddress.toLowerCase();

      if (!isTokenApproved) {
        await asset.sendTransaction("setApprovalForAll", [
          marketplaceAddress,
          true,
        ]);
      }
    }
  } else if (isERC1155) {
    const asset = new ContractWrapper<IERC1155>(
      contractWrapper.getSignerOrProvider(),
      assetContract,
      ERC1155Abi,
      contractWrapper.options,
    );

    const approved = await asset.readContract.isApprovedForAll(
      from,
      marketplaceAddress,
    );
    if (!approved) {
      await asset.sendTransaction("setApprovalForAll", [
        marketplaceAddress,
        true,
      ]);
    }
  } else {
    throw Error("Contract must implement ERC 1155 or ERC 721.");
  }
}
