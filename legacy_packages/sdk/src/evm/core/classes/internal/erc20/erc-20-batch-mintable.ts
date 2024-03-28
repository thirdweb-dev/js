import type { IMintableERC20, IMulticall } from "@thirdweb-dev/contracts-js";
import { resolveAddress } from "../../../../common/ens/resolveAddress";
import { buildTransactionFunction } from "../../../../common/transactions";
import { FEATURE_TOKEN_BATCH_MINTABLE } from "../../../../constants/erc20-features";
import type { TokenMintInput } from "../../../../schema/tokens/token";
import type { DetectableFeature } from "../../../interfaces/DetectableFeature";
import { ContractEncoder } from "../../contract-encoder";
import type { ContractWrapper } from "../contract-wrapper";
import type { Erc20 } from "../../erc-20";
import { Transaction } from "../../transactions";

/**
 * Mint Many ERC20 Tokens at once
 * @remarks Token batch minting functionality that handles unit parsing for you.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.token.mint.batch.to(walletAddress, [nftMetadata1, nftMetadata2, ...]);
 * ```
 * @internal
 */
export class Erc20BatchMintable implements DetectableFeature {
  featureName = FEATURE_TOKEN_BATCH_MINTABLE.name;
  private contractWrapper: ContractWrapper<IMintableERC20 & IMulticall>;
  private erc20: Erc20;

  constructor(
    erc20: Erc20,
    contractWrapper: ContractWrapper<IMintableERC20 & IMulticall>,
  ) {
    this.erc20 = erc20;
    this.contractWrapper = contractWrapper;
  }

  /**
   * Mint Tokens To Many Wallets
   *
   * @remarks Mint tokens to many wallets in one transaction.
   *
   * @example
   * ```javascript
   * // Data of the tokens you want to mint
   * const data = [
   *   {
   *     toAddress: "{{wallet_address}}", // Address to mint tokens to
   *     amount: 0.2, // How many tokens to mint to specified address
   *   },
   *  {
   *    toAddress: "0x...",
   *    amount: 1.4,
   *  }
   * ]
   *
   * await contract.token.mint.batch(data);
   * ```
   */
  to = /* @__PURE__ */ buildTransactionFunction(
    async (args: TokenMintInput[]) => {
      const contractEncoder = new ContractEncoder(this.contractWrapper);
      const _items = await Promise.all(
        args.map((item) =>
          Promise.all([
            resolveAddress(item.toAddress),
            this.erc20.normalizeAmount(item.amount),
          ]),
        ),
      );
      const encoded = _items.map(([address, amount]) =>
        contractEncoder.encode("mintTo", [address, amount]),
      );

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "multicall",
        args: [encoded],
      });
    },
  );
}
