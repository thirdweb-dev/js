import { type ThirdwebContract, getContract } from "../contract/contract.js";
import { getOrDeployInfraContract } from "../contract/deployment/utils/bootstrap.js";
import { encodeInitialize } from "../extensions/assets/__generated__/AssetEntrypointERC20/write/initialize.js";
import type { ClientAndChainAndAccount } from "../utils/types.js";
import {
  deployRewardLocker,
  deployRouter,
  getDeployedAssetFactory,
  getDeployedRewardLocker,
  getDeployedRouter,
} from "./bootstrap.js";
import { DEFAULT_INFRA_ADMIN, IMPLEMENTATIONS } from "./constants.js";
import { deployInfraProxy } from "./deploy-infra-proxy.js";

export async function getOrDeployEntrypointERC20(
  options: ClientAndChainAndAccount,
): Promise<ThirdwebContract> {
  const implementations = IMPLEMENTATIONS[options.chain.id];

  if (implementations?.AssetEntrypointERC20) {
    return getContract({
      client: options.client,
      chain: options.chain,
      address: implementations.AssetEntrypointERC20,
    });
  }

  let [router, rewardLocker] = await Promise.all([
    getDeployedRouter(options),
    getDeployedRewardLocker(options),
  ]);

  if (!router) {
    router = await deployRouter(options);
  }

  if (!rewardLocker) {
    rewardLocker = await deployRewardLocker(options);
  }

  const assetFactory = await getDeployedAssetFactory(options);
  if (!assetFactory) {
    throw new Error(`Asset factory not found for chain: ${options.chain.id}`);
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
    router: router.address,
    rewardLocker: rewardLocker.address,
  });

  const entyrpointProxyAddress = await deployInfraProxy({
    ...options,
    initData,
    extraData: "0x",
    implementationAddress: entrypointImpl.address,
    assetFactory,
  });

  return getContract({
    client: options.client,
    chain: options.chain,
    address: entyrpointProxyAddress,
  });
}
