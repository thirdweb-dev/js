import type { Multiwrap as MultiwrapContract } from "@thirdweb-dev/contracts-js";
import {
  ITokenBundle,
  TokensWrappedEvent,
} from "@thirdweb-dev/contracts-js/dist/declarations/src/Multiwrap";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { utils, type BigNumberish, type CallOverrides } from "ethers";
import { NFT, NFTMetadataOrUri } from "../../../core/schema/nft";
import { fetchCurrencyMetadata } from "../../common/currency/fetchCurrencyMetadata";
import { hasERC20Allowance } from "../../common/currency/hasERC20Allowance";
import { normalizePriceValue } from "../../common/currency/normalizePriceValue";
import { resolveAddress } from "../../common/ens/resolveAddress";
import { isTokenApprovedForTransfer } from "../../common/marketplace";
import { uploadOrExtractURI } from "../../common/nft";
import { buildTransactionFunction } from "../../common/transactions";
import { ContractAppURI } from "../../core/classes/contract-appuri";
import { ContractEncoder } from "../../core/classes/contract-encoder";
import { ContractEvents } from "../../core/classes/contract-events";
import { ContractMetadata } from "../../core/classes/contract-metadata";
import { ContractOwner } from "../../core/classes/contract-owner";
import { ContractRoles } from "../../core/classes/contract-roles";
import { ContractRoyalty } from "../../core/classes/contract-royalty";
import { ContractWrapper } from "../../core/classes/internal/contract-wrapper";
import { StandardErc721 } from "../../core/classes/internal/erc721/erc-721-standard";
import { GasCostEstimator } from "../../core/classes/gas-cost-estimator";
import { Transaction } from "../../core/classes/transactions";
import { NetworkInput, TransactionResultWithId } from "../../core/types";
import { Abi, AbiInput, AbiSchema } from "../../schema/contracts/custom";
import { MultiwrapContractSchema } from "../../schema/contracts/multiwrap";
import { SDKOptions } from "../../schema/sdk-options";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import {
  ERC1155Wrappable,
  ERC20Wrappable,
  ERC721Wrappable,
  TokensToWrap,
  WrappedTokens,
} from "../../types/multiwrap";
import { MULTIWRAP_CONTRACT_ROLES } from "../contractRoles";

/**
 * Multiwrap lets you wrap any number of ERC20, ERC721 and ERC1155 tokens you own into a single wrapped token bundle.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("{{chainName}}");
 * const contract = await sdk.getContract("{{contract_address}}", "multiwrap");
 * ```
 *
 * @beta
 */
// TODO create extension wrappers for this
export class Multiwrap extends StandardErc721<MultiwrapContract> {
  static contractRoles = MULTIWRAP_CONTRACT_ROLES;

  public abi: Abi;
  public encoder: ContractEncoder<MultiwrapContract>;
  public estimator: GasCostEstimator<MultiwrapContract>;
  public metadata: ContractMetadata<
    MultiwrapContract,
    typeof MultiwrapContractSchema
  >;
  public app: ContractAppURI<MultiwrapContract>;
  public events: ContractEvents<MultiwrapContract>;
  public roles: ContractRoles<
    MultiwrapContract,
    (typeof Multiwrap.contractRoles)[number]
  >;

  /**
   * Configure royalties
   * @remarks Set your own royalties for the entire contract or per token
   * @example
   * ```javascript
   * // royalties on the whole contract
   * contract.royalties.setDefaultRoyaltyInfo({
   *   seller_fee_basis_points: 100, // 1%
   *   fee_recipient: "0x..."
   * });
   * // override royalty for a particular token
   * contract.royalties.setTokenRoyaltyInfo(tokenId, {
   *   seller_fee_basis_points: 500, // 5%
   *   fee_recipient: "0x..."
   * });
   * ```
   */
  public royalties: ContractRoyalty<
    MultiwrapContract,
    typeof MultiwrapContractSchema
  >;
  public owner: ContractOwner;

  constructor(
    network: NetworkInput,
    address: string,
    storage: ThirdwebStorage,
    options: SDKOptions = {},
    abi: AbiInput,
    chainId: number,
    contractWrapper = new ContractWrapper<MultiwrapContract>(
      network,
      address,
      abi,
      options,
      storage,
    ),
  ) {
    super(contractWrapper, storage, chainId);

    this.abi = AbiSchema.parse(abi || []);
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      MultiwrapContractSchema,
      this.storage,
    );
    this.app = new ContractAppURI(
      this.contractWrapper,
      this.metadata,
      this.storage,
    );
    this.roles = new ContractRoles(
      this.contractWrapper,
      Multiwrap.contractRoles,
    );
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.events = new ContractEvents(this.contractWrapper);
    this.royalties = new ContractRoyalty(this.contractWrapper, this.metadata);
    this.owner = new ContractOwner(this.contractWrapper);
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get the contents of a wrapped token bundle
   * @example
   * ```javascript
   * const contents = await contract.getWrappedContents(wrappedTokenId);
   * console.log(contents.erc20Tokens);
   * console.log(contents.erc721Tokens);
   * console.log(contents.erc1155Tokens);
   * ```
   * @param wrappedTokenId - the id of the wrapped token bundle
   */
  public async getWrappedContents(
    wrappedTokenId: BigNumberish,
  ): Promise<WrappedTokens> {
    const wrappedTokens = await this.contractWrapper.read(
      "getWrappedContents",
      [wrappedTokenId],
    );

    const erc20Tokens: ERC20Wrappable[] = [];
    const erc721Tokens: ERC721Wrappable[] = [];
    const erc1155Tokens: ERC1155Wrappable[] = [];

    for (const token of wrappedTokens) {
      switch (token.tokenType) {
        case 0: {
          const tokenMetadata = await fetchCurrencyMetadata(
            this.contractWrapper.getProvider(),
            token.assetContract,
          );
          erc20Tokens.push({
            contractAddress: token.assetContract,
            quantity: utils.formatUnits(
              token.totalAmount,
              tokenMetadata.decimals,
            ),
          });
          break;
        }
        case 1: {
          erc721Tokens.push({
            contractAddress: token.assetContract,
            tokenId: token.tokenId,
          });
          break;
        }
        case 2: {
          erc1155Tokens.push({
            contractAddress: token.assetContract,
            tokenId: token.tokenId,
            quantity: token.totalAmount.toString(),
          });
          break;
        }
      }
    }
    return {
      erc20Tokens,
      erc721Tokens,
      erc1155Tokens,
    };
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Wrap any number of ERC20/ERC721/ERC1155 tokens into a single wrapped token
   * @example
   * ```javascript
   * const tx = await contract.wrap({
   *   erc20Tokens: [{
   *     contractAddress: "0x...",
   *     quantity: "0.8"
   *   }],
   *   erc721Tokens: [{
   *     contractAddress: "0x...",
   *     tokenId: "0"
   *   }],
   *   erc1155Tokens: [{
   *     contractAddress: "0x...",
   *     tokenId: "1",
   *     quantity: "2"
   *   }]
   * }, {
   *     name: "Wrapped bundle",
   *     description: "This is a wrapped bundle of tokens and NFTs",
   *     image: "ipfs://...",
   * });
   * const receipt = tx.receipt(); // the transaction receipt
   * const wrappedTokenId = tx.id; // the id of the wrapped token bundle
   * ```
   * @param contents - the contents to wrap
   * @param wrappedTokenMetadata - metadata to represent the wrapped token bundle
   * @param recipientAddress - Optional. The address to send the wrapped token bundle to
   */
  wrap = /* @__PURE__ */ buildTransactionFunction(
    async (
      contents: TokensToWrap,
      wrappedTokenMetadata: NFTMetadataOrUri,
      recipientAddress?: AddressOrEns,
    ): Promise<Transaction<TransactionResultWithId<NFT>>> => {
      const [uri, tokens, recipient] = await Promise.all([
        uploadOrExtractURI(wrappedTokenMetadata, this.storage),
        this.toTokenStructList(contents),
        resolveAddress(
          recipientAddress
            ? recipientAddress
            : await this.contractWrapper.getSignerAddress(),
        ),
      ]);

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "wrap",
        args: [tokens, uri, recipient],
        parse: (receipt) => {
          const event = this.contractWrapper.parseLogs<TokensWrappedEvent>(
            "TokensWrapped",
            receipt?.logs,
          );
          if (event.length === 0) {
            throw new Error("TokensWrapped event not found");
          }
          const tokenId = event[0].args.tokenIdOfWrappedToken;
          return {
            id: tokenId,
            receipt,
            data: () => this.get(tokenId),
          };
        },
      });
    },
  );

  /**
   * Unwrap a wrapped token bundle, and retrieve its contents
   * @example
   * ```javascript
   * await contract.unwrap(wrappedTokenId);
   * ```
   * @param wrappedTokenId - the id of the wrapped token bundle
   * @param recipientAddress - Optional. The address to send the unwrapped tokens to
   */
  unwrap = /* @__PURE__ */ buildTransactionFunction(
    async (wrappedTokenId: BigNumberish, recipientAddress?: AddressOrEns) => {
      const recipient = await resolveAddress(
        recipientAddress
          ? recipientAddress
          : await this.contractWrapper.getSignerAddress(),
      );

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "unwrap",
        args: [wrappedTokenId, recipient],
      });
    },
  );

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  private async toTokenStructList(contents: TokensToWrap) {
    const tokens: ITokenBundle.TokenStruct[] = [];

    const provider = this.contractWrapper.getProvider();
    const owner = await this.contractWrapper.getSignerAddress();

    if (contents.erc20Tokens) {
      for (const erc20 of contents.erc20Tokens) {
        const normalizedQuantity = await normalizePriceValue(
          provider,
          erc20.quantity,
          erc20.contractAddress,
        );
        const hasAllowance = await hasERC20Allowance(
          this.contractWrapper,
          erc20.contractAddress,
          normalizedQuantity,
        );
        if (!hasAllowance) {
          throw new Error(
            `ERC20 token with contract address "${
              erc20.contractAddress
            }" does not have enough allowance to transfer.\n\nYou can set allowance to the multiwrap contract to transfer these tokens by running:\n\nawait sdk.getToken("${
              erc20.contractAddress
            }").setAllowance("${this.getAddress()}", ${erc20.quantity});\n\n`,
          );
        }
        tokens.push({
          assetContract: erc20.contractAddress,
          totalAmount: normalizedQuantity,
          tokenId: 0,
          tokenType: 0,
        });
      }
    }

    if (contents.erc721Tokens) {
      for (const erc721 of contents.erc721Tokens) {
        const isApproved = await isTokenApprovedForTransfer(
          this.contractWrapper.getProvider(),
          this.getAddress(),
          erc721.contractAddress,
          erc721.tokenId,
          owner,
        );

        if (!isApproved) {
          throw new Error(
            `ERC721 token "${erc721.tokenId}" with contract address "${
              erc721.contractAddress
            }" is not approved for transfer.\n\nYou can give approval the multiwrap contract to transfer this token by running:\n\nawait sdk.getNFTCollection("${
              erc721.contractAddress
            }").setApprovalForToken("${this.getAddress()}", ${
              erc721.tokenId
            });\n\n`,
          );
        }

        tokens.push({
          assetContract: erc721.contractAddress,
          totalAmount: 0,
          tokenId: erc721.tokenId,
          tokenType: 1,
        });
      }
    }

    if (contents.erc1155Tokens) {
      for (const erc1155 of contents.erc1155Tokens) {
        const isApproved = await isTokenApprovedForTransfer(
          this.contractWrapper.getProvider(),
          this.getAddress(),
          erc1155.contractAddress,
          erc1155.tokenId,
          owner,
        );

        if (!isApproved) {
          throw new Error(
            `ERC1155 token "${erc1155.tokenId}" with contract address "${
              erc1155.contractAddress
            }" is not approved for transfer.\n\nYou can give approval the multiwrap contract to transfer this token by running:\n\nawait sdk.getEdition("${
              erc1155.contractAddress
            }").setApprovalForAll("${this.getAddress()}", true);\n\n`,
          );
        }
        tokens.push({
          assetContract: erc1155.contractAddress,
          totalAmount: erc1155.quantity,
          tokenId: erc1155.tokenId,
          tokenType: 2,
        });
      }
    }
    return tokens;
  }

  /**
   * @internal
   */
  public async prepare<
    TMethod extends
      keyof MultiwrapContract["functions"] = keyof MultiwrapContract["functions"],
  >(
    method: string & TMethod,
    args: any[] & Parameters<MultiwrapContract["functions"][TMethod]>,
    overrides?: CallOverrides,
  ) {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method,
      args,
      overrides,
    });
  }

  /**
   * @internal
   */
  public async call<
    TMethod extends
      keyof MultiwrapContract["functions"] = keyof MultiwrapContract["functions"],
  >(
    functionName: string & TMethod,
    args?: Parameters<MultiwrapContract["functions"][TMethod]>,
    overrides?: CallOverrides,
  ): Promise<ReturnType<MultiwrapContract["functions"][TMethod]>> {
    return this.contractWrapper.call(functionName, args, overrides);
  }
}
