import type {
  ITokenERC1155,
  Multicall,
  TokenERC1155,
} from "@thirdweb-dev/contracts-js";
import { TokensMintedWithSignatureEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/ITokenERC1155";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, constants } from "ethers";
import invariant from "tiny-invariant";
import { normalizePriceValue } from "../../common/currency/normalizePriceValue";
import { setErc20Allowance } from "../../common/currency/setErc20Allowance";
import { hasFunction } from "../../common/feature-detection/hasFunction";
import { getPrebuiltInfo } from "../../common/legacy";
import { uploadOrExtractURIs } from "../../common/nft";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_EDITION_SIGNATURE_MINTABLE } from "../../constants/erc1155-features";
import { NFT_BASE_CONTRACT_ROLES } from "../../contracts/contractRoles";
import {
  FilledSignaturePayload1155WithTokenId,
  MintRequest1155,
  PayloadToSign1155,
  PayloadToSign1155WithTokenId,
  PayloadWithUri1155,
  Signature1155PayloadInputWithTokenId,
  Signature1155PayloadOutput,
  SignedPayload1155,
} from "../../schema/contracts/common/signature";
import { BaseSignatureMintERC1155 } from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResultWithId } from "../types";
import { ContractEncoder } from "./contract-encoder";
import { ContractRoles } from "./contract-roles";
import { ContractWrapper } from "./internal/contract-wrapper";
import { Transaction } from "./transactions";

/**
 * Enables generating dynamic ERC1155 NFTs with rules and an associated signature, which can then be minted by anyone securely
 * @public
 */
export class Erc1155SignatureMintable implements DetectableFeature {
  featureName = FEATURE_EDITION_SIGNATURE_MINTABLE.name;

  private contractWrapper: ContractWrapper<
    BaseSignatureMintERC1155 | TokenERC1155
  >;
  private storage: ThirdwebStorage;
  private roles:
    | ContractRoles<TokenERC1155, (typeof NFT_BASE_CONTRACT_ROLES)[number]>
    | undefined;

  constructor(
    contractWrapper: ContractWrapper<BaseSignatureMintERC1155 | TokenERC1155>,
    storage: ThirdwebStorage,
    roles?: ContractRoles<
      TokenERC1155,
      (typeof NFT_BASE_CONTRACT_ROLES)[number]
    >,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.roles = roles;
  }

  /**
   * Mint a dynamically generated NFT
   *
   * @remarks Mint a dynamic NFT with a previously generated signature.
   *
   * @example
   * ```javascript
   * // see how to craft a payload to sign in the `generate()` documentation
   * const signedPayload = contract.erc1155.signature.generate(payload);
   *
   * // now anyone can mint the NFT
   * const tx = contract.erc1155.signature.mint(signedPayload);
   * ```
   * @param signedPayload - the previously generated payload and signature with {@link Erc1155SignatureMintable.generate}
   * @twfeature ERC1155SignatureMintable
   */
  mint = /* @__PURE__ */ buildTransactionFunction(
    async (
      signedPayload: SignedPayload1155,
    ): Promise<Transaction<TransactionResultWithId>> => {
      const mintRequest = signedPayload.payload;
      const signature = signedPayload.signature;
      const [message, overrides] = await Promise.all([
        this.mapPayloadToContractStruct(mintRequest),
        this.contractWrapper.getCallOverrides(),
      ]);
      // TODO: Transaction Sequence Pattern
      await setErc20Allowance(
        this.contractWrapper,
        message.pricePerToken.mul(message.quantity),
        mintRequest.currencyAddress,
        overrides,
      );
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "mintWithSignature",
        args: [message, signature],
        overrides,
        parse: (receipt) => {
          const t =
            this.contractWrapper.parseLogs<TokensMintedWithSignatureEvent>(
              "TokensMintedWithSignature",
              receipt.logs,
            );
          if (t.length === 0) {
            throw new Error("No MintWithSignature event found");
          }
          const id = t[0].args.tokenIdMinted;
          return {
            id,
            receipt,
          };
        },
      });
    },
  );

  /**
   * Mint any number of dynamically generated NFT at once
   * @remarks Mint multiple dynamic NFTs in one transaction. Note that this is only possible for free mints (cannot batch mints with a price attached to it for security reasons)
   *
   * @example
   * ```javascript
   * // see how to craft a batch of payloads to sign in the `generateBatch()` documentation
   * const signedPayloads = contract.erc1155.signature.generateBatch(payloads);
   *
   * // now anyone can mint the NFT
   * const tx = contract.erc1155.signature.mintBatch(signedPayloads);
   * ```
   *
   * @param signedPayloads - the array of signed payloads to mint
   * @twfeature ERC1155SignatureMintable
   */
  mintBatch = /* @__PURE__ */ buildTransactionFunction(
    async (
      signedPayloads: SignedPayload1155[],
    ): Promise<Transaction<TransactionResultWithId[]>> => {
      const contractStructs = await Promise.all(
        signedPayloads.map((s) => this.mapPayloadToContractStruct(s.payload)),
      );
      const contractPayloads = signedPayloads.map((s, index) => {
        const message = contractStructs[index];
        const signature = s.signature;
        const price = s.payload.price;
        if (BigNumber.from(price).gt(0)) {
          throw new Error(
            "Can only batch free mints. For mints with a price, use regular mint()",
          );
        }
        return {
          message,
          signature,
        };
      });
      const contractEncoder = new ContractEncoder(this.contractWrapper);
      const encoded = contractPayloads.map((p) => {
        return contractEncoder.encode("mintWithSignature", [
          p.message,
          p.signature,
        ]);
      });

      if (hasFunction<Multicall>("multicall", this.contractWrapper)) {
        return Transaction.fromContractWrapper({
          contractWrapper: this.contractWrapper,
          method: "multicall",
          args: [encoded],
          parse: (receipt) => {
            const events =
              this.contractWrapper.parseLogs<TokensMintedWithSignatureEvent>(
                "TokensMintedWithSignature",
                receipt.logs,
              );
            if (events.length === 0) {
              throw new Error("No MintWithSignature event found");
            }
            return events.map((log) => ({
              id: log.args.tokenIdMinted,
              receipt,
            }));
          },
        });
      } else {
        throw new Error("Multicall not supported on this contract!");
      }
    },
  );

  /**
   * Verify that a payload is correctly signed
   * @param signedPayload - the payload to verify
   * @twfeature ERC1155SignatureMintable
   *
   * @example
   * ```javascript
   * const nftMetadata = {
   *   name: "Cool NFT #1",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * };
   *
   * const startTime = new Date();
   * const endTime = new Date(Date.now() + 60 * 60 * 24 * 1000);
   * const payload = {
   *   metadata: nftMetadata, // The NFT to mint
   *   to: {{wallet_address}}, // Who will receive the NFT
   *   quantity: 2, // the quantity of NFTs to mint
   *   price: 0.5, // the price per NFT
   *   currencyAddress: NATIVE_TOKEN_ADDRESS, // the currency to pay with
   *   mintStartTime: startTime, // can mint anytime from now
   *   mintEndTime: endTime, // to 24h from now
   *   royaltyRecipient: "0x...", // custom royalty recipient for this NFT
   *   royaltyBps: 100, // custom royalty fees for this NFT (in bps)
   *   primarySaleRecipient: "0x...", // custom sale recipient for this NFT
   * };
   *
   * const signedPayload = contract.erc1155.signature.generate(payload);
   * // Now you can verify that the payload is valid
   * const isValid = await contract.erc1155.signature.verify(signedPayload);
   * ```
   */
  public async verify(signedPayload: SignedPayload1155): Promise<boolean> {
    const mintRequest = signedPayload.payload;
    const signature = signedPayload.signature;
    const message = await this.mapPayloadToContractStruct(mintRequest);
    const verification: [boolean, string] = await this.contractWrapper.read(
      "verify",
      [message, signature],
    );
    return verification[0];
  }

  /**
   * Generate a signature that can be used to mint an NFT dynamically.
   *
   * @remarks Takes in an NFT and some information about how it can be minted, uploads the metadata and signs it with your private key. The generated signature can then be used to mint an NFT using the exact payload and signature generated.
   *
   * @example
   * ```javascript
   * const nftMetadata = {
   *   name: "Cool NFT #1",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * };
   *
   * const startTime = new Date();
   * const endTime = new Date(Date.now() + 60 * 60 * 24 * 1000);
   * const payload = {
   *   metadata: nftMetadata, // The NFT to mint
   *   to: {{wallet_address}}, // Who will receive the NFT
   *   quantity: 2, // the quantity of NFTs to mint
   *   price: 0.5, // the price per NFT
   *   currencyAddress: NATIVE_TOKEN_ADDRESS, // the currency to pay with
   *   mintStartTime: startTime, // can mint anytime from now
   *   mintEndTime: endTime, // to 24h from now
   *   royaltyRecipient: "0x...", // custom royalty recipient for this NFT
   *   royaltyBps: 100, // custom royalty fees for this NFT (in bps)
   *   primarySaleRecipient: "0x...", // custom sale recipient for this NFT
   * };
   *
   * const signedPayload = await contract.erc1155.signature.generate(payload);
   * // now anyone can use these to mint the NFT using `contract.erc1155.signature.mint(signedPayload)`
   * ```
   * @param payloadToSign - the payload to sign
   * @returns The signed payload and the corresponding signature
   * @twfeature ERC1155SignatureMintable
   */
  public async generate(
    payloadToSign: PayloadToSign1155,
  ): Promise<SignedPayload1155> {
    const payload = {
      ...payloadToSign,
      tokenId: constants.MaxUint256,
    };
    return this.generateFromTokenId(payload);
  }

  /**
   * Generate a signature that can be used to mint additionally supply to an existing NFT.
   *
   * @remarks Takes in a payload with the token ID of an existing NFT, and signs it with your private key. The generated signature can then be used to mint additional supply to the NFT using the exact payload and signature generated.
   *
   * @example
   * ```javascript
   * const nftMetadata = {
   *   name: "Cool NFT #1",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * };
   *
   * const startTime = new Date();
   * const endTime = new Date(Date.now() + 60 * 60 * 24 * 1000);
   * const payload = {
   *   tokenId: 0, // Instead of metadata, we specify the token ID of the NFT to mint supply to
   *   to: {{wallet_address}}, // Who will receive the NFT (or AddressZero for anyone)
   *   quantity: 2, // the quantity of NFTs to mint
   *   price: 0.5, // the price per NFT
   *   currencyAddress: NATIVE_TOKEN_ADDRESS, // the currency to pay with
   *   mintStartTime: startTime, // can mint anytime from now
   *   mintEndTime: endTime, // to 24h from now
   *   royaltyRecipient: "0x...", // custom royalty recipient for this NFT
   *   royaltyBps: 100, // custom royalty fees for this NFT (in bps)
   *   primarySaleRecipient: "0x...", // custom sale recipient for this NFT
   * };
   *
   * const signedPayload = await contract.erc1155.signature.generateFromTokenId(payload);
   * // now anyone can use these to mint the NFT using `contract.erc1155.signature.mint(signedPayload)`
   * ```
   * @param payloadToSign - the payload to sign
   * @returns The signed payload and the corresponding signature
   * @twfeature ERC1155SignatureMintable
   */
  public async generateFromTokenId(
    payloadToSign: PayloadToSign1155WithTokenId,
  ): Promise<SignedPayload1155> {
    const payloads = await this.generateBatchFromTokenIds([payloadToSign]);
    return payloads[0];
  }

  /**
   * Generate a batch of signatures that can be used to mint many new NFTs dynamically.
   *
   * @remarks See {@link Erc1155SignatureMintable.generate}
   *
   * @param payloadsToSign - the payloads to sign
   * @returns An array of payloads and signatures
   * @twfeature ERC1155SignatureMintable
   */
  public async generateBatch(
    payloadsToSign: PayloadToSign1155[],
  ): Promise<SignedPayload1155[]> {
    const payloads = payloadsToSign.map((payload) => ({
      ...payload,
      tokenId: constants.MaxUint256,
    }));
    return this.generateBatchFromTokenIds(payloads);
  }

  /**
   * Generate a batch of signatures that can be used to mint new NFTs or additionally supply to existing NFTs dynamically.
   *
   * @remarks See {@link Erc1155SignatureMintable.generateFromTokenId}
   *
   * @param payloadsToSign - the payloads to sign with tokenIds specified
   * @returns An array of payloads and signatures
   * @twfeature ERC1155SignatureMintable
   */
  public async generateBatchFromTokenIds(
    payloadsToSign: PayloadToSign1155WithTokenId[],
  ): Promise<SignedPayload1155[]> {
    const signer = this.contractWrapper.getSigner();
    invariant(signer, "No signer available");

    await this.roles?.verify(["minter"], await signer.getAddress());

    const parsedRequests: FilledSignaturePayload1155WithTokenId[] =
      await Promise.all(
        payloadsToSign.map((m) =>
          Signature1155PayloadInputWithTokenId.parseAsync(m),
        ),
      );

    const metadatas = parsedRequests.map((r) => r.metadata);

    const [uris, chainId, contractInfo] = await Promise.all([
      uploadOrExtractURIs(metadatas, this.storage),
      this.contractWrapper.getChainID(),
      getPrebuiltInfo(
        this.contractWrapper.address,
        this.contractWrapper.getProvider(),
      ),
    ]);

    const finalPayloads = await Promise.all(
      parsedRequests.map((m, i) =>
        Signature1155PayloadOutput.parseAsync({
          ...m,
          uri: uris[i],
        }),
      ),
    );
    const contractStructs = await Promise.all(
      finalPayloads.map((finalPayload) =>
        this.mapPayloadToContractStruct(finalPayload),
      ),
    );

    const isLegacyContract = contractInfo?.type === "TokenERC1155";
    const signatures = await Promise.all(
      contractStructs.map((contractStruct) =>
        this.contractWrapper.signTypedData(
          signer,
          {
            name: isLegacyContract ? "TokenERC1155" : "SignatureMintERC1155",
            version: "1",
            chainId,
            verifyingContract: this.contractWrapper.address,
          },
          { MintRequest: MintRequest1155 }, // TYPEHASH
          contractStruct,
        ),
      ),
    );
    return signatures.map((signature, index) => ({
      payload: finalPayloads[index],
      signature: signature.toString(),
    }));
  }

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  /**
   * Maps a payload to the format expected by the contract
   *
   * @internal
   *
   * @param mintRequest - The payload to map.
   * @returns - The mapped payload.
   */
  private async mapPayloadToContractStruct(
    mintRequest: PayloadWithUri1155,
  ): Promise<ITokenERC1155.MintRequestStructOutput> {
    const normalizedPricePerToken = await normalizePriceValue(
      this.contractWrapper.getProvider(),
      mintRequest.price,
      mintRequest.currencyAddress,
    );
    return {
      to: mintRequest.to,
      tokenId: mintRequest.tokenId,
      uri: mintRequest.uri,
      quantity: mintRequest.quantity,
      pricePerToken: normalizedPricePerToken,
      currency: mintRequest.currencyAddress,
      validityStartTimestamp: mintRequest.mintStartTime,
      validityEndTimestamp: mintRequest.mintEndTime,
      uid: mintRequest.uid,
      royaltyRecipient: mintRequest.royaltyRecipient,
      royaltyBps: mintRequest.royaltyBps,
      primarySaleRecipient: mintRequest.primarySaleRecipient,
    } as ITokenERC1155.MintRequestStructOutput;
  }
}
