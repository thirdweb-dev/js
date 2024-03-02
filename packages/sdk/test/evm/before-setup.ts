import {
  AbiSchema,
  ChainId,
  CONTRACTS_MAP,
  ContractType,
  EditionDropInitializer,
  EditionInitializer,
  getNativeTokenByChainId,
  MarketplaceInitializer,
  MultiwrapInitializer,
  NFTCollectionInitializer,
  NFTDropInitializer,
  PackInitializer,
  SignatureDropInitializer,
  SplitInitializer,
  ThirdwebSDK,
  TokenDropInitializer,
  TokenInitializer,
  VoteInitializer,
} from "../../src/evm";
import { Plugin } from "../../src/evm/types/plugins";
import { MockStorage } from "./mock/MockStorage";
import weth from "./mock/WETH9.json";
import { deployContractAndUploadMetadata } from "./utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  ContractPublisher,
  ContractPublisher__factory,
  DropERC1155__factory,
  DropERC1155_V2__factory,
  DropERC20__factory,
  DropERC20_V2__factory,
  DropERC721__factory,
  DropERC721_V3__factory,
  Marketplace__factory,
  MockContractPublisher,
  MockContractPublisher__factory,
  Multiwrap__factory,
  Pack__factory,
  SignatureDrop__factory,
  SignatureDrop_V4__factory,
  Split__factory,
  TokenERC1155__factory,
  TokenERC20__factory,
  TokenERC721__factory,
  TWFactory,
  TWFactory__factory,
  TWRegistry,
  TWRegistry__factory,
  TWMultichainRegistryRouter,
  TWMultichainRegistryRouter__factory,
  TWMultichainRegistryLogic,
  TWMultichainRegistryLogic__factory,
  PluginMap,
  PluginMap__factory,
  VoteERC20__factory,
  MarketplaceV3__factory,
  DirectListingsLogic__factory,
  EnglishAuctionsLogic__factory,
  OffersLogic__factory,
  Forwarder__factory,
} from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { constants, ContractInterface, ethers } from "ethers";
import hardhat from "hardhat";
import {
  generateExtensionFunctions,
  generatePluginFunctions,
} from "../../src/evm/common/plugin/generatePluginFunctions";
import { mockUploadMetadataWithBytecode } from "./utils";
import {
  bytecode as TWCloneFactoryBytecode,
  abi as TWCloneFactoryAbi,
} from "./metadata/TWCloneFactory";
import {
  Extension,
  ExtensionFunction,
  ExtensionMetadata,
} from "../../src/evm/types/extensions";
import { startProxy } from "@viem/anvil";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv-mono").load();

// it's there, trust me bro
const hardhatEthers = (hardhat as any).ethers;

const RPC_URL = "http://localhost:8545";

const jsonProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
const defaultProvider = hardhatEthers.provider;

const extendedMetadataMock = {
  name: "",
  metadataUri: "",
  bytecodeUri: "",
  analytics: {},
  version: "1.0.0",
  displayName: "",
  description: "",
  changelog: "",
  isDeployableViaFactory: false,
  isDeployableViaProxy: false,
  factoryDeploymentData: {
    implementationAddresses: {},
    implementationInitializerFunction: "initialize",
    factoryAddresses: {},
  },
  constructorParams: {},
  publisher: "",
  customFactoryInput: {
    factoryFunction: "",
    customFactoryAddresses: [],
  },
};

let registryAddress: string;
let sdk: ThirdwebSDK;
let signer: SignerWithAddress;
let signers: SignerWithAddress[];
let storage: ThirdwebStorage;
let implementations: { [key in ContractType]?: string };
let mock_weth_address: string;
let thirdwebFactory: TWFactory;

const fastForwardTime = async (timeInSeconds: number): Promise<void> => {
  const now = Math.floor(Date.now() / 1000);
  await jsonProvider.send("anvil_mine", [now + timeInSeconds]);
};

export const expectError = (e: unknown, message: string) => {
  if (e instanceof Error) {
    if (!e.message.includes(message)) {
      throw e;
    }
  } else {
    throw e;
  }
};

export const mochaHooks = {
  beforeAll: async () => {
    try {
      await startProxy({
        port: 8545,
        options: {
          chainId: 31337,
        },
      });
    } catch (e) {
      // assume already in use -> do nothing
    }

    // this should still work because the private keys are the same(?)
    signers = await hardhatEthers.getSigners();
    implementations = {};

    [signer] = signers;

    const trustedForwarderAddress =
      "0xc82BbE41f2cF04e3a8efA18F7032BDD7f6d98a81";

    await uploadAutoFactoryInfra();

    const mock_weth_deployer = new ethers.ContractFactory(
      weth.abi,
      weth.bytecode,
    )
      .connect(signer)
      .deploy();
    const mock_weth = await (await mock_weth_deployer).deployed();
    mock_weth_address = mock_weth.address;

    const registry = (await new ethers.ContractFactory(
      TWRegistry__factory.abi,
      TWRegistry__factory.bytecode,
    )
      .connect(signer)
      .deploy(trustedForwarderAddress)) as TWRegistry;
    const registryContract = await registry.deployed();

    const thirdwebFactoryDeployer = (await new ethers.ContractFactory(
      TWFactory__factory.abi,
      TWFactory__factory.bytecode,
    )
      .connect(signer)
      .deploy(trustedForwarderAddress, registry.address)) as TWFactory;

    thirdwebFactory = await thirdwebFactoryDeployer.deployed();
    const deployTxFactory = thirdwebFactoryDeployer.deployTransaction;
    await deployTxFactory.wait();
    const thirdwebRegistryAddress = await thirdwebFactoryDeployer.registry();
    registryAddress = thirdwebFactoryDeployer.address;

    await registryContract.grantRole(
      await registryContract.OPERATOR_ROLE(),
      thirdwebFactoryDeployer.address,
    );

    // Mock publisher for tests
    const mockPublisher = (await new ethers.ContractFactory(
      MockContractPublisher__factory.abi,
      MockContractPublisher__factory.bytecode,
    )
      .connect(signer)
      .deploy()) as MockContractPublisher;
    const contractPublisher = (await new ethers.ContractFactory(
      ContractPublisher__factory.abi,
      ContractPublisher__factory.bytecode,
    )
      .connect(signer)
      .deploy(
        trustedForwarderAddress,
        mockPublisher.address,
      )) as ContractPublisher; // TODO needs MockPublisher here
    await contractPublisher.deployed();

    async function deployContract(
      abi: ContractInterface,
      bytecode: string,
      contractType: ContractType,
    ): Promise<string> {
      switch (contractType) {
        case MarketplaceInitializer.contractType:
        case MultiwrapInitializer.contractType:
          const nativeTokenWrapperAddress = getNativeTokenByChainId(
            ChainId.Hardhat,
          ).wrapped.address;
          return await deployContractAndUploadMetadata(abi, bytecode, signer, [
            nativeTokenWrapperAddress,
          ]);
        case PackInitializer.contractType:
          const addr = getNativeTokenByChainId(ChainId.Hardhat).wrapped.address;
          return await deployContractAndUploadMetadata(abi, bytecode, signer, [
            addr,
            trustedForwarderAddress,
          ]);
        default:
          return await deployContractAndUploadMetadata(abi, bytecode, signer);
      }
    }

    for (const contractType in CONTRACTS_MAP) {
      if (contractType === "custom" || contractType === "marketplace-v3") {
        continue;
      }
      const factories: any[] = [];
      switch (contractType) {
        case TokenInitializer.contractType:
          factories.push(TokenERC20__factory);
          break;
        case TokenDropInitializer.contractType:
          factories.push(DropERC20_V2__factory, DropERC20__factory);
          break;
        case NFTCollectionInitializer.contractType:
          factories.push(TokenERC721__factory);
          break;
        case NFTDropInitializer.contractType:
          factories.push(DropERC721_V3__factory, DropERC721__factory);
          break;
        case SignatureDropInitializer.contractType:
          factories.push(SignatureDrop_V4__factory, SignatureDrop__factory);
          break;
        case EditionInitializer.contractType:
          factories.push(TokenERC1155__factory);
          break;
        case EditionDropInitializer.contractType:
          factories.push(DropERC1155_V2__factory, DropERC1155__factory);
          break;
        case SplitInitializer.contractType:
          factories.push(Split__factory);
          break;
        case VoteInitializer.contractType:
          factories.push(VoteERC20__factory);
          break;
        case MarketplaceInitializer.contractType:
          factories.push(Marketplace__factory);
          break;
        case PackInitializer.contractType:
          factories.push(Pack__factory);
          break;
        case MultiwrapInitializer.contractType:
          factories.push(Multiwrap__factory);
          break;
        default:
          throw new Error(`No factory for contract: ${contractType}`);
      }

      for (const factory of factories) {
        const addr = await deployContract(
          factory.abi,
          factory.bytecode,
          contractType as ContractType,
        );

        const tx = await thirdwebFactoryDeployer.addImplementation(addr);
        await tx.wait();
        implementations[contractType as ContractType] = addr;
      }
    }

    // setup marketplace-v3 and add implementation to factory
    const marketplaceEntrypointAddress = await setupMarketplaceV3();
    const tx = await thirdwebFactoryDeployer.addImplementation(
      marketplaceEntrypointAddress,
    );
    await tx.wait();
    implementations["marketplace-v3"] = marketplaceEntrypointAddress;

    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.registryAddress = thirdwebRegistryAddress;
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.factoryAddress = thirdwebFactoryDeployer.address;
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.contractPublisherAddress = contractPublisher.address;
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.multiChainRegistryAddress = await setupMultichainRegistry(
      trustedForwarderAddress,
    );

    storage = MockStorage();
    sdk = new ThirdwebSDK(
      signer,
      {
        secretKey: process.env.TW_SECRET_KEY,
        gasSettings: {
          maxPriceInGwei: 10000,
        },
        supportedChains: [
          {
            chainId: 31337,
            rpc: ["http://localhost:8545"],
            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
            slug: "hardhat",
          },
        ],
      },
      storage,
    );
  },
};

// Setup multichain registry for tests
async function setupMultichainRegistry(
  trustedForwarderAddress: string,
): Promise<string> {
  const multichainRegistryLogicDeployer = (await new ethers.ContractFactory(
    TWMultichainRegistryLogic__factory.abi,
    TWMultichainRegistryLogic__factory.bytecode,
  )
    .connect(signer)
    .deploy()) as TWMultichainRegistryLogic;
  const multichainRegistryLogic =
    await multichainRegistryLogicDeployer.deployed();

  const plugins: Plugin[] = generatePluginFunctions(
    multichainRegistryLogic.address,
    AbiSchema.parse(TWMultichainRegistryLogic__factory.abi),
  );

  const pluginMapDeployer = (await new ethers.ContractFactory(
    PluginMap__factory.abi,
    PluginMap__factory.bytecode,
  )
    .connect(signer)
    .deploy(plugins)) as PluginMap;
  const pluginMap = await pluginMapDeployer.deployed();
  const multichainRegistryRouterDeployer = (await new ethers.ContractFactory(
    TWMultichainRegistryRouter__factory.abi,
    TWMultichainRegistryRouter__factory.bytecode,
  )
    .connect(signer)
    .deploy(pluginMap.address, [
      trustedForwarderAddress,
    ])) as TWMultichainRegistryRouter;
  const multichainRegistryRouter =
    await multichainRegistryRouterDeployer.deployed();

  return multichainRegistryRouter.address;
}

// Setup marketplace-v3 for tests
async function setupMarketplaceV3(): Promise<string> {
  const extensions: Extension[] = [];

  // Direct Listings
  const directListingsExtensionAddress = await deployContractAndUploadMetadata(
    DirectListingsLogic__factory.abi,
    DirectListingsLogic__factory.bytecode,
    signer,
    [mock_weth_address],
  );
  const directListingsFunctions: ExtensionFunction[] =
    generateExtensionFunctions(
      AbiSchema.parse(DirectListingsLogic__factory.abi),
    );
  const directListingsExtensionMetadata: ExtensionMetadata = {
    name: "DirectListingsLogic",
    metadataURI: "",
    implementation: directListingsExtensionAddress,
  };
  extensions.push({
    metadata: directListingsExtensionMetadata,
    functions: directListingsFunctions,
  });

  // English Auctions
  const englishAuctionExtensionAddress = await deployContractAndUploadMetadata(
    EnglishAuctionsLogic__factory.abi,
    EnglishAuctionsLogic__factory.bytecode,
    signer,
    [mock_weth_address],
  );
  const englishAuctionsFunctions: ExtensionFunction[] =
    generateExtensionFunctions(
      AbiSchema.parse(EnglishAuctionsLogic__factory.abi),
    );
  const englishAuctionsExtensionMetadata: ExtensionMetadata = {
    name: "EnglishAuctionsLogic",
    metadataURI: "",
    implementation: englishAuctionExtensionAddress,
  };
  extensions.push({
    metadata: englishAuctionsExtensionMetadata,
    functions: englishAuctionsFunctions,
  });

  // Offers
  const offersLogicExtensionAddress = await deployContractAndUploadMetadata(
    OffersLogic__factory.abi,
    OffersLogic__factory.bytecode,
    signer,
  );
  const offersFunctions: ExtensionFunction[] = generateExtensionFunctions(
    AbiSchema.parse(OffersLogic__factory.abi),
  );
  const offersExtensionMetadata: ExtensionMetadata = {
    name: "OffersLogic",
    metadataURI: "",
    implementation: offersLogicExtensionAddress,
  };
  extensions.push({
    metadata: offersExtensionMetadata,
    functions: offersFunctions,
  });

  // Router
  const royaltyEngineAddress = constants.AddressZero;
  const marketplaceV3Address = await deployContractAndUploadMetadata(
    MarketplaceV3__factory.abi,
    MarketplaceV3__factory.bytecode,
    signer,
    [
      {
        extensions: extensions,
        royaltyEngineAddress: royaltyEngineAddress,
        nativeTokenWrapper: mock_weth_address,
      },
    ],
    "MarketplaceV3",
  );
  return marketplaceV3Address;
}

async function uploadAutoFactoryInfra() {
  // mock upload Forwarder
  await mockUploadMetadataWithBytecode(
    "Forwarder",
    Forwarder__factory.abi,
    Forwarder__factory.bytecode,
    "",
    {
      ...extendedMetadataMock,
      deployType: "standard",
      networksForDeployment: {
        allNetworks: true,
        networksEnabled: [],
      },
    },
    "ipfs://Qmcu8FaqerUvQYb4qPg7PwkXa6dRtEe45LedLJPN42Jwqe/0",
    // ^ we use actual publish uri as mock uri here, because this contract's uri is fetched from publisher by contractName
  );

  // mock upload TWCloneFactory
  await mockUploadMetadataWithBytecode(
    "Forwarder",
    TWCloneFactoryAbi,
    TWCloneFactoryBytecode,
    "",
    {
      ...extendedMetadataMock,
      deployType: "standard",
      networksForDeployment: {
        allNetworks: true,
        networksEnabled: [],
      },
    },
    "ipfs://QmYfw13Zykqf9jAmJobNgYrEpatEF9waWcQPUHvJ7sctRb/0",
    // ^ we use actual publish uri as mock uri here, because this contract's uri is fetched from publisher by contractName
  );
}

export {
  sdk,
  signers,
  jsonProvider,
  defaultProvider,
  registryAddress,
  fastForwardTime,
  storage,
  implementations,
  hardhatEthers,
  thirdwebFactory,
  extendedMetadataMock,
};
