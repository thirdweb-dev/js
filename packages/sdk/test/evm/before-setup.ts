import {
  Abi,
  AbiSchema,
  ChainId,
  CONTRACTS_MAP,
  ContractType,
  DEFAULT_IPFS_GATEWAY,
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
} from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ContractInterface, ethers } from "ethers";
import hardhat from "hardhat";
import { generatePluginFunctions } from "../../src/evm/common/plugin/generatePluginFunctions";

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
        gasSettings: {
          maxPriceInGwei: 10000,
        },
        supportedChains: [
          {
            chainId: 31337,
            rpc: ["http://localhost:8545"],
            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
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
  // Direct Listings
  const directListingsPluginAddress = await deployContractAndUploadMetadata(
    DirectListingsLogic__factory.abi,
    DirectListingsLogic__factory.bytecode,
    signer,
    [mock_weth_address],
  );
  const pluginsDirectListings: Plugin[] = generatePluginFunctions(
    directListingsPluginAddress,
    AbiSchema.parse(DirectListingsLogic__factory.abi),
  );

  // English Auctions
  const englishAuctionPluginAddress = await deployContractAndUploadMetadata(
    EnglishAuctionsLogic__factory.abi,
    EnglishAuctionsLogic__factory.bytecode,
    signer,
    [mock_weth_address],
  );
  const pluginsEnglishAuctions: Plugin[] = generatePluginFunctions(
    englishAuctionPluginAddress,
    AbiSchema.parse(EnglishAuctionsLogic__factory.abi),
  );

  // Offers
  const offersLogicPluginAddress = await deployContractAndUploadMetadata(
    OffersLogic__factory.abi,
    OffersLogic__factory.bytecode,
    signer,
  );
  const pluginsOffers: Plugin[] = generatePluginFunctions(
    offersLogicPluginAddress,
    AbiSchema.parse(OffersLogic__factory.abi),
  );

  // Map
  const pluginMapAddress = await deployContractAndUploadMetadata(
    PluginMap__factory.abi,
    PluginMap__factory.bytecode,
    signer,
    [[...pluginsDirectListings, ...pluginsEnglishAuctions, ...pluginsOffers]],
  );

  // Router
  const marketplaceV3Address = await deployContractAndUploadMetadata(
    MarketplaceV3__factory.abi,
    MarketplaceV3__factory.bytecode,
    signer,
    [pluginMapAddress],
    "MarketplaceV3",
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
