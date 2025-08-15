import type { AbiConstructor } from "abitype";
import { getContract } from "../contract/contract.js";
import { getDeployedInfraContractFromMetadata } from "../contract/deployment/utils/infra.js";
import { computeDeployAddress } from "../extensions/tokens/__generated__/ContractFactory/read/computeDeployAddress.js";
import { computeProxyAddress } from "../extensions/tokens/__generated__/ContractFactory/read/computeProxyAddress.js";
import { encodeAbiParameters } from "../utils/abi/encodeAbiParameters.js";
import { normalizeFunctionParams } from "../utils/abi/normalizeFunctionParams.js";
import {
  fetchBytecodeFromCompilerMetadata,
  fetchDeployMetadata,
} from "../utils/any-evm/deploy-metadata.js";
import { isContractDeployed } from "../utils/bytecode/is-contract-deployed.js";
import { padHex, toHex } from "../utils/encoding/hex.js";
import { withCache } from "../utils/promise/withCache.js";
import type { ClientAndChain } from "../utils/types.js";
import {
  CONTRACT_DEPLOY,
  CONTRACT_FACTORY_DEPLOY_URL,
  ENTRYPOINT_DEPLOY_URL,
  MANAGER_ADDRESS,
  OWNER_ADDRESS,
  PROXY_DEPLOY,
} from "./constants.js";

export async function getDeployedEntrypointERC20(options: ClientAndChain) {
  const cacheKey = `${options.chain.id}-${ENTRYPOINT_DEPLOY_URL}-${JSON.stringify(options.client)}`;

  return withCache(
    async () => {
      // 1. Get deployed contract factory
      const contractFactory = await getDeployedContractFactory(options);

      if (!contractFactory) {
        throw new Error(
          `Contract factory not found on chain: ${options.chain.id}`,
        );
      }

      // 2. Fetch metadata and encode args for entrypoint implementation
      const contractMetadata = await fetchDeployMetadata({
        client: options.client,
        uri: ENTRYPOINT_DEPLOY_URL,
      });
      const bytecode = await fetchBytecodeFromCompilerMetadata({
        chain: options.chain,
        client: options.client,
        compilerMetadata: contractMetadata,
      });
      const constructorAbi = contractMetadata.abi.find(
        (abi) => abi.type === "constructor",
      ) as AbiConstructor | undefined;
      const encodedArgs = encodeAbiParameters(
        constructorAbi?.inputs ?? [],
        normalizeFunctionParams(constructorAbi, {}),
      );

      // 3. Compute entrypoint implementation address
      const entrypointImplAddress = await computeDeployAddress({
        contract: contractFactory,
        deployType: CONTRACT_DEPLOY.CREATE2,
        bytecode,
        constructorArgs: encodedArgs,
        salt: padHex(toHex("ERC20_ENTRYPOINT:1"), { size: 32 }),
      });

      // 4. Compute entrypoint proxy address
      const entrypointProxyAddress = await computeProxyAddress({
        contract: contractFactory,
        implementation: entrypointImplAddress,
        data: "0x",
        salt: padHex(toHex("ERC20_ENTRYPOINT_PROXY:1"), { size: 32 }),
        deployType: PROXY_DEPLOY.ERC1967,
      });
      const entrypointProxy = getContract({
        ...options,
        address: entrypointProxyAddress,
      });

      const isDeployed = await isContractDeployed(entrypointProxy);

      if (!isDeployed) {
        throw new Error(
          `Entrypoint is not deployed yet on chain: ${options.chain.id}`,
        );
      }

      return entrypointProxy;
    },
    {
      cacheKey,
      cacheTime: 24 * 60 * 60 * 1000, // 1 day
    },
  );
}

export async function getDeployedContractFactory(options: ClientAndChain) {
  const cacheKey = `${options.chain.id}-${CONTRACT_FACTORY_DEPLOY_URL}-${JSON.stringify(options.client)}`;
  return withCache(
    async () => {
      const contractMetadata = await fetchDeployMetadata({
        client: options.client,
        uri: CONTRACT_FACTORY_DEPLOY_URL,
      });

      return getDeployedInfraContractFromMetadata({
        chain: options.chain,
        client: options.client,
        constructorParams: {
          owner: OWNER_ADDRESS,
          manager: MANAGER_ADDRESS,
        },
        contractMetadata,
        salt: "THIRDWEB_CONTRACT_FACTORY:1",
      });
    },
    {
      cacheKey,
      cacheTime: 24 * 60 * 60 * 1000, // 1 day
    },
  );
}
