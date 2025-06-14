import type { ThirdwebContract } from "thirdweb";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";

export async function getTotalNFTCount(params: {
  type: "erc1155" | "erc721";
  contract: ThirdwebContract;
}) {
  async function getRawValue() {
    if (params.type === "erc1155") {
      const nextTokenIdToMint = await ERC1155Ext.nextTokenIdToMint({
        contract: params.contract,
      }).catch(() => 0n);

      return nextTokenIdToMint;
    } else {
      const [nextTokenIdToMint, totalSupply] = await Promise.all([
        ERC721Ext.nextTokenIdToMint({
          contract: params.contract,
        }).catch(() => 0n),
        ERC721Ext.totalSupply({
          contract: params.contract,
        }).catch(() => 0n),
      ]);

      return nextTokenIdToMint > totalSupply ? nextTokenIdToMint : totalSupply;
    }
  }

  const value = await getRawValue();

  if (value > 1_000_000n) {
    return 1_000_000;
  }

  return Number(value);
}
