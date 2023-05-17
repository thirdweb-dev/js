import { NetworkInput } from "..";
import { AmountSchema } from "../../../core/schema/shared";
import { assertEnabled, detectContractFeature } from "../../common";
import {
  fetchCurrencyMetadata,
  fetchCurrencyValue,
} from "../../common/currency";
import { resolveAddress } from "../../common/ens";
import { buildTransactionFunction } from "../../common/transactions";
import {
  FEATURE_TOKEN,
  FEATURE_TOKEN_MINTABLE,
  FEATURE_TOKEN_BATCH_MINTABLE,
  FEATURE_TOKEN_BURNABLE,
  FEATURE_TOKEN_SIGNATURE_MINTABLE,
  FEATURE_TOKEN_CLAIM_CONDITIONS_V2,
} from "../../constants/erc20-features";
import { FEATURE_AIRDROP_TOKEN } from "../../constants/thirdweb-features";
import { Address, AddressOrEns, TokenMintInput } from "../../schema";
import { Currency, CurrencyValue, Amount, ClaimOptions } from "../../types";
import {
  BaseERC20,
  BaseSignatureMintERC20,
  BaseDropERC20,
} from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { UpdateableNetwork } from "../interfaces/contract";
import { ContractWrapper } from "./contract-wrapper";
import { Erc20Burnable } from "./erc-20-burnable";
import { Erc20Droppable } from "./erc-20-droppable";
import { Erc20Mintable } from "./erc-20-mintable";
import { Erc20SignatureMintable } from "./erc-20-signature-mintable";
import { Transaction } from "./transactions";
import type {
  TokenERC20,
  DropERC20,
  IMintableERC20,
  IBurnableERC20,
  IAirdropERC20,
  AirdropERC20,
} from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers, BigNumber, BigNumberish } from "ethers";

/**
 * Standard ERC20 Token functions
 * @remarks Basic functionality for a ERC20 contract that handles all unit transformation for you.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.erc20.transfer(walletAddress, amount);
 * ```
 * @public
 */
export class TokenAirdrop<T extends IAirdropERC20 | AirdropERC20>
  implements UpdateableNetwork, DetectableFeature
{
  featureName = FEATURE_AIRDROP_TOKEN.name;
  protected contractWrapper: ContractWrapper<T>;
  protected storage: ThirdwebStorage;

  private _chainId: number;
  get chainId() {
    return this._chainId;
  }

  constructor(
    contractWrapper: ContractWrapper<T>,
    storage: ThirdwebStorage,
    chainId: number,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this._chainId = chainId;
  }

  /**
   * @internal
   */
  onNetworkUpdated(network: NetworkInput): void {
    this.contractWrapper.updateSignerOrProvider(network);
  }

  /**
   * @internal
   */
  getAddress(): Address {
    return this.contractWrapper.readContract.address;
  }

  ////// Standard ERC20 Airdrop Extension //////

  // WRITE FUNCTIONS
  addRecipients = buildTransactionFunction(
    async (
      recipients: {
        amount: Amount;
        tokenAddress: AddressOrEns;
        tokenOwner: AddressOrEns;
        recipient: AddressOrEns;
      }[],
    ) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "addRecipients",
        args: [recipients],
      });
    },
  );
}
