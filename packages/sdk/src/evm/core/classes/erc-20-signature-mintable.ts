import type { ITokenERC20, TokenERC20 } from "@thirdweb-dev/contracts-js";
import { BigNumber, utils } from "ethers";
import invariant from "tiny-invariant";
import { normalizePriceValue } from "../../common/currency/normalizePriceValue";
import { setErc20Allowance } from "../../common/currency/setErc20Allowance";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_TOKEN_SIGNATURE_MINTABLE } from "../../constants/erc20-features";
import type { TokenInitializer } from "../../contracts";
import {
  FilledSignaturePayload20,
  MintRequest20,
  PayloadToSign20,
  PayloadWithUri20,
  Signature20PayloadInput,
  Signature20PayloadOutput,
  SignedPayload20,
} from "../../schema/contracts/common/signature";
import type { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractEncoder } from "./contract-encoder";
import { ContractRoles } from "./contract-roles";
import type { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";

/**
 * Enables generating ERC20 Tokens with rules and an associated signature, which can then be minted by anyone securely
 * @public
 */
// TODO consolidate into a single class

export class Erc20SignatureMintable implements DetectableFeature {
  featureName = FEATURE_TOKEN_SIGNATURE_MINTABLE.name;

  private contractWrapper: ContractWrapper<TokenERC20>;
  private roles:
    | ContractRoles<TokenERC20, (typeof TokenInitializer.roles)[number]>
    | undefined;

  constructor(
    contractWrapper: ContractWrapper<TokenERC20>,
    roles?: ContractRoles<TokenERC20, (typeof TokenInitializer.roles)[number]>,
  ) {
    this.contractWrapper = contractWrapper;
    this.roles = roles;
  }

  /**
   * Mint tokens from a signature
   *
   * @remarks Mint a certain amount of tokens from a previously generated signature.
   *
   * @example
   * ```javascript
   * // see how to craft a payload to sign in the `generate()` documentation
   * const signedPayload = contract.erc20.signature.generate(payload);
   *
   * // Use the signed payload to mint the tokens
   * const tx = contract.erc20.signature.mint(signedPayload);
   * ```
   * @param signedPayload - the previously generated payload and signature with {@link Erc20SignatureMintable.generate}
   * @twfeature ERC20SignatureMintable
   */
  mint = /* @__PURE__ */ buildTransactionFunction(
    async (signedPayload: SignedPayload20) => {
      const mintRequest = signedPayload.payload;
      const signature = signedPayload.signature;
      const [message, overrides] = await Promise.all([
        this.mapPayloadToContractStruct(mintRequest),
        this.contractWrapper.getCallOverrides(),
      ]);
      // TODO: Transaction Sequence Pattern
      await setErc20Allowance(
        this.contractWrapper,
        BigNumber.from(message.price),
        mintRequest.currencyAddress,
        overrides,
      );
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "mintWithSignature",
        args: [message, signature],
        overrides,
      });
    },
  );

  /**
   * Mint any number of generated tokens signatures at once
   * @remarks Mint multiple token signatures in one transaction. Note that this is only possible for free mints (cannot batch mints with a price attached to it for security reasons)
   * @param signedPayloads - the array of signed payloads to mint
   * @twfeature ERC20SignatureMintable
   */
  mintBatch = /* @__PURE__ */ buildTransactionFunction(
    async (signedPayloads: SignedPayload20[]) => {
      const messages = await Promise.all(
        signedPayloads.map((s) => this.mapPayloadToContractStruct(s.payload)),
      );
      const contractPayloads = signedPayloads.map((s, index) => {
        const message = messages[index];
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
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "multicall",
        args: [encoded],
      });
    },
  );

  /**
   * Verify that a payload is correctly signed
   * @param signedPayload - the payload to verify
   * @twfeature ERC20SignatureMintable
   *
   * ```javascript
   * const startTime = new Date();
   * const endTime = new Date(Date.now() + 60 * 60 * 24 * 1000);
   * const payload = {
   *   quantity: 4.2, // The quantity of tokens to be minted
   *   to: {{wallet_address}}, // Who will receive the tokens
   *   price: 0.5, // the price to pay for minting those tokens
   *   currencyAddress: NATIVE_TOKEN_ADDRESS, // the currency to pay with
   *   mintStartTime: startTime, // can mint anytime from now
   *   mintEndTime: endTime, // to 24h from now,
   *   primarySaleRecipient: "0x...", // custom sale recipient for this token mint
   * };
   *
   * const signedPayload = await contract.erc20.signature.generate(payload);
   * // Now you can verify if the signed payload is valid
   * const isValid = await contract.erc20.signature.verify(signedPayload);
   * ```
   */
  public async verify(signedPayload: SignedPayload20): Promise<boolean> {
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
   * Generate a signature that can be used to mint a certain amount of tokens
   *
   * @remarks Takes in a quantity of tokens, some conditions for how it can be minted and signs it with your private key. The generated signature can then be used to mint those tokens using the exact payload and signature generated.
   *
   * @example
   * ```javascript
   * const startTime = new Date();
   * const endTime = new Date(Date.now() + 60 * 60 * 24 * 1000);
   * const payload = {
   *   quantity: 4.2, // The quantity of tokens to be minted
   *   to: {{wallet_address}}, // Who will receive the tokens
   *   price: 0.5, // the price to pay for minting those tokens
   *   currencyAddress: NATIVE_TOKEN_ADDRESS, // the currency to pay with
   *   mintStartTime: startTime, // can mint anytime from now
   *   mintEndTime: endTime, // to 24h from now,
   *   primarySaleRecipient: "0x...", // custom sale recipient for this token mint
   * };
   *
   * const signedPayload = await contract.erc20.signature.generate(payload);
   * // now anyone can use these to mint the NFT using `contract.erc20.signature.mint(signedPayload)`
   * ```
   * @param mintRequest - the payload to sign
   * @returns the signed payload and the corresponding signature
   * @twfeature ERC20SignatureMintable
   */
  public async generate(
    mintRequest: PayloadToSign20,
  ): Promise<SignedPayload20> {
    return (await this.generateBatch([mintRequest]))[0];
  }

  /**
   * Generate a batch of signatures that can be used to mint many token signatures.
   *
   * @remarks See {@link Erc20SignatureMintable.generate}
   *
   * @param payloadsToSign - the payloads to sign
   * @returns an array of payloads and signatures
   * @twfeature ERC20SignatureMintable
   */
  public async generateBatch(
    payloadsToSign: PayloadToSign20[],
  ): Promise<SignedPayload20[]> {
    await this.roles?.verify(
      ["minter"],
      await this.contractWrapper.getSignerAddress(),
    );

    const parsedRequests: FilledSignaturePayload20[] = await Promise.all(
      payloadsToSign.map((m) => Signature20PayloadInput.parseAsync(m)),
    );

    const chainId = await this.contractWrapper.getChainID();
    const signer = this.contractWrapper.getSigner();
    invariant(signer, "No signer available");

    // ERC20Permit (EIP-712) spec differs from signature mint 721, 1155.
    const name = await this.contractWrapper.read("name", []);

    return await Promise.all(
      parsedRequests.map(async (m) => {
        const finalPayload = await Signature20PayloadOutput.parseAsync(m);
        const signature = await this.contractWrapper.signTypedData(
          signer,
          {
            name,
            version: "1",
            chainId,
            verifyingContract: this.contractWrapper.address,
          },
          { MintRequest: MintRequest20 },
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
    mintRequest: PayloadWithUri20,
  ): Promise<ITokenERC20.MintRequestStructOutput> {
    const normalizedPrice = await normalizePriceValue(
      this.contractWrapper.getProvider(),
      mintRequest.price,
      mintRequest.currencyAddress,
    );
    const amountWithDecimals = utils.parseUnits(
      mintRequest.quantity,
      await this.contractWrapper.read("decimals", []),
    );
    return {
      to: mintRequest.to,
      primarySaleRecipient: mintRequest.primarySaleRecipient,
      quantity: amountWithDecimals,
      price: normalizedPrice,
      currency: mintRequest.currencyAddress,
      validityEndTimestamp: mintRequest.mintEndTime,
      validityStartTimestamp: mintRequest.mintStartTime,
      uid: mintRequest.uid,
    } as ITokenERC20.MintRequestStructOutput;
  }
}
