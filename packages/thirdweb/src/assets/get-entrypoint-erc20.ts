import { encodePacked } from "viem";
import { ZERO_ADDRESS } from "../constants/addresses.js";
import { getContract, type ThirdwebContract } from "../contract/contract.js";
import { getOrDeployInfraContract } from "../contract/deployment/utils/bootstrap.js";
import { getDeployedInfraContract } from "../contract/deployment/utils/infra.js";
import { encodeInitialize } from "../extensions/assets/__generated__/AssetEntrypointERC20/write/initialize.js";
import { keccakId } from "../utils/any-evm/keccak-id.js";
import { isContractDeployed } from "../utils/bytecode/is-contract-deployed.js";
import { keccak256 } from "../utils/hashing/keccak256.js";
import type {
  ClientAndChain,
  ClientAndChainAndAccount,
} from "../utils/types.js";
import { deployAssetFactory, getDeployedAssetFactory } from "./bootstrap.js";
import {
  DEFAULT_INFRA_ADMIN,
  DEFAULT_SALT,
  IMPLEMENTATIONS,
} from "./constants.js";
import { deployInfraProxy } from "./deploy-infra-proxy.js";
import { getInitCodeHashERC1967 } from "./get-initcode-hash-1967.js";

export async function getOrDeployEntrypointERC20(
  options: ClientAndChainAndAccount,
): Promise<ThirdwebContract> {
  const implementations = IMPLEMENTATIONS[options.chain.id];

  if (implementations?.AssetEntrypointERC20) {
    return getContract({
      address: implementations.AssetEntrypointERC20,
      chain: options.chain,
      client: options.client,
    });
  }

  let assetFactory = await getDeployedAssetFactory(options);
  if (!assetFactory) {
    assetFactory = await deployAssetFactory(options);
  }

  const entrypointImpl = await getOrDeployInfraContract({
    ...options,
    contractId: "AssetEntrypointERC20",
    publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
    version: "0.0.2",
  });

  // encode init data
  const initData = encodeInitialize({
    owner: DEFAULT_INFRA_ADMIN,
    rewardLocker: ZERO_ADDRESS,
    router: ZERO_ADDRESS,
  });

  const entyrpointProxyAddress = await deployInfraProxy({
    ...options,
    assetFactory,
    extraData: "0x",
    implementationAddress: entrypointImpl.address,
    initData,
  });

  return getContract({
    address: entyrpointProxyAddress,
    chain: options.chain,
    client: options.client,
  });
}

export async function getDeployedEntrypointERC20(options: ClientAndChain) {
  const implementations = IMPLEMENTATIONS[options.chain.id];

  if (implementations?.AssetEntrypointERC20) {
    return getContract({
      address: implementations.AssetEntrypointERC20,
      chain: options.chain,
      client: options.client,
    });
  }

  const [assetFactory, entrypointImpl] = await Promise.all([
    getDeployedAssetFactory(options),
    getDeployedInfraContract({
      ...options,
      contractId: "AssetEntrypointERC20",
      publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
      version: "0.0.2",
    }),
  ]);

  if (!assetFactory || !entrypointImpl) {
    return null;
  }

  const initCodeHash = getInitCodeHashERC1967(entrypointImpl.address);

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

  const entrypointProxyAddress = `0x${hashedDeployInfo.slice(26)}`;
  const entrypointProxy = getContract({
    address: entrypointProxyAddress,
    chain: options.chain,
    client: options.client,
  });

  if (!(await isContractDeployed(entrypointProxy))) {
    return null;
  }

  return entrypointProxy;
}
