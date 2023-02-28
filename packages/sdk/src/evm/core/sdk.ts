import { fetchCurrencyValue } from "../common";
import {
  getChainProvider,
  isChainConfig,
  NATIVE_TOKEN_ADDRESS,
  setSupportedChains,
} from "../constants";
import { SmartContract } from "../contracts/smart-contract";
import { getContract } from "../functions/getContract";
import { getContractFromAbi } from "../functions/getContractFromAbi";
import { resolveContractType } from "../functions/utils/contract";
import { SDKOptions } from "../schema";
import { ContractWithMetadata, CurrencyValue } from "../types";
import { ContractDeployer } from "./classes";
import { ContractPublisher } from "./classes/contract-publisher";
import { MultichainRegistry } from "./classes/multichain-registry";
import { RPCConnectionHandler } from "./classes/rpc-connection-handler";
import type {
  ChainOrRpcUrl,
  ContractForPrebuiltContractType,
  ContractType,
  NetworkInput,
  PrebuiltContractType,
  ValidContractInstance,
} from "./types";
import { UserWallet } from "./wallet/user-wallet";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { EVMWallet } from "@thirdweb-dev/wallets";
import { ContractInterface, ethers, Signer } from "ethers";

/**
 * The main entry point for the thirdweb SDK
 * @public
 */
export class ThirdwebSDK extends RPCConnectionHandler {
  /**
   * Get an instance of the thirdweb SDK based on an AbstractWallet
   *
   * @example
   * ```javascript
   * import { ThirdwebSDK } from "@thirdweb-dev/sdk"
   *
   * const wallet = new AbstractWalletImplementation();
   * const sdk = await ThirdwebSDK.fromWallet(wallet, "mainnet");
   * ```
   *
   * @param wallet - the implementation of the AbstractWallet class to use for signing
   * @param network - the network (chain) to connect to (e.g. "mainnet", "rinkeby", "polygon", "mumbai"...) or a fully formed RPC url
   * @param options - the SDK options to use
   * @param storage - optional storage implementation to use
   * @returns an instance of the SDK
   *
   * @beta
   */
  static async fromWallet(
    wallet: EVMWallet,
    network: ChainOrRpcUrl,
    options: SDKOptions = {},
    storage: ThirdwebStorage = new ThirdwebStorage(),
  ) {
    const signer = await wallet.getSigner();
    return ThirdwebSDK.fromSigner(signer, network, options, storage);
  }

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
   * @param storage - optional storage implementation to use
   * @returns an instance of the SDK
   *
   * @beta
   */
  static fromSigner(
    signer: Signer,
    network?: ChainOrRpcUrl,
    options: SDKOptions = {},
    storage: ThirdwebStorage = new ThirdwebStorage(),
  ): ThirdwebSDK {
    let signerWithProvider = signer;
    if (network && !signer.provider) {
      const provider = getChainProvider(network, options);
      signerWithProvider = signer.connect(provider);
    }

    const sdk = new ThirdwebSDK(
      network || signerWithProvider,
      options,
      storage,
    );
    sdk.updateSignerOrProvider(signerWithProvider);
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
   * @public
   */
  static fromPrivateKey(
    privateKey: string,
    network: ChainOrRpcUrl,
    options: SDKOptions = {},
    storage: ThirdwebStorage = new ThirdwebStorage(),
  ): ThirdwebSDK {
    const provider = getChainProvider(network, options);
    const signer = new ethers.Wallet(privateKey, provider);
    return new ThirdwebSDK(signer, options, storage);
  }

  /**
   * @internal
   * the cache of contracts that we have already seen
   */
  private contractCache = new Map<string, ValidContractInstance>();
  /**
   * @internal
   * should never be accessed directly, use {@link ThirdwebSDK.getPublisher} instead
   */
  private _publisher: ContractPublisher;
  /**
   * Internal handler for uploading and downloading files
   */
  private storageHandler: ThirdwebStorage;
  /**
   * New contract deployer
   */
  public deployer: ContractDeployer;
  /**
   * The registry of deployed contracts
   */
  public multiChainRegistry: MultichainRegistry;
  /**
   * Interact with the connected wallet
   */
  public wallet: UserWallet;
  /**
   * Upload and download files from IPFS or from your own storage service
   */
  public storage: ThirdwebStorage;

  constructor(
    network: NetworkInput,
    options: SDKOptions = {},
    storage: ThirdwebStorage = new ThirdwebStorage(),
  ) {
    if (isChainConfig(network)) {
      options = {
        ...options,
        // @ts-expect-error - we know that the network is assignable despite the readonly mismatch
        supportedChains: [network, ...(options.supportedChains || [])],
      };
    }

    super(network, options);
    setSupportedChains(options?.supportedChains);
    this.storageHandler = storage;
    this.storage = storage;
    this.wallet = new UserWallet(network, options);
    this.deployer = new ContractDeployer(network, options, storage);
    this.multiChainRegistry = new MultichainRegistry(
      network,
      this.storageHandler,
      this.options,
    );
    this._publisher = new ContractPublisher(
      network,
      this.options,
      this.storageHandler,
    );
  }

  get auth() {
    throw new Error(
      `The sdk.auth namespace has been moved to the @thirdweb-dev/auth package and is no longer available after @thirdweb-dev/sdk >= 3.7.0. 
      Please visit https://portal.thirdweb.com/auth for instructions on how to switch to using the new auth package (@thirdweb-dev/auth@3.0.0).
      
      If you still want to use the old @thirdweb-dev/auth@2.0.0 package, you can downgrade the SDK to version 3.6.0.`,
    );
  }

  /**
   * Get an instance of a NFT Drop contract
   * @param contractAddress - the address of the deployed contract
   * @deprecated
   * This method is deprecated and will be removed in a future major version. You should use {@link getContract} instead.
   * ```diff
   * - const dropContract = await sdk.getDropContract("0x1234...");
   * + const dropContract = await sdk.getContract("0x1234...", "nft-drop");
   * ```
   */
  public async getNFTDrop(contractAddress: string) {
    return await this.getContract(contractAddress, "nft-drop");
  }

  /**
   * Get an instance of a Signature Drop contract
   * @param contractAddress - the address of the deployed contract
   * @deprecated
   * This method is deprecated and will be removed in a future major version. You should use {@link getContract} instead.
   * ```diff
   * - const signatureDrop = await sdk.getSignatureDrop("0x1234...");
   * + const signatureDrop = await sdk.getContract("0x1234...", "signature-drop");
   * ```
   */
  public async getSignatureDrop(contractAddress: string) {
    return await this.getContract(contractAddress, "signature-drop");
  }

  /**
   * Get an instance of a NFT Collection Drop contract
   * @param contractAddress - the address of the deployed contract
   * @deprecated
   * This method is deprecated and will be removed in a future major version. You should use {@link getContract} instead.
   * ```diff
   * - const signatureDrop = await sdk.getNFTCollection("0x1234...");
   * + const signatureDrop = await sdk.getContract("0x1234...", "nft-collection");
   * ```
   */
  public async getNFTCollection(contractAddress: string) {
    return await this.getContract(contractAddress, "nft-collection");
  }

  /**
   * Get an instance of a Edition Drop contract
   * @param contractAddress - the address of the deployed contract
   * @deprecated
   * This method is deprecated and will be removed in a future major version. You should use {@link getContract} instead.
   * ```diff
   * - const editionDrop = await sdk.getEditionDrop("0x1234...");
   * + const editionDrop = await sdk.getContract("0x1234...", "edition-drop");
   * ```
   */
  public async getEditionDrop(contractAddress: string) {
    return await this.getContract(contractAddress, "edition-drop");
  }

  /**
   * Get an instance of a Edition contract
   * @param contractAddress - the address of the deployed contract
   * @deprecated
   * This method is deprecated and will be removed in a future major version. You should use {@link getContract} instead.
   * ```diff
   * - const edition = await sdk.getEdition("0x1234...");
   * + const edition = await sdk.getContract("0x1234...", "edition");
   * ```
   */
  public async getEdition(contractAddress: string) {
    return await this.getContract(contractAddress, "edition");
  }

  /**
   * Get an instance of a Token Drop contract
   * @param contractAddress - the address of the deployed contract
   * @deprecated
   * This method is deprecated and will be removed in a future major version. You should use {@link getContract} instead.
   * ```diff
   * - const tokenDrop = await sdk.getTokenDrop("0x1234...");
   * + const tokenDrop = await sdk.getContract("0x1234...", "token-drop");
   * ```
   */
  public async getTokenDrop(contractAddress: string) {
    return await this.getContract(contractAddress, "token-drop");
  }

  /**
   * Get an instance of a Token contract
   * @param contractAddress - the address of the deployed contract
   * @deprecated
   * This method is deprecated and will be removed in a future major version. You should use {@link getContract} instead.
   * ```diff
   * - const token = await sdk.getToken("0x1234...");
   * + const token = await sdk.getContract("0x1234...", "token");
   * ```
   */
  public async getToken(contractAddress: string) {
    return await this.getContract(contractAddress, "token");
  }

  /**
   * Get an instance of a Vote contract
   * @param contractAddress - the address of the deployed contract
   * @deprecated
   * This method is deprecated and will be removed in a future major version. You should use {@link getContract} instead.
   * ```diff
   * - const vote = await sdk.getVote("0x1234...");
   * + const vote = await sdk.getContract("0x1234...", "vote");
   * ```
   */
  public async getVote(contractAddress: string) {
    return await this.getContract(contractAddress, "vote");
  }

  /**
   * Get an instance of a Split contract
   * @param contractAddress - the address of the deployed contract
   * @deprecated
   * This method is deprecated and will be removed in a future major version. You should use {@link getContract} instead.
   * ```diff
   * - const split = await sdk.getSplit("0x1234...");
   * + const split = await sdk.getContract("0x1234...", "split");
   * ```
   */
  public async getSplit(contractAddress: string) {
    return await this.getContract(contractAddress, "split");
  }

  /**
   * Get an instance of a Marketplace contract
   * @param contractAddress - the address of the deployed contract
   * @deprecated
   * This method is deprecated and will be removed in a future major version. You should use {@link getContract} instead.
   * ```diff
   * - const marketplace = await sdk.getMarketplace("0x1234...");
   * + const marketplace = await sdk.getContract("0x1234...", "marketplace");
   * ```
   */
  public async getMarketplace(contractAddress: string) {
    return await this.getContract(contractAddress, "marketplace");
  }

  /**
   * Get an instance of a Marketplace contract
   * @param contractAddress - the address of the deployed contract
   * @deprecated
   * This method is deprecated and will be removed in a future major version. You should use {@link getContract} instead.
   * ```diff
   * - const marketplace = await sdk.getMarketplaceV3("0x1234...");
   * + const marketplace = await sdk.getContract("0x1234...", "marketplace-v3");
   * ```
   */
  public async getMarketplaceV3(contractAddress: string) {
    return await this.getContract(contractAddress, "marketplace-v3");
  }

  /**
   * Get an instance of a Pack contract
   * @param contractAddress - the address of the deployed contract
   * @deprecated
   * This method is deprecated and will be removed in a future major version. You should use {@link getContract} instead.
   * ```diff
   * - const pack = await sdk.getPack("0x1234...");
   * + const pack = await sdk.getContract("0x1234...", "pack");
   * ```
   */
  public async getPack(contractAddress: string) {
    return await this.getContract(contractAddress, "pack");
  }

  /**
   * Get an instance of a Pack contract
   * @param contractAddress - the address of the deployed contract
   * @deprecated
   * This method is deprecated and will be removed in a future major version. You should use {@link getContract} instead.
   * ```diff
   * - const multiWrap = await sdk.getMultiwrap("0x1234...");
   * + const multiWrap = await sdk.getContract("0x1234...", "multiwrap");
   * ```
   */
  public async getMultiwrap(contractAddress: string) {
    return await this.getContract(contractAddress, "multiwrap");
  }

  /**
   * Get an instance of a Custom ThirdwebContract
   * @param address - the address of the deployed contract
   * @returns the contract
   * @public
   * @example
   * ```javascript
   * const contract = await sdk.getContract("{{contract_address}}");
   * ```
   */
  public async getContract(address: string): Promise<SmartContract>;
  /**
   * Get an instance of a Custom ThirdwebContract
   * @param address - the address of the deployed contract
   * @param contractType - the {@link ContractType} of the contract to load
   * @returns the contract
   * @public
   * @example
   * ```javascript
   * const contract = await sdk.getContract("{{contract_address}}", "nft-drop");
   * ```
   */
  public async getContract<TContractType extends ContractType>(
    address: string,
    contractType: TContractType,
  ): Promise<
    TContractType extends PrebuiltContractType
      ? ContractForPrebuiltContractType<TContractType>
      : SmartContract
  >;
  /**
   * Get an instance of a Custom ThirdwebContract
   * @param address - the address of the deployed contract
   * @param abi - the ABI ({@link ContractInterface}) of the contract to load
   * @returns the contract
   * @public
   * @example
   * ```javascript
   * const contract = await sdk.getContract("{{contract_address}}", ABI);
   * ```
   */
  public async getContract(
    address: string,
    abi: ContractInterface,
  ): Promise<SmartContract>;
  public async getContract(
    address: string,
    contractTypeOrABI?: PrebuiltContractType | ContractInterface,
  ): Promise<ValidContractInstance> {
    const contract = await getContract({
      address,
      contractTypeOrAbi: contractTypeOrABI,
      network: this.getSignerOrProvider(),
      storage: this.storage,
      sdkOptions: this.options,
    });
    this.contractCache.set(address, contract);
    return contract;
  }

  /**
   * @internal
   * @deprecated use {@link getContract} directly instead
   */
  public async getBuiltInContract<TContractType extends PrebuiltContractType>(
    address: string,
    contractType: TContractType,
  ): Promise<ContractForPrebuiltContractType<TContractType>> {
    return (await this.getContract(address, contractType)) as Promise<
      ContractForPrebuiltContractType<TContractType>
    >;
  }

  /**
   * @param contractAddress - the address of the contract to attempt to resolve the contract type for
   * @returns the {@link ContractType} for the given contract address
   *
   */
  public async resolveContractType(
    contractAddress: string,
  ): Promise<ContractType> {
    return resolveContractType({
      address: contractAddress,
      provider: this.getProvider(),
    });
  }

  /**
   * Return all the contracts deployed by the specified address
   * @param walletAddress - the deployed address
   * @example
   * ```javascript
   * const contracts = sdk.getContractList("{{wallet_address}}");
   * ```
   */
  public async getContractList(
    walletAddress: string,
  ): Promise<ContractWithMetadata[]> {
    // TODO - this only reads from the current registry chain, not the multichain registry
    const addresses =
      (await (
        await this.deployer.getRegistry()
      )?.getContractAddresses(walletAddress)) || [];

    const chainId = (await this.getProvider().getNetwork()).chainId;

    return await Promise.all(
      addresses.map(async (address) => {
        return {
          address,
          chainId,
          contractType: () => this.resolveContractType(address),
          metadata: async () =>
            (await this.getContract(address)).metadata.get(),
        };
      }),
    );
  }

  public async getMultichainContractList(
    walletAddress: string,
    chains: Chain[] = defaultChains,
  ): Promise<ContractWithMetadata[]> {
    const contracts = await this.multiChainRegistry.getContractAddresses(
      walletAddress,
    );

    const chainMap = chains.reduce((acc, chain) => {
      acc[chain.chainId] = chain;
      return acc;
    }, {} as Record<number, Chain>);

    const sdkMap: Record<number, ThirdwebSDK> = {};

    return contracts.map(({ address, chainId }) => {
      if (!chainMap[chainId]) {
        // if we don't have the chain in our list of supported chains then we can't resolve the contract type regardless, don't even try to set up the SDK
        return {
          address,
          chainId,
          contractType: async () => "custom" as const,
          metadata: async () => ({}),
        };
      }
      try {
        let chainSDK = sdkMap[chainId];
        if (!chainSDK) {
          chainSDK = new ThirdwebSDK(chainId, {
            ...this.options,
            // need to disable readonly settings for this to work
            readonlySettings: undefined,
            // @ts-expect-error - zod doesn't like this
            supportedChains: chains,
          });
          sdkMap[chainId] = chainSDK;
        }
        return {
          address,
          chainId,
          contractType: () => chainSDK.resolveContractType(address),
          metadata: async () =>
            (await chainSDK.getContract(address)).metadata.get(),
        };
      } catch (e) {
        return {
          address,
          chainId,
          contractType: async () => "custom" as const,
          metadata: async () => ({}),
        };
      }
    });
  }

  /**
   * Update the active signer or provider for all contracts
   * @param network - the new signer or provider
   */
  public override updateSignerOrProvider(network: NetworkInput) {
    super.updateSignerOrProvider(network);
    this.updateContractSignerOrProvider();
  }

  private updateContractSignerOrProvider() {
    this.wallet.connect(this.getSignerOrProvider());
    this.deployer.updateSignerOrProvider(this.getSignerOrProvider());
    this._publisher.updateSignerOrProvider(this.getSignerOrProvider());
    this.multiChainRegistry.updateSigner(this.getSignerOrProvider());
    for (const [, contract] of this.contractCache) {
      contract.onNetworkUpdated(this.getSignerOrProvider());
    }
  }

  /**
   * Get an instance of a Custom contract from a json ABI
   * @param address - the address of the deployed contract
   * @param abi - the JSON abi
   * @returns the contract
   * @beta
   * @example
   * ```javascript
   * // Import your ABI from a JSON file
   * import myABI from "./path/to/myABI.json";
   *
   * const contract = sdk.getContractFromAbi(
   *   "{{contract_address}}",
   *   // Pass in the "abi" field from the JSON file
   *   myABI.abi
   * );
   * ```
   */
  public async getContractFromAbi(address: string, abi: ContractInterface) {
    const contract = await getContractFromAbi({
      address,
      abi,
      network: this.getSignerOrProvider(),
      storage: this.storage,
      sdkOptions: this.options,
    });
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
