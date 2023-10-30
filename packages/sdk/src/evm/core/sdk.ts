import { getAllDetectedExtensionNames } from "../common/feature-detection/getAllDetectedFeatureNames";
import { resolveAddress } from "../common/ens/resolveAddress";
import { getCompositeABI } from "../common/plugin/getCompositePluginABI";
import { createStorage } from "../common/storage";
import { getChainProvider, isChainConfig } from "../constants/urls";
import { setSupportedChains } from "../constants/chains/supportedChains";
import { NATIVE_TOKEN_ADDRESS } from "../constants/currency";
import {
  PREBUILT_CONTRACTS_MAP,
  getContractTypeForRemoteName,
} from "../contracts";
import type { SmartContract as SmartContractType } from "../contracts/smart-contract";
import { getSignerAndProvider } from "../constants/urls";
import { Abi, AbiSchema } from "../schema/contracts/custom";
import { AddressOrEns } from "../schema/shared/AddressOrEnsSchema";
import { SDKOptions } from "../schema/sdk-options";
import { ContractPublisher } from "./classes/contract-publisher";
import { MultichainRegistry } from "./classes/multichain-registry";
import { RPCConnectionHandler } from "./classes/rpc-connection-handler";
import type {
  ContractForPrebuiltContractType,
  ContractType,
  PrebuiltContractType,
  ValidContractInstance,
} from "../contracts";
import type { NetworkInput, ChainOrRpcUrl } from "./types";
import { UserWallet } from "./wallet/user-wallet";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import IThirdwebContractABI from "@thirdweb-dev/contracts-js/dist/abis/IThirdwebContract.json";
import { ContractAddress, GENERATED_ABI } from "@thirdweb-dev/generated-abis";
import { IThirdwebStorage, ThirdwebStorage } from "@thirdweb-dev/storage";
import type { ContractInterface, Signer, BaseContract } from "ethers";
import {
  Contract as EthersContract,
  Wallet as EthersWallet,
  utils as ethersUtils,
} from "ethers";
import { BaseContractForAddress } from "../types/contract";
import { ContractVerifier } from "./classes/contract-verifier";
import { fetchCurrencyValue } from "../common/currency/fetchCurrencyValue";

import { extractConstructorParamsFromAbi } from "../common/feature-detection/extractConstructorParamsFromAbi";
import { extractFunctionParamsFromAbi } from "../common/feature-detection/extractFunctionParamsFromAbi";
import { fetchAndCacheDeployMetadata } from "../common/any-evm-utils/fetchAndCacheDeployMetadata";
import { isContractDeployed } from "../common/any-evm-utils/isContractDeployed";
import { computeCloneFactoryAddress } from "../common/any-evm-utils/computeCloneFactoryAddress";
import { convertParamValues } from "../common/any-evm-utils/convertParamValues";
import { createTransactionBatches } from "../common/any-evm-utils/createTransactionBatches";
import { deployContractDeterministic } from "../common/any-evm-utils/deployContractDeterministic";
import { deployCreate2Factory } from "../common/any-evm-utils/deployCreate2Factory";
import { deployWithThrowawayDeployer } from "../common/any-evm-utils/deployWithThrowawayDeployer";
import { getCreate2FactoryAddress } from "../common/any-evm-utils/getCreate2FactoryAddress";
import { getDeploymentInfo } from "../common/any-evm-utils/getDeploymentInfo";
import { getDeployArguments } from "../common/deploy";
import {
  buildDeployTransactionFunction,
  buildTransactionFunction,
} from "../common/transactions";
import { EventType } from "../constants/events";
import { getContractAddressByChainId } from "../constants/addresses/getContractAddressByChainId";
import {
  EditionDropInitializer,
  EditionInitializer,
  getContractName,
  MarketplaceInitializer,
  MarketplaceV3Initializer,
  MultiwrapInitializer,
  NFTCollectionInitializer,
  NFTDropInitializer,
  PackInitializer,
  PREBUILT_CONTRACTS_APPURI_MAP,
  SignatureDropInitializer,
  SplitInitializer,
  TokenDropInitializer,
  TokenInitializer,
  VoteInitializer,
} from "../contracts";
import { Address } from "../schema/shared/Address";
import type { CurrencyValue } from "../types/currency";
import type { ContractWithMetadata } from "../types/registry";
import { DeploySchemaForPrebuiltContractType } from "../contracts";
import { ContractFactory } from "./classes/factory";
import { ContractRegistry } from "./classes/registry";
import { DeployTransaction, Transaction } from "./classes/transactions";
import {
  type BytesLike,
  Contract,
  utils,
  ContractFactory as ethersContractFactory,
} from "ethers";
import EventEmitter from "eventemitter3";
import invariant from "tiny-invariant";
import { z } from "zod";
import {
  DeploymentTransaction,
  PrecomputedDeploymentTransaction,
} from "../types/any-evm/deploy-data";
import { fetchContractMetadataFromAddress } from "../common/metadata-resolver";
import { LoyaltyCardContractDeploy } from "../schema/contracts/loyalty-card";
import { checkClientIdOrSecretKey } from "../../core/utils/apiKey";
import { getProcessEnv } from "../../core/utils/process";
import { DropErc721ContractSchema } from "../schema/contracts/drop-erc721";
import { AirdropContractDeploy } from "../schema/contracts/airdrop";
import {
  directDeployDeterministicPublished,
  predictAddressDeterministicPublished,
} from "../common/any-evm-utils/deployDirectDeterministic";
import { getDefaultTrustedForwarders } from "../constants/addresses/getDefaultTrustedForwarders";
import { DeployEvent, DeployEvents } from "../types/deploy/deploy-events";
import {
  AirdropContractDeployMetadata,
  MarketplaceContractDeployMetadata,
  MarketplaceV3ContractDeployMetadata,
  MultiwrapContractDeployMetadata,
  NFTContractDeployMetadata,
  OpenEditionContractDeployMetadata,
  SplitContractDeployMetadata,
  TokenContractDeployMetadata,
  VoteContractDeployMetadata,
} from "../types/deploy/deploy-metadata";
import { DeployMetadata, DeployOptions } from "../types/deploy/deploy-options";

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
    wallet: {
      getSigner: () => Promise<Signer>;
    },
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
   * const signer = Wallet.createRandom();
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
    if (network) {
      try {
        const provider = getChainProvider(network, options);
        signerWithProvider = signer.connect(provider);
      } catch {
        // We have to catch here because browser wallets throw when trying to override provider
      }
    }

    const sdk = new ThirdwebSDK(
      network || signerWithProvider,
      network ? addChainToSupportedChains(network, options) : options,
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
    return new ThirdwebSDK(
      signer,
      addChainToSupportedChains(network, options),
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
   * Contract verifier
   */
  public verifier: ContractVerifier;
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
    storage?: IThirdwebStorage,
  ) {
    const apiKeyType = typeof window !== "undefined" ? "clientId" : "secretKey";
    let warnMessage = `No API key. Please provide a ${apiKeyType}. It is required to access thirdweb's services. You can create a key at https://thirdweb.com/create-api-key`;
    if (
      typeof window === "undefined" &&
      !options.secretKey &&
      options.clientId
    ) {
      warnMessage = `Please provide a secret key instead of the clientId. Create a new API Key at https://thirdweb.com/create-api-key`;
    }
    checkClientIdOrSecretKey(warnMessage, options.clientId, options.secretKey);

    options = addChainToSupportedChains(network, options);
    super(network, options);
    setSupportedChains(options?.supportedChains);

    const configuredStorage = createStorage(
      storage,
      options,
    ) as ThirdwebStorage;
    this.storage = configuredStorage;
    this.storageHandler = configuredStorage;

    this.wallet = new UserWallet(network, options, configuredStorage);
    this.deployer = new ContractDeployer(network, options, configuredStorage);
    this.verifier = new ContractVerifier(network, options, configuredStorage);
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
      ? SmartContractType<BaseContractForAddress<TContractAddress>>
      : SmartContractType<BaseContract>
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
      : SmartContractType
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
  ): Promise<SmartContractType>;
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
        // fallback to
        // try resolving the contract type (legacy contracts)
        const resolvedContractType = await this.resolveContractType(
          resolvedAddress,
        );
        if (resolvedContractType && resolvedContractType !== "custom") {
          // otherwise if it's a prebuilt contract we can just use the contract type
          const contractAbi = await PREBUILT_CONTRACTS_MAP[
            resolvedContractType
          ].getAbi(resolvedAddress, this.getProvider(), this.storage);
          newContract = await this.getContractFromAbi(
            resolvedAddress,
            contractAbi,
          );
        } else {
          // we cant fetch the ABI, and we don't know the contract type, throw the original error
          throw e;
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
            getAllDetectedExtensionNames(
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

    const chainMap = chains.reduce(
      (acc, chain) => {
        acc[chain.chainId] = chain;
        return acc;
      },
      {} as Record<number, Chain>,
    );

    const sdkMap: Record<number, ThirdwebSDK> = {};

    return contracts.map(({ address, chainId }) => {
      if (!chainMap[chainId]) {
        // if we don't have the chain in our list of supported chains then we can't resolve the contract type regardless, don't even try to set up the SDK
        return {
          address,
          chainId,
          contractType: async () => "custom" as const,
          metadata: async () => ({ name: "" }),
          extensions: async () => [],
        };
      }
      try {
        let chainSDK = sdkMap[chainId];
        if (!chainSDK) {
          chainSDK = new ThirdwebSDK(
            chainId,
            {
              ...this.options,
              // need to disable readonly settings for this to work
              readonlySettings: undefined,
              // @ts-expect-error - zod doesn't like this
              supportedChains: chains,
            },
            this.storage,
          );
          sdkMap[chainId] = chainSDK;
        }

        return {
          address,
          chainId,
          contractType: () => chainSDK.resolveContractType(address),
          metadata: async () =>
            (await chainSDK.getContract(address)).metadata.get(),
          extensions: async () =>
            getAllDetectedExtensionNames(
              (await chainSDK.getContract(address)).abi as Abi,
            ),
        };
      } catch (e) {
        return {
          address,
          chainId,
          contractType: async () => "custom" as const,
          metadata: async () => ({ name: "" }),
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
    this.verifier.updateSignerOrProvider(this.getSignerOrProvider());
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
    const [resolvedAddress, { SmartContract }] = await Promise.all([
      resolveAddress(address),
      import("../contracts/smart-contract"),
    ]);

    if (this.contractCache.has(resolvedAddress)) {
      return this.contractCache.get(resolvedAddress) as SmartContractType;
    }
    const [, provider] = getSignerAndProvider(
      this.getSignerOrProvider(),
      this.options,
    );

    const parsedABI = typeof abi === "string" ? JSON.parse(abi) : abi;
    const contract = new SmartContract(
      this.getSignerOrProvider(),
      resolvedAddress,
      await getCompositeABI(
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

function addChainToSupportedChains(
  network: NetworkInput,
  options: SDKOptions | undefined,
) {
  if (isChainConfig(network)) {
    options = {
      ...options,
      // @ts-expect-error - we know that the network is assignable despite the readonly mismatch
      supportedChains: [network, ...(options?.supportedChains || [])],
    };
  }
  return options;
}

const THIRDWEB_DEPLOYER = "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024";

/**
 * Handles deploying new contracts
 * @public
 */
export class ContractDeployer extends RPCConnectionHandler {
  /**
   * @internal
   * should never be accessed directly, use {@link ContractDeployer.getFactory} instead
   */
  private _factory: Promise<ContractFactory | undefined> | undefined;
  /**
   * @internal
   * should never be accessed directly, use {@link ContractDeployer.getRegistry} instead
   */
  private _registry: Promise<ContractRegistry | undefined> | undefined;
  private storage: ThirdwebStorage;
  private events: EventEmitter<DeployEvents>;

  private transactionListener = (event: any) => {
    if (event.status === "submitted") {
      this.events.emit("contractDeployed", {
        status: "submitted",
        transactionHash: event.transactionHash,
      });
    }
  };

  constructor(
    network: NetworkInput,
    options: SDKOptions,
    storage: ThirdwebStorage,
  ) {
    super(network, options);
    this.storage = storage;
    this.events = new EventEmitter();
    // Initialize factory and registry (we don't need to make these calls async)
    this.getFactory();
    this.getRegistry();
  }

  /**
   * Deploys an NFT Collection contract
   *
   * @remarks Deploys an NFT Collection contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployNFTCollection({
   *   name: "My Collection",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  deployNFTCollection = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: NFTContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        NFTCollectionInitializer.contractType,
        metadata,
        "latest",
        options,
      );
    },
  );

  /**
   * Deploys a new NFTDrop contract
   *
   * @remarks Deploys an NFT Drop contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployNFTDrop({
   *   name: "My Drop",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  deployNFTDrop = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: NFTContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        NFTDropInitializer.contractType,
        metadata,
        "latest",
        options,
      );
    },
  );

  /**
   * Deploys a new LoyaltyCard contract
   *
   * @remarks Deploys a LoyaltyCard contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployLoyaltyCard({
   *   name: "My Loyalty Program",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  deployLoyaltyCard = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: NFTContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      const parsedMetadata = await LoyaltyCardContractDeploy.parseAsync(
        metadata,
      );
      const contractURI = await this.storage.upload(parsedMetadata);

      const chainId = (await this.getProvider().getNetwork()).chainId;
      const trustedForwarders = getDefaultTrustedForwarders(chainId);
      // add default forwarders to any custom forwarders passed in
      if (
        metadata.trusted_forwarders &&
        metadata.trusted_forwarders.length > 0
      ) {
        trustedForwarders.push(...metadata.trusted_forwarders);
      }

      const signerAddress = await this.getSigner()?.getAddress();

      const deployArgs = [
        signerAddress,
        parsedMetadata.name,
        parsedMetadata.symbol,
        contractURI,
        trustedForwarders,
        parsedMetadata.primary_sale_recipient,
        parsedMetadata.fee_recipient,
        parsedMetadata.seller_fee_basis_points,
        parsedMetadata.platform_fee_basis_points,
        parsedMetadata.platform_fee_recipient,
      ];

      return await this.deployReleasedContract.prepare(
        THIRDWEB_DEPLOYER,
        "LoyaltyCard",
        deployArgs,
        options,
      );
    },
  );

  /**
   * Deploys a new OpenEditionERC721 contract
   *
   * @remarks Deploys a OpenEdition contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployOpenEdition({
   *   name: "My Open Edition",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  deployOpenEdition = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: OpenEditionContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      const parsedMetadata = await DropErc721ContractSchema.deploy.parseAsync(
        metadata,
      );
      const contractURI = await this.storage.upload(parsedMetadata);

      const chainId = (await this.getProvider().getNetwork()).chainId;
      const trustedForwarders = getDefaultTrustedForwarders(chainId);
      // add default forwarders to any custom forwarders passed in
      if (
        metadata.trusted_forwarders &&
        metadata.trusted_forwarders.length > 0
      ) {
        trustedForwarders.push(...metadata.trusted_forwarders);
      }

      const signerAddress = await this.getSigner()?.getAddress();

      const deployArgs = [
        signerAddress,
        parsedMetadata.name,
        parsedMetadata.symbol,
        contractURI,
        trustedForwarders,
        parsedMetadata.primary_sale_recipient,
        parsedMetadata.fee_recipient,
        parsedMetadata.seller_fee_basis_points,
      ];

      return await this.deployPublishedContract.prepare(
        THIRDWEB_DEPLOYER,
        "OpenEditionERC721",
        deployArgs,
        options,
      );
    },
  );

  /**
   * Deploys a new SignatureDrop contract
   *
   * @remarks Deploys a SignatureDrop contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deploySignatureDrop({
   *   name: "My Signature Drop",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  deploySignatureDrop = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: NFTContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        SignatureDropInitializer.contractType,
        metadata,
        "latest",
        options,
      );
    },
  );

  /**
   * Deploys a new Multiwrap contract
   *
   * @remarks Deploys a Multiwrap contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployMultiwrap({
   *   name: "My Multiwrap",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   * @beta
   */
  deployMultiwrap = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: MultiwrapContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        MultiwrapInitializer.contractType,
        metadata,
        "latest",
        options,
      );
    },
  );

  /**
   * Deploys a new Edition contract
   *
   * @remarks Deploys an Edition contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployEdition({
   *   name: "My Edition",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  deployEdition = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: NFTContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        EditionInitializer.contractType,
        metadata,
        "latest",
        options,
      );
    },
  );

  /**
   * Deploys a new EditionDrop contract
   *
   * @remarks Deploys an Edition Drop contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployEditionDrop({
   *   name: "My Edition Drop",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  deployEditionDrop = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: NFTContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        EditionDropInitializer.contractType,
        metadata,
        "latest",
        options,
      );
    },
  );

  /**
   * Deploys a new Token contract
   *
   * @remarks Deploys a Token contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployToken({
   *   name: "My Token",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  deployToken = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: TokenContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        TokenInitializer.contractType,
        metadata,
        "latest",
        options,
      );
    },
  );

  /**
   * Deploys a new Token Drop contract
   *
   * @remarks Deploys a Token Drop contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployTokenDrop({
   *   name: "My Token Drop",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  deployTokenDrop = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: TokenContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        TokenDropInitializer.contractType,
        metadata,
        "latest",
        options,
      );
    },
  );

  /**
   * Deploys a new Marketplace contract
   *
   * @remarks Deploys a Marketplace contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployMarketplace({
   *   name: "My Marketplace",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  deployMarketplace = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: MarketplaceContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        MarketplaceInitializer.contractType,
        metadata,
        "latest",
        options,
      );
    },
  );

  /**
   * Deploys a new Marketplace-V3 contract
   *
   * @remarks Deploys a Marketplace-V3 contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployMarketplaceV3({
   *   name: "My Marketplace",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  deployMarketplaceV3 = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: MarketplaceV3ContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        MarketplaceV3Initializer.contractType,
        metadata,
        "latest",
        options,
      );
    },
  );

  /**
   * Deploys a new Pack contract
   *
   * @remarks Deploys a Pack contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployPack({
   *   name: "My Pack",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  deployPack = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: NFTContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        PackInitializer.contractType,
        metadata,
        "latest",
        options,
      );
    },
  );

  /**
   * Deploys a new Split contract
   *
   * @remarks Deploys a Split contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deploySplit({
   *   name: "My Split",
   *   primary_sale_recipient: "your-address",
   *   recipients: [
   *    {
   *      address: "your-address",
   *      sharesBps: 80 * 100, // 80%
   *    },
   *    {
   *      address: "another-address",
   *      sharesBps: 20 * 100, // 20%
   *    },
   *   ],
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  deploySplit = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: SplitContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        SplitInitializer.contractType,
        metadata,
        "latest",
        options,
      );
    },
  );

  /**
   * Deploys a new Vote contract
   *
   * @remarks Deploys an Vote contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployVote({
   *   name: "My Vote",
   *   primary_sale_recipient: "your-address",
   *   voting_token_address: "your-token-contract-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  deployVote = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: VoteContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        VoteInitializer.contractType,
        metadata,
        "latest",
        options,
      );
    },
  );

  deployAirdropERC20 = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: AirdropContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      const parsedMetadata = await AirdropContractDeploy.parseAsync(metadata);
      const contractURI = await this.storage.upload(parsedMetadata);

      const chainId = (await this.getProvider().getNetwork()).chainId;
      const trustedForwarders = getDefaultTrustedForwarders(chainId);
      // add default forwarders to any custom forwarders passed in
      if (
        metadata.trusted_forwarders &&
        metadata.trusted_forwarders.length > 0
      ) {
        trustedForwarders.push(...metadata.trusted_forwarders);
      }

      const signerAddress = await this.getSigner()?.getAddress();

      const deployArgs = [signerAddress, contractURI, trustedForwarders];

      return await this.deployReleasedContract.prepare(
        THIRDWEB_DEPLOYER,
        "AirdropERC20",
        deployArgs,
        options,
      );
    },
  );

  deployAirdropERC721 = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: AirdropContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      const parsedMetadata = await AirdropContractDeploy.parseAsync(metadata);
      const contractURI = await this.storage.upload(parsedMetadata);

      const chainId = (await this.getProvider().getNetwork()).chainId;
      const trustedForwarders = getDefaultTrustedForwarders(chainId);
      // add default forwarders to any custom forwarders passed in
      if (
        metadata.trusted_forwarders &&
        metadata.trusted_forwarders.length > 0
      ) {
        trustedForwarders.push(...metadata.trusted_forwarders);
      }

      const signerAddress = await this.getSigner()?.getAddress();

      const deployArgs = [signerAddress, contractURI, trustedForwarders];

      return await this.deployReleasedContract.prepare(
        THIRDWEB_DEPLOYER,
        "AirdropERC721",
        deployArgs,
        options,
      );
    },
  );

  deployAirdropERC1155 = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      metadata: AirdropContractDeployMetadata,
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      const parsedMetadata = await AirdropContractDeploy.parseAsync(metadata);
      const contractURI = await this.storage.upload(parsedMetadata);

      const chainId = (await this.getProvider().getNetwork()).chainId;
      const trustedForwarders = getDefaultTrustedForwarders(chainId);
      // add default forwarders to any custom forwarders passed in
      if (
        metadata.trusted_forwarders &&
        metadata.trusted_forwarders.length > 0
      ) {
        trustedForwarders.push(...metadata.trusted_forwarders);
      }

      const signerAddress = await this.getSigner()?.getAddress();

      const deployArgs = [signerAddress, contractURI, trustedForwarders];

      return await this.deployReleasedContract.prepare(
        THIRDWEB_DEPLOYER,
        "AirdropERC1155",
        deployArgs,
        options,
      );
    },
  );

  /**
   * Deploys a new contract
   *
   * @internal
   * @param contractType - the type of contract to deploy
   * @param contractMetadata - the metadata to deploy the contract with
   * @param version
   * @returns a promise of the address of the newly deployed contract
   */
  deployBuiltInContract = /* @__PURE__ */ buildDeployTransactionFunction(
    async <TContractType extends PrebuiltContractType>(
      contractType: TContractType,
      contractMetadata: z.input<
        DeploySchemaForPrebuiltContractType<TContractType>
      >,
      version = "latest",
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      const signer = this.getSigner();
      invariant(signer, "A signer is required to deploy contracts");

      const parsedMetadata = {
        app_uri: PREBUILT_CONTRACTS_APPURI_MAP[contractType],
        ...(await PREBUILT_CONTRACTS_MAP[contractType].schema.deploy.parseAsync(
          contractMetadata,
        )),
      };

      if (this.hasLocalFactory()) {
        // old behavior for unit tests, deploy from local factory
        // parse version into the first number of the version string (or undefined if unparseable)
        let parsedVersion: number | undefined = undefined;
        try {
          parsedVersion = parseInt(version);
          if (isNaN(parsedVersion)) {
            parsedVersion = undefined;
          }
        } catch (e) {
          parsedVersion = undefined;
        }
        const factory = await this.getFactory();
        if (!factory) {
          throw new Error("Factory not found");
        }
        factory.on(EventType.Transaction, this.transactionListener);
        return factory.deploy.prepare(
          contractType,
          parsedMetadata,
          this.events,
          parsedVersion,
          options,
          () => {
            factory.off(EventType.Transaction, this.transactionListener);
          },
        ) as unknown as DeployTransaction;
      }

      // For all other chains, fetch from published contracts
      // resolve contract name from type
      const contractName = getContractName(contractType);
      invariant(contractName, "Contract name not found");
      // first upload the contract metadata
      const contractURI = await this.storage.upload(parsedMetadata);
      // then get the deploy arguments
      const constructorParams = await getDeployArguments(
        contractType,
        parsedMetadata,
        contractURI,
        signer,
        this.storage,
      );

      // fetch the publish URI from the ContractPublisher contract
      const publishedContract = await this.fetchPublishedContractFromPolygon(
        THIRDWEB_DEPLOYER,
        contractName,
        version,
      );

      return this.deployContractFromUri.prepare(
        publishedContract.metadataUri,
        constructorParams,
        options,
      );
    },
  );

  /**
   * @internal
   * @param contractType
   */
  public async getLatestBuiltInContractVersion<
    TContractType extends PrebuiltContractType,
  >(contractType: TContractType) {
    const factory = await this.getFactory();
    if (!factory) {
      throw new Error("Factory not found");
    }
    return await factory.getLatestVersion(contractType);
  }

  /**
   * Deploy any published contract by its name
   * @param publisherAddress the address of the publisher
   * @param contractName the name of the contract to deploy
   * @param constructorParams the constructor params to pass to the contract
   *
   * @deprecated use deployPublishedContract instead
   */
  deployReleasedContract = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      publisherAddress: AddressOrEns,
      contractName: string,
      constructorParams: any[],
      version = "latest",
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      const publishedContract = await this.fetchPublishedContractFromPolygon(
        publisherAddress,
        contractName,
        version,
      );
      return await this.deployContractFromUri.prepare(
        publishedContract.metadataUri,
        constructorParams,
        options,
      );
    },
  );

  /**
   * Deploy any published contract by its name
   * @param publisherAddress the address of the publisher
   * @param contractName the name of the contract to deploy
   * @param constructorParams the constructor params to pass to the contract
   * @param version Optional: the version of the contract to deploy or "latest"
   * @param options Optional: the deploy options
   */
  deployPublishedContract = this.deployReleasedContract;

  /**
   * Deploy any published contract by its name
   * @param contractName the name of the contract to deploy
   * @param constructorParams the constructor params to pass to the contract
   * @param publisherAddress the address of the publisher
   * @param version Optional: the version of the contract to deploy or "latest"
   * @param saltForCreate2 Optional: salt for create2 deployment, will determine deployment address
   */
  async deployPublishedContractDeterministic(
    contractName: string,
    constructorParams: any[],
    publisherAddress: string = THIRDWEB_DEPLOYER,
    contractVersion: string = "latest",
    saltForCreate2?: string,
  ): Promise<string> {
    const signer = this.getSigner();
    invariant(signer, "Signer is required");

    return directDeployDeterministicPublished(
      contractName,
      publisherAddress,
      contractVersion,
      constructorParams,
      signer,
      this.storage,
      this.options.clientId,
      this.options.secretKey,
      saltForCreate2,
    );
  }

  /**
   * Predict Create2 address of a contract
   * @param contractName the name of the contract
   * @param constructorParams the constructor params to pass to the contract
   * @param publisherAddress the address of the publisher
   * @param version Optional: the version of the contract to deploy or "latest"
   * @param saltForCreate2 Optional: salt for create2 deployment, will determine deployment address
   */
  async predictAddressDeterministic(
    contractName: string,
    constructorParams: any[],
    publisherAddress: string = THIRDWEB_DEPLOYER,
    contractVersion: string = "latest",
    saltForCreate2?: string,
  ): Promise<string> {
    const provider = this.getProvider();
    invariant(provider, "Provider is required");

    return predictAddressDeterministicPublished(
      contractName,
      publisherAddress,
      contractVersion,
      constructorParams,
      provider,
      this.storage,
      this.options.clientId,
      this.options.secretKey,
      saltForCreate2,
    );
  }

  /**
   * Deploy a proxy contract of a given implementation via the given factory
   * @param factoryAddress
   * @param implementationAddress
   * @param implementationAbi
   * @param initializerFunction
   * @param initializerArgs
   */
  deployViaFactory = /* @__PURE__ */ buildTransactionFunction(
    async (
      factoryAddress: AddressOrEns,
      implementationAddress: AddressOrEns,
      implementationAbi: ContractInterface,
      initializerFunction: string,
      initializerArgs: any[],
      saltForProxyDeploy?: string,
    ): Promise<Transaction<Address>> => {
      const resolvedFactoryAddress = await resolveAddress(factoryAddress);
      const resolvedImplementationAddress = await resolveAddress(
        implementationAddress,
      );

      const signer = this.getSigner();
      invariant(signer, "signer is required");
      // TODO only require factory interface here - IProxyFactory
      const proxyFactory = new ContractFactory(
        resolvedFactoryAddress,
        this.getSignerOrProvider(),
        this.storage,
        this.options,
      );
      proxyFactory.on(EventType.Transaction, this.transactionListener);
      return await proxyFactory.deployProxyByImplementation.prepare(
        resolvedImplementationAddress,
        implementationAbi,
        initializerFunction,
        initializerArgs,
        this.events,
        saltForProxyDeploy,
        () => {
          proxyFactory.off(EventType.Transaction, this.transactionListener);
        },
      );
    },
  );

  /**
   * Deploy a proxy contract of a given implementation directly
   * @param implementationAddress
   * @param implementationAbi
   * @param initializerFunction
   * @param initializerArgs
   */
  deployProxy = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      implementationAddress: AddressOrEns,
      implementationAbi: ContractInterface,
      initializerFunction: string,
      initializerArgs: any[],
    ): Promise<DeployTransaction> => {
      const resolvedAddress = await resolveAddress(implementationAddress);
      const encodedInitializer = Contract.getInterface(
        implementationAbi,
      ).encodeFunctionData(initializerFunction, initializerArgs);

      const { TWProxy__factory } = await import(
        "@thirdweb-dev/contracts-js/factories/TWProxy__factory"
      );
      return this.deployContractWithAbi.prepare(
        TWProxy__factory.abi,
        TWProxy__factory.bytecode,
        [resolvedAddress, encodedInitializer],
      );
    },
  );

  /**
   * Deploy a proxy contract of a given implementation via thirdweb's Clone factory
   * @param publishMetadataUri
   * @param constructorParamValues
   * @param deployMetadata
   * @param signer
   * @param options
   */
  deployViaAutoFactory = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      publishMetadataUri: string,
      deployMetadata: DeployMetadata,
      signer: Signer,
      initializerFunction: string,
      paramValues: any[],
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      // any evm deployment flow

      // 1. Deploy CREATE2 factory (if not already exists)
      const create2Factory = await deployCreate2Factory(signer, options);

      // 2. get deployment info for any evm
      const deploymentInfo = await getDeploymentInfo(
        publishMetadataUri,
        this.storage,
        this.getProvider(),
        create2Factory,
        this.options.clientId,
        this.options.secretKey,
      );

      const implementationAddress = deploymentInfo.find(
        (i) => i.type === "implementation",
      )?.transaction.predictedAddress as string;

      // 3. deploy infra + plugins + implementation using a throwaway Deployer contract

      // filter out already deployed contracts (data is empty)
      const transactionsToSend = deploymentInfo.filter(
        (i) => i.transaction.data && i.transaction.data.length > 0,
      );
      const transactionsforDirectDeploy = transactionsToSend
        .filter((i) => {
          return i.type !== "infra";
        })
        .map((i) => i.transaction);
      const transactionsForThrowawayDeployer = transactionsToSend
        .filter((i) => {
          return i.type === "infra";
        })
        .map((i) => i.transaction);

      // deploy via throwaway deployer, multiple infra contracts in one transaction
      await deployWithThrowawayDeployer(
        signer,
        transactionsForThrowawayDeployer,
        options,
      );

      // send each transaction directly to Create2 factory
      // process txns one at a time
      for (const tx of transactionsforDirectDeploy) {
        try {
          await deployContractDeterministic(signer, tx, options);
        } catch (e) {
          console.debug(
            `Error deploying contract at ${tx.predictedAddress}`,
            (e as any)?.message,
          );
        }
      }

      const resolvedImplementationAddress = await resolveAddress(
        implementationAddress,
      );

      // 4. deploy proxy with TWStatelessFactory (Clone factory) and return address
      const cloneFactory = await computeCloneFactoryAddress(
        this.getProvider(),
        this.storage,
        create2Factory,
        this.options.clientId,
        this.options.secretKey,
      );

      options?.notifier?.("deploying", "proxy");
      const proxyDeployTransaction = (await this.deployViaFactory.prepare(
        cloneFactory,
        resolvedImplementationAddress,
        deployMetadata.compilerMetadata.abi,
        initializerFunction,
        paramValues,
        options?.saltForProxyDeploy,
      )) as unknown as DeployTransaction;
      options?.notifier?.("deployed", "proxy");
      return proxyDeployTransaction;
    },
  );

  /**
   * Deploy a proxy contract of a given implementation via a custom factory
   * @param constructorParamValues
   * @param deployMetadata
   * @param signer
   * @param chainId
   */
  deployViaCustomFactory = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      constructorParamValues: any[],
      deployMetadata: DeployMetadata,
      signer: Signer,
      chainId: number,
    ): Promise<DeployTransaction> => {
      const customFactoryAddress = deployMetadata.extendedMetadata
        ?.factoryDeploymentData?.customFactoryInput?.customFactoryAddresses[
        chainId
      ] as AddressOrEns;
      const resolvedCustomFactoryAddress = await resolveAddress(
        customFactoryAddress,
      );

      invariant(
        resolvedCustomFactoryAddress,
        `customFactoryAddress not found for chainId '${chainId}'`,
      );
      invariant(
        deployMetadata.extendedMetadata?.factoryDeploymentData
          ?.customFactoryInput?.factoryFunction,
        `customFactoryFunction not set'`,
      );

      const customFactoryMetadata = await fetchContractMetadataFromAddress(
        resolvedCustomFactoryAddress,
        this.getProvider(),
        this.storage,
        this.options,
      );

      const factoryFunctionParamTypes = extractFunctionParamsFromAbi(
        customFactoryMetadata.abi,
        deployMetadata.extendedMetadata.factoryDeploymentData.customFactoryInput
          .factoryFunction,
      ).map((p) => p.type);
      const factoryFunctionparamValues = convertParamValues(
        factoryFunctionParamTypes,
        constructorParamValues,
      );

      // eslint-disable-next-line prefer-const
      let deployedImplementationAddress: string;
      const deployTransaction = await Transaction.fromContractInfo({
        contractAddress: resolvedCustomFactoryAddress,
        contractAbi: customFactoryMetadata.abi,
        provider: this.getProvider(),
        signer,
        method:
          deployMetadata.extendedMetadata.factoryDeploymentData
            .customFactoryInput.factoryFunction,
        args: factoryFunctionparamValues,
        parse: () => {
          return deployedImplementationAddress;
        },
        storage: this.storage,
      });
      deployedImplementationAddress = await deployTransaction.simulate();

      return deployTransaction as unknown as DeployTransaction;
    },
  );

  /**
   * @internal
   */
  public async getRegistry(): Promise<ContractRegistry | undefined> {
    // if we already have a registry just return it back
    if (this._registry) {
      return this._registry;
    }

    // otherwise get the registry address for the active chain and get a new one

    // have to do it like this otherwise we run it over and over and over
    // "this._registry" has to be assigned to the promise upfront.
    return (this._registry = this.getProvider()
      .getNetwork()
      .then(async ({ chainId }) => {
        const registryAddress = getContractAddressByChainId(
          chainId,
          "twRegistry",
        );
        if (!registryAddress) {
          return undefined;
        }
        return new ContractRegistry(
          registryAddress,
          this.getSignerOrProvider(),
          this.storage,
          this.options,
        );
      }));
  }

  private async getFactory(): Promise<ContractFactory | undefined> {
    // if we already have a factory just return it back
    if (this._factory) {
      return this._factory;
    }

    // otherwise get the factory address for the active chain and get a new one

    // have to do it like this otherwise we run it over and over and over
    // "this._factory" has to be assigned to the promise upfront.
    return (this._factory = this.getProvider()
      .getNetwork()
      .then(async ({ chainId }) => {
        const factoryAddress = getContractAddressByChainId(
          chainId,
          "twFactory",
        );
        if (!factoryAddress) {
          return undefined;
        }
        const factory = new ContractFactory(
          factoryAddress,
          this.getSignerOrProvider(),
          this.storage,
          this.options,
        );
        return factory;
      }));
  }

  public override updateSignerOrProvider(network: NetworkInput) {
    super.updateSignerOrProvider(network);
    this.updateContractSignerOrProvider();
  }

  private updateContractSignerOrProvider() {
    // has to be promises now
    this._factory
      ?.then((factory) => {
        factory?.updateSignerOrProvider(this.getSignerOrProvider());
      })
      .catch(() => {
        // ignore
      });
    // has to be promises now
    this._registry
      ?.then((registry) => {
        registry?.updateSignerOrProvider(this.getSignerOrProvider());
      })
      .catch(() => {
        // ignore
      });
  }

  /**
   * @internal
   * @param publishMetadataUri
   * @param constructorParamValues
   * @param options
   */
  deployContractFromUri = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      publishMetadataUri: string,
      constructorParamValues: any[],
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      const signer = this.getSigner();
      invariant(signer, "A signer is required");
      const { compilerMetadata, extendedMetadata } =
        await fetchAndCacheDeployMetadata(publishMetadataUri, this.storage);
      const forceDirectDeploy = options?.forceDirectDeploy || false;

      const chainId = (await this.getProvider().getNetwork()).chainId;
      const isNetworkEnabled =
        extendedMetadata?.networksForDeployment?.networksEnabled.includes(
          chainId,
        ) || extendedMetadata?.networksForDeployment?.allNetworks;

      if (extendedMetadata?.networksForDeployment && !isNetworkEnabled) {
        throw new Error(
          `Deployments disabled on this network, with chainId: ${chainId}`,
        );
      }

      if (
        extendedMetadata &&
        extendedMetadata.factoryDeploymentData &&
        (extendedMetadata.isDeployableViaProxy ||
          extendedMetadata.isDeployableViaFactory ||
          (extendedMetadata.deployType &&
            extendedMetadata.deployType !== "standard")) &&
        !forceDirectDeploy
      ) {
        if (extendedMetadata.deployType === "customFactory") {
          return await this.deployViaCustomFactory.prepare(
            constructorParamValues,
            { compilerMetadata, extendedMetadata },
            signer,
            chainId,
          );
        } else {
          invariant(
            extendedMetadata.factoryDeploymentData
              .implementationInitializerFunction,
            `implementationInitializerFunction not set'`,
          );
          const initializerParamTypes = extractFunctionParamsFromAbi(
            compilerMetadata.abi,
            extendedMetadata.factoryDeploymentData
              .implementationInitializerFunction,
          ).map((p) => p.type);
          const paramValues = convertParamValues(
            initializerParamTypes,
            constructorParamValues,
          );

          const implementationAddress = extendedMetadata.factoryDeploymentData
            .implementationAddresses[chainId] as AddressOrEns;

          if (
            !implementationAddress ||
            extendedMetadata.deployType === "autoFactory"
          ) {
            return await this.deployViaAutoFactory.prepare(
              publishMetadataUri,
              { compilerMetadata, extendedMetadata },
              signer,
              extendedMetadata.factoryDeploymentData
                .implementationInitializerFunction,
              paramValues,
              options,
            );
          }

          const resolvedImplementationAddress = await resolveAddress(
            implementationAddress,
          );

          invariant(
            resolvedImplementationAddress,
            `implementationAddress not found for chainId '${chainId}'`,
          );

          if (extendedMetadata.isDeployableViaFactory) {
            // deploy via a factory (prioritise factory)
            invariant(
              extendedMetadata.factoryDeploymentData.factoryAddresses,
              "isDeployableViaFactory is true so factoryAddresses is required",
            );
            const factoryAddress = extendedMetadata.factoryDeploymentData
              .factoryAddresses[chainId] as AddressOrEns;
            invariant(
              factoryAddress,
              `isDeployableViaFactory is true and factoryAddress not found for chainId '${chainId}'`,
            );
            const resolvedFactoryAddress = await resolveAddress(factoryAddress);
            return (await this.deployViaFactory.prepare(
              resolvedFactoryAddress,
              resolvedImplementationAddress,
              compilerMetadata.abi,
              extendedMetadata.factoryDeploymentData
                .implementationInitializerFunction,
              paramValues,
              options?.saltForProxyDeploy,
            )) as unknown as DeployTransaction;
          } else if (extendedMetadata.isDeployableViaProxy) {
            // deploy a proxy directly
            return await this.deployProxy.prepare(
              resolvedImplementationAddress,
              compilerMetadata.abi,
              extendedMetadata.factoryDeploymentData
                .implementationInitializerFunction,
              paramValues,
            );
          }
        }
      }

      const bytecode = compilerMetadata.bytecode.startsWith("0x")
        ? compilerMetadata.bytecode
        : `0x${compilerMetadata.bytecode}`;
      if (!utils.isHexString(bytecode)) {
        throw new Error(`Contract bytecode is invalid.\n\n${bytecode}`);
      }
      const constructorParamTypes = extractConstructorParamsFromAbi(
        compilerMetadata.abi,
      ).map((p) => p.type);
      const paramValues = convertParamValues(
        constructorParamTypes,
        constructorParamValues,
      );
      return this.deployContractWithAbi.prepare(
        compilerMetadata.abi,
        bytecode,
        paramValues,
      );
    },
  );

  /**
   * @internal
   * @param abi
   * @param bytecode
   * @param constructorParams
   */
  deployContractWithAbi = /* @__PURE__ */ buildDeployTransactionFunction(
    async (
      abi: ContractInterface,
      bytecode: BytesLike | { object: string },
      constructorParams: Array<any>,
    ): Promise<DeployTransaction> => {
      const signer = this.getSigner();
      const provider = this.getProvider();
      invariant(signer, "Signer is required to deploy contracts");
      const factory = new ethersContractFactory(abi, bytecode).connect(signer);

      return new DeployTransaction({
        args: constructorParams,
        provider,
        signer,
        factory,
        storage: this.storage,
        events: this.events,
      });
    },
  );

  /**
   * @public
   * @param publishMetadataUri
   * @param options
   */
  public async getTransactionsForDeploy(
    publishMetadataUri: string,
    options?: DeployOptions,
  ): Promise<DeploymentTransaction[]> {
    let transactions: DeploymentTransaction[] = [];
    const provider = this.getProvider();
    invariant(provider, "A provider is required");

    const { extendedMetadata } = await fetchAndCacheDeployMetadata(
      publishMetadataUri,
      this.storage,
    );
    const forceDirectDeploy = options?.forceDirectDeploy || false;
    if (
      extendedMetadata &&
      extendedMetadata.factoryDeploymentData &&
      (extendedMetadata.isDeployableViaProxy ||
        extendedMetadata.isDeployableViaFactory ||
        extendedMetadata.deployType === "autoFactory") &&
      !forceDirectDeploy
    ) {
      const chainId = (await this.getProvider().getNetwork()).chainId;

      const implementationAddress = extendedMetadata.factoryDeploymentData
        .implementationAddresses[chainId] as AddressOrEns;

      if (
        !implementationAddress ||
        extendedMetadata.deployType === "autoFactory"
      ) {
        const create2FactoryAddress = await getCreate2FactoryAddress(
          this.getProvider(),
        );

        transactions.push({
          contractType: "create2Factory",
          addresses: [create2FactoryAddress],
        });

        const deploymentInfo = await getDeploymentInfo(
          publishMetadataUri,
          this.storage,
          this.getProvider(),
          create2FactoryAddress,
          this.options.clientId,
          this.options.secretKey,
        );

        const transactionsToSend = deploymentInfo.filter(
          (i) => i.transaction.data && i.transaction.data.length > 0,
        );

        const transactionsforDirectDeploy = transactionsToSend
          .filter((i) => {
            return i.type !== "infra";
          })
          .map((i) => i.transaction);
        transactionsforDirectDeploy.forEach((tx) => {
          transactions.push({
            contractType: "preset",
            addresses: [tx.predictedAddress],
          });
        });

        const transactionsForThrowawayDeployer = transactionsToSend
          .filter((i) => {
            return i.type === "infra";
          })
          .map((i) => i.transaction);
        const transactionBatches = createTransactionBatches(
          transactionsForThrowawayDeployer,
        );
        transactionBatches.forEach((batch) => {
          const addresses = batch.map(
            (tx: PrecomputedDeploymentTransaction) => tx.predictedAddress,
          );
          transactions.push({
            contractType: "infra",
            addresses: addresses,
          });
        });
      }

      transactions = (
        await Promise.all(
          transactions.map(async (tx) => {
            const addresses = (
              await Promise.all(
                tx.addresses.map(async (address) => {
                  const isDeployed = await isContractDeployed(
                    address,
                    provider,
                  );
                  return isDeployed ? null : address;
                }),
              )
            ).filter(Boolean);
            return addresses.length > 0 ? tx : null;
          }),
        )
      ).filter(Boolean) as DeploymentTransaction[];

      transactions.push({
        contractType: "proxy",
        addresses: [],
      });
    } else {
      transactions.push({
        contractType: "custom",
        addresses: [],
      });
    }
    return transactions;
  }

  /**
   * Listen to all deploy transactions from this deployer
   * @param listener the listener to add
   */
  public addDeployListener(listener: (event: DeployEvent) => void) {
    this.events.on("contractDeployed", listener);
  }

  /**
   * Remove a deploy listener
   * @param listener the listener to remove
   */
  public removeDeployListener(listener: (event: DeployEvent) => void) {
    this.events.off("contractDeployed", listener);
  }

  /**
   * Remove all deploy listeners
   */
  public removeAllDeployListeners() {
    this.events.removeAllListeners("contractDeployed");
  }

  // PRIVATE METHODS

  private async fetchPublishedContractFromPolygon(
    publisherAddress: AddressOrEns,
    contractName: string,
    version: string,
  ) {
    const address = await resolveAddress(publisherAddress);
    // TODO don't create a new sdk instance here, instead read from contract directly with provider
    // this will allow moving deployer out of this file and help with tree shaking
    const publishedContract = await new ThirdwebSDK(
      "polygon",
      {
        clientId: this.options.clientId,
        secretKey: this.options.secretKey,
      },
      this.storage,
    )
      .getPublisher()
      .getVersion(address, contractName, version);
    if (!publishedContract) {
      throw new Error(
        `No published contract found for '${contractName}' at version '${version}' by '${address}'`,
      );
    }
    return publishedContract;
  }

  private hasLocalFactory() {
    return !!getProcessEnv("factoryAddress");
  }
}
