import {
  ALL_ROLES,
  assertEnabled,
  detectContractFeature,
  extractFunctionsFromAbi,
} from "../common";
import { FEATURE_TOKEN } from "../constants/erc20-features";
import { FEATURE_NFT } from "../constants/erc721-features";
import { FEATURE_EDITION } from "../constants/erc1155-features";
import { ContractEncoder, NetworkOrSignerOrProvider } from "../core";
import { ContractEvents } from "../core/classes/contract-events";
import { ContractInterceptor } from "../core/classes/contract-interceptor";
import { ContractMetadata } from "../core/classes/contract-metadata";
import { ContractPlatformFee } from "../core/classes/contract-platform-fee";
import { ContractPublishedMetadata } from "../core/classes/contract-published-metadata";
import { ContractRoles } from "../core/classes/contract-roles";
import { ContractRoyalty } from "../core/classes/contract-royalty";
import { ContractPrimarySale } from "../core/classes/contract-sales";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import { Erc20 } from "../core/classes/erc-20";
import { Erc721 } from "../core/classes/erc-721";
import { Erc1155 } from "../core/classes/erc-1155";
import { GasCostEstimator } from "../core/classes/gas-cost-estimator";
import { UpdateableNetwork } from "../core/interfaces/contract";
import { AbiSchema, CustomContractSchema } from "../schema/contracts/custom";
import { CallOverrideSchema } from "../schema/index";
import { SDKOptions } from "../schema/sdk-options";
import { BaseERC1155, BaseERC20, BaseERC721 } from "../types/eips";
import {
  IPermissionsEnumerable,
  IPlatformFee,
  IPrimarySale,
  IRoyalty,
} from "@thirdweb-dev/contracts-js";
import { IStorage } from "@thirdweb-dev/storage";
import { BaseContract, CallOverrides, ContractInterface } from "ethers";

/**
 * Custom contract dynamic class with feature detection
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK(provider);
 * const contract = await sdk.getContract("{{contract_address}}");
 *
 * // call any function in your contract
 * await contract.call("myCustomFunction", param1, param2);
 *
 * // if your contract follows the ERC721 standard, contract.nft will be present
 * const allNFTs = await contract.nft.query.all()
 *
 * // if your contract extends IMintableERC721, contract.nft.mint() will be available
 * const tx = await contract.nft.mint({
 *     name: "Cool NFT",
 *     image: readFileSync("some_image.png"),
 *   });
 * ```
 *
 * @beta
 */
export class SmartContract<TContract extends BaseContract = BaseContract>
  implements UpdateableNetwork
{
  static contractType = "custom" as const;
  /**
   * @internal
   */
  static schema = CustomContractSchema;

  private contractWrapper;
  private storage;
  private options;

  // utilities
  public events: ContractEvents<TContract>;
  public interceptor: ContractInterceptor<TContract>;
  public encoder: ContractEncoder<TContract>;
  public estimator: GasCostEstimator<TContract>;
  public publishedMetadata: ContractPublishedMetadata<TContract>;
  public abi: ContractInterface;

  // features
  public metadata: ContractMetadata<BaseContract, any>;
  public royalties: ContractRoyalty<IRoyalty, any> | undefined;
  public roles: ContractRoles<IPermissionsEnumerable, any> | undefined;
  public sales: ContractPrimarySale<IPrimarySale> | undefined;
  public platformFees: ContractPlatformFee<IPlatformFee> | undefined;

  private token: Erc20 | undefined;
  private nft: Erc721 | undefined;
  private edition: Erc1155 | undefined;

  /**
   * Auto-detects ERC20 standard functions.
   */
  get erc20(): Erc20 {
    return assertEnabled(this.token, FEATURE_TOKEN);
  }

  /**
   * Auto-detects ERC721 standard functions.
   */
  get erc721(): Erc721 {
    return assertEnabled(this.nft, FEATURE_NFT);
  }

  /**
   * Auto-detects ERC1155 standard functions.
   */
  get erc1155(): Erc1155 {
    return assertEnabled(this.edition, FEATURE_EDITION);
  }

  constructor(
    network: NetworkOrSignerOrProvider,
    address: string,
    abi: ContractInterface,
    storage: IStorage,
    options: SDKOptions = {},
    contractWrapper = new ContractWrapper<TContract>(
      network,
      address,
      abi,
      options,
    ),
  ) {
    this.options = options;
    this.storage = storage;
    this.contractWrapper = contractWrapper;
    this.abi = abi;

    this.events = new ContractEvents(this.contractWrapper);
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.interceptor = new ContractInterceptor(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.publishedMetadata = new ContractPublishedMetadata(
      this.contractWrapper,
      this.storage,
    );

    this.metadata = new ContractMetadata(
      this.contractWrapper,
      SmartContract.schema,
      this.storage,
    );

    // feature detection
    this.royalties = this.detectRoyalties();
    this.roles = this.detectRoles();
    this.sales = this.detectPrimarySales();
    this.platformFees = this.detectPlatformFees();

    this.token = this.detectErc20();
    this.nft = this.detectErc721();
    this.edition = this.detectErc1155();
  }

  onNetworkUpdated(network: NetworkOrSignerOrProvider): void {
    this.contractWrapper.updateSignerOrProvider(network);
  }

  getAddress(): string {
    return this.contractWrapper.readContract.address;
  }

  /**
   * Call any function on this contract
   * @example
   * ```javascript
   * // read functions will return the data from the contract
   * const myValue = await contract.call("myReadFunction");
   * console.log(myValue);
   *
   * // write functions will return the transaction receipt
   * const tx = await contract.call("myWriteFunction", arg1, arg2);
   * const receipt = tx.receipt;
   *
   * // Optionally override transaction options
   * await contract.call("myWriteFunction", arg1, arg2, {
   *  gasLimit: 1000000, // override default gas limit
   *  value: ethers.utils.parseEther("0.1"), // send 0.1 ether with the contract call
   * };
   * ```
   * @param functionName - the name of the function to call
   * @param args - the arguments of the function
   */
  public async call(
    functionName: string,
    ...args: unknown[] | [...unknown[], CallOverrides]
  ): Promise<any> {
    // parse last arg as tx options if present
    let txOptions: CallOverrides | undefined;
    try {
      if (args.length > 0 && typeof args[args.length - 1] === "object") {
        const last = args[args.length - 1];
        txOptions = CallOverrideSchema.parse(last);
        // if call overrides found, remove it from args array
        args = args.slice(0, args.length - 1);
      }
    } catch (e) {
      // no-op
    }

    const functions = extractFunctionsFromAbi(
      AbiSchema.parse(this.contractWrapper.abi),
    );
    const fn = functions.find((f) => f.name === functionName);
    if (!fn) {
      throw new Error(
        `Function "${functionName}" not found in contract. Check your dashboard for the list of functions available`,
      );
    }
    // TODO extract this and re-use for deploy function to check constructor args
    if (fn.inputs.length !== args.length) {
      throw new Error(
        `Function "${functionName}" requires ${fn.inputs.length} arguments, but ${args.length} were provided.\nExpected function signature: ${fn.signature}`,
      );
    }
    // TODO validate each argument
    if (fn.stateMutability === "view" || fn.stateMutability === "pure") {
      // read function
      return (this.contractWrapper.readContract as any)[functionName](...args);
    } else {
      // write function
      const receipt = await this.contractWrapper.sendTransaction(
        functionName,
        args,
        txOptions,
      );
      return {
        receipt,
      };
    }
  }

  /** ********************
   * FEATURE DETECTION
   * ********************/

  private detectRoyalties() {
    if (detectContractFeature<IRoyalty>(this.contractWrapper, "Royalty")) {
      // ContractMetadata is stateless, it's fine to create a new one here
      // This also makes it not order dependent in the feature detection process
      const metadata = new ContractMetadata(
        this.contractWrapper,
        SmartContract.schema,
        this.storage,
      );
      return new ContractRoyalty(this.contractWrapper, metadata);
    }
    return undefined;
  }

  private detectRoles() {
    if (
      detectContractFeature<IPermissionsEnumerable>(
        this.contractWrapper,
        "Permissions",
      )
    ) {
      return new ContractRoles(this.contractWrapper, ALL_ROLES);
    }
    return undefined;
  }

  private detectPrimarySales() {
    if (
      detectContractFeature<IPrimarySale>(this.contractWrapper, "PrimarySale")
    ) {
      return new ContractPrimarySale(this.contractWrapper);
    }
    return undefined;
  }

  private detectPlatformFees() {
    if (
      detectContractFeature<IPlatformFee>(this.contractWrapper, "PlatformFee")
    ) {
      return new ContractPlatformFee(this.contractWrapper);
    }
    return undefined;
  }

  private detectErc20() {
    if (detectContractFeature<BaseERC20>(this.contractWrapper, "ERC20")) {
      return new Erc20(this.contractWrapper, this.storage);
    }
    return undefined;
  }

  private detectErc721() {
    if (detectContractFeature<BaseERC721>(this.contractWrapper, "ERC721")) {
      return new Erc721(this.contractWrapper, this.storage);
    }
    return undefined;
  }

  private detectErc1155() {
    if (detectContractFeature<BaseERC1155>(this.contractWrapper, "ERC1155")) {
      return new Erc1155(this.contractWrapper, this.storage);
    }
    return undefined;
  }
}
