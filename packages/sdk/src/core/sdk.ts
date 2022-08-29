import { fetchCurrencyValue } from "../common/currency";
import {
  ChainOrRpc,
  getProviderForNetwork,
  getReadOnlyProvider,
  NATIVE_TOKEN_ADDRESS,
} from "../constants";
import {
  Edition,
  EditionDrop,
  KNOWN_CONTRACTS_MAP,
  Marketplace,
  NFTCollection,
  NFTDrop,
  Pack,
  REMOTE_CONTRACT_TO_CONTRACT_TYPE,
  SignatureDrop,
  Split,
  Token,
  Vote,
} from "../contracts";
import { Multiwrap } from "../contracts/multiwrap";
import { SmartContract } from "../contracts/smart-contract";
import { TokenDrop } from "../contracts/token-drop";
import { SDKOptions } from "../schema/sdk-options";
import { CurrencyValue } from "../types/index";
import { WalletAuthenticator } from "./auth/wallet-authenticator";
import { ContractMetadata } from "./classes";
import { ContractDeployer } from "./classes/contract-deployer";
import { ContractPublisher } from "./classes/contract-publisher";
import { RPCConnectionHandler } from "./classes/rpc-connection-handler";
import type {
  ContractForContractType,
  ContractType,
  NetworkOrSignerOrProvider,
  SignerOrProvider,
  ValidContractInstance,
} from "./types";
import { UserWallet } from "./wallet/UserWallet";
import { IThirdwebContract__factory } from "@thirdweb-dev/contracts-js";
import { IpfsStorage, RemoteStorage, IStorage } from "@thirdweb-dev/storage";
import { ContractInterface, ethers, Signer } from "ethers";
import invariant from "tiny-invariant";

/**
 * The main entry point for the thirdweb SDK
 * @public
 */
export class ThirdwebSDK extends RPCConnectionHandler {
  /**
   * Get an instance of the thirdweb SDK based on an existing ethers signer
   *
   * @example
   * ```javascript
   * // get a signer from somewhere (createRandom is being used purely for example purposes)
   * const signer = ethers.Wallet.createRandom();
   *
   * // get an instance of the SDK with the signer already setup
   * const sdk = ThirdwebSDK.fromSigner(signer, "mainnet");
   * ```
   *
   * @param signer - a ethers Signer to be used for transactions
   * @param network - the network (chain) to connect to (e.g. "mainnet", "rinkeby", "polygon", "mumbai"...) or a fully formed RPC url
   * @param options - the SDK options to use
   * @returns an instance of the SDK
   * @param storage - optional storage implementation to use
   *
   * @beta
   */
  static fromSigner(
    signer: Signer,
    network?: ChainOrRpc,
    options: SDKOptions = {},
    storage: IStorage = new IpfsStorage(),
  ): ThirdwebSDK {
    const sdk = new ThirdwebSDK(network || signer, options, storage);
    sdk.updateSignerOrProvider(signer);
    return sdk;
  }

  /**
   * Get an instance of the thirdweb SDK based on a private key.
   *
   * @remarks
   * This should only be used for backend services or scripts, with the private key stored in a secure way.
   * **NEVER** expose your private key to the public in any way.
   *
   * @example
   * ```javascript
   * const sdk = ThirdwebSDK.fromPrivateKey("SecretPrivateKey", "mainnet");
   * ```
   *
   * @param privateKey - the private key - **DO NOT EXPOSE THIS TO THE PUBLIC**
   * @param network - the network (chain) to connect to (e.g. "mainnet", "rinkeby", "polygon", "mumbai"...) or a fully formed RPC url
   * @param options - the SDK options to use
   * @param storage - optional storage implementation to use
   * @returns an instance of the SDK
   *
   * @beta
   */
  static fromPrivateKey(
    privateKey: string,
    network: ChainOrRpc,
    options: SDKOptions = {},
    storage: IStorage = new IpfsStorage(),
  ): ThirdwebSDK {
    const signerOrProvider = getProviderForNetwork(network);
    const provider = Signer.isSigner(signerOrProvider)
      ? signerOrProvider.provider
      : typeof signerOrProvider === "string"
      ? getReadOnlyProvider(signerOrProvider)
      : signerOrProvider;
    const signer = new ethers.Wallet(privateKey, provider);
    return ThirdwebSDK.fromSigner(signer, network, options, storage);
  }

  /**
   * @internal
   * the cache of contracts that we have already seen
   */
  private contractCache = new Map<
    string,
    ValidContractInstance | SmartContract
  >();
  /**
   * @internal
   * should never be accessed directly, use {@link ThirdwebSDK.getPublisher} instead
   */
  private _publisher: ContractPublisher;
  /**
   * Internal handler for uploading and downloading files
   */
  private storageHandler: IStorage;
  /**
   * New contract deployer
   */
  public deployer: ContractDeployer;
  /**
   * Interact with the connected wallet
   */
  public wallet: UserWallet;
  /**
   * Upload and download files from IPFS or from your own storage service
   */
  public storage: RemoteStorage;
  /**
   * Enable authentication with the connected wallet
   */
  public auth: WalletAuthenticator;

  constructor(
    network: ChainOrRpc | SignerOrProvider,
    options: SDKOptions = {},
    storage: IStorage = new IpfsStorage(),
  ) {
    const signerOrProvider = getProviderForNetwork(network);
    super(signerOrProvider, options);
    this.storageHandler = storage;
    this.storage = new RemoteStorage(storage);
    this.wallet = new UserWallet(signerOrProvider, options);
    this.deployer = new ContractDeployer(signerOrProvider, options, storage);
    this.auth = new WalletAuthenticator(signerOrProvider, this.wallet, options);
    this._publisher = new ContractPublisher(
      signerOrProvider,
      this.options,
      this.storageHandler,
    );
  }

  /**
   * Get an instance of a Drop contract
   * @param contractAddress - the address of the deployed contract
   * @returns the contract
   */
  public getNFTDrop(contractAddress: string): NFTDrop {
    return this.getBuiltInContract(
      contractAddress,
      NFTDrop.contractType,
    ) as NFTDrop;
  }

  /**
   * Get an instance of a SignatureDrop contract
   * @param contractAddress - the address of the deployed contract
   * @returns the contract
   * @internal
   */
  public getSignatureDrop(contractAddress: string): SignatureDrop {
    return this.getBuiltInContract(
      contractAddress,
      SignatureDrop.contractType,
    ) as SignatureDrop;
  }

  /**
   * Get an instance of a NFT Collection contract
   * @param address - the address of the deployed contract
   * @returns the contract
   */
  public getNFTCollection(address: string): NFTCollection {
    return this.getBuiltInContract(
      address,
      NFTCollection.contractType,
    ) as NFTCollection;
  }

  /**
   * Get an instance of a Edition Drop contract
   * @param address - the address of the deployed contract
   * @returns the contract
   */
  public getEditionDrop(address: string): EditionDrop {
    return this.getBuiltInContract(
      address,
      EditionDrop.contractType,
    ) as EditionDrop;
  }

  /**
   * Get an instance of an Edition contract
   * @param address - the address of the deployed contract
   * @returns the contract
   */
  public getEdition(address: string): Edition {
    return this.getBuiltInContract(address, Edition.contractType) as Edition;
  }

  /**
   * Get an instance of a Token Drop contract
   * @param address - the address of the deployed contract
   * @returns the contract
   */
  public getTokenDrop(address: string): TokenDrop {
    return this.getBuiltInContract(
      address,
      TokenDrop.contractType,
    ) as TokenDrop;
  }

  /**
   * Get an instance of a Token contract
   * @param address - the address of the deployed contract
   * @returns the contract
   */
  public getToken(address: string): Token {
    return this.getBuiltInContract(address, Token.contractType) as Token;
  }

  /**
   * Get an instance of a Vote contract
   * @param address - the address of the deployed contract
   * @returns the contract
   */
  public getVote(address: string): Vote {
    return this.getBuiltInContract(address, Vote.contractType) as Vote;
  }

  /**
   * Get an instance of a Splits contract
   * @param address - the address of the deployed contract
   * @returns the contract
   */
  public getSplit(address: string): Split {
    return this.getBuiltInContract(address, Split.contractType) as Split;
  }

  /**
   * Get an instance of a Marketplace contract
   * @param address - the address of the deployed contract
   * @returns the contract
   */
  public getMarketplace(address: string): Marketplace {
    return this.getBuiltInContract(
      address,
      Marketplace.contractType,
    ) as Marketplace;
  }

  /**
   * Get an instance of a Pack contract
   * @param address - the address of the deployed contract
   * @returns the contract
   */
  public getPack(address: string): Pack {
    return this.getBuiltInContract(address, Pack.contractType) as Pack;
  }

  /**
   * Get an instance of a Multiwrap contract
   * @param address - the address of the deployed contract
   * @returns the contract
   * @beta
   */
  public getMultiwrap(address: string): Multiwrap {
    return this.getBuiltInContract(
      address,
      Multiwrap.contractType,
    ) as Multiwrap;
  }

  /**
   *
   * @internal
   * @param address - the address of the contract to instantiate
   * @param contractType - optional, the type of contract to instantiate
   * @returns a promise that resolves with the contract instance
   */
  public getBuiltInContract<TContractType extends ContractType = ContractType>(
    address: string,
    contractType: TContractType,
  ): ContractForContractType<TContractType> {
    // if we have a contract in the cache we will return it
    // we will do this **without** checking any contract type things for simplicity, this may have to change in the future?
    if (this.contractCache.has(address)) {
      return this.contractCache.get(
        address,
      ) as ContractForContractType<TContractType>;
    }

    if (contractType === "custom") {
      throw new Error(
        "To get an instance of a custom contract, use getContract(address)",
      );
    }

    const newContract = new KNOWN_CONTRACTS_MAP[
      contractType as keyof typeof KNOWN_CONTRACTS_MAP
    ](this.getSignerOrProvider(), address, this.storageHandler, this.options);

    this.contractCache.set(address, newContract);

    // return the new contract
    return newContract as ContractForContractType<TContractType>;
  }

  /**
   * @param contractAddress - the address of the contract to attempt to resolve the contract type for
   * @returns the {@link ContractType} for the given contract address
   * @throws if the contract type cannot be determined (is not a valid thirdweb contract)
   */
  public async resolveContractType(
    contractAddress: string,
  ): Promise<Exclude<ContractType, "custom">> {
    const contract = IThirdwebContract__factory.connect(
      contractAddress,
      this.getSignerOrProvider(),
    );
    const remoteContractType = ethers.utils
      .toUtf8String(await contract.contractType())
      // eslint-disable-next-line no-control-regex
      .replace(/\x00/g, "");
    invariant(
      remoteContractType in REMOTE_CONTRACT_TO_CONTRACT_TYPE,
      `${remoteContractType} is not a valid contract type, falling back to custom contract`,
    );
    return REMOTE_CONTRACT_TO_CONTRACT_TYPE[
      remoteContractType as keyof typeof REMOTE_CONTRACT_TO_CONTRACT_TYPE
    ];
  }

  /**
   * Return all the contracts deployed by the specified address
   * @param walletAddress - the deployed address
   */
  public async getContractList(walletAddress: string) {
    const addresses = await (
      await this.deployer.getRegistry()
    ).getContractAddresses(walletAddress);

    const addressesWithContractTypes = await Promise.all(
      addresses.map(async (address) => {
        let contractType: ContractType = "custom";
        try {
          contractType = await this.resolveContractType(address);
        } catch (e) {
          // this going to happen frequently and be OK, we'll just catch it and ignore it
        }
        let metadata: ContractMetadata<any, any> | undefined;
        if (contractType === "custom") {
          try {
            metadata = (await this.getContract(address)).metadata;
          } catch (e) {
            console.warn(
              `Couldn't get contract metadata for custom contract: ${address}`,
            );
          }
        } else {
          metadata = this.getBuiltInContract(address, contractType).metadata;
        }
        return {
          address,
          contractType,
          metadata,
        };
      }),
    );

    return addressesWithContractTypes
      .filter((e) => e.metadata)
      .map(({ address, contractType, metadata }) => {
        invariant(metadata, "All ThirdwebContracts require metadata");
        return {
          address,
          contractType,
          metadata: () => metadata.get(),
        };
      });
  }

  /**
   * Update the active signer or provider for all contracts
   * @param network - the new signer or provider
   */
  public override updateSignerOrProvider(network: NetworkOrSignerOrProvider) {
    super.updateSignerOrProvider(network);
    this.updateContractSignerOrProvider();
  }

  private updateContractSignerOrProvider() {
    this.auth.updateSignerOrProvider(this.getSignerOrProvider());
    this.wallet.onNetworkUpdated(this.getSignerOrProvider());
    this.deployer.updateSignerOrProvider(this.getSignerOrProvider());
    this._publisher.updateSignerOrProvider(this.getSignerOrProvider());
    for (const [, contract] of this.contractCache) {
      contract.onNetworkUpdated(this.getSignerOrProvider());
    }
  }

  /**
   * Get an instance of a Custom ThirdwebContract
   * @param address - the address of the deployed contract
   * @returns the contract
   * @beta
   */
  public async getContract(address: string) {
    if (this.contractCache.has(address)) {
      return this.contractCache.get(address) as SmartContract;
    }
    try {
      // try built in contract first, eventually all our contracts will have bytecode metadata
      const contractType = await this.resolveContractType(address);
      const abi = KNOWN_CONTRACTS_MAP[contractType].contractAbi;
      return this.getContractFromAbi(address, abi);
    } catch (err) {
      try {
        const publisher = this.getPublisher();
        const metadata = await publisher.fetchCompilerMetadataFromAddress(
          address,
        );
        return this.getContractFromAbi(address, metadata.abi);
      } catch (e) {
        throw new Error(`Error fetching ABI for this contract\n\n${err}`);
      }
    }
  }

  /**
   * Get an instance of a Custom contract from a json ABI
   * @param address - the address of the deployed contract
   * @param abi - the JSON abi
   * @returns the contract
   * @beta
   */
  public getContractFromAbi(address: string, abi: ContractInterface) {
    if (this.contractCache.has(address)) {
      return this.contractCache.get(address) as SmartContract;
    }
    const contract = new SmartContract(
      this.getSignerOrProvider(),
      address,
      abi,
      this.storageHandler,
      this.options,
    );
    this.contractCache.set(address, contract);
    return contract;
  }

  /**
   * Get the native balance of a given address (wallet or contract)
   * @example
   * ```javascript
   * const balance = await sdk.getBalance("0x...");
   * console.log(balance.displayValue);
   * ```
   * @param address - the address to check the balance for
   */
  public async getBalance(address: string): Promise<CurrencyValue> {
    return fetchCurrencyValue(
      this.getProvider(),
      NATIVE_TOKEN_ADDRESS,
      await this.getProvider().getBalance(address),
    );
  }

  /**
   * @internal
   */
  public getPublisher(): ContractPublisher {
    return this._publisher;
  }
}
