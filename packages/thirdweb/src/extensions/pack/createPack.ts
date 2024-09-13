import type { ThirdwebClient } from "../../client/client.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import type { AddPackContentsParams } from "../../extensions/erc1155/__generated__/IPack/write/addPackContents.js";
import {
  type CreatePackParams as CreatePackParams1155,
  createPack as createPack1155,
} from "../../extensions/erc1155/__generated__/IPack/write/createPack.js";
import { upload } from "../../storage/upload.js";
import type { BaseTransactionOptions } from "../../transaction/types.js";
import type { NFTInput } from "../../utils/nft/parseNft.js";
import { toUnits } from "../../utils/units.js";

export enum PACK_TOKEN_TYPE {
  ERC20 = 0,
  ERC721 = 1,
  ERC1155 = 2,
}

export type ERC20Reward = {
  contractAddress: string;
  quantityPerReward: number | string;
  totalRewards: number | string;
};

export type ERC721Reward = {
  contractAddress: string;
  tokenId: bigint;
};

export type ERC1155Reward = {
  contractAddress: string;
  tokenId: bigint;
  quantityPerReward: number | string;
  totalRewards: number | string;
};

/**
 * @extension PACK
 */
export type CreatePackParams = {
  client: ThirdwebClient;
  contract: ThirdwebContract;
  recipient: string;
  packMetadata: NFTInput | string;
  amountDistributedPerOpen: bigint;
  openStartTimestamp: Date;
  erc20Rewards?: ERC20Reward[];
  erc721Rewards?: ERC721Reward[];
  erc1155Rewards?: ERC1155Reward[];
  tokenOwner: string;
};

/**
 * @extension PACK
 */
export function createPack(options: BaseTransactionOptions<CreatePackParams>) {
  return createPack1155({
    contract: options.contract,
    asyncParams: async () => getCreatePackParams(options),
  });
}

/**
 * @internal
 */
export async function getCreatePackParams(
  options: BaseTransactionOptions<CreatePackParams>,
): Promise<CreatePackParams1155> {
  const {
    contract,
    recipient,
    packMetadata,
    amountDistributedPerOpen,
    openStartTimestamp,
    erc20Rewards,
    erc721Rewards,
    erc1155Rewards,
    tokenOwner,
  } = options;
  const [erc20Content, erc721Content, erc1155Content, packUri] =
    await Promise.all([
      processErc20Rewards({
        packContract: contract,
        content: erc20Rewards,
        tokenOwner,
      }),
      processErc721Rewards({
        packContract: contract,
        content: erc721Rewards,
        tokenOwner,
      }),
      processErc1155Rewards({
        packContract: contract,
        content: erc1155Rewards,
        tokenOwner,
      }),
      typeof packMetadata === "string"
        ? packMetadata
        : upload({
            client: options.contract.client,
            files: [packMetadata],
          }),
    ]);
  const contents = erc20Content.content
    .concat(erc721Content.content)
    .concat(erc1155Content.content);

  const numOfRewardUnits = erc20Content.numOfRewardUnits
    .concat(erc721Content.numOfRewardUnits)
    .concat(erc1155Content.numOfRewardUnits);

  return {
    packUri,
    recipient,
    contents,
    numOfRewardUnits,

    // @joaquim - I'm not sure if this is correct
    openStartTimestamp: BigInt(openStartTimestamp.getTime()),
    amountDistributedPerOpen,
  };
}

/**
 * @internal
 */
export async function processErc20Rewards(options: {
  content?: ERC20Reward[];
  packContract: ThirdwebContract;
  tokenOwner: string;
}): Promise<{
  content: AddPackContentsParams["contents"];
  numOfRewardUnits: bigint[];
}> {
  const { content, packContract, tokenOwner } = options;
  if (!content?.length) {
    return {
      content: [],
      numOfRewardUnits: [],
    };
  }
  const [{ allowance }, { decimals }] = await Promise.all([
    import("../erc20/__generated__/IERC20/read/allowance.js"),
    import("../erc20/__generated__/IERC20/read/decimals.js"),
  ]);

  const uniqueERC20Contracts = [
    ...new Set(
      content.map((o) =>
        getContract({
          address: o.contractAddress,
          chain: packContract.chain,
          client: packContract.client,
        }),
      ),
    ),
  ];

  const data: Array<{
    _allowance: bigint;
    _decimals: number;
    address: string;
  }> = (
    await Promise.all(
      uniqueERC20Contracts.map((contract) => {
        return Promise.all([
          allowance({
            contract,
            spender: packContract.address,
            owner: tokenOwner,
          }),
          decimals({ contract }).catch(() => undefined),
          contract.address,
        ]);
      }),
    )
  ).map((item) => {
    const [_allowance, _decimals, address] = item;
    if (_decimals === undefined) {
      throw new Error(
        `Failed to get the decimals of contract: ${address}. Make sure it is a valid ERC20 contract`,
      );
    }
    return {
      _allowance,
      _decimals,
      address,
    };
  });
  const numOfRewardUnits: bigint[] = [];
  const result = content.map((item, index) => {
    const { contractAddress, quantityPerReward, totalRewards } = item;
    if (!totalRewards) {
      throw new Error(
        `Invalid totalRewards for contract: ${contractAddress} at index: ${index}`,
      );
    }
    const _data = data.find((o) => o.address === contractAddress);
    if (!_data) {
      // This should never happen
      throw new Error(`contractAddress not found: ${contractAddress}`);
    }
    const quantityInWei = toUnits(String(quantityPerReward), _data._decimals);
    const totalRequired = quantityInWei * BigInt(totalRewards);
    if (totalRequired > _data._allowance) {
      throw new Error(
        `The following ERC20 contract address do not have enough allowance for the Pack contract: ${contractAddress}`,
      );
    }
    numOfRewardUnits.push(BigInt(item.totalRewards));
    return {
      assetContract: contractAddress,
      tokenType: PACK_TOKEN_TYPE.ERC20,
      tokenId: 0n, // hard-coded to `0n` for ERC20
      totalAmount: totalRequired,
    };
  });

  return {
    content: result,
    numOfRewardUnits,
  };
}

/**
 * @internal
 */
export async function processErc721Rewards(options: {
  content?: ERC721Reward[];
  packContract: ThirdwebContract;
  tokenOwner: string;
}): Promise<{
  content: AddPackContentsParams["contents"];
  numOfRewardUnits: bigint[];
}> {
  const { content, packContract, tokenOwner } = options;
  if (!content?.length) {
    return {
      content: [],
      numOfRewardUnits: [],
    };
  }
  const uniqueERC721Contracts = [
    ...new Set(
      content.map((o) => ({
        contract: getContract({
          address: o.contractAddress,
          chain: packContract.chain,
          client: packContract.client,
        }),
        tokenId: o.tokenId,
      })),
    ),
  ];
  const [{ isApprovedForAll }, { getApproved }] = await Promise.all([
    import("../erc721/__generated__/IERC721A/read/isApprovedForAll.js"),
    import("../erc721/__generated__/IERC721A/read/getApproved.js"),
  ]);
  const numOfRewardUnits: bigint[] = [];
  const result = (
    await Promise.all(
      uniqueERC721Contracts.map(({ contract, tokenId }) => {
        return Promise.all([
          isApprovedForAll({
            contract,
            operator: packContract.address,
            owner: tokenOwner,
          }).catch(() => false),
          getApproved({ contract, tokenId }).catch(() => ""),
          contract.address,
          tokenId,
        ]);
      }),
    )
  ).map((item) => {
    const [_allApproved, _tokenApprove, address, tokenId] = item;
    if (
      !_allApproved &&
      _tokenApprove.toLowerCase() !== packContract.address.toLowerCase()
    ) {
      throw new Error(
        `TokenID: ${tokenId} from contract address ${address} is not approved to be used by this Pack contract.`,
      );
    }
    numOfRewardUnits.push(1n);
    return {
      assetContract: address,
      tokenType: PACK_TOKEN_TYPE.ERC721,
      tokenId,
      totalAmount: 1n,
    };
  });

  return {
    content: result,
    numOfRewardUnits,
  };
}

export async function processErc1155Rewards(options: {
  content?: ERC1155Reward[];
  packContract: ThirdwebContract;
  tokenOwner: string;
}): Promise<{
  content: AddPackContentsParams["contents"];
  numOfRewardUnits: bigint[];
}> {
  const { content, packContract, tokenOwner } = options;
  if (!content?.length) {
    return {
      content: [],
      numOfRewardUnits: [],
    };
  }
  const uniqueERC1155Contracts = [
    ...new Set(
      content.map((o) => ({
        contract: getContract({
          address: o.contractAddress,
          chain: packContract.chain,
          client: packContract.client,
        }),
        tokenId: o.tokenId,
        quantityPerReward: o.quantityPerReward,
        totalRewards: o.totalRewards,
      })),
    ),
  ];
  const { isApprovedForAll } = await import(
    "../erc1155/__generated__/IERC1155/read/isApprovedForAll.js"
  );
  const numOfRewardUnits: bigint[] = [];
  const result = (
    await Promise.all(
      uniqueERC1155Contracts.map(
        ({ contract, tokenId, quantityPerReward, totalRewards }) => {
          return Promise.all([
            isApprovedForAll({
              contract,
              operator: packContract.address,
              owner: tokenOwner,
            }).catch(() => false),
            contract.address,
            tokenId,
            quantityPerReward,
            totalRewards,
          ]);
        },
      ),
    )
  ).map((item) => {
    const [_allApproved, address, tokenId, quantityPerReward, totalRewards] =
      item;
    if (!_allApproved) {
      throw new Error(
        `ERC1155 contract address ${address} is not approved to be used by this Pack contract.`,
      );
    }
    numOfRewardUnits.push(BigInt(totalRewards));
    return {
      assetContract: address,
      tokenType: PACK_TOKEN_TYPE.ERC1155,
      tokenId,
      totalAmount: BigInt(quantityPerReward) * BigInt(totalRewards),
    };
  });

  return {
    content: result,
    numOfRewardUnits,
  };
}
