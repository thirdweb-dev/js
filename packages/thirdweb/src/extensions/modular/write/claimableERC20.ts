import { type Hex, encodePacked, maxUint256 } from "viem";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import {
  NATIVE_TOKEN_ADDRESS,
  ZERO_ADDRESS,
  isNativeTokenAddress,
} from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { getOrDeployInfraContract } from "../../../contract/deployment/utils/bootstrap.js";
import { getDeployedInfraContract } from "../../../contract/deployment/utils/infra.js";
import { download } from "../../../storage/download.js";
import { upload } from "../../../storage/upload.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getAddress } from "../../../utils/address.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import { padHex, toHex } from "../../../utils/encoding/hex.js";
import { processOverrideList } from "../../../utils/extensions/drops/process-override-list.js";
import type { ClaimConditionInput } from "../../../utils/extensions/drops/types.js";
import { keccak256 } from "../../../utils/hashing/keccak256.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { Module } from "../../prebuilts/deploy-modular.js";
import {
  type EncodeBytesOnInstallParams,
  encodeBytesOnInstallParams,
} from "../__generated__/ClaimableERC20/encode/encodeBytesOnInstall.js";
import { setClaimCondition as generatedSetClaimCondition } from "../__generated__/ClaimableERC20/write/setClaimCondition.js";
import { mint as generatedMint } from "../__generated__/ERC20Core/write/mint.js";
import { installModule } from "../__generated__/ModularCore/write/installModule.js";

// TODO separate each function into its own file

// ClaimableERC20
// .getDeployedModule()
// .deployModule()
// .install()
// .encodeInstall()
// .mint()
// .encodeMint()
// .setClaimCondition()
// .getClaimCondition()

/**
 * ```ts
 * import { ClaimableERC20 } from "thirdweb/modules";
 *
 * // DEPLOY if needed
 * let module = await ClimableERC20.getDeployedModule({ client, chain });
 *
 * if (!module) {
 *   module = await ClaimableERC20.deployModule({ client, chain, account });
 * }
 *
 * // INSTALL
 * const installTransaction = installModule({
 *   coreContract,
 *   module: module.address,
 *   data: ClaimableERC20.encodeInstall({
 *     primarySaleRecipient: "0x...",
 *   },
 * });
 *
 * await sendTransaction({ transaction: installTransaction, account });
 *
 * // MINT
 *
 * // prebuilt extension
 * const mintTx = ClaimableERC20.mint({
 *   contract: coreContract,
 *   to: "0x...",
 *   quantity: 1n,
 * });
 *
 * // or custom
 * const mintTx = mint({
 *   contract: coreContract,
 *   to: "0x...",
 *   quantity: 1n,
 *   data: MyModule.encodeMint({
 *     myData: "0x...",
 *   },
 * });
 *
 * await sendTransaction({ transaction: mintTx, account });
 * ```
 */

export const deployModule = async (options: {
  client: ThirdwebClient;
  chain: Chain;
  account: Account;
}) => {
  const { client, chain, account } = options;
  const contract = await getOrDeployInfraContract({
    client,
    chain,
    account,
    contractId: "ClaimableERC20",
    constructorParams: [],
  });
  return contract;
};

export const getDeployedModule = (options: {
  client: ThirdwebClient;
  chain: Chain;
}) => {
  const { client, chain } = options;
  return getDeployedInfraContract({
    client,
    chain,
    contractId: "ClaimableERC20",
    constructorParams: [],
  });
};

export const prepareInstall = (options: {
  coreContract: ThirdwebContract;
  params: EncodeBytesOnInstallParams;
}) => {
  const { coreContract, params } = options;
  return installModule({
    contract: coreContract,
    async asyncParams() {
      const contract = await getDeployedModule({
        client: coreContract.client,
        chain: coreContract.chain,
      });
      if (!contract) {
        throw new Error(
          "No ClaimableERC20 module implementation found, deploy it first.",
        );
      }
      return {
        module: getAddress(contract.address),
        data: encodeBytesOnInstallParams(params),
      };
    },
  });
};

export const claimableERC20Module = (
  args: EncodeBytesOnInstallParams,
): Module => {
  const { primarySaleRecipient } = args;
  return {
    getInstallData: async ({ client, chain, account }) => {
      const contract = await getOrDeployInfraContract({
        client,
        chain,
        account,
        contractId: "ClaimableERC20",
        constructorParams: [],
      });
      const address = getAddress(contract.address);
      const params = encodeBytesOnInstallParams({
        primarySaleRecipient: primarySaleRecipient
          ? getAddress(primarySaleRecipient)
          : account.address,
      });
      return {
        address,
        encodedParams: params,
      };
    },
  };
};

export type TokenClaimParams = {
  to: string;
  quantity: string | number;
};

export function claimTo(options: BaseTransactionOptions<TokenClaimParams>) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      let amount = 0n;

      const [
        { convertErc20Amount },
        { getClaimCondition },
        { decimals },
        { encodeBytesBeforeMintERC20Params },
      ] = await Promise.all([
        import("../../../utils/extensions/convert-erc20-amount.js"),
        import("../__generated__/ClaimableERC20/read/getClaimCondition.js"),
        import("../../erc20/read/decimals.js"),
        import(
          "../__generated__/ClaimableERC20/encode/encodeBytesBeforeMintERC20.js"
        ),
      ]);
      amount = await convertErc20Amount({
        amount: options.quantity,
        client: options.contract.client,
        chain: options.contract.chain,
        erc20Address: options.contract.address,
      });

      const emptyPayload = {
        pricePerUnit: 0n,
        quantity: 0n,
        uid: toHex("", { size: 32 }),
        currency: ZERO_ADDRESS,
        startTimestamp: 0,
        endTimestamp: 0,
        recipient: ZERO_ADDRESS,
      };

      const [cc, tokenDecimals] = await Promise.all([
        getClaimCondition({ contract: options.contract }),
        decimals({ contract: options.contract }),
      ]);

      const totalPrice =
        (cc.pricePerUnit * amount) / BigInt(10 ** tokenDecimals);
      const value = isNativeTokenAddress(cc.currency) ? totalPrice : 0n;
      const erc20Value =
        !isNativeTokenAddress(cc.currency) && cc.pricePerUnit > 0n
          ? {
              amountWei: totalPrice,
              tokenAddress: cc.currency,
            }
          : undefined;

      let recipientAllowlistProof: Hex[] = [];
      if (
        cc.allowlistMerkleRoot &&
        cc.allowlistMerkleRoot !== padHex("0x", { size: 32 })
      ) {
        const { fetchProofsForClaimer } = await import(
          "../../../utils/extensions/drops/fetch-proofs-for-claimers.js"
        );
        const metadataUri = cc.auxData;
        if (metadataUri) {
          // download merkle tree from metadata
          const metadata = await download({
            client: options.contract.client,
            uri: metadataUri,
          });
          const metadataJson: {
            merkleTreeUri: string;
          } = await metadata.json();
          const merkleTreeUri = metadataJson.merkleTreeUri;

          // fetch proofs
          if (merkleTreeUri) {
            const allowlistProof = await fetchProofsForClaimer({
              contract: options.contract,
              claimer: options.to,
              merkleTreeUri,
              tokenDecimals,
              async hashEntry(options) {
                return keccak256(
                  encodePacked(
                    ["address"],
                    [getAddress(options.entry.address)],
                  ),
                );
              },
            });
            recipientAllowlistProof = allowlistProof?.proof || [];
          }
        }
      }

      return {
        to: getAddress(options.to),
        amount,
        data: encodeBytesBeforeMintERC20Params({
          params: {
            request: emptyPayload, // TODO (modular) signature claiming
            signature: "0x", // TODO (modular) signature claiming
            currency: cc.currency,
            pricePerUnit: cc.pricePerUnit,
            recipientAllowlistProof,
          },
        }),
        overrides: {
          value,
          erc20Value,
        },
      };
    },
  });
}

export function setClaimCondition(
  options: BaseTransactionOptions<ClaimConditionInput>,
) {
  return generatedSetClaimCondition({
    contract: options.contract,
    asyncParams: async () => {
      const { convertErc20Amount } = await import(
        "../../../utils/extensions/convert-erc20-amount.js"
      );
      const startTime = options.startTime || new Date(0);
      const endTime = options.endTime || tenYearsFromNow();
      const [pricePerUnit, availableSupply] = await Promise.all([
        options.pricePerToken
          ? convertErc20Amount({
              chain: options.contract.chain,
              client: options.contract.client,
              erc20Address: options.currencyAddress || NATIVE_TOKEN_ADDRESS,
              amount: options.pricePerToken.toString(),
            })
          : 0n,
        options.maxClaimableSupply
          ? await convertErc20Amount({
              chain: options.contract.chain,
              client: options.contract.client,
              erc20Address: options.contract.address,
              amount: options.maxClaimableSupply.toString(),
            })
          : maxUint256,
      ]);

      // allowlist + metadata
      let metadata = "";
      let merkleRoot: Hex = toHex("", { size: 32 });
      if (options.allowList) {
        const { shardedMerkleInfo, uri } = await processOverrideList({
          overrides: options.allowList.map((entry) => ({
            address: entry,
          })),
          client: options.contract.client,
          chain: options.contract.chain,
          tokenDecimals: 18, // unused in this case, we only care
          async hashEntry(options) {
            return keccak256(
              encodePacked(["address"], [getAddress(options.entry.address)]),
            );
          },
        });
        merkleRoot = shardedMerkleInfo.merkleRoot;
        metadata = await upload({
          client: options.contract.client,
          files: [
            {
              merkleRoot: shardedMerkleInfo.merkleRoot,
              merkleTreeUri: uri,
            },
          ],
        });
      }

      return {
        claimCondition: {
          startTimestamp: Number(dateToSeconds(startTime)),
          endTimestamp: Number(dateToSeconds(endTime)),
          pricePerUnit,
          currency: getAddress(options.currencyAddress || NATIVE_TOKEN_ADDRESS),
          availableSupply,
          allowlistMerkleRoot: merkleRoot,
          auxData: metadata, // stores the merkle root and merkle tree uri in IPFS
        },
      };
    },
  });
}
