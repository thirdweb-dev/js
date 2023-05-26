import { extractConstructorParamsFromAbi } from "../../common/feature-detection/extractConstructorParamsFromAbi";
import { extractFunctionParamsFromAbi } from "../../common/feature-detection/extractFunctionParamsFromAbi";
import { fetchAndCacheDeployMetadata } from "../../common/any-evm-utils/fetchAndCacheDeployMetadata";
import { isContractDeployed } from "../../common/any-evm-utils/isContractDeployed";
import { computeCloneFactoryAddress } from "../../common/any-evm-utils/computeCloneFactoryAddress";
import { convertParamValues } from "../../common/any-evm-utils/convertParamValues";
import { createTransactionBatches } from "../../common/any-evm-utils/createTransactionBatches";
import { deployContractDeterministic } from "../../common/any-evm-utils/deployContractDeterministic";
import { deployCreate2Factory } from "../../common/any-evm-utils/deployCreate2Factory";
import { deployWithThrowawayDeployer } from "../../common/any-evm-utils/deployWithThrowawayDeployer";
import { getCreate2FactoryAddress } from "../../common/any-evm-utils/getCreate2FactoryAddress";
import { getDeploymentInfo } from "../../common/any-evm-utils/getDeploymentInfo";
import { getDeployArguments } from "../../common/deploy";
import { resolveAddress } from "../../common/ens";
import {
  buildDeployTransactionFunction,
  buildTransactionFunction,
} from "../../common/transactions";
import { EventType } from "../../constants/events";
import { getContractAddressByChainId } from "../../constants/addresses";
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
  PREBUILT_CONTRACTS_MAP,
  SignatureDropInitializer,
  SplitInitializer,
  TokenDropInitializer,
  TokenInitializer,
  VoteInitializer,
} from "../../contracts";
import { Address, AddressOrEns } from "../../schema/shared";
import { SDKOptions } from "../../schema/sdk-options";
import {
  DeployEvent,
  DeployEvents,
  DeployMetadata,
  DeployOptions,
  MarketplaceContractDeployMetadata,
  MarketplaceV3ContractDeployMetadata,
  MultiwrapContractDeployMetadata,
  NFTContractDeployMetadata,
  SplitContractDeployMetadata,
  TokenContractDeployMetadata,
  VoteContractDeployMetadata,
} from "../../types";
import { ThirdwebSDK } from "../sdk";
import { NetworkInput } from "../types";
import {
  DeploySchemaForPrebuiltContractType,
  PrebuiltContractType,
} from "../../contracts";
import { ContractFactory } from "./factory";
import { ContractRegistry } from "./registry";
import { RPCConnectionHandler } from "./rpc-connection-handler";
import { DeployTransaction, Transaction } from "./transactions";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BytesLike, Contract, ContractInterface, ethers } from "ethers";
import { EventEmitter } from "eventemitter3";
import invariant from "tiny-invariant";
import { z } from "zod";
import {
  DeploymentTransaction,
  PrecomputedDeploymentTransaction,
} from "../../types/any-evm/deploy-data";
import { fetchContractMetadataFromAddress } from "../../common";

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
  deployNFTCollection = buildDeployTransactionFunction(
    async (metadata: NFTContractDeployMetadata): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        NFTCollectionInitializer.contractType,
        metadata,
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
  deployNFTDrop = buildDeployTransactionFunction(
    async (metadata: NFTContractDeployMetadata): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        NFTDropInitializer.contractType,
        metadata,
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
  deploySignatureDrop = buildDeployTransactionFunction(
    async (metadata: NFTContractDeployMetadata): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        SignatureDropInitializer.contractType,
        metadata,
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
  deployMultiwrap = buildDeployTransactionFunction(
    async (
      metadata: MultiwrapContractDeployMetadata,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        MultiwrapInitializer.contractType,
        metadata,
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
  deployEdition = buildDeployTransactionFunction(
    async (metadata: NFTContractDeployMetadata): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        EditionInitializer.contractType,
        metadata,
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
  deployEditionDrop = buildDeployTransactionFunction(
    async (metadata: NFTContractDeployMetadata): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        EditionDropInitializer.contractType,
        metadata,
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
  deployToken = buildDeployTransactionFunction(
    async (
      metadata: TokenContractDeployMetadata,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        TokenInitializer.contractType,
        metadata,
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
  deployTokenDrop = buildDeployTransactionFunction(
    async (
      metadata: TokenContractDeployMetadata,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        TokenDropInitializer.contractType,
        metadata,
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
  deployMarketplace = buildDeployTransactionFunction(
    async (
      metadata: MarketplaceContractDeployMetadata,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        MarketplaceInitializer.contractType,
        metadata,
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
  deployMarketplaceV3 = buildDeployTransactionFunction(
    async (
      metadata: MarketplaceV3ContractDeployMetadata,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        MarketplaceV3Initializer.contractType,
        metadata,
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
  deployPack = buildDeployTransactionFunction(
    async (metadata: NFTContractDeployMetadata): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        PackInitializer.contractType,
        metadata,
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
  deploySplit = buildDeployTransactionFunction(
    async (
      metadata: SplitContractDeployMetadata,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        SplitInitializer.contractType,
        metadata,
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
  deployVote = buildDeployTransactionFunction(
    async (
      metadata: VoteContractDeployMetadata,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        VoteInitializer.contractType,
        metadata,
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
  deployBuiltInContract = buildDeployTransactionFunction(
    async <TContractType extends PrebuiltContractType>(
      contractType: TContractType,
      contractMetadata: z.input<
        DeploySchemaForPrebuiltContractType<TContractType>
      >,
      version: string = "latest",
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
   */
  deployReleasedContract = buildDeployTransactionFunction(
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
   * Deploy a proxy contract of a given implementation via the given factory
   * @param factoryAddress
   * @param implementationAddress
   * @param implementationAbi
   * @param initializerFunction
   * @param initializerArgs
   */
  deployViaFactory = buildTransactionFunction(
    async (
      factoryAddress: AddressOrEns,
      implementationAddress: AddressOrEns,
      implementationAbi: ContractInterface,
      initializerFunction: string,
      initializerArgs: any[],
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
  deployProxy = buildDeployTransactionFunction(
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
  deployViaAutoFactory = buildDeployTransactionFunction(
    async (
      publishMetadataUri: string,
      deployMetadata: DeployMetadata,
      signer: ethers.Signer,
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
      await Promise.all(
        transactionsforDirectDeploy.map((tx) => {
          return deployContractDeterministic(signer, tx, options);
        }),
      );

      const resolvedImplementationAddress = await resolveAddress(
        implementationAddress,
      );

      // 4. deploy proxy with TWStatelessFactory (Clone factory) and return address
      const cloneFactory = await computeCloneFactoryAddress(
        this.getProvider(),
        this.storage,
        create2Factory,
      );

      options?.notifier?.("deploying", "proxy");
      const proxyDeployTransaction = (await this.deployViaFactory.prepare(
        cloneFactory,
        resolvedImplementationAddress,
        deployMetadata.compilerMetadata.abi,
        initializerFunction,
        paramValues,
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
  deployViaCustomFactory = buildDeployTransactionFunction(
    async (
      constructorParamValues: any[],
      deployMetadata: DeployMetadata,
      signer: ethers.Signer,
      chainId: number,
    ): Promise<DeployTransaction> => {
      let customFactoryAddress = deployMetadata.extendedMetadata
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
  deployContractFromUri = buildDeployTransactionFunction(
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

          if (extendedMetadata.deployType === "autoFactory") {
            return await this.deployViaAutoFactory.prepare(
              publishMetadataUri,
              { compilerMetadata, extendedMetadata },
              signer,
              extendedMetadata.factoryDeploymentData
                .implementationInitializerFunction,
              paramValues,
              options,
            );
          } else if (
            extendedMetadata.isDeployableViaProxy ||
            extendedMetadata.isDeployableViaFactory
          ) {
            let implementationAddress = extendedMetadata.factoryDeploymentData
              .implementationAddresses[chainId] as AddressOrEns;
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
              const resolvedFactoryAddress = await resolveAddress(
                factoryAddress,
              );
              return (await this.deployViaFactory.prepare(
                resolvedFactoryAddress,
                resolvedImplementationAddress,
                compilerMetadata.abi,
                extendedMetadata.factoryDeploymentData
                  .implementationInitializerFunction,
                paramValues,
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
      }

      const bytecode = compilerMetadata.bytecode.startsWith("0x")
        ? compilerMetadata.bytecode
        : `0x${compilerMetadata.bytecode}`;
      if (!ethers.utils.isHexString(bytecode)) {
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
  deployContractWithAbi = buildDeployTransactionFunction(
    async (
      abi: ContractInterface,
      bytecode: BytesLike | { object: string },
      constructorParams: Array<any>,
    ): Promise<DeployTransaction> => {
      const signer = this.getSigner();
      const provider = this.getProvider();
      invariant(signer, "Signer is required to deploy contracts");
      const factory = new ethers.ContractFactory(abi, bytecode).connect(signer);

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

      let implementationAddress = extendedMetadata.factoryDeploymentData
        .implementationAddresses[chainId] as AddressOrEns;

      if (!implementationAddress) {
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
    const publishedContract = await new ThirdwebSDK("polygon")
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
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    return process.env.factoryAddress !== undefined;
  }
}
