import { normalizePriceValue, setErc20Allowance } from "../../common/currency";
import { uploadOrExtractURIs } from "../../common/nft";
import { FEATURE_EDITION_SIGNATURE_MINTABLE } from "../../constants/erc1155-features";
import type { NFTCollectionInitializer } from "../../contracts";
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
import { ContractRoles } from "./contract-roles";
import { ContractWrapper } from "./contract-wrapper";
import type { ITokenERC1155, TokenERC1155 } from "@thirdweb-dev/contracts-js";
import { TokensMintedWithSignatureEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/ITokenERC1155";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, ethers } from "ethers";
import invariant from "tiny-invariant";

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
    | ContractRoles<TokenERC1155, typeof NFTCollectionInitializer.roles[number]>
    | undefined;

  constructor(
    contractWrapper: ContractWrapper<BaseSignatureMintERC1155 | TokenERC1155>,
    storage: ThirdwebStorage,
    roles?: ContractRoles<
      TokenERC1155,
      typeof NFTCollectionInitializer.roles[number]
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
   * const signedPayload = contract.signature.generate(payload);
   *
   * // now anyone can mint the NFT
   * const tx = contract.signature.mint(signedPayload);
   * const receipt = tx.receipt; // the mint transaction receipt
   * const mintedId = tx.id; // the id of the NFT minted
   * ```
   * @param signedPayload - the previously generated payload and signature with {@link Erc1155SignatureMintable.generate}
   */
  public async mint(
    signedPayload: SignedPayload1155,
  ): Promise<TransactionResultWithId> {
    const mintRequest = signedPayload.payload;
    const signature = signedPayload.signature;
    const message = await this.mapPayloadToContractStruct(mintRequest);
    const overrides = await this.contractWrapper.getCallOverrides();
    await setErc20Allowance(
      this.contractWrapper,
      message.pricePerToken.mul(message.quantity),
      mintRequest.currencyAddress,
      overrides,
    );
    const receipt = await this.contractWrapper.sendTransaction(
      "mintWithSignature",
      [message, signature],
      overrides,
    );
    const t = this.contractWrapper.parseLogs<TokensMintedWithSignatureEvent>(
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
  }

  /**
   * Mint any number of dynamically generated NFT at once
   * @remarks Mint multiple dynamic NFTs in one transaction. Note that this is only possible for free mints (cannot batch mints with a price attached to it for security reasons)
   * @param signedPayloads - the array of signed payloads to mint
   */
  public async mintBatch(
    signedPayloads: SignedPayload1155[],
  ): Promise<TransactionResultWithId[]> {
    const contractPayloads = await Promise.all(
      signedPayloads.map(async (s) => {
        const message = await this.mapPayloadToContractStruct(s.payload);
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
      }),
    );
    const encoded = contractPayloads.map((p) => {
      return this.contractWrapper.readContract.interface.encodeFunctionData(
        "mintWithSignature",
        [p.message, p.signature],
      );
    });
    const receipt = await this.contractWrapper.multiCall(encoded);
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
  }

  /**
   * Verify that a payload is correctly signed
   * @param signedPayload - the payload to verify
   */
  public async verify(signedPayload: SignedPayload1155): Promise<boolean> {
    const mintRequest = signedPayload.payload;
    const signature = signedPayload.signature;
    const message = await this.mapPayloadToContractStruct(mintRequest);
    const verification: [boolean, string] =
      await this.contractWrapper.readContract.verify(message, signature);
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
   * const signedPayload = contract.signature.generate(payload);
   * // now anyone can use these to mint the NFT using `contract.signature.mint(signedPayload)`
   * ```
   * @param payloadToSign - the payload to sign
   * @returns the signed payload and the corresponding signature
   */
  public async generate(
    payloadToSign: PayloadToSign1155,
  ): Promise<SignedPayload1155> {
    const payload = {
      ...payloadToSign,
      tokenId: ethers.constants.MaxUint256,
    };
    return this.generateFromTokenId(payload);
  }

  /**
   * Generate a signature that can be used to mint additionaly supply to an existing NFT.
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
   *   tokenId: 0, // Instead of metadata, we specificy the token ID of the NFT to mint supply to
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
   * const signedPayload = contract.signature.generate(payload);
   * // now anyone can use these to mint the NFT using `contract.signature.mint(signedPayload)`
   * ```
   * @param payloadToSign - the payload to sign
   * @returns the signed payload and the corresponding signature
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
   * @returns an array of payloads and signatures
   */
  public async generateBatch(
    payloadsToSign: PayloadToSign1155[],
  ): Promise<SignedPayload1155[]> {
    const payloads = payloadsToSign.map((payload) => ({
      ...payload,
      tokenId: ethers.constants.MaxUint256,
    }));
    return this.generateBatchFromTokenIds(payloads);
  }

  /**
   * Genrate a batch of signatures that can be used to mint new NFTs or additionaly supply to existing NFTs dynamically.
   *
   * @remarks See {@link Erc1155SignatureMintable.generateFromTokenId}
   *
   * @param payloadsToSign - the payloads to sign with tokenIds specified
   * @returns an array of payloads and signatures
   */
  public async generateBatchFromTokenIds(
    payloadsToSign: PayloadToSign1155WithTokenId[],
  ): Promise<SignedPayload1155[]> {
    await this.roles?.verify(
      ["minter"],
      await this.contractWrapper.getSignerAddress(),
    );

    const parsedRequests: FilledSignaturePayload1155WithTokenId[] =
      payloadsToSign.map((m) => Signature1155PayloadInputWithTokenId.parse(m));

    const metadatas = parsedRequests.map((r) => r.metadata);
    const uris = await uploadOrExtractURIs(metadatas, this.storage);

    const chainId = await this.contractWrapper.getChainID();
    const signer = this.contractWrapper.getSigner();
    invariant(signer, "No signer available");

    return await Promise.all(
      parsedRequests.map(async (m, i) => {
        const uri = uris[i];
        const finalPayload = Signature1155PayloadOutput.parse({
          ...m,
          uri,
        });
        const signature = await this.contractWrapper.signTypedData(
          signer,
          {
            name: "TokenERC1155",
            version: "1",
            chainId,
            verifyingContract: this.contractWrapper.readContract.address,
          },
          { MintRequest: MintRequest1155 }, // TYPEHASH
          await this.mapPayloadToContractStruct(finalPayload),
        );
        return {
          payload: finalPayload,
          signature: signature.toString(),
        };
      }),
    );
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
