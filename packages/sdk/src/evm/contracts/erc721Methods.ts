import { type BigNumberish, constants, BigNumber } from "ethers";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import type {
  BaseClaimConditionERC721,
  BaseDropERC721,
  BaseERC721,
} from "../types/eips";
import type { NFT, NFTMetadata } from "../../core/schema/nft";
import { NotFoundError } from "../common/error";
import { FALLBACK_METADATA, fetchTokenMetadata } from "../common/nft";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import type {
  DropERC721,
  IClaimableERC721,
  IERC721AQueryableUpgradeable,
  IERC721Supply,
  IMintableERC721,
  IMulticall,
  OpenEditionERC721,
  SignatureDrop,
  TieredDrop,
  TokenERC721,
  Zora_IERC721Drop,
} from "@thirdweb-dev/contracts-js";
import { hasFunction } from "../common/feature-detection/hasFunction";

/**
 * @internal
 */
type Erc721Extensions =
  | BaseERC721
  | Zora_IERC721Drop
  | IClaimableERC721
  | IMintableERC721
  | BaseClaimConditionERC721
  | (IMintableERC721 & IMulticall)
  | (BaseERC721 & IERC721AQueryableUpgradeable);

export async function ownerOfErc721(
  tokenId: BigNumberish,
  contractWrapper: ContractWrapper<Erc721Extensions>,
): Promise<string> {
  return await (contractWrapper as ContractWrapper<BaseERC721>).read(
    "ownerOf",
    [tokenId],
  );
}

export async function getTokenMetadata(
  tokenId: BigNumberish,
  contractWrapper: ContractWrapper<Erc721Extensions>,
  storage: ThirdwebStorage,
): Promise<NFTMetadata> {
  const tokenUri = await (contractWrapper as ContractWrapper<BaseERC721>).read(
    "tokenURI",
    [tokenId],
  );
  if (!tokenUri) {
    throw new NotFoundError();
  }
  return fetchTokenMetadata(tokenId, tokenUri, storage);
}

export async function getErc721Token(
  tokenId: BigNumberish,
  contractWrapper: ContractWrapper<Erc721Extensions>,
  storage: ThirdwebStorage,
): Promise<NFT> {
  const [owner, metadata] = await Promise.all([
    ownerOfErc721(tokenId, contractWrapper).catch(() => constants.AddressZero),
    getTokenMetadata(tokenId, contractWrapper, storage).catch(() => ({
      id: tokenId.toString(),
      uri: "",
      ...FALLBACK_METADATA,
    })),
  ]);
  return { owner, metadata, type: "ERC721", supply: "1" };
}

export async function nextTokenIdToMint(
  contractWrapper: ContractWrapper<
    TokenERC721 | TieredDrop | (BaseERC721 & IERC721Supply) | BaseDropERC721
  >,
): Promise<BigNumber> {
  if (hasFunction<TokenERC721>("nextTokenIdToMint", contractWrapper)) {
    let nextTokenIdToMint = await (
      contractWrapper as ContractWrapper<TokenERC721>
    ).read("nextTokenIdToMint", []);
    // handle open editions and contracts with startTokenId
    if (hasFunction<OpenEditionERC721>("startTokenId", contractWrapper)) {
      nextTokenIdToMint = nextTokenIdToMint.sub(
        await (contractWrapper as ContractWrapper<OpenEditionERC721>).read(
          "startTokenId",
          [],
        ),
      );
    }
    return nextTokenIdToMint;
  } else if (hasFunction<TokenERC721>("totalSupply", contractWrapper)) {
    return await (contractWrapper as ContractWrapper<TokenERC721>).read(
      "totalSupply",
      [],
    );
  } else {
    throw new Error(
      "Contract requires either `nextTokenIdToMint` or `totalSupply` function available to determine the next token ID to mint",
    );
  }
}

export async function totalClaimedSupply(
  contractWrapper: ContractWrapper<
    SignatureDrop | DropERC721 | (BaseERC721 & IERC721Supply)
  >,
): Promise<BigNumber> {
  const contract = contractWrapper;
  if (hasFunction<SignatureDrop>("totalMinted", contract)) {
    return (contractWrapper as ContractWrapper<SignatureDrop>).read(
      "totalMinted",
      [],
    );
  }
  if (hasFunction<DropERC721>("nextTokenIdToClaim", contract)) {
    return (contractWrapper as ContractWrapper<DropERC721>).read(
      "nextTokenIdToClaim",
      [],
    );
  }
  throw new Error("No function found on contract to get total claimed supply");
}
