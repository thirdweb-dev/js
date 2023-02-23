import {
  Abi,
  ChainId,
  CONTRACTS_MAP,
  ContractType,
  DEFAULT_IPFS_GATEWAY,
  EditionDropInitializer,
  EditionInitializer,
  getNativeTokenByChainId,
  LOCAL_NODE_PKEY,
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
import {
  Plugin,
  PluginFunction,
  PluginMetadata,
} from "../../src/evm/types/plugins";
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
  TWMultichainRegistry,
  TWMultichainRegistry__factory,
  MultichainRegistryCore,
  MultichainRegistryCore__factory,
  PluginRegistry__factory,
  VoteERC20__factory,
  MarketplaceV3__factory,
  DirectListingsLogic__factory,
  EnglishAuctionsLogic__factory,
  OffersLogic__factory,
  PluginRegistry,
  Permissions__factory,
  Permissions,
  MetaTx__factory,
  MetaTx,
  PermissionsEnumerableImpl__factory,
  PermissionsEnumerable,
  PermissionsEnumerableImpl,
  PlatformFeeImpl__factory,
  PlatformFeeImpl,
  ContractMetadataImpl__factory,
  ContractMetadataImpl,
} from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers } from "ethers";
import hardhat from "hardhat";

// it's there, trust me bro
const hardhatEthers = (hardhat as any).ethers;

const RPC_URL = "http://localhost:8545";

const jsonProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
const defaultProvider = hardhatEthers.provider;

let registryAddress: string;
let sdk: ThirdwebSDK;
const ipfsGatewayUrl = DEFAULT_IPFS_GATEWAY;
let signer: SignerWithAddress;
let signers: SignerWithAddress[];
let storage: ThirdwebStorage;
let implementations: { [key in ContractType]?: string };
let mock_weth_address: string;
let pluginRegistry: PluginRegistry;

const fastForwardTime = async (timeInSeconds: number): Promise<void> => {
  const now = Math.floor(Date.now() / 1000);
  await defaultProvider.send("evm_mine", [now + timeInSeconds]);
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
    signers = await hardhatEthers.getSigners();
    implementations = {};

    [signer] = signers;

    const trustedForwarderAddress =
      "0xc82BbE41f2cF04e3a8efA18F7032BDD7f6d98a81";
    await jsonProvider.send("hardhat_reset", []);

    const mock_weth_deployer = new ethers.ContractFactory(
      weth.abi,
      weth.bytecode,
    )
      .connect(signer)
      .deploy();
    const mock_weth = await (await mock_weth_deployer).deployed();
    mock_weth_address = mock_weth.address;

    const pluginRegistryDeployer = (await new ethers.ContractFactory(
      PluginRegistry__factory.abi,
      PluginRegistry__factory.bytecode,
    )
      .connect(signer)
      .deploy(signer.address)) as PluginRegistry;
    pluginRegistry = await pluginRegistryDeployer.deployed();

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
      contractFactory: ethers.ContractFactory,
      contractType: ContractType,
    ): Promise<ethers.Contract> {
      switch (contractType) {
        case MarketplaceInitializer.contractType:
        case MultiwrapInitializer.contractType:
          const nativeTokenWrapperAddress = getNativeTokenByChainId(
            ChainId.Hardhat,
          ).wrapped.address;
          return await contractFactory.deploy(nativeTokenWrapperAddress);
        case PackInitializer.contractType:
          const addr = getNativeTokenByChainId(ChainId.Hardhat).wrapped.address;
          return await contractFactory.deploy(addr, trustedForwarderAddress);
        default:
          return await contractFactory.deploy();
      }
    }

    for (const contractType in CONTRACTS_MAP) {
      if (contractType === "custom" || contractType === "marketplace-v3") {
        continue;
      }
      let factories: any[] = [];
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
        const contractFactory = new ethers.ContractFactory(
          factory.abi,
          factory.bytecode,
        ).connect(signer);

        const deployedContract: ethers.Contract = await deployContract(
          contractFactory,
          contractType as ContractType,
        );

        await deployedContract.deployed();
        const tx = await thirdwebFactoryDeployer.addImplementation(
          deployedContract.address,
        );
        await tx.wait();
        implementations[contractType as ContractType] =
          deployedContract.address;
      }
    }

    // setup marketplace-v3 and add implementation to factory
    const marketplaceEntrypointAddress = await setupMarketplaceV3(
      trustedForwarderAddress,
    );
    const tx = await thirdwebFactoryDeployer.addImplementation(
      marketplaceEntrypointAddress,
    );
    await tx.wait();

    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.registryAddress = thirdwebRegistryAddress;
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.factoryAddress = thirdwebFactoryDeployer.address;
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.contractPublisherAddress = contractPublisher.address;
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.multiChainRegistryAddress = await setupMultichainRegistry();

    storage = MockStorage();
    sdk = new ThirdwebSDK(
      signer,
      {
        gasSettings: {
          maxPriceInGwei: 10000,
        },
      },
      storage,
    );
  },
};

const getFunctionSignature = (fnInputs: any): string => {
  return (
    "(" +
    fnInputs
      .map((i) => {
        return i.type === "tuple" ? getFunctionSignature(i.components) : i.type;
      })
      .join(",") +
    ")"
  );
};

const generatePluginFunctions = (
  pluginAddress: string,
  pluginAbi: Abi,
): PluginFunction[] => {
  const pluginInterface = new ethers.utils.Interface(pluginAbi);
  const pluginFunctions: PluginFunction[] = [];
  // TODO - filter out common functions like _msgSender(), contractType(), etc.
  for (const fnFragment of Object.values(pluginInterface.functions)) {
    const fn = pluginInterface.getFunction(fnFragment.name);
    if (fn.name.includes("_")) {
      continue;
    }
    pluginFunctions.push({
      functionSelector: pluginInterface.getSighash(fn),
      functionSignature: fn.name + getFunctionSignature(fn.inputs),
    });
  }
  return pluginFunctions;
};

// Setup multichain registry for tests
async function setupMultichainRegistry(): Promise<string> {
  const plugins: Plugin[] = [];
  const pluginNames: string[] = [];

  // multichain registry core plugin
  const multichainRegistryCoreDeployer = (await new ethers.ContractFactory(
    MultichainRegistryCore__factory.abi,
    MultichainRegistryCore__factory.bytecode,
  )
    .connect(signer)
    .deploy()) as MultichainRegistryCore;
  const multichainRegistryCore =
    await multichainRegistryCoreDeployer.deployed();

  const functionsCore: PluginFunction[] = generatePluginFunctions(
    multichainRegistryCore.address,
    MultichainRegistryCore__factory.abi,
  );
  const metadataCore: PluginMetadata = {
    name: "MultichainRegistryCore",
    metadataURI: "",
    implementation: multichainRegistryCore.address,
  };
  plugins.push({
    metadata: metadataCore,
    functions: functionsCore,
  });
  pluginNames.push("MultichainRegistryCore");

  // Add plugins to plugin-registry
  await Promise.all(
    plugins.map((plugin) => {
      return pluginRegistry.addPlugin(plugin);
    }),
  );

  // Add util plugin names
  pluginNames.push("PermissionsEnumerable");
  pluginNames.push("ContractMetadata");
  pluginNames.push("ERC2771Context");
  pluginNames.push("PlatformFee");

  const multichainRegistryRouterDeployer = (await new ethers.ContractFactory(
    TWMultichainRegistry__factory.abi,
    TWMultichainRegistry__factory.bytecode,
  )
    .connect(signer)
    .deploy(pluginRegistry.address, pluginNames)) as TWMultichainRegistry;
  const multichainRegistryRouter =
    await multichainRegistryRouterDeployer.deployed();

  return multichainRegistryRouter.address;
}

// Setup marketplace-v3 for tests
async function setupMarketplaceV3(
  trustedForwarderAddress: string,
): Promise<string> {
  const plugins: Plugin[] = [];
  const pluginNames: string[] = [];

  // PermissionsEnumerable plugin
  const permissionsAddress = await deployContractAndUploadMetadata(
    PermissionsEnumerableImpl__factory.abi,
    PermissionsEnumerableImpl__factory.bytecode,
    signer,
  );
  const functionsPermissions: PluginFunction[] = generatePluginFunctions(
    permissionsAddress,
    PermissionsEnumerableImpl__factory.abi,
  );
  const metadataPermissions: PluginMetadata = {
    name: "PermissionsEnumerable",
    metadataURI: "",
    implementation: permissionsAddress,
  };
  plugins.push({
    metadata: metadataPermissions,
    functions: functionsPermissions,
  });
  pluginNames.push("PermissionsEnumerable");

  // PlatformFee plugin
  const platformFeeAddress = await deployContractAndUploadMetadata(
    PlatformFeeImpl__factory.abi,
    PlatformFeeImpl__factory.bytecode,
    signer,
  );
  const functionsPlatformFee: PluginFunction[] = generatePluginFunctions(
    platformFeeAddress,
    PlatformFeeImpl__factory.abi,
  );
  const metadataPlatformFee: PluginMetadata = {
    name: "PlatformFee",
    metadataURI: "",
    implementation: platformFeeAddress,
  };
  plugins.push({
    metadata: metadataPlatformFee,
    functions: functionsPlatformFee,
  });
  pluginNames.push("PlatformFee");

  // ContractMetadata plugin
  const contractMetadataAddress = await deployContractAndUploadMetadata(
    ContractMetadataImpl__factory.abi,
    ContractMetadataImpl__factory.bytecode,
    signer,
  );
  const functionsContractMetadata: PluginFunction[] = generatePluginFunctions(
    contractMetadataAddress,
    ContractMetadataImpl__factory.abi,
  );
  const metadataContractMetadata: PluginMetadata = {
    name: "ContractMetadata",
    metadataURI: "",
    implementation: contractMetadataAddress,
  };
  plugins.push({
    metadata: metadataContractMetadata,
    functions: functionsContractMetadata,
  });
  pluginNames.push("ContractMetadata");

  // MetaTx plugin
  const metaTxAddress = await deployContractAndUploadMetadata(
    MetaTx__factory.abi,
    MetaTx__factory.bytecode,
    signer,
    [[trustedForwarderAddress]],
  );
  const functionsMetaTx: PluginFunction[] = generatePluginFunctions(
    metaTxAddress,
    MetaTx__factory.abi,
  );
  const metadataMetaTx: PluginMetadata = {
    name: "ERC2771Context",
    metadataURI: "",
    implementation: metaTxAddress,
  };
  plugins.push({
    metadata: metadataMetaTx,
    functions: functionsMetaTx,
  });
  pluginNames.push("ERC2771Context");

  // Direct Listings
  const directListingsPluginAddress = await deployContractAndUploadMetadata(
    DirectListingsLogic__factory.abi,
    DirectListingsLogic__factory.bytecode,
    signer,
    [mock_weth_address],
  );
  const functionsDirectListings: PluginFunction[] = generatePluginFunctions(
    directListingsPluginAddress,
    DirectListingsLogic__factory.abi,
  );
  const metadataDirectListings: PluginMetadata = {
    name: "DirectListingsLogic",
    metadataURI: "",
    implementation: directListingsPluginAddress,
  };
  plugins.push({
    metadata: metadataDirectListings,
    functions: functionsDirectListings,
  });
  pluginNames.push("DirectListingsLogic");

  // English Auctions
  const englishAuctionPluginAddress = await deployContractAndUploadMetadata(
    EnglishAuctionsLogic__factory.abi,
    EnglishAuctionsLogic__factory.bytecode,
    signer,
    [mock_weth_address],
  );
  const functionsEnglishAuctions: PluginFunction[] = generatePluginFunctions(
    englishAuctionPluginAddress,
    EnglishAuctionsLogic__factory.abi,
  );
  const metadataEnglishAuctions: PluginMetadata = {
    name: "EnglishAuctionsLogic",
    metadataURI: "",
    implementation: englishAuctionPluginAddress,
  };
  plugins.push({
    metadata: metadataEnglishAuctions,
    functions: functionsEnglishAuctions,
  });
  pluginNames.push("EnglishAuctionsLogic");

  // Offers
  const offersLogicPluginAddress = await deployContractAndUploadMetadata(
    OffersLogic__factory.abi,
    OffersLogic__factory.bytecode,
    signer,
  );
  const functionsOffers: PluginFunction[] = generatePluginFunctions(
    offersLogicPluginAddress,
    OffersLogic__factory.abi,
  );
  const metadataOffers: PluginMetadata = {
    name: "OffersLogic",
    metadataURI: "",
    implementation: offersLogicPluginAddress,
  };
  plugins.push({
    metadata: metadataOffers,
    functions: functionsOffers,
  });
  pluginNames.push("OffersLogic");

  // Add plugins to plugin-registry
  await Promise.all(
    plugins.map((plugin) => {
      return pluginRegistry.addPlugin(plugin);
    }),
  );

  // Router
  const marketplaceV3Address = await deployContractAndUploadMetadata(
    MarketplaceV3__factory.abi,
    MarketplaceV3__factory.bytecode,
    signer,
    [pluginRegistry.address, pluginNames],
  );
  return marketplaceV3Address;
}

export {
  ipfsGatewayUrl,
  sdk,
  signers,
  jsonProvider,
  defaultProvider,
  registryAddress,
  fastForwardTime,
  storage,
  implementations,
  hardhatEthers,
};
