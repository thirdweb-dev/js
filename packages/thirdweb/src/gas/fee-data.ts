import type { ThirdwebClient } from "../client/client.js";
import { getChainIdFromChain, type Chain } from "../chain/index.js";
import {
  eth_gasPrice,
  eth_getBlockByNumber,
  eth_maxPriorityFeePerGas,
  getRpcClient,
} from "../rpc/index.js";
import { parseUnits } from "../utils/units.js";
import type { PreparedTransaction } from "../transaction/prepare-transaction.js";

type FeeData = {
  maxFeePerGas: null | bigint;
  maxPriorityFeePerGas: null | bigint;
};

type FeeDataParams =
  | {
      gasPrice?: never;
      maxFeePerGas?: bigint;
      maxPriorityFeePerGas?: bigint;
    }
  | {
      gasPrice?: bigint;
      maxFeePerGas?: never;
      maxPriorityFeePerGas?: never;
    };

/**
 *
 * @internal
 */
export async function getGasOverridesForTransaction(
  transaction: PreparedTransaction,
): Promise<FeeDataParams> {
  // if we have a `gasPrice` param in the transaction, use that.
  if ("gasPrice" in transaction && !transaction.gasPrice) {
    return { gasPrice: transaction.gasPrice };
  }
  // if we have a maxFeePerGas and maxPriorityFeePerGas, use those
  if (
    "maxFeePerGas" in transaction &&
    "maxPriorityFeePerGas" in transaction &&
    !transaction.maxFeePerGas &&
    !transaction.maxPriorityFeePerGas
  ) {
    return {
      maxFeePerGas: transaction.maxFeePerGas,
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
    };
  }
  // otherwise call getDefaultGasOverrides
  return getDefaultGasOverrides(transaction.client, transaction.chain);
}

/**
 * Retrieves the default gas overrides for a given client and chain ID.
 * If the fee data contains both maxFeePerGas and maxPriorityFeePerGas, it returns an object with those values.
 * Otherwise, it returns an object with the gasPrice obtained from the client and chain ID.
 * @param client - The ThirdwebClient instance.
 * @param chain - The chain ID.
 * @returns An object containing the default gas overrides.
 * @internal
 */
export async function getDefaultGasOverrides(
  client: ThirdwebClient,
  chain: Chain,
) {
  const feeData = await getDynamicFeeData(client, chain);
  if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
    return {
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    };
  } else {
    return {
      gasPrice: await getGasPrice(client, chain),
    };
  }
}

/**
 * Retrieves dynamic fee data for a given chain.
 * @param client - The Thirdweb client.
 * @param chain - The chain ID.
 * @returns A promise that resolves to the fee data.
 * @internal
 */
async function getDynamicFeeData(
  client: ThirdwebClient,
  chain: Chain,
): Promise<FeeData> {
  let maxFeePerGas: null | bigint = null;
  let maxPriorityFeePerGas_: null | bigint = null;

  const rpcRequest = getRpcClient({ client, chain });

  const [block, maxPriorityFeePerGas] = await Promise.all([
    eth_getBlockByNumber(rpcRequest, { blockTag: "latest" }),
    eth_maxPriorityFeePerGas(rpcRequest).catch(() => null),
  ]);

  const baseBlockFee =
    block && block.baseFeePerGas ? block.baseFeePerGas : 100n;

  const chainId = getChainIdFromChain(chain);
  // flag chain testnet & flag chain
  if (chainId === 220n || chainId === 1220n) {
    // these does not support eip-1559, for some reason even though `eth_maxPriorityFeePerGas` is available?!?
    // return null because otherwise TX break
    return { maxFeePerGas: null, maxPriorityFeePerGas: null };
    // mumbai & polygon
  } else if (chainId === 80001n || chainId === 137n) {
    // for polygon, get fee data from gas station
    maxPriorityFeePerGas_ = await getPolygonGasPriorityFee(chainId);
  } else if (maxPriorityFeePerGas) {
    // prioritize fee from eth_maxPriorityFeePerGas
    maxPriorityFeePerGas_ = maxPriorityFeePerGas;
  }

  if (!maxPriorityFeePerGas_) {
    // chain does not support eip-1559, return null for both
    return { maxFeePerGas: null, maxPriorityFeePerGas: null };
  }

  // add 10% tip to maxPriorityFeePerGas for faster processing
  maxPriorityFeePerGas_ = getPreferredPriorityFee(maxPriorityFeePerGas_);
  // eip-1559 formula, doubling the base fee ensures that the tx can be included in the next 6 blocks no matter how busy the network is
  // good article on the subject: https://www.blocknative.com/blog/eip-1559-fees
  maxFeePerGas = baseBlockFee * 2n + maxPriorityFeePerGas_;

  // special cased for Celo gas fees
  if (chainId === 42220n || chainId === 44787n || chainId === 62320n) {
    maxPriorityFeePerGas_ = maxFeePerGas;
  }

  return {
    maxFeePerGas,
    maxPriorityFeePerGas: maxPriorityFeePerGas_,
  };
}

/**
 * Calculates the preferred priority fee based on the default priority fee per gas and a percent multiplier.
 * @param defaultPriorityFeePerGas - The default priority fee per gas.
 * @param percentMultiplier - The percent multiplier to calculate the extra tip. Default is 10.
 * @returns The total priority fee including the extra tip.
 * @internal
 */
function getPreferredPriorityFee(
  defaultPriorityFeePerGas: bigint,
  percentMultiplier: number = 10,
): bigint {
  const extraTip =
    (defaultPriorityFeePerGas / BigInt(100)) * BigInt(percentMultiplier);
  const totalPriorityFee = defaultPriorityFeePerGas + extraTip;
  return totalPriorityFee;
}

/**
 * Retrieves the gas price for a transaction on a specific chain.
 * @param client - The Thirdweb client.
 * @param chain - The ID of the chain.
 * @returns A promise that resolves to the gas price as a bigint.
 * @internal
 */
async function getGasPrice(
  client: ThirdwebClient,
  chain: Chain,
): Promise<bigint> {
  const rpcClient = getRpcClient({ client, chain });
  const gasPrice_ = await eth_gasPrice(rpcClient);
  const maxGasPrice = 300n; // 300 gwei
  const extraTip = (gasPrice_ / BigInt(100)) * BigInt(10);
  const txGasPrice = gasPrice_ + extraTip;

  if (txGasPrice > maxGasPrice) {
    return maxGasPrice;
  }

  return txGasPrice;
}

/**
 * @internal
 */
function getGasStationUrl(chainId: 137n | 80001n): string {
  switch (chainId) {
    case 137n:
      return "https://gasstation.polygon.technology/v2";
    case 80001n:
      return "https://gasstation-testnet.polygon.technology/v2";
  }
}

const MIN_POLYGON_GAS_PRICE = 31n; // 31 gwei

const MIN_MUMBAI_GAS_PRICE = 1n; // 1 gwei

/**
 * @internal
 */
function getDefaultGasFee(chainId: 137n | 80001n): bigint {
  switch (chainId) {
    case 137n:
      return MIN_POLYGON_GAS_PRICE;
    case 80001n:
      return MIN_MUMBAI_GAS_PRICE;
  }
}

/**
 *
 * @returns The gas price
 * @internal
 */
async function getPolygonGasPriorityFee(
  chainId: 137n | 80001n,
): Promise<bigint> {
  const gasStationUrl = getGasStationUrl(chainId);
  try {
    const data = await (await fetch(gasStationUrl)).json();
    // take the standard speed here, SDK options will define the extra tip
    const priorityFee = data["fast"]["maxPriorityFee"];
    if (priorityFee > 0) {
      const fixedFee = parseFloat(priorityFee).toFixed(9);
      return parseUnits(fixedFee, 18);
    }
  } catch (e) {
    console.error("failed to fetch gas", e);
  }
  return getDefaultGasFee(chainId);
}
