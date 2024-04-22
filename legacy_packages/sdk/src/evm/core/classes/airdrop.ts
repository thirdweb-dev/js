import {
  Airdrop,
  AirdropEvent,
} from "@thirdweb-dev/contracts-js/dist/declarations/src/Airdrop";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_AIRDROP } from "../../constants/thirdweb-features";
import { Address } from "../../schema/shared/Address";
import {
  Airdrop1155Content,
  Airdrop20Content,
  Airdrop721Content,
  AirdropContentERC1155,
  AirdropContentERC20,
  AirdropContentERC721,
  AirdropPayloadToSign1155,
  AirdropPayloadToSign20,
  AirdropPayloadToSign721,
  AirdropRequestERC1155,
  AirdropRequestERC20,
  AirdropRequestERC721,
  SignedAirdropPayload1155,
  SignedAirdropPayload20,
  SignedAirdropPayload721,
} from "../../types/airdrop/airdrop";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./internal/contract-wrapper";
import { Transaction } from "./transactions";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { ContractEncoder } from "./contract-encoder";
import {
  AirdropSignature1155PayloadInput,
  AirdropSignature1155PayloadOutput,
  AirdropSignature20PayloadInput,
  AirdropSignature20PayloadOutput,
  AirdropSignature721PayloadInput,
  AirdropSignature721PayloadOutput,
} from "../../schema/contracts/common/airdrop";
import invariant from "tiny-invariant";

/**
 * @public
 */
export class AirdropExtension<T extends Airdrop> implements DetectableFeature {
  featureName = FEATURE_AIRDROP.name;
  protected contractWrapper: ContractWrapper<Airdrop>;

  constructor(contractWrapper: ContractWrapper<Airdrop>) {
    this.contractWrapper = contractWrapper;
  }

  /**
   * @internal
   */
  getAddress(): Address {
    return this.contractWrapper.address;
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Perform airdrop of ERC20 tokens
   *
   * @example
   * ```javascript
   * // Airdrop content array, with recipients and token amounts
   * const contents = [
   *      {
   *        recipient: "0xabc...", // first recipient address
   *        amount: "10" // number of tokens in wei units
   *      },
   *      {
   *        recipient: "0x123...", // second recipient address
   *        amount: "20" // number of tokens in wei units
   *      }
   *   ]
   *
   * const tokenAddress = "0x..." // Address of the ERC20 token being airdropped
   *
   * const output = await contract.airdrop20.drop(tokenAddress, tokenOwner, contents);
   *
   * // the `output` return value above contains:
   * //     - count of successful and failed drops
   * //     - array containing failed drops, if any
   *
   * ```
   * @param tokenAddress - Address of the ERC20 token being airdropped
   * @param contents - Array of airdrop contents
   *
   * @twfeature Airdrop
   */
  dropERC20 = /* @__PURE__ */ buildTransactionFunction(
    async (
      tokenAddress: string,
      contents: Airdrop20Content[],
    ): Promise<Transaction<Promise<TransactionReceipt>>> => {
      const args = tokenAddress;
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "airdropERC20",
        args: [tokenAddress, contents],
        parse: async (receipt) => {
          const events = this.contractWrapper.parseLogs<AirdropEvent>(
            "Airdrop",
            receipt.logs,
          );

          if (events.length < 1) {
            throw new Error("No Airdrop event found");
          }

          return receipt;
        },
      });
    },
  );

  /**
   * Perform airdrop of ERC721 tokens
   *
   * @example
   * ```javascript
   * // Airdrop content array, with recipients and tokenIds
   * const contents = [
   *      {
   *        recipient: "0xabc...", // first recipient address
   *        tokenId: 0
   *      },
   *      {
   *        recipient: "0x123...", // second recipient address
   *        tokenId: 2
   *      }
   *   ]
   *
   * const tokenAddress = "0x..." // Address of the ERC721 token being airdropped
   *
   * const output = await contract.airdrop721.drop(tokenAddress, tokenOwner, contents);
   *
   * // the `output` return value above contains:
   * //     - count of successful and failed drops
   * //     - array containing failed drops, if any
   *
   * ```
   * @param tokenAddress - Address of the ERC721 token being airdropped
   * @param contents - Array of recipients and tokenIds to airdrop
   *
   * @twfeature Airdrop
   */
  dropERC721 = /* @__PURE__ */ buildTransactionFunction(
    async (
      tokenAddress: string,
      contents: Airdrop721Content[],
    ): Promise<Transaction<Promise<TransactionReceipt>>> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "airdropERC721",
        args: [tokenAddress, contents],
        parse: async (receipt) => {
          const events = this.contractWrapper.parseLogs<AirdropEvent>(
            "Airdrop",
            receipt.logs,
          );

          if (events.length < 1) {
            throw new Error("No Airdrop event found");
          }

          return receipt;
        },
      });
    },
  );

  /**
   * Perform airdrop of ERC1155 tokens
   *
   * @example
   * ```javascript
   * // Airdrop content array, with recipients and tokenIds
   * const contents = [
   *      {
   *        recipient: "0xabc...", // first recipient address
   *        tokenId: 0,
   *        amount: "10" // number of tokens
   *      },
   *      {
   *        recipient: "0x123...", // second recipient address
   *        tokenId: 0
   *        amount: "20" // number of tokens
   *      }
   *   ]
   *
   * const tokenAddress = "0x..." // Address of the ERC1155 token being airdropped
   *
   * const output = await contract.airdrop1155.drop(tokenAddress, tokenOwner, contents);
   *
   * // the `output` return value above contains:
   * //     - count of successful and failed drops
   * //     - array containing failed drops, if any
   *
   * ```
   * @param tokenAddress - Address of the ERC1155 token being airdropped
   * @param contents - Array of recipients and tokenIds to airdrop
   *
   * @twfeature Airdrop
   */
  dropERC1155 = /* @__PURE__ */ buildTransactionFunction(
    async (
      tokenAddress: string,
      contents: Airdrop1155Content[],
    ): Promise<Transaction<Promise<TransactionReceipt>>> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "airdropERC1155",
        args: [tokenAddress, contents],
        parse: async (receipt) => {
          const events = this.contractWrapper.parseLogs<AirdropEvent>(
            "Airdrop",
            receipt.logs,
          );

          if (events.length < 1) {
            throw new Error("No Airdrop event found");
          }

          return receipt;
        },
      });
    },
  );

  dropWithSignatureERC20 = /* @__PURE__ */ buildTransactionFunction(
    async (signedPayload: SignedAirdropPayload20) => {
      const message = signedPayload.payload;
      const signature = signedPayload.signature;
      const contractEncoder = new ContractEncoder(this.contractWrapper);

      const encoded = contractEncoder.encode("airdropERC20WithSignature", [
        message,
        signature,
      ]);

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "airdropERC20WithSignature",
        args: [encoded],
      });
    },
  );

  dropWithSignatureERC721 = /* @__PURE__ */ buildTransactionFunction(
    async (signedPayload: SignedAirdropPayload721) => {
      const message = signedPayload.payload;
      const signature = signedPayload.signature;
      const contractEncoder = new ContractEncoder(this.contractWrapper);

      const encoded = contractEncoder.encode("airdropERC721WithSignature", [
        message,
        signature,
      ]);

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "airdropERC721WithSignature",
        args: [encoded],
      });
    },
  );

  dropWithSignatureERC1155 = /* @__PURE__ */ buildTransactionFunction(
    async (signedPayload: SignedAirdropPayload1155) => {
      const message = signedPayload.payload;
      const signature = signedPayload.signature;
      const contractEncoder = new ContractEncoder(this.contractWrapper);

      const encoded = contractEncoder.encode("airdropERC1155WithSignature", [
        message,
        signature,
      ]);

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "airdropERC1155WithSignature",
        args: [encoded],
      });
    },
  );

  public async generateSignature20(
    payloadToSign: AirdropPayloadToSign20,
  ): Promise<SignedAirdropPayload20> {
    const [chainId, parsed] = await Promise.all([
      this.contractWrapper.getChainID(),
      AirdropSignature20PayloadInput.parseAsync(payloadToSign),
    ]);

    const signer = this.contractWrapper.getSigner();
    invariant(signer, "No signer available");

    const finalPayload =
      await AirdropSignature20PayloadOutput.parseAsync(parsed);
    const signature = await this.contractWrapper.signTypedData(
      signer,
      {
        name: "Airdrop",
        version: "1",
        chainId,
        verifyingContract: this.contractWrapper.address,
      },
      { AirdropRequestERC20, AirdropContentERC20 },
      finalPayload,
    );

    return {
      payload: finalPayload,
      signature: signature.toString(),
    };
  }

  public async generateSignature721(
    payloadToSign: AirdropPayloadToSign721,
  ): Promise<SignedAirdropPayload721> {
    const [chainId, parsed] = await Promise.all([
      this.contractWrapper.getChainID(),
      AirdropSignature721PayloadInput.parseAsync(payloadToSign),
    ]);

    const signer = this.contractWrapper.getSigner();
    invariant(signer, "No signer available");

    const finalPayload =
      await AirdropSignature721PayloadOutput.parseAsync(parsed);
    const signature = await this.contractWrapper.signTypedData(
      signer,
      {
        name: "Airdrop",
        version: "1",
        chainId,
        verifyingContract: this.contractWrapper.address,
      },
      { AirdropRequestERC721, AirdropContentERC721 },
      finalPayload,
    );

    return {
      payload: finalPayload,
      signature: signature.toString(),
    };
  }

  public async generateSignature1155(
    payloadToSign: AirdropPayloadToSign1155,
  ): Promise<SignedAirdropPayload1155> {
    const [chainId, parsed] = await Promise.all([
      this.contractWrapper.getChainID(),
      AirdropSignature1155PayloadInput.parseAsync(payloadToSign),
    ]);

    const signer = this.contractWrapper.getSigner();
    invariant(signer, "No signer available");

    const finalPayload =
      await AirdropSignature1155PayloadOutput.parseAsync(parsed);
    const signature = await this.contractWrapper.signTypedData(
      signer,
      {
        name: "Airdrop",
        version: "1",
        chainId,
        verifyingContract: this.contractWrapper.address,
      },
      { AirdropRequestERC1155, AirdropContentERC1155 },
      finalPayload,
    );

    return {
      payload: finalPayload,
      signature: signature.toString(),
    };
  }
}
