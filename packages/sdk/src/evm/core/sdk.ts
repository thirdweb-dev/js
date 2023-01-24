import { fetchCurrencyValue } from "../common/currency";
import { getCompositePluginABI } from "../common/plugin";
import {
  ChainId,
  getChainProvider,
  NATIVE_TOKEN_ADDRESS,
  toChainId,
} from "../constants";
import {
  getContractTypeForRemoteName,
  PREBUILT_CONTRACTS_MAP,
} from "../contracts";
import { SmartContract } from "../contracts/smart-contract";
import { AbiSchema } from "../schema";
import { SDKOptions } from "../schema/sdk-options";
import { ContractWithMetadata, CurrencyValue } from "../types/index";
import type { AbstractWallet } from "../wallets";
import { WalletAuthenticator } from "./auth/wallet-authenticator";
import { ContractDeployer } from "./classes/contract-deployer";
import { ContractPublisher } from "./classes/contract-publisher";
import { MultichainRegistry } from "./classes/multichain-registry";
import {
  getSignerAndProvider,
  RPCConnectionHandler,
} from "./classes/rpc-connection-handler";
import type {
  ChainIdOrName,
  ContractForPrebuiltContractType,
  ContractType,
  NetworkInput,
  PrebuiltContractType,
  ValidContractInstance,
} from "./types";
import { UserWallet } from "./wallet/UserWallet";
import IThirdwebContractABI from "@thirdweb-dev/contracts-js/dist/abis/IThirdwebContract.json";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { Contract, ContractInterface, ethers, Signer } from "ethers";

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
    wallet: AbstractWallet,
    network: ChainIdOrName,
    options: SDKOptions = {},
    storage: ThirdwebStorage = new ThirdwebStorage(),
  ) {
    const provider = getChainProvider(network, options);
    const signer = await wallet.getSigner(provider);
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
    network?: ChainIdOrName,
    options: SDKOptions = {},
    storage: ThirdwebStorage = new ThirdwebStorage(),
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
    network: ChainIdOrName,
    options: SDKOptions = {},
    storage: ThirdwebStorage = new ThirdwebStorage(),
  ): ThirdwebSDK {
    const provider = getChainProvider(network, options);
    const signer = new ethers.Wallet(privateKey, provider);
    return ThirdwebSDK.fromSigner(signer, network, options, storage);
  }

  /**
   * Get an instance of the thirdweb SDK using a local node and a local signer.
   * Useful for testing and development.
   *
   * @example
   * ```javascript
   * const sdk = ThirdwebSDK.fromLocalNode();
   *
   * // if your local node is running based off a forked chain, you can specify the chain id or name
   * const sdk = ThirdwebSDK.fromLocalNode("mainnet");
   * ```
   *
   * @param forkedChain - optional forked chain id or name. Defaults to localhost
   * @param privateKey - optional private key to use. Defaults to hardhat default
   * @param port - optional port to use. Defaults to 8545
   * @param storage -  optional storage implementation to use
   * @returns
   */
  static fromLocalNode(
    forkedChain: ChainIdOrName = ChainId.Localhost,
    privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    port: number = 8545,
    sdkOptions: SDKOptions = {},
    storage: ThirdwebStorage = new ThirdwebStorage(),
  ) {
    const chainId = toChainId(forkedChain);
    return ThirdwebSDK.fromPrivateKey(
      privateKey,
      chainId,
      {
        chainInfos: {
          [chainId]: {
            rpc: `http://localhost:${port}`,
          },
          ...sdkOptions.chainInfos,
        },
        ...sdkOptions,
      },
      storage,
    );
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
  /**
   * Enable authentication with the connected wallet
   */
  public auth: WalletAuthenticator;

  constructor(
    network: NetworkInput,
    options: SDKOptions = {},
    storage: ThirdwebStorage = new ThirdwebStorage(),
  ) {
    super(network, options);
    this.storageHandler = storage;
    this.storage = storage;
    this.wallet = new UserWallet(network, options);
    this.deployer = new ContractDeployer(network, options, storage);
    this.auth = new WalletAuthenticator(network, this.wallet, options);
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
    // if we have a contract in the cache we will return it
    // we will do this **without** checking any contract type things for simplicity, this may have to change in the future?
    if (this.contractCache.has(address)) {
      // we know this will be there since we check the has above
      return this.contractCache.get(address) as ValidContractInstance;
    }

    let newContract: ValidContractInstance;

    // if we don't have a contractType or ABI then we will have to resolve it regardless
    // we also handle it being "custom" just in case...
    if (!contractTypeOrABI || contractTypeOrABI === "custom") {
      const resolvedContractType = await this.resolveContractType(address);
      if (resolvedContractType === "custom") {
        // if it's a custom contract we gotta fetch the compiler metadata
        try {
          const metadata =
            await this.getPublisher().fetchCompilerMetadataFromAddress(address);
          newContract = await this.getContractFromAbi(address, metadata.abi);
        } catch (e) {
          const chainId = (await this.getProvider().getNetwork()).chainId;
          throw new Error(
            `No ABI found for this contract. Try importing it by visiting: https://thirdweb.com/${chainId}/${address}`,
          );
        }
      } else {
        // otherwise if it's a prebuilt contract we can just use the contract type
        const contractAbi = await PREBUILT_CONTRACTS_MAP[
          resolvedContractType
        ].getAbi(address, this.getProvider(), this.storage);
        newContract = await this.getContractFromAbi(address, contractAbi);
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
        address,
        this.storage,
        this.options,
      );
    }
    // otherwise it has to be an ABI
    else {
      newContract = await this.getContractFromAbi(address, contractTypeOrABI);
    }

    // set whatever we have on the cache
    this.contractCache.set(address, newContract);
    // return it
    return newContract;
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
    try {
      const contract = new Contract(
        contractAddress,
        IThirdwebContractABI,
        // !provider only! - signer can break things here!
        this.getProvider(),
      );
      const remoteContractType = ethers.utils
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
  ): Promise<ContractWithMetadata[]> {
    const contracts = await this.multiChainRegistry.getContractAddresses(
      walletAddress,
    );

    const sdkMap: Record<number, ThirdwebSDK> = {};

    return await Promise.all(
      contracts.map(async ({ address, chainId }) => {
        let chainSDK = sdkMap[chainId];
        if (!chainSDK) {
          chainSDK = new ThirdwebSDK(chainId, {
            ...this.options,
            // need to disable readonly settings for this to work
            readonlySettings: undefined,
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
      }),
    );
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
    this.auth.updateSignerOrProvider(this.getSignerOrProvider());
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
    if (this.contractCache.has(address)) {
      return this.contractCache.get(address) as SmartContract;
    }
    const [, provider] = getSignerAndProvider(
      this.getSignerOrProvider(),
      this.options,
    );

    const parsedABI = typeof abi === "string" ? JSON.parse(abi) : abi;
    // TODO we still might want to lazy-fy this
    const contract = new SmartContract(
      this.getSignerOrProvider(),
      address,
      await getCompositePluginABI(
        address,
        AbiSchema.parse(parsedABI),
        provider,
        this.options,
        this.storage,
      ),
      this.storageHandler,
      this.options,
      (await provider.getNetwork()).chainId,
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
