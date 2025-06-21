import type { ThirdwebClient } from "../../client/client.js";
import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import { upload } from "../../storage/upload.js";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../transaction/types.js";
import type { NFTInput } from "../../utils/nft/parseNft.js";
import { toUnits } from "../../utils/units.js";
import type { AddPackContentsParams } from "./__generated__/IPack/write/addPackContents.js";
import {
  type CreatePackParams,
  createPack,
} from "./__generated__/IPack/write/createPack.js";

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
export type CreateNewPackParams = {
  client: ThirdwebClient;
  contract: ThirdwebContract;
  /**
   * The address of the reward recipient
   */
  recipient: string;
  /**
   * The address of the entity who owns the tokens that are used as rewards.
   * This is only used for checking token approval
   */
  tokenOwner: string;
  /**
   * The metadata (image, description, etc.) of the Pack.
   * This is similar to an NFT's metadata
   */
  packMetadata: NFTInput | string;
  amountDistributedPerOpen: bigint;
  /**
   * JavaScript Date object
   */
  openStartTimestamp: Date;
  /**
   * An array of ERC20 rewards, see type `ERC20Reward` for more info
   */
  erc20Rewards?: ERC20Reward[];
  /**
   * An array of ERC721 rewards, see type `ERC721Reward` for more info
   */
  erc721Rewards?: ERC721Reward[];
  /**
   * An array of ERC1155 rewards, see type `ERC1155Reward` for more info
   */
  erc1155Rewards?: ERC1155Reward[];
};

/**
 * * @deprecated [Pack contract is incompatible with Pectra update. Support for this contract is being removed in next release.]
 *
 * @extension PACK
 * @example
 * ```ts
 * import { createNewPack } from "thirdweb/extensions/pack";
 *
 * const transaction = createNewPack({
 *   contract: packContract,
 *   client,
 *   recipient: "0x...",
 *   tokenOwner: "0x...",
 *   packMetadata: {
 *     name: "Pack #1",
 *     image: "image-of-pack-1",
 *   },
 *   openStartTimestamp: new Date(),
 *   erc20Rewards: [
 *     {
 *       contractAddress: "0x...",
 *       quantityPerReward: 1,
 *       totalRewards: 1,
 *     },
 *   ],
 *   erc721Rewards: [
 *     {
 *       contractAddress: "0x...",
 *       tokenId: 0n,
 *     },
 *   ],
 *   erc1155Rewards: [
 *     {
 *       contractAddress: "0x...",
 *       tokenId: 0n,
 *       quantityPerReward: 1,
 *       totalRewards: 1,
 *     },
 *   ],
 * });
 * ```
 */
export function createNewPack(
  options: WithOverrides<BaseTransactionOptions<CreateNewPackParams>>,
) {
  return createPack({
    asyncParams: async () => getCreatePackParams(options),
    contract: options.contract,
  });
}

/**
 * @internal
 */
async function getCreatePackParams(
  options: WithOverrides<BaseTransactionOptions<CreateNewPackParams>>,
): Promise<CreatePackParams> {
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
    overrides,
  } = options;
  const [erc20Content, erc721Content, erc1155Content, packUri] =
    await Promise.all([
      processErc20Rewards({
        content: erc20Rewards,
        packContract: contract,
        tokenOwner,
      }),
      processErc721Rewards({
        content: erc721Rewards,
        packContract: contract,
        tokenOwner,
      }),
      processErc1155Rewards({
        content: erc1155Rewards,
        packContract: contract,
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
    amountDistributedPerOpen,
    contents,
    numOfRewardUnits,
    // openStartTimestamp should be in seconds and not millisecond
    openStartTimestamp: BigInt(Math.ceil(openStartTimestamp.getTime() / 1000)),
    overrides,
    packUri,
    recipient,
  };
}

/**
 * @internal
 */
async function processErc20Rewards(options: {
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
            owner: tokenOwner,
            spender: packContract.address,
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
      tokenId: 0n,
      tokenType: PACK_TOKEN_TYPE.ERC20, // hard-coded to `0n` for ERC20
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
async function processErc721Rewards(options: {
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
      tokenId,
      tokenType: PACK_TOKEN_TYPE.ERC721,
      totalAmount: 1n,
    };
  });

  return {
    content: result,
    numOfRewardUnits,
  };
}

async function processErc1155Rewards(options: {
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
        quantityPerReward: o.quantityPerReward,
        tokenId: o.tokenId,
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
      tokenId,
      tokenType: PACK_TOKEN_TYPE.ERC1155,
      totalAmount: BigInt(quantityPerReward) * BigInt(totalRewards),
    };
  });

  return {
    content: result,
    numOfRewardUnits,
  };
}
