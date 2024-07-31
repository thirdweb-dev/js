import { ChainId } from "../constants/chains/ChainId";
import { BigNumber, utils, providers } from "ethers";
import {
  Polygon,
  Flag,
  FlagTestnet,
  Optimism,
  OpSepoliaTestnet,
  Base,
  BaseSepoliaTestnet,
  Zora,
  ZoraSepoliaTestnet,
  Celo,
  CeloAlfajoresTestnet,
  PolygonAmoyTestnet,
} from "@thirdweb-dev/chains";

type FeeData = {
  maxFeePerGas: null | BigNumber;
  maxPriorityFeePerGas: null | BigNumber;
  baseFee: null | BigNumber;
};

export async function getDefaultGasOverrides(provider: providers.Provider) {
  // handle smart wallet provider
  if ((provider as any).originalProvider) {
    provider = (provider as any).originalProvider;
  }

  const feeData = await getDynamicFeeData(
    provider as providers.JsonRpcProvider,
  );
  if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
    return {
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    };
  } else {
    return {
      gasPrice: await getGasPrice(provider),
    };
  }
}

export async function getDynamicFeeData(
  provider: providers.JsonRpcProvider,
): Promise<FeeData> {
  let maxFeePerGas: null | BigNumber = null;
  let maxPriorityFeePerGas: null | BigNumber = null;

  const [{ chainId }, block, eth_maxPriorityFeePerGas] = await Promise.all([
    provider.getNetwork(),
    provider.getBlock("latest"),
    provider.send("eth_maxPriorityFeePerGas", []).catch(() => null),
  ]);

  const baseBlockFee =
    block && block.baseFeePerGas
      ? block.baseFeePerGas
      : utils.parseUnits("100", "wei");

  // flag-chain overrides
  if (chainId === Flag.chainId || chainId === FlagTestnet.chainId) {
    // chains does not support eip-1559, return null for all
    return { maxFeePerGas: null, maxPriorityFeePerGas: null, baseFee: null };
  } else if (chainId === PolygonAmoyTestnet.chainId || chainId === Polygon.chainId) {
    // for polygon, get fee data from gas station
    maxPriorityFeePerGas = await getPolygonGasPriorityFee(chainId);
  } else if (eth_maxPriorityFeePerGas) {
    // prioritize fee from eth_maxPriorityFeePerGas
    maxPriorityFeePerGas = BigNumber.from(eth_maxPriorityFeePerGas);
  } else {
    // if eth_maxPriorityFeePerGas is not available, use 1.5 gwei default
    const feeData = await provider.getFeeData();
    maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
    if (!maxPriorityFeePerGas) {
      // chain does not support eip-1559, return null for both
      return { maxFeePerGas: null, maxPriorityFeePerGas: null, baseFee: null };
    }
  }

  // add 10% tip to maxPriorityFeePerGas for faster processing
  maxPriorityFeePerGas = getPreferredPriorityFee(maxPriorityFeePerGas);
  // eip-1559 formula, doubling the base fee ensures that the tx can be included in the next 6 blocks no matter how busy the network is
  // good article on the subject: https://www.blocknative.com/blog/eip-1559-fees
  maxFeePerGas = baseBlockFee.mul(2).add(maxPriorityFeePerGas);

  return { maxFeePerGas, maxPriorityFeePerGas, baseFee: baseBlockFee };
}

function getPreferredPriorityFee(
  defaultPriorityFeePerGas: BigNumber,
  percentMultiplier: number = 10,
): BigNumber {
  const extraTip = defaultPriorityFeePerGas.div(100).mul(percentMultiplier); // + 10%
  const totalPriorityFee = defaultPriorityFeePerGas.add(extraTip);
  return totalPriorityFee;
}

export async function getGasPrice(
  provider: providers.Provider,
): Promise<BigNumber> {
  const gasPrice = await provider.getGasPrice();
  const maxGasPrice = utils.parseUnits("300", "gwei"); // 300 gwei
  const extraTip = gasPrice.div(100).mul(10); // + 10%
  const txGasPrice = gasPrice.add(extraTip);

  if (txGasPrice.gt(maxGasPrice)) {
    return maxGasPrice;
  }

  return txGasPrice;
}

export async function estimateTransactionCost(
  provider: providers.Provider,
  tx: providers.TransactionRequest,
) {
  const chainId = (await provider.getNetwork()).chainId;
  let l1GasCost = BigNumber.from(0);
  if (isOpStackChain(chainId)) {
    const { asL2Provider } = await import("@eth-optimism/sdk");
    const l2RpcProvider = asL2Provider(provider);
    l1GasCost = await l2RpcProvider.estimateL1GasCost(tx);
  }
  const gasLimit = tx.gasLimit || (await provider.estimateGas(tx));
  const gasPrice = await getGasPrice(provider);
  const gasCost = BigNumber.from(gasLimit).mul(gasPrice);
  return gasCost.add(l1GasCost);
}

function isOpStackChain(chainId: number) {
  return (
    chainId === Optimism.chainId ||
    chainId === OpSepoliaTestnet.chainId ||
    chainId === Base.chainId ||
    chainId === BaseSepoliaTestnet.chainId ||
    chainId === Zora.chainId ||
    chainId === ZoraSepoliaTestnet.chainId ||
    chainId === Celo.chainId ||
    chainId === CeloAlfajoresTestnet.chainId ||
    chainId === 204 || // opBNB
    chainId === 5611 // opBNB testnet
  );
}

/**
 * @internal
 */
function getGasStationUrl(chainId: ChainId.Polygon | 80002): string {
  switch (chainId) {
    case ChainId.Polygon:
      return "https://gasstation.polygon.technology/v2";
    case 80002:
      return "https://gasstation-testnet.polygon.technology/v2";
  }
}

const MIN_POLYGON_GAS_PRICE = /* @__PURE__ */ (() =>
  utils.parseUnits("31", "gwei"))();

/**
 *
 * @returns The gas price
 * @internal
 */
export async function getPolygonGasPriorityFee(
  chainId: ChainId.Polygon | 80002,
): Promise<BigNumber> {
  const gasStationUrl = getGasStationUrl(chainId);
  try {
    const data = await (await fetch(gasStationUrl)).json();
    // take the standard speed here, SDK options will define the extra tip
    const priorityFee = data["fast"]["maxPriorityFee"];
    if (priorityFee > 0) {
      const fixedFee = parseFloat(priorityFee).toFixed(9);
      return utils.parseUnits(fixedFee, "gwei");
    }
  } catch {
    // if the gas station is down, return the default gas fee
  }
  return MIN_POLYGON_GAS_PRICE;
}
