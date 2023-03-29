import { fetchCurrencyValue, getAllDetectedFeatureNames } from "../common";
import { resolveAddress } from "../common/ens";
import { getCompositePluginABI } from "../common/plugin";
import { createStorage } from "../common/storage";
import {
  getChainProvider,
  isChainConfig,
  NATIVE_TOKEN_ADDRESS,
  setSupportedChains,
} from "../constants";
import {
  PREBUILT_CONTRACTS_MAP,
  getContractTypeForRemoteName,
} from "../contracts";
import { SmartContract } from "../contracts/smart-contract";
import { getSignerAndProvider } from "../functions/getSignerAndProvider";
import { Abi, AbiSchema, AddressOrEns, SDKOptions } from "../schema";
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
import IThirdwebContractABI from "@thirdweb-dev/contracts-js/dist/abis/IThirdwebContract.json";
import { ContractAddress, GENERATED_ABI } from "@thirdweb-dev/generated-abis";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { EVMWallet } from "@thirdweb-dev/wallets";
import type { ContractInterface, Signer, BaseContract } from "ethers";
import {
  Contract as EthersContract,
  Wallet as EthersWallet,
  utils as ethersUtils,
} from "ethers";
import { BaseContractForAddress } from "../types/contract";

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
    storage?: ThirdwebStorage,
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
    storage?: ThirdwebStorage,
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
    storage?: ThirdwebStorage,
  ): ThirdwebSDK {
    const provider = getChainProvider(network, options);
    const signer = new EthersWallet(privateKey, provider);
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
    storage?: ThirdwebStorage,
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

    const configuredStorage = createStorage(storage, options);
    this.storage = configuredStorage;
    this.storageHandler = configuredStorage;

    this.wallet = new UserWallet(network, options);
    this.deployer = new ContractDeployer(network, options, configuredStorage);
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
  public async getNFTDrop(contractAddress: AddressOrEns) {
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
  public async getSignatureDrop(contractAddress: AddressOrEns) {
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
  public async getNFTCollection(contractAddress: AddressOrEns) {
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
  public async getEditionDrop(contractAddress: AddressOrEns) {
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
  public async getEdition(contractAddress: AddressOrEns) {
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
  public async getTokenDrop(contractAddress: AddressOrEns) {
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
  public async getToken(contractAddress: AddressOrEns) {
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
  public async getVote(contractAddress: AddressOrEns) {
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
  public async getSplit(contractAddress: AddressOrEns) {
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
  public async getMarketplace(contractAddress: AddressOrEns) {
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
  public async getMarketplaceV3(contractAddress: AddressOrEns) {
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
  public async getPack(contractAddress: AddressOrEns) {
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
  public async getMultiwrap(contractAddress: AddressOrEns) {
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
  public async getContract<
    TContractAddress extends AddressOrEns | ContractAddress,
  >(
    address: TContractAddress,
  ): Promise<
    TContractAddress extends ContractAddress
      ? SmartContract<BaseContractForAddress<TContractAddress>>
      : SmartContract<BaseContract>
  >;
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
    address: AddressOrEns,
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
    address: AddressOrEns,
    abi: ContractInterface,
  ): Promise<SmartContract>;
  public async getContract(
    address: AddressOrEns,
    contractTypeOrABI?: PrebuiltContractType | ContractInterface,
  ): Promise<ValidContractInstance> {
    const resolvedAddress = await resolveAddress(address);

    // if we have a contract in the cache we will return it
    // we will do this **without** checking any contract type things for simplicity, this may have to change in the future?
    if (this.contractCache.has(resolvedAddress)) {
      // we know this will be there since we check the has above
      return this.contractCache.get(resolvedAddress) as ValidContractInstance;
    }

    if (resolvedAddress in GENERATED_ABI) {
      return await this.getContractFromAbi(
        resolvedAddress,
        (GENERATED_ABI as any)[resolvedAddress],
      );
    }

    let newContract: ValidContractInstance;

    // if we don't have a contractType or ABI then we will have to resolve it regardless
    // we also handle it being "custom" just in case...
    if (!contractTypeOrABI || contractTypeOrABI === "custom") {
      try {
        const metadata =
          await this.getPublisher().fetchCompilerMetadataFromAddress(
            resolvedAddress,
          );
        newContract = await this.getContractFromAbi(
          resolvedAddress,
          metadata.abi,
        );
      } catch (e) {
        // try resolving the contract type (legacy contracts)
        const resolvedContractType = await this.resolveContractType(address);
        if (resolvedContractType && resolvedContractType !== "custom") {
          // otherwise if it's a prebuilt contract we can just use the contract type
          const contractAbi = await PREBUILT_CONTRACTS_MAP[
            resolvedContractType
          ].getAbi(address, this.getProvider(), this.storage);
          newContract = await this.getContractFromAbi(address, contractAbi);
        } else {
          // we cant fetch the ABI, and we don't know the contract type, throw an error
          const chainId = (await this.getProvider().getNetwork()).chainId;
          throw new Error(
            `No ABI found for this contract. Try importing it by visiting: https://thirdweb.com/${chainId}/${resolvedAddress}`,
          );
        }
      }
    }
    // if it's a builtin contract type we can just use the contract type to initialize the contract instance
    else if (
      typeof contractTypeOrABI === "string" &&
      contractTypeOrABI in PREBUILT_CONTRACTS_MAP
    ) {
      newContract = await PREBUILT_CONTRACTS_MAP[
        contractTypeOrABI as keyof typeof PREBUILT_CONTRACTS_MAP
      ].initialize(
        this.getSignerOrProvider(),
        resolvedAddress,
        this.storage,
        this.options,
      );
    }
    // otherwise it has to be an ABI
    else {
      newContract = await this.getContractFromAbi(
        resolvedAddress,
        contractTypeOrABI,
      );
    }

    // set whatever we have on the cache
    this.contractCache.set(resolvedAddress, newContract);
    // return it
    return newContract;
  }

  /**
   * @internal
   * @deprecated use {@link getContract} directly instead
   */
  public async getBuiltInContract<TContractType extends PrebuiltContractType>(
    address: AddressOrEns,
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
    contractAddress: AddressOrEns,
  ): Promise<ContractType> {
    try {
      const contract = new EthersContract(
        await resolveAddress(contractAddress),
        IThirdwebContractABI,
        // !provider only! - signer can break things here!
        this.getProvider(),
      );
      const remoteContractType = ethersUtils
        .toUtf8String(await contract.contractType())
        // eslint-disable-next-line no-control-regex
        .replace(/\x00/g, "");
      return getContractTypeForRemoteName(remoteContractType);
    } catch (err) {
      return "custom";
    }
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
    walletAddress: AddressOrEns,
  ): Promise<ContractWithMetadata[]> {
    // TODO - this only reads from the current registry chain, not the multichain registry
    const addresses =
      (await (
        await this.deployer.getRegistry()
      )?.getContractAddresses(await resolveAddress(walletAddress))) || [];

    const chainId = (await this.getProvider().getNetwork()).chainId;

    return await Promise.all(
      addresses.map(async (address) => {
        return {
          address: address,
          chainId,
          contractType: () => this.resolveContractType(address),
          metadata: async () =>
            (await this.getContract(address)).metadata.get(),
          extensions: async () =>
            getAllDetectedFeatureNames(
              (await this.getContract(address)).abi as Abi,
            ),
        };
      }),
    );
  }

  public async getMultichainContractList(
    walletAddress: AddressOrEns,
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
          extensions: async () => [],
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
          extensions: async () =>
            getAllDetectedFeatureNames(
              (await chainSDK.getContract(address)).abi as Abi,
            ),
        };
      } catch (e) {
        return {
          address,
          chainId,
          contractType: async () => "custom" as const,
          metadata: async () => ({}),
          extensions: async () => [],
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
  public async getContractFromAbi(
    address: AddressOrEns,
    abi: ContractInterface,
  ) {
    const resolvedAddress = await resolveAddress(address);

    if (this.contractCache.has(resolvedAddress)) {
      return this.contractCache.get(resolvedAddress) as SmartContract;
    }
    const [, provider] = getSignerAndProvider(
      this.getSignerOrProvider(),
      this.options,
    );

    const parsedABI = typeof abi === "string" ? JSON.parse(abi) : abi;
    // TODO we still might want to lazy-fy this
    const contract = new SmartContract(
      this.getSignerOrProvider(),
      resolvedAddress,
      await getCompositePluginABI(
        resolvedAddress,
        AbiSchema.parse(parsedABI),
        provider,
        this.options,
        this.storage,
      ),
      this.storageHandler,
      this.options,
      (await provider.getNetwork()).chainId,
    );
    this.contractCache.set(resolvedAddress, contract);
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
  public async getBalance(address: AddressOrEns): Promise<CurrencyValue> {
    return fetchCurrencyValue(
      this.getProvider(),
      NATIVE_TOKEN_ADDRESS,
      await this.getProvider().getBalance(await resolveAddress(address)),
    );
  }

  /**
   * @internal
   */
  public getPublisher(): ContractPublisher {
    return this._publisher;
  }
}
