import type { Zora_IERC721Drop } from "@thirdweb-dev/contracts-js";
import {
  IERC721Drop,
  SaleEvent,
} from "@thirdweb-dev/contracts-js/dist/declarations/src/Zora_IERC721Drop";
import { BigNumber, BigNumberish } from "ethers";
import { NFT } from "../../../../../core/schema/nft";
import { toWei } from "../../../../common/currency/toWei";
import { buildTransactionFunction } from "../../../../common/transactions";
import { FEATURE_NFT_CLAIM_ZORA } from "../../../../constants/erc721-features";
import { AddressOrEns } from "../../../../schema/shared/AddressOrEnsSchema";
import type { ClaimOptions } from "../../../../types/claim-conditions/claim-conditions";
import { DetectableFeature } from "../../../interfaces/DetectableFeature";
import { TransactionResultWithId } from "../../../types";
import { ContractWrapper } from "../contract-wrapper";
import type { Erc721 } from "../../erc-721";
import { Transaction } from "../../transactions";

/**
 * Claim ERC721 NFTs from a Zora Drop
 * @remarks Purchase NFTs on a Zora Drop
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.erc721.claim(tokenId, quantity);
 * ```
 */
export class Erc721ClaimableZora implements DetectableFeature {
  featureName = FEATURE_NFT_CLAIM_ZORA.name;

  private erc721: Erc721;
  private contractWrapper: ContractWrapper<Zora_IERC721Drop>;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<Zora_IERC721Drop>,
  ) {
    this.erc721 = erc721;
    this.contractWrapper = contractWrapper;
  }

  /**
   * Claim NFT
   *
   * @remarks Let the specified wallet claim NFTs.
   *
   * @example
   * ```javascript
   * const address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs
   * const quantity = 1; // how many NFTs you want to claim
   *
   * const tx = await contract.erc721.claimTo(address, quantity);
   * const receipt = tx[0].receipt; // the transaction receipt
   * ```
   *
   * @param destinationAddress - Address you want to send the token to, needs to be the connected wallet address
   * @param quantity - Quantity of the tokens you want to claim
   * @param options - Not applicable
   *
   * @returns  Receipt for the transaction
   */
  to = /* @__PURE__ */ buildTransactionFunction(
    async (
      destinationAddress: AddressOrEns,
      quantity: BigNumberish,
      options?: ClaimOptions,
    ): Promise<Transaction<TransactionResultWithId<NFT>[]>> => {
      // TODO validation on destinationAddr / options
      const signerAddress = await this.contractWrapper
        .getSigner()
        ?.getAddress();
      if (destinationAddress !== signerAddress) {
        throw new Error(
          "Zora Drop: Destination address must match connected wallet address",
        );
      }
      if (options?.pricePerToken) {
        throw new Error(
          "Zora Drop: Custom pricePerToken is not supported. Price is automatically calculated",
        );
      }
      const saleDetails = await this.getSaleDetails();
      const price = saleDetails.publicSalePrice;
      const zoraFee = toWei("0.000777");
      const totalPrice = BigNumber.from(price).add(zoraFee).mul(quantity);

      const tx = Transaction.fromContractWrapper<
        Zora_IERC721Drop,
        TransactionResultWithId<NFT>[]
      >({
        contractWrapper: this.contractWrapper,
        method: "purchase",
        args: [quantity],
        overrides: {
          value: totalPrice,
        },
      });
      tx.setParse((receipt) => {
        const event = this.contractWrapper.parseLogs<SaleEvent>(
          "Sale",
          receipt?.logs,
        );
        const startingIndex: BigNumber = event[0].args.firstPurchasedTokenId;
        const endingIndex = startingIndex.add(quantity);
        const results: TransactionResultWithId<NFT>[] = [];
        for (let id = startingIndex; id.lt(endingIndex); id = id.add(1)) {
          results.push({
            id,
            receipt,
            data: () => this.erc721.get(id),
          });
        }
        return results;
      });
      return tx;
    },
  );

  public async getSaleDetails(): Promise<IERC721Drop.SaleDetailsStructOutput> {
    return this.contractWrapper.read("saleDetails", []);
  }
}
