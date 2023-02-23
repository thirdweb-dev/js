import {
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
  Abi,
} from "../../src/evm";
import {
  Plugin,
  PluginFunction,
  PluginMetadata,
} from "../../src/evm/types/plugins";
import { MockStorage } from "./mock/MockStorage";
import { deployContractAndUploadMetadata } from "./utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  ContractPublisher,
  ContractPublisher__factory,
  DropERC20__factory,
  DropERC20_V2__factory,
  Marketplace__factory,
  MockContractPublisher,
  MockContractPublisher__factory,
  Multiwrap__factory,
  PermissionsEnumerable__factory,
  PluginRegistry,
  PluginRegistry__factory,
  Split__factory,
  TieredDrop__factory,
  TieredDropLogic__factory,
  TokenERC1155__factory,
  TokenERC20__factory,
  TokenERC721__factory,
  TWFactory,
  TWFactory__factory,
  TWRegistry,
  TWRegistry__factory,
  VoteERC20__factory,
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
          break;
        case SignatureDropInitializer.contractType:
          break;
        case EditionInitializer.contractType:
          factories.push(TokenERC1155__factory);
          break;
        case EditionDropInitializer.contractType:
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

    // setup tiered drop
    const tieredDropEntrypointAddress = await setupTieredDrop();
    let tx = await thirdwebFactoryDeployer.approveImplementation(
      tieredDropEntrypointAddress,
      true,
    );
    await tx.wait();

    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.registryAddress = thirdwebRegistryAddress;
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.factoryAddress = thirdwebFactoryDeployer.address;
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.contractPublisherAddress = contractPublisher.address;
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.tieredDropImplementationAddress = tieredDropEntrypointAddress;

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
  for (const fnName of Object.keys(pluginInterface.functions)) {
    const fn = pluginInterface.getFunction(fnName);
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function setupTieredDrop(): Promise<string> {
  const plugins: Plugin[] = [];
  const pluginNames: string[] = [];

  // PermissionsEnumerable plugin
  const permissionsAddress = await deployContractAndUploadMetadata(
    PermissionsEnumerable__factory.abi,
    PermissionsEnumerable__factory.bytecode,
    signer,
  );
  const functionsPermissions: PluginFunction[] = generatePluginFunctions(
    permissionsAddress,
    PermissionsEnumerable__factory.abi,
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

  // Logic
  const tieredDropLogicAddress = await deployContractAndUploadMetadata(
    TieredDropLogic__factory.abi,
    TieredDropLogic__factory.bytecode,
    signer,
    [],
  );
  const functionsTieredDropLogic: PluginFunction[] = generatePluginFunctions(
    tieredDropLogicAddress,
    TieredDropLogic__factory.abi,
  );
  const metadataTieredDropLogic: PluginMetadata = {
    name: "TieredDropLogic",
    metadataURI: "",
    implementation: tieredDropLogicAddress,
  };
  plugins.push({
    metadata: metadataTieredDropLogic,
    functions: functionsTieredDropLogic,
  });
  pluginNames.push("TieredDropLogic");

  // Add plugins to plugin-registry
  await Promise.all(
    plugins.map((plugin) => {
      return pluginRegistry.addPlugin(plugin);
    }),
  );

  // Router
  const tieredDropAddress = await deployContractAndUploadMetadata(
    TieredDrop__factory.abi,
    TieredDrop__factory.bytecode,
    signer,
    [plugins],
  );

  return tieredDropAddress;
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
