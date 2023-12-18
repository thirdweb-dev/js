import type {
  ISignatureMintERC721,
  ITokenERC721,
  Multicall,
  SignatureMintERC721,
  TokenERC721,
} from "@thirdweb-dev/contracts-js";
import { TokensMintedWithSignatureEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/SignatureDrop";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, type providers } from "ethers";
import invariant from "tiny-invariant";
import { normalizePriceValue } from "../../common/currency/normalizePriceValue";
import { setErc20Allowance } from "../../common/currency/setErc20Allowance";
import { detectContractFeature } from "../../common/feature-detection/detectContractFeature";
import { hasFunction } from "../../common/feature-detection/hasFunction";
import { uploadOrExtractURIs } from "../../common/nft";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_NFT_SIGNATURE_MINTABLE_V2 } from "../../constants/erc721-features";
import {
  MintRequest721,
  MintRequest721withQuantity,
  PayloadToSign721withQuantity,
  PayloadWithUri721withQuantity,
  Signature721WithQuantityInput,
  Signature721WithQuantityOutput,
  SignedPayload721WithQuantitySignature,
} from "../../schema/contracts/common/signature";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResultWithId } from "../types";
import { ContractEncoder } from "./contract-encoder";
import { ContractWrapper } from "./internal/contract-wrapper";
import { Transaction } from "./transactions";

/**
 * Enables generating dynamic ERC721 NFTs with rules and an associated signature, which can then be minted by anyone securely
 * @public
 */
export class Erc721WithQuantitySignatureMintable implements DetectableFeature {
  featureName = FEATURE_NFT_SIGNATURE_MINTABLE_V2.name;

  private contractWrapper: ContractWrapper<SignatureMintERC721 | TokenERC721>;

  private storage: ThirdwebStorage;

  constructor(
    contractWrapper: ContractWrapper<SignatureMintERC721 | TokenERC721>,
    storage: ThirdwebStorage,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
  }

  /**
   * Mint a dynamically generated NFT
   *
   * @remarks Mint a dynamic NFT with a previously generated signature.
   *
   * @example
   * ```javascript
   * // see how to craft a payload to sign in the `generate()` documentation
   * const signedPayload = contract.erc721.signature.generate(payload);
   *
   * // now anyone can mint the NFT
   * const tx = contract.erc721.signature.mint(signedPayload);
   * const receipt = tx.receipt; // the mint transaction receipt
   * const mintedId = tx.id; // the id of the NFT minted
   * ```
   * @param signedPayload - the previously generated payload and signature with {@link Erc721WithQuantitySignatureMintable.generate}
   * @twfeature ERC721SignatureMint
   */
  mint = /* @__PURE__ */ buildTransactionFunction(
    async (
      signedPayload: SignedPayload721WithQuantitySignature,
    ): Promise<Transaction<TransactionResultWithId>> => {
      const mintRequest = signedPayload.payload;
      const signature = signedPayload.signature;

      const overrides = await this.contractWrapper.getCallOverrides();
      const parse = (receipt: providers.TransactionReceipt) => {
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
      };

      if (await this.isLegacyNFTContract()) {
        const message = await this.mapLegacyPayloadToContractStruct(
          mintRequest,
        );
        const price = message.price;

        // TODO: Transaction Sequence Pattern
        await setErc20Allowance(
          this.contractWrapper,
          price,
          mintRequest.currencyAddress,
          overrides,
        );

        return Transaction.fromContractWrapper({
          contractWrapper: this.contractWrapper,
          method: "mintWithSignature",
          args: [message, signature],
          overrides,
          parse,
        });
      } else {
        const message = await this.mapPayloadToContractStruct(mintRequest);
        const price = message.pricePerToken.mul(message.quantity);

        // TODO: Transaction Sequence Pattern
        await setErc20Allowance(
          this.contractWrapper,
          price,
          mintRequest.currencyAddress,
          overrides,
        );

        return Transaction.fromContractWrapper({
          contractWrapper: this.contractWrapper,
          method: "mintWithSignature",
          args: [message, signature],
          overrides,
          parse,
        });
      }
    },
  );

  /**
   * Mint any number of dynamically generated NFT at once
   * @remarks Mint multiple dynamic NFTs in one transaction. Note that this is only possible for free mints (cannot batch mints with a price attached to it for security reasons)
   * @param signedPayloads - the array of signed payloads to mint
   * @twfeature ERC721SignatureMint
   */
  mintBatch = /* @__PURE__ */ buildTransactionFunction(
    async (
      signedPayloads: SignedPayload721WithQuantitySignature[],
    ): Promise<Transaction<TransactionResultWithId[]>> => {
      const isLegacyNFTContract = await this.isLegacyNFTContract();
      const contractPayloads = (
        await Promise.all(
          signedPayloads.map((s) =>
            isLegacyNFTContract
              ? this.mapLegacyPayloadToContractStruct(s.payload)
              : this.mapPayloadToContractStruct(s.payload),
          ),
        )
      ).map((message, index) => {
        const s = signedPayloads[index];
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
        if (isLegacyNFTContract) {
          return contractEncoder.encode("mintWithSignature", [
            p.message as ITokenERC721.MintRequestStructOutput,
            p.signature,
          ]);
        } else {
          return contractEncoder.encode("mintWithSignature", [
            p.message as ISignatureMintERC721.MintRequestStructOutput,
            p.signature,
          ]);
        }
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
        throw new Error("Multicall not available on this contract!");
      }
    },
  );

  /**
   * Verify that a payload is correctly signed
   * @param signedPayload - the payload to verify
   * @twfeature ERC721SignatureMint
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
   * const signedPayload = await contract.erc721.signature.generate(payload);
   * // Now you can verify if the signed payload is valid
   * const isValid = await contract.erc721.signature.verify(signedPayload);
   * ```
   */
  public async verify(
    signedPayload: SignedPayload721WithQuantitySignature,
  ): Promise<boolean> {
    const isLegacyNFTContract = await this.isLegacyNFTContract();

    const mintRequest = signedPayload.payload;
    const signature = signedPayload.signature;

    let message;
    let verification: [boolean, string];

    if (isLegacyNFTContract) {
      message = await this.mapLegacyPayloadToContractStruct(mintRequest);
      verification = await this.contractWrapper.read("verify", [
        message,
        signature,
      ]);
    } else {
      message = await this.mapPayloadToContractStruct(mintRequest);
      verification = await this.contractWrapper.read("verify", [
        message,
        signature,
      ]);
    }

    return verification[0];
  }

  /**
   * Generate a signature that can be used to mint a dynamic NFT
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
   * const signedPayload = await contract.erc721.signature.generate(payload);
   * // now anyone can use these to mint the NFT using `contract.erc721.signature.mint(signedPayload)`
   * ```
   * @param mintRequest - the payload to sign
   * @returns The signed payload and the corresponding signature
   * @twfeature ERC721SignatureMint
   */
  public async generate(
    mintRequest: PayloadToSign721withQuantity,
  ): Promise<SignedPayload721WithQuantitySignature> {
    return (await this.generateBatch([mintRequest]))[0];
  }

  /**
   * Genrate a batch of signatures that can be used to mint many dynamic NFTs.
   *
   * @remarks See {@link Erc721WithQuantitySignatureMintable.generate}
   *
   * @param payloadsToSign - the payloads to sign
   * @returns An array of payloads and signatures
   * @twfeature ERC721SignatureMint
   */
  public async generateBatch(
    payloadsToSign: PayloadToSign721withQuantity[],
  ): Promise<SignedPayload721WithQuantitySignature[]> {
    const isLegacyNFTContract = await this.isLegacyNFTContract();

    const parsedRequests = await Promise.all(
      payloadsToSign.map((m) => Signature721WithQuantityInput.parseAsync(m)),
    );

    const metadatas = parsedRequests.map((r) => r.metadata);
    const uris = await uploadOrExtractURIs(metadatas, this.storage);

    const chainId = await this.contractWrapper.getChainID();
    const signer = this.contractWrapper.getSigner();
    invariant(signer, "No signer available");

    return await Promise.all(
      parsedRequests.map(async (m, i) => {
        const uri = uris[i];
        const finalPayload = await Signature721WithQuantityOutput.parseAsync({
          ...m,
          uri,
        });
        let signature;

        if (isLegacyNFTContract) {
          signature = await this.contractWrapper.signTypedData(
            signer,
            {
              name: "TokenERC721",
              version: "1",
              chainId,
              verifyingContract: this.contractWrapper.address,
            },
            { MintRequest: MintRequest721 },
            await this.mapLegacyPayloadToContractStruct(finalPayload),
          );
        } else {
          signature = await this.contractWrapper.signTypedData(
            signer,
            {
              name: "SignatureMintERC721",
              version: "1",
              chainId,
              verifyingContract: await this.contractWrapper.address,
            },
            { MintRequest: MintRequest721withQuantity }, // TYPEHASH
            await this.mapPayloadToContractStruct(finalPayload),
          );
        }
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
    mintRequest: PayloadWithUri721withQuantity,
  ): Promise<ISignatureMintERC721.MintRequestStructOutput> {
    const normalizedPricePerToken = await normalizePriceValue(
      this.contractWrapper.getProvider(),
      mintRequest.price,
      mintRequest.currencyAddress,
    );
    return {
      to: mintRequest.to,
      royaltyRecipient: mintRequest.royaltyRecipient,
      royaltyBps: mintRequest.royaltyBps,
      primarySaleRecipient: mintRequest.primarySaleRecipient,
      uri: mintRequest.uri,
      quantity: mintRequest.quantity,
      pricePerToken: normalizedPricePerToken,
      currency: mintRequest.currencyAddress,
      validityStartTimestamp: mintRequest.mintStartTime,
      validityEndTimestamp: mintRequest.mintEndTime,
      uid: mintRequest.uid,
    } as ISignatureMintERC721.MintRequestStructOutput;
  }

  private async mapLegacyPayloadToContractStruct(
    mintRequest: PayloadWithUri721withQuantity,
  ): Promise<ITokenERC721.MintRequestStructOutput> {
    const normalizedPricePerToken = await normalizePriceValue(
      this.contractWrapper.getProvider(),
      mintRequest.price,
      mintRequest.currencyAddress,
    );
    return {
      to: mintRequest.to,
      price: normalizedPricePerToken,
      uri: mintRequest.uri,
      currency: mintRequest.currencyAddress,
      validityEndTimestamp: mintRequest.mintEndTime,
      validityStartTimestamp: mintRequest.mintStartTime,
      uid: mintRequest.uid,
      royaltyRecipient: mintRequest.royaltyRecipient,
      royaltyBps: mintRequest.royaltyBps,
      primarySaleRecipient: mintRequest.primarySaleRecipient,
    } as ITokenERC721.MintRequestStructOutput;
  }

  private async isLegacyNFTContract() {
    return detectContractFeature<ISignatureMintERC721>(
      this.contractWrapper,
      "ERC721SignatureMintV1",
    );
  }
}
