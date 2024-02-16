import { getContractAddress } from "viem";
import { getChainIdFromChain, type Chain } from "../../chain/index.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getContract } from "../../contract/contract.js";
import { isContractDeployed } from "../bytecode/is-contract-deployed.js";
import { isEIP155Enforced } from "./is-eip155-enforced.js";
import { getKeylessTransaction } from "./keyless-transaction.js";

const COMMON_FACTORY_ADDRESS = "0x4e59b44847b379578588920cA78FbF26c0B4956C"; // for pre-eip-155 supporting chains

/**
 * @internal
 */
const CREATE2_FACTORY_BYTECODE =
  "0x604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3";
/**
 * @internal
 */
const SIGNATURE = {
  v: 27n,
  r: "0x2222222222222222222222222222222222222222222222222222222222222222",
  s: "0x2222222222222222222222222222222222222222222222222222222222222222",
} as const;

type GetCreate2FactoryAddressOptions = {
  chain: Chain;
  client: ThirdwebClient;
};

/**
 * Retrieves the address of the Create2 factory contract.
 * If the common factory is already deployed, it returns the address.
 * Otherwise, it calculates the deployment info based on the chain options and returns the deployment address.
 *
 * @param options - The options for retrieving the Create2 factory address.
 * @returns The address of the Create2 factory contract.
 * @internal
 *
 */
export async function getCreate2FactoryAddress(
  options: GetCreate2FactoryAddressOptions,
) {
  const commonFactory = getContract({
    ...options,
    address: COMMON_FACTORY_ADDRESS,
  });
  // if the common factory is deployed, return the address
  if (await isContractDeployed(commonFactory)) {
    return COMMON_FACTORY_ADDRESS;
  }

  const enforceEip155 = await isEIP155Enforced(options);
  const chainId = getChainIdFromChain(options.chain);
  const custom = CUSTOM_GAS_FOR_CHAIN[chainId.toString()];
  const eipChain = enforceEip155 ? chainId : 0n;

  const deploymentInfo = custom
    ? getCreate2FactoryDeploymentInfo(eipChain, {
        gasPrice: custom.gasPrice,
        gasLimit: custom.gasLimit,
      })
    : getCreate2FactoryDeploymentInfo(eipChain, {});

  return (await deploymentInfo).deployment;
}

/**
 * Retrieves the deployment information for the Create2 factory contract.
 * @param chainId - The chain ID.
 * @param gasOptions - The gas options for the deployment transaction.
 * @returns The deployment information, including the deployment transaction and the create2 factory address.
 * @internal
 */
export async function getCreate2FactoryDeploymentInfo(
  chainId: bigint,
  gasOptions: { gasPrice?: bigint; gasLimit?: bigint },
) {
  const deploymentTransaction = await getKeylessTransaction({
    transaction: {
      gasPrice: gasOptions.gasPrice ? gasOptions.gasPrice : 100n * 10n ** 9n,
      gas: gasOptions.gasLimit ? gasOptions.gasLimit : 100000n,
      nonce: 0,
      data: CREATE2_FACTORY_BYTECODE,
      chainId: Number(chainId),
    },
    signature: SIGNATURE,
  });
  const create2FactoryAddress = getContractAddress({
    from: deploymentTransaction.address,
    nonce: 0n,
  });

  return {
    ...deploymentTransaction,
    deployment: create2FactoryAddress,
  };
}

// TODO: move this somewhere else
type CustomChain = {
  name: string;
  gasPrice?: bigint;
  gasLimit?: bigint;
};

const CUSTOM_GAS_FOR_CHAIN: Record<string, CustomChain> = {
  "5001": {
    name: "Mantle Testnet",
    gasPrice: 1n,
  },
  "71402": {
    name: "Godwoken Mainnet",
    gasPrice: 40000n * 10n ** 9n,
  },
  "1351057110": {
    name: "Chaos (SKALE Testnet)",
    gasPrice: 100000n,
  },
  "361": {
    name: "Theta Mainnet",
    gasPrice: 4000n * 10n ** 9n,
  },
  "365": {
    name: "Theta Testnet",
    gasPrice: 4000n * 10n ** 9n,
  },
  "7700": {
    name: "Canto",
    gasPrice: 1000n * 10n ** 9n,
  },
  "7701": {
    name: "Canto Testnet",
    gasPrice: 1000n * 10n ** 9n,
  },
  "338": {
    name: "Cronos Testnet",
    gasPrice: 2000n * 10n ** 9n,
  },
  "199": {
    name: "BitTorrent Chain",
    gasPrice: 300000n * 10n ** 9n,
  },
  "88882": {
    name: "Spicy Chain",
    gasPrice: 2500n * 10n ** 9n,
    gasLimit: 200000n,
  },
  "88888": {
    name: "Chiliz Chain",
    gasPrice: 2500n * 10n ** 9n,
    gasLimit: 200000n,
  },
};
