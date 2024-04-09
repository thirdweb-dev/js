import { getContractAddress } from "viem";
import { getGasPrice } from "../../../gas/get-gas-price.js";
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
  const chainId = options.chain.id;

  // special handling for chains with hardcoded gasPrice and gasLimit
  if (CUSTOM_GAS_FOR_CHAIN[chainId]) {
    const enforceEip155 = await isEIP155Enforced(options);
    const eipChain = enforceEip155 ? chainId : 0;
    const gasPrice = CUSTOM_GAS_FOR_CHAIN[chainId.toString()]?.gasPrice;
    const gasLimit = CUSTOM_GAS_FOR_CHAIN[chainId.toString()]?.gasLimit;

    const deploymentInfo = await _getCreate2FactoryDeploymentInfo(eipChain, {
      gasPrice,
      gasLimit,
    });

    return deploymentInfo.predictedAddress;
  }

  // default flow
  const allBinsInfo = await Promise.all([
    // to generate EIP-155 transaction
    ...CUSTOM_GAS_BINS.map((b) => {
      return _getCreate2FactoryDeploymentInfo(chainId, { gasPrice: b });
    }),

    // to generate pre EIP-155 transaction, hence chainId 0
    ...CUSTOM_GAS_BINS.map((b) => {
      return _getCreate2FactoryDeploymentInfo(0, { gasPrice: b });
    }),
  ]);

  const allFactories = await Promise.all(
    allBinsInfo.map((b) => {
      const tempFactory = getContract({
        ...options,
        address: b.predictedAddress,
      });
      return isContractDeployed(tempFactory);
    }),
  );

  const indexOfCommonFactory = allBinsInfo.findIndex(
    (b) => b.predictedAddress === COMMON_FACTORY_ADDRESS,
  );
  if (indexOfCommonFactory && allFactories[indexOfCommonFactory]) {
    return COMMON_FACTORY_ADDRESS;
  }

  const indexOfExistingDeployment = allFactories.findIndex((b) => b);
  if (
    indexOfExistingDeployment &&
    allBinsInfo &&
    allBinsInfo[indexOfExistingDeployment]?.predictedAddress
  ) {
    // TODO: cleanup
    return allBinsInfo[indexOfExistingDeployment]?.predictedAddress as string;
  }

  const [enforceEip155, gasPriceFetched] = await Promise.all([
    isEIP155Enforced(options),
    getGasPrice(options),
  ]);
  const eipChain = enforceEip155 ? chainId : 0;
  const bin = _getNearestGasPriceBin(gasPriceFetched);

  const deploymentInfo = await _getCreate2FactoryDeploymentInfo(eipChain, {
    gasPrice: bin,
  });

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
  const eipChain = enforceEip155 ? chainId : 0;

  const rpcRequest = getRpcClient({
    client: client,
    chain,
  });

  const gasPriceFetched = await getGasPrice(options);
  const bin = _getNearestGasPriceBin(gasPriceFetched);
  const deploymentInfo = await _getCreate2FactoryDeploymentInfo(eipChain, {
    gasPrice: bin,
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
  // 100000 is default deployment gas limit and 100 gwei is default gas price for create2 factory deployment
  // (See: https://github.com/Arachnid/deterministic-deployment-proxy?tab=readme-ov-file#deployment-gas-limit)
  const gasPrice = gasOptions.gasPrice ? gasOptions.gasPrice : 100n * 10n ** 9n;
  const gas = gasOptions.gasLimit ? gasOptions.gasLimit : 100000n;
  const deploymentTransaction = await getKeylessTransaction({
    transaction: {
      gasPrice,
      gas,
      nonce: 0,
      data: CREATE2_FACTORY_BYTECODE,
      chainId: chainId !== 0 ? Number(chainId) : undefined,
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

function _getNearestGasPriceBin(gasPrice: bigint): bigint {
  return CUSTOM_GAS_BINS.find((e) => e >= gasPrice) || gasPrice;
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

const CUSTOM_GAS_BINS = [
  1n,
  1n * 10n ** 9n,
  100n * 10n ** 9n,
  500n * 10n ** 9n,
  1000n * 10n ** 9n,
  2500n * 10n ** 9n,
  5000n * 10n ** 9n,
  7500n * 10n ** 9n,
  10_000n * 10n ** 9n,
  25_000n * 10n ** 9n,
  50_000n * 10n ** 9n,
  75_000n * 10n ** 9n,
  100_000n * 10n ** 9n,
  250_000n * 10n ** 9n,
  500_000n * 10n ** 9n,
  750_000n * 10n ** 9n,
  1_000_000n * 10n ** 9n,
];
