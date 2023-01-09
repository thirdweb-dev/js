import {
  Abi,
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
  MarketplaceEntrypoint__factory,
  Map,
  Map__factory,
  DirectListings__factory,
  DirectListings,
  MarketplaceEntrypoint,
  EnglishAuctions__factory,
  EnglishAuctions,
  Offers__factory,
  Offers,
  TWProxy__factory,
  TWProxy,
} from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers } from "ethers";
import { FormatTypes, FunctionFragment, Interface } from "ethers/lib/utils";
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
      if (contractType === "custom") {
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
    await setupMarketplaceV3Registry();

    // Setup marketplace-v3 for tests
    async function setupMarketplaceV3Registry() {
      const mapDeployer = (await new ethers.ContractFactory(
        Map__factory.abi,
        Map__factory.bytecode,
      )
        .connect(signer)
        .deploy()) as Map;
      const map = await mapDeployer.deployed();
      const nativeTokenWrapperAddress = getNativeTokenByChainId(ChainId.Hardhat)
        .wrapped.address;

      // Direct Listings
      const directListingsLogicDeployer = (await new ethers.ContractFactory(
        DirectListings__factory.abi,
        DirectListings__factory.bytecode,
      )
        .connect(signer)
        .deploy(nativeTokenWrapperAddress)) as DirectListings;
      const directListingsLogic = await directListingsLogicDeployer.deployed();
      const directListingsInterface = new ethers.utils.Interface(
        DirectListings__factory.abi,
      );
      map.addExtension(
        directListingsInterface.getSighash("totalListings"),
        directListingsLogic.address,
      );
      map.addExtension(
        directListingsInterface.getSighash("isBuyerApprovedForListing"),
        directListingsLogic.address,
      );
      map.addExtension(
        directListingsInterface.getSighash("isCurrencyApprovedForListing"),
        directListingsLogic.address,
      );
      map.addExtension(
        directListingsInterface.getSighash("currencyPriceForListing"),
        directListingsLogic.address,
      );
      map.addExtension(
        directListingsInterface.getSighash("createListing"),
        directListingsLogic.address,
      );
      map.addExtension(
        directListingsInterface.getSighash("updateListing"),
        directListingsLogic.address,
      );
      map.addExtension(
        directListingsInterface.getSighash("cancelListing"),
        directListingsLogic.address,
      );
      map.addExtension(
        directListingsInterface.getSighash("approveBuyerForListing"),
        directListingsLogic.address,
      );
      map.addExtension(
        directListingsInterface.getSighash("approveCurrencyForListing"),
        directListingsLogic.address,
      );
      map.addExtension(
        directListingsInterface.getSighash("buyFromListing"),
        directListingsLogic.address,
      );
      map.addExtension(
        directListingsInterface.getSighash("getAllListings"),
        directListingsLogic.address,
      );
      map.addExtension(
        directListingsInterface.getSighash("getAllValidListings"),
        directListingsLogic.address,
      );
      map.addExtension(
        directListingsInterface.getSighash("getListing"),
        directListingsLogic.address,
      );

      // English Auctions
      const auctionsLogicDeployer = (await new ethers.ContractFactory(
        EnglishAuctions__factory.abi,
        EnglishAuctions__factory.bytecode,
      )
        .connect(signer)
        .deploy(nativeTokenWrapperAddress)) as EnglishAuctions;
      const auctionsLogic = await auctionsLogicDeployer.deployed();
      const auctionsInterface = new ethers.utils.Interface(
        EnglishAuctions__factory.abi,
      );
      map.addExtension(
        auctionsInterface.getSighash("createAuction"),
        auctionsLogic.address,
      );
      map.addExtension(
        auctionsInterface.getSighash("cancelAuction"),
        auctionsLogic.address,
      );
      map.addExtension(
        auctionsInterface.getSighash("collectAuctionPayout"),
        auctionsLogic.address,
      );
      map.addExtension(
        auctionsInterface.getSighash("collectAuctionTokens"),
        auctionsLogic.address,
      );
      map.addExtension(
        auctionsInterface.getSighash("bidInAuction"),
        auctionsLogic.address,
      );
      map.addExtension(
        auctionsInterface.getSighash("isNewWinningBid"),
        auctionsLogic.address,
      );
      map.addExtension(
        auctionsInterface.getSighash("getAuction"),
        auctionsLogic.address,
      );
      map.addExtension(
        auctionsInterface.getSighash("getAllAuctions"),
        auctionsLogic.address,
      );
      map.addExtension(
        auctionsInterface.getSighash("getAllValidAuctions"),
        auctionsLogic.address,
      );
      map.addExtension(
        auctionsInterface.getSighash("getWinningBid"),
        auctionsLogic.address,
      );
      map.addExtension(
        auctionsInterface.getSighash("isAuctionExpired"),
        auctionsLogic.address,
      );
      map.addExtension(
        auctionsInterface.getSighash("totalAuctions"),
        auctionsLogic.address,
      );

      // Offers
      const offersLogicDeployer = (await new ethers.ContractFactory(
        Offers__factory.abi,
        Offers__factory.bytecode,
      )
        .connect(signer)
        .deploy()) as Offers;
      const offersLogic = await offersLogicDeployer.deployed();
      const offersInterface = new ethers.utils.Interface(Offers__factory.abi);
      map.addExtension(
        offersInterface.getSighash("totalOffers"),
        offersLogic.address,
      );
      map.addExtension(
        offersInterface.getSighash("makeOffer"),
        offersLogic.address,
      );
      map.addExtension(
        offersInterface.getSighash("cancelOffer"),
        offersLogic.address,
      );
      map.addExtension(
        offersInterface.getSighash("acceptOffer"),
        offersLogic.address,
      );
      map.addExtension(
        offersInterface.getSighash("getAllValidOffers"),
        offersLogic.address,
      );
      map.addExtension(
        offersInterface.getSighash("getAllOffers"),
        offersLogic.address,
      );
      map.addExtension(
        offersInterface.getSighash("getOffer"),
        offersLogic.address,
      );

      // deploye Marketplace-V3 Entrypoint implementation
      const marketplaceEntrypointDeployer = (await new ethers.ContractFactory(
        MarketplaceEntrypoint__factory.abi,
        MarketplaceEntrypoint__factory.bytecode,
      )
        .connect(signer)
        .deploy(map.address)) as MarketplaceEntrypoint;
      const marketplaceEntrypoint =
        await marketplaceEntrypointDeployer.deployed();

      // add to factory
      const tx = await thirdwebFactoryDeployer.addImplementation(
        marketplaceEntrypoint.address,
      );
      await tx.wait();

      console.log(
        await thirdwebFactoryDeployer.getLatestImplementation(
          ethers.utils.formatBytes32String("Marketplace"),
        ),
      );
      console.log(
        await thirdwebFactoryDeployer.getImplementation(
          ethers.utils.formatBytes32String("Marketplace"),
          2,
        ),
      );
      console.log(
        await thirdwebFactoryDeployer.getImplementation(
          ethers.utils.formatBytes32String("Marketplace"),
          3,
        ),
      );
    }

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
      },
      storage,
    );
  },
};

const generatePluginFunctions = (
  pluginAddress: string,
  pluginAbi: Abi,
): Plugin[] => {
  const pluginInterface = new ethers.utils.Interface(pluginAbi);
  const pluginFunctions: Plugin[] = [];
  // TODO - filter out common functions like _msgSender(), contractType(), etc.
  for (const fnFragment of Object.values(pluginInterface.functions)) {
    const fn = pluginInterface.getFunction(fnFragment.name);
    pluginFunctions.push({
      functionSelector: pluginInterface.getSighash(fn),
      functionSignature:
        fn.name + "(" + fn.inputs.map((i) => i.type).join(",") + ")",
      pluginAddress,
    });
  }
  return pluginFunctions;
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
    TWMultichainRegistryLogic__factory.abi,
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
