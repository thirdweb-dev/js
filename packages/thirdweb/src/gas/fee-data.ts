import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { eth_getBlockByNumber } from "../rpc/actions/eth_getBlockByNumber.js";
import { eth_maxPriorityFeePerGas } from "../rpc/actions/eth_maxPriorityFeePerGas.js";
import { getRpcClient } from "../rpc/rpc.js";
import type { PreparedTransaction } from "../transaction/prepare-transaction.js";
import { resolvePromisedValue } from "../utils/promise/resolve-promised-value.js";
import { toUnits } from "../utils/units.js";
import { getGasPrice } from "./get-gas-price.js";
import { roundUpGas } from "./op-gas-fee-reducer.js";

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
  // first check for explicit values
  const [maxFeePerGas, maxPriorityFeePerGas, gasPrice] = await Promise.all([
    resolvePromisedValue(transaction.maxFeePerGas),
    resolvePromisedValue(transaction.maxPriorityFeePerGas),
    resolvePromisedValue(transaction.gasPrice),
  ]);

  // Exit early if the user explicitly provided enough options
  if (maxFeePerGas !== undefined && maxPriorityFeePerGas !== undefined) {
    return {
      maxFeePerGas,
      maxPriorityFeePerGas,
    };
  }
  if (gasPrice) {
    return { gasPrice };
  }

  // If we don't have enough explicit values, get defaults
  const defaultGasOverrides = await getDefaultGasOverrides(
    transaction.client,
    transaction.chain,
  );

  if (transaction.chain.experimental?.increaseZeroByteCount) {
    // otherwise adjust each value
    if (defaultGasOverrides.gasPrice) {
      return { gasPrice: roundUpGas(defaultGasOverrides.gasPrice) };
    }

    return {
      maxFeePerGas:
        maxFeePerGas ?? roundUpGas(defaultGasOverrides.maxFeePerGas ?? 0n),
      maxPriorityFeePerGas:
        maxPriorityFeePerGas ??
        roundUpGas(defaultGasOverrides.maxPriorityFeePerGas ?? 0n),
    };
  }

  // return as is
  if (defaultGasOverrides.gasPrice) {
    return defaultGasOverrides;
  }

  // Still check for explicit values in case one is provided and not the other
  return {
    maxFeePerGas: maxFeePerGas ?? defaultGasOverrides.maxFeePerGas,
    maxPriorityFeePerGas:
      maxPriorityFeePerGas ?? defaultGasOverrides.maxPriorityFeePerGas,
  };
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
  }
  return {
    gasPrice: await getGasPrice({ client, chain, percentMultiplier: 10 }),
  };
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

  const baseBlockFee = block?.baseFeePerGas ? block.baseFeePerGas : 100n;

  const chainId = chain.id;
  // flag chain testnet & flag chain
  if (chainId === 220 || chainId === 1220) {
    // these does not support eip-1559, for some reason even though `eth_maxPriorityFeePerGas` is available?!?
    // return null because otherwise TX break
    return { maxFeePerGas: null, maxPriorityFeePerGas: null };
    // mumbai & polygon
  }
  if (chainId === 80001 || chainId === 137) {
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
  if (chainId === 42220 || chainId === 44787 || chainId === 62320) {
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
  percentMultiplier = 10,
): bigint {
  const extraTip =
    (defaultPriorityFeePerGas / BigInt(100)) * BigInt(percentMultiplier);
  const totalPriorityFee = defaultPriorityFeePerGas + extraTip;
  return totalPriorityFee;
}

/**
 * @internal
 */
function getGasStationUrl(chainId: 137 | 80001): string {
  switch (chainId) {
    case 137:
      return "https://gasstation.polygon.technology/v2";
    case 80001:
      return "https://gasstation-testnet.polygon.technology/v2";
  }
}

const MIN_POLYGON_GAS_PRICE = 31n; // 31 gwei

const MIN_MUMBAI_GAS_PRICE = 1n; // 1 gwei

/**
 * @internal
 */
function getDefaultGasFee(chainId: 137 | 80001): bigint {
  switch (chainId) {
    case 137:
      return MIN_POLYGON_GAS_PRICE;
    case 80001:
      return MIN_MUMBAI_GAS_PRICE;
  }
}

/**
 *
 * @returns The gas price
 * @internal
 */
async function getPolygonGasPriorityFee(chainId: 137 | 80001): Promise<bigint> {
  const gasStationUrl = getGasStationUrl(chainId);
  try {
    const data = await (await fetch(gasStationUrl)).json();
    // take the standard speed here, SDK options will define the extra tip
    const priorityFee = data.fast.maxPriorityFee;
    if (priorityFee > 0) {
      const fixedFee = Number.parseFloat(priorityFee).toFixed(9);
      return toUnits(fixedFee, 9);
    }
  } catch (e) {
    console.error("failed to fetch gas", e);
  }
  return getDefaultGasFee(chainId);
}
