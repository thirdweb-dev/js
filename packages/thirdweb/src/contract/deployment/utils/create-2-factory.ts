import { getContractAddress } from "viem";
import { eth_getBalance } from "../../../rpc/actions/eth_getBalance.js";
import { eth_sendRawTransaction } from "../../../rpc/actions/eth_sendRawTransaction.js";
import { getRpcClient } from "../../../rpc/rpc.js";
import { sendTransaction } from "../../../transaction/actions/send-transaction.js";
import { waitForReceipt } from "../../../transaction/actions/wait-for-tx-receipt.js";
import { prepareTransaction } from "../../../transaction/prepare-transaction.js";
import { isEIP155Enforced } from "../../../utils/any-evm/is-eip155-enforced.js";
import { getKeylessTransaction } from "../../../utils/any-evm/keyless-transaction.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import type {
  ClientAndChain,
  ClientAndChainAndAccount,
} from "../../../utils/types.js";
import { getContract } from "../../contract.js";

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

/**
 * Computes the address of the Create2 factory contract and checks if it is deployed.
 * @param options - The options for retrieving the Create2 factory address.
 * @returns whether the Create2 factory is deployed.
 * @internal
 */
export async function computeCreate2FactoryAddress(
  options: ClientAndChain,
): Promise<string> {
  // TODO add LRU cache
  const commonFactory = getContract({
    ...options,
    address: COMMON_FACTORY_ADDRESS,
  });
  // if the common factory is deployed, return the address
  if (await isContractDeployed(commonFactory)) {
    return COMMON_FACTORY_ADDRESS;
  }

  const enforceEip155 = await isEIP155Enforced(options);
  const chainId = options.chain.id;
  const custom = CUSTOM_GAS_FOR_CHAIN[chainId.toString()];
  const eipChain = enforceEip155 ? chainId : 0;

  const deploymentInfo = custom
    ? await _getCreate2FactoryDeploymentInfo(eipChain, {
        gasPrice: custom.gasPrice,
        gasLimit: custom.gasLimit,
      })
    : await _getCreate2FactoryDeploymentInfo(eipChain, {});

  return deploymentInfo.predictedAddress;
}

/**
 * @internal
 */
export async function getDeployedCreate2Factory(options: ClientAndChain) {
  const address = await computeCreate2FactoryAddress(options);
  const factory = getContract({
    ...options,
    address,
  });
  const isDeployed = await isContractDeployed(factory);
  if (!isDeployed) {
    return null;
  }
  return factory;
}

/**
 * Deploys the Create2 factory contract using a keyless transaction.
 * @internal
 */
export async function deployCreate2Factory(options: ClientAndChainAndAccount) {
  const { client, chain, account } = options;
  const enforceEip155 = await isEIP155Enforced(options);
  const chainId = options.chain.id;
  const custom = CUSTOM_GAS_FOR_CHAIN[chainId.toString()];
  const eipChain = enforceEip155 ? chainId : 0;

  const deploymentInfo = custom
    ? await _getCreate2FactoryDeploymentInfo(eipChain, {
        gasPrice: custom.gasPrice,
        gasLimit: custom.gasLimit,
      })
    : await _getCreate2FactoryDeploymentInfo(eipChain, {});
  const rpcRequest = getRpcClient({
    client: client,
    chain,
  });

  const balance = await eth_getBalance(rpcRequest, {
    address: deploymentInfo.signerAddress,
  });
  if (balance < deploymentInfo.valueToSend) {
    const transaction = prepareTransaction({
      chain,
      client,
      to: deploymentInfo.signerAddress,
      value: deploymentInfo.valueToSend,
    });
    const res = await sendTransaction({ transaction, account });
    await waitForReceipt(res);
  }
  const transactionHash = await eth_sendRawTransaction(
    rpcRequest,
    deploymentInfo.transaction,
  );
  return {
    transactionHash,
  };
}

/**
 * Retrieves the deployment information for the Create2 factory contract.
 * @param chainId - The chain ID.
 * @param gasOptions - The gas options for the deployment transaction.
 * @returns The deployment information, including the deployment transaction and the create2 factory address.
 * @internal
 */
async function _getCreate2FactoryDeploymentInfo(
  chainId: number,
  gasOptions: { gasPrice?: bigint; gasLimit?: bigint },
) {
  const gasPrice = gasOptions.gasPrice ? gasOptions.gasPrice : 100n * 10n ** 9n;
  const gas = gasOptions.gasLimit ? gasOptions.gasLimit : 100000n;
  const deploymentTransaction = await getKeylessTransaction({
    transaction: {
      gasPrice,
      gas,
      nonce: 0,
      data: CREATE2_FACTORY_BYTECODE,
      chainId: Number(chainId),
    },
    signature: SIGNATURE,
  });
  const create2FactoryAddress = getContractAddress({
    from: deploymentTransaction.signerAddress,
    nonce: 0n,
  });

  return {
    ...deploymentTransaction,
    valueToSend: gasPrice * gas,
    predictedAddress: create2FactoryAddress,
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
