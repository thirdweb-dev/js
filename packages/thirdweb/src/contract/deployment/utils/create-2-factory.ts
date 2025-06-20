import * as ox__ContractAddress from "ox/ContractAddress";
import { getGasPrice } from "../../../gas/get-gas-price.js";
import { eth_getBalance } from "../../../rpc/actions/eth_getBalance.js";
import { eth_sendRawTransaction } from "../../../rpc/actions/eth_sendRawTransaction.js";
import { getRpcClient } from "../../../rpc/rpc.js";
import { sendTransaction } from "../../../transaction/actions/send-transaction.js";
import { waitForReceipt } from "../../../transaction/actions/wait-for-tx-receipt.js";
import { prepareTransaction } from "../../../transaction/prepare-transaction.js";
import { getAddress } from "../../../utils/address.js";
import { isEIP155Enforced } from "../../../utils/any-evm/is-eip155-enforced.js";
import { getKeylessTransaction } from "../../../utils/any-evm/keyless-transaction.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import { withCache } from "../../../utils/promise/withCache.js";
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
  r: "0x2222222222222222222222222222222222222222222222222222222222222222",
  s: "0x2222222222222222222222222222222222222222222222222222222222222222",
  v: 27n,
} as const;

type Create2FactoryDeploymentInfo = {
  valueToSend: bigint;
  predictedAddress: `0x${string}`;
  signerAddress: string;
  transaction: `0x${string}`;
};

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

  return withCache(
    async () => {
      if (FACTORIES[chainId.toString()]) {
        return FACTORIES[chainId.toString()] as string;
      }
      // special handling for chains with hardcoded gasPrice and gasLimit
      if (CUSTOM_GAS_FOR_CHAIN[chainId]) {
        const enforceEip155 = await isEIP155Enforced(options);
        const eipChain = enforceEip155 ? chainId : 0;
        const gasPrice = CUSTOM_GAS_FOR_CHAIN[chainId.toString()]?.gasPrice;
        const gasLimit = CUSTOM_GAS_FOR_CHAIN[chainId.toString()]?.gasLimit;

        const deploymentInfo = await _getCreate2FactoryDeploymentInfo(
          eipChain,
          {
            gasLimit,
            gasPrice,
          },
        );

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
        return allBinsInfo[indexOfExistingDeployment]
          ?.predictedAddress as string;
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
    },
    {
      cacheKey: `create2factory:${chainId}`,
      cacheTime: 24 * 60 * 60 * 1000, // 1 day
    },
  );
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
    chain,
    client: client,
  });

  let gasPrice: bigint | undefined;
  let gasLimit: bigint | undefined;

  if (CUSTOM_GAS_FOR_CHAIN[chainId]) {
    gasPrice = CUSTOM_GAS_FOR_CHAIN[chainId.toString()]?.gasPrice;
    gasLimit = CUSTOM_GAS_FOR_CHAIN[chainId.toString()]?.gasLimit;
  } else {
    const gasPriceFetched = await getGasPrice(options);
    gasPrice = _getNearestGasPriceBin(gasPriceFetched);
  }

  const deploymentInfo = await _getCreate2FactoryDeploymentInfo(eipChain, {
    gasLimit,
    gasPrice,
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
    const res = await sendTransaction({ account, transaction });
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
): Promise<Create2FactoryDeploymentInfo> {
  // 100000 is default deployment gas limit and 100 gwei is default gas price for create2 factory deployment
  // (See: https://github.com/Arachnid/deterministic-deployment-proxy?tab=readme-ov-file#deployment-gas-limit)
  const gasPrice = gasOptions.gasPrice ? gasOptions.gasPrice : 100n * 10n ** 9n;
  const gas = gasOptions.gasLimit ? gasOptions.gasLimit : 100000n;
  const deploymentTransaction = await getKeylessTransaction({
    signature: SIGNATURE,
    transaction: {
      chainId: chainId !== 0 ? Number(chainId) : undefined,
      data: CREATE2_FACTORY_BYTECODE,
      gas,
      gasPrice,
      nonce: 0,
    },
  });
  const create2FactoryAddress = ox__ContractAddress.from({
    from: deploymentTransaction.signerAddress,
    nonce: 0n,
  });

  return {
    ...deploymentTransaction,
    predictedAddress: getAddress(create2FactoryAddress),
    valueToSend: gasPrice * gas,
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
  "199": {
    gasPrice: 300000n * 10n ** 9n,
    name: "BitTorrent Chain",
  },
  "338": {
    gasPrice: 2000n * 10n ** 9n,
    name: "Cronos Testnet",
  },
  "361": {
    gasPrice: 4000n * 10n ** 9n,
    name: "Theta Mainnet",
  },
  "365": {
    gasPrice: 4000n * 10n ** 9n,
    name: "Theta Testnet",
  },
  "5001": {
    gasPrice: 1n,
    name: "Mantle Testnet",
  },
  "7700": {
    gasPrice: 1000n * 10n ** 9n,
    name: "Canto",
  },
  "7701": {
    gasPrice: 1000n * 10n ** 9n,
    name: "Canto Testnet",
  },
  "71402": {
    gasPrice: 40000n * 10n ** 9n,
    name: "Godwoken Mainnet",
  },
  "88882": {
    gasLimit: 200000n,
    gasPrice: 2500n * 10n ** 9n,
    name: "Spicy Chain",
  },
  "88888": {
    gasLimit: 200000n,
    gasPrice: 2500n * 10n ** 9n,
    name: "Chiliz Chain",
  },
  // SKALE chains
  "1350216234": {
    gasPrice: 110000n,
    name: "Titan",
  },
  "1351057110": {
    gasPrice: 100000n,
    name: "Chaos (SKALE Testnet)",
  },
  "1482601649": {
    gasPrice: 110000n,
    name: "Nebula",
  },
  "1564830818": {
    gasPrice: 110000n,
    name: "Calypso",
  },
  "2046399126": {
    gasPrice: 110000n,
    name: "Europa",
  },
};

const FACTORIES: Record<string, string> = {
  "88888": "0xc501b9abf5540de1dd24f66633b1ecf35ff7101f",
  "420120000": COMMON_FACTORY_ADDRESS,
  "420120001": COMMON_FACTORY_ADDRESS, // EIP155 is enforced, but the check fails, hence we hardcode the address here instead of computing dynamically
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
