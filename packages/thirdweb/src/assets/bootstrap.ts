import { encodePacked } from "viem";
import { ZERO_ADDRESS } from "../constants/addresses.js";
import { getContract } from "../contract/contract.js";
import { getOrDeployInfraContract } from "../contract/deployment/utils/bootstrap.js";
import {
  deployCreate2Factory,
  getDeployedCreate2Factory,
} from "../contract/deployment/utils/create-2-factory.js";
import { getDeployedInfraContract } from "../contract/deployment/utils/infra.js";
import { parseEventLogs } from "../event/actions/parse-logs.js";
import { assetInfraDeployedEvent } from "../extensions/assets/__generated__/AssetInfraDeployer/events/AssetInfraDeployed.js";
import { deployInfraProxyDeterministic } from "../extensions/assets/__generated__/AssetInfraDeployer/write/deployInfraProxyDeterministic.js";
import { encodeInitialize as encodeFeeManagerInit } from "../extensions/assets/__generated__/FeeManager/write/initialize.js";
import { encodeInitialize as encodeRouterInit } from "../extensions/assets/__generated__/Router/write/initialize.js";
import { sendAndConfirmTransaction } from "../transaction/actions/send-and-confirm-transaction.js";
import { keccakId } from "../utils/any-evm/keccak-id.js";
import { isContractDeployed } from "../utils/bytecode/is-contract-deployed.js";
import { keccak256 } from "../utils/hashing/keccak256.js";
import type {
  ClientAndChain,
  ClientAndChainAndAccount,
} from "../utils/types.js";
import {
  DEFAULT_FEE_BPS,
  DEFAULT_FEE_RECIPIENT,
  DEFAULT_INFRA_ADMIN,
  DEFAULT_SALT,
  IMPLEMENTATIONS,
} from "./constants.js";
import { deployInfraProxy } from "./deploy-infra-proxy.js";
import { getInitCodeHashERC1967 } from "./get-initcode-hash-1967.js";

export async function deployRouter(options: ClientAndChainAndAccount) {
  let [feeManager, marketSaleImpl] = await Promise.all([
    getDeployedFeeManager(options),
    getDeployedInfraContract({
      ...options,
      contractId: "MarketSale",
      publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
    }),
  ]);

  if (!feeManager) {
    feeManager = await deployFeeManager(options);
  }

  if (!marketSaleImpl) {
    marketSaleImpl = await getOrDeployInfraContract({
      ...options,
      contractId: "MarketSale",
      publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
    });
  }

  const assetFactory = await getDeployedAssetFactory(options);
  if (!assetFactory) {
    throw new Error(`Asset factory not found for chain: ${options.chain.id}`);
  }

  const routerImpl = await getOrDeployInfraContract({
    ...options,
    contractId: "Router",
    constructorParams: {
      _marketSaleImplementation: marketSaleImpl.address,
      _feeManager: feeManager.address,
    },
    publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
  });

  // encode init data
  const initData = encodeRouterInit({
    owner: DEFAULT_INFRA_ADMIN,
  });

  const routerProxyAddress = await deployInfraProxy({
    ...options,
    initData,
    extraData: "0x",
    implementationAddress: routerImpl.address,
    assetFactory,
  });

  return getContract({
    client: options.client,
    chain: options.chain,
    address: routerProxyAddress,
  });
}

export async function deployRewardLocker(options: ClientAndChainAndAccount) {
  let v3PositionManager = ZERO_ADDRESS;
  let v4PositionManager = ZERO_ADDRESS;

  const implementations = IMPLEMENTATIONS[options.chain.id];

  if (implementations) {
    v3PositionManager = implementations.V3PositionManager || ZERO_ADDRESS;
    v4PositionManager = implementations.V4PositionManager || ZERO_ADDRESS;
  }

  let feeManager = await getDeployedFeeManager(options);

  if (!feeManager) {
    feeManager = await deployFeeManager(options);
  }

  return await getOrDeployInfraContract({
    ...options,
    contractId: "RewardLocker",
    constructorParams: {
      _feeManager: feeManager.address,
      _v3PositionManager: v3PositionManager,
      _v4PositionManager: v4PositionManager,
    },
    publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
  });
}

export async function deployFeeManager(options: ClientAndChainAndAccount) {
  // asset factory
  let assetFactory = await getDeployedAssetFactory(options);
  if (!assetFactory) {
    assetFactory = await deployAssetFactory(options);
  }

  // fee manager implementation
  const feeManagerImpl = await getOrDeployInfraContract({
    ...options,
    contractId: "FeeManager",
    publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
  });

  // encode init data
  const initData = encodeFeeManagerInit({
    owner: DEFAULT_INFRA_ADMIN,
    feeRecipient: DEFAULT_FEE_RECIPIENT,
    defaultFee: DEFAULT_FEE_BPS,
  });

  // fee manager proxy deployment
  const transaction = deployInfraProxyDeterministic({
    contract: assetFactory,
    implementation: feeManagerImpl.address,
    data: initData,
    extraData: "0x",
    salt: keccakId(DEFAULT_SALT),
  });

  const receipt = await sendAndConfirmTransaction({
    transaction,
    account: options.account,
  });
  const proxyEvent = assetInfraDeployedEvent();
  const decodedEvent = parseEventLogs({
    events: [proxyEvent],
    logs: receipt.logs,
  });

  if (decodedEvent.length === 0 || !decodedEvent[0]) {
    throw new Error(
      `No AssetInfraDeployed event found in transaction: ${receipt.transactionHash}`,
    );
  }

  const feeManagerProxyAddress = decodedEvent[0]?.args.proxy;

  return getContract({
    client: options.client,
    chain: options.chain,
    address: feeManagerProxyAddress,
  });
}

export async function deployAssetFactory(options: ClientAndChainAndAccount) {
  // create2 factory
  const create2Factory = await getDeployedCreate2Factory(options);
  if (!create2Factory) {
    await deployCreate2Factory(options);
  }

  // asset factory
  return getOrDeployInfraContract({
    ...options,
    contractId: "AssetInfraDeployer",
    publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
  });
}

export async function getDeployedRouter(options: ClientAndChain) {
  const [feeManager, marketSaleImpl, assetFactory] = await Promise.all([
    getDeployedFeeManager(options),
    getDeployedInfraContract({
      ...options,
      contractId: "MarketSale",
      publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
    }),
    getDeployedAssetFactory(options),
  ]);

  if (!feeManager || !marketSaleImpl || !assetFactory) {
    return null;
  }

  const routerImpl = await getDeployedInfraContract({
    ...options,
    contractId: "Router",
    constructorParams: {
      _marketSaleImplementation: marketSaleImpl.address,
      _feeManager: feeManager.address,
    },
    publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
  });

  if (!routerImpl) {
    return null;
  }

  const initCodeHash = getInitCodeHashERC1967(routerImpl.address);

  const saltHash = keccak256(
    encodePacked(
      ["bytes32", "address"],
      [keccakId(DEFAULT_SALT), DEFAULT_INFRA_ADMIN],
    ),
  );

  const hashedDeployInfo = keccak256(
    encodePacked(
      ["bytes1", "address", "bytes32", "bytes32"],
      ["0xff", assetFactory.address, saltHash, initCodeHash],
    ),
  );

  const routerProxyAddress = `0x${hashedDeployInfo.slice(26)}`;
  const routerProxy = getContract({
    client: options.client,
    chain: options.chain,
    address: routerProxyAddress,
  });

  if (!(await isContractDeployed(routerProxy))) {
    return null;
  }

  return routerProxy;
}

export async function getDeployedRewardLocker(options: ClientAndChain) {
  let v3PositionManager = ZERO_ADDRESS;
  let v4PositionManager = ZERO_ADDRESS;

  const implementations = IMPLEMENTATIONS[options.chain.id];

  if (implementations) {
    v3PositionManager = implementations.V3PositionManager || ZERO_ADDRESS;
    v4PositionManager = implementations.V4PositionManager || ZERO_ADDRESS;
  }

  const feeManager = await getDeployedFeeManager(options);

  if (!feeManager) {
    return null;
  }

  return await getDeployedInfraContract({
    ...options,
    contractId: "RewardLocker",
    constructorParams: {
      _feeManager: feeManager.address,
      _v3PositionManager: v3PositionManager,
      _v4PositionManager: v4PositionManager,
    },
    publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
  });
}

export async function getDeployedFeeManager(options: ClientAndChain) {
  const [assetFactory, feeManagerImpl] = await Promise.all([
    getDeployedAssetFactory(options),
    getDeployedInfraContract({
      ...options,
      contractId: "FeeManager",
      publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
    }),
  ]);

  if (!assetFactory || !feeManagerImpl) {
    return null;
  }

  const initCodeHash = getInitCodeHashERC1967(feeManagerImpl.address);

  const saltHash = keccak256(
    encodePacked(
      ["bytes32", "address"],
      [keccakId(DEFAULT_SALT), DEFAULT_INFRA_ADMIN],
    ),
  );

  const hashedDeployInfo = keccak256(
    encodePacked(
      ["bytes1", "address", "bytes32", "bytes32"],
      ["0xff", assetFactory.address, saltHash, initCodeHash],
    ),
  );

  const feeManagerProxyAddress = `0x${hashedDeployInfo.slice(26)}`;
  const feeManagerProxy = getContract({
    client: options.client,
    chain: options.chain,
    address: feeManagerProxyAddress,
  });

  if (!(await isContractDeployed(feeManagerProxy))) {
    return null;
  }

  return feeManagerProxy;
}

export async function getDeployedAssetFactory(args: ClientAndChain) {
  const assetFactory = await getDeployedInfraContract({
    ...args,
    contractId: "AssetInfraDeployer",
    publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
  });
  if (!assetFactory) {
    return null;
  }
  return assetFactory;
}
