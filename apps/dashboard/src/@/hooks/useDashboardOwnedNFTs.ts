import { useQuery } from "@tanstack/react-query";
import type { NFT, ThirdwebContract } from "thirdweb";
import {
  getOwnedNFTs as getOwnedERC721,
  isERC721,
} from "thirdweb/extensions/erc721";
import { getOwnedNFTs as getOwnedERC1155 } from "thirdweb/extensions/erc1155";
import invariant from "tiny-invariant";

/**
 * This hook is currently used for getting owned NFTs for Create DirectListing/English Auction
 * It should only be used if our indexing solutions don't support the current network
 */
export function useDashboardOwnedNFTs({
  contract,
  owner,
  disabled,
}: {
  owner?: string;
  contract?: ThirdwebContract;
  disabled?: boolean;
}) {
  return useQuery({
    enabled: !!contract && !!owner && !disabled,
    queryFn: async (): Promise<NFT[]> => {
      invariant(contract, "Contract is required");
      invariant(owner, "owner address is required");
      const is721 = await isERC721({ contract });
      if (is721) {
        return getOwnedERC721({
          contract,
          owner,
        });
      }
      // Else default to 1155
      return getOwnedERC1155({ address: owner, contract });
    },
    queryKey: [
      "owned-nfts",
      contract?.chain.id || "",
      contract?.address || "",
      owner || "",
    ],
  });
}
