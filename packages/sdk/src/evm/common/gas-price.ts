import { ChainId } from "../constants/chains";
import fetch from "cross-fetch";
import { BigNumber, ethers } from "ethers";

/**
 * @internal
 */
function getGasStationUrl(chainId: ChainId.Polygon | ChainId.Mumbai): string {
  switch (chainId) {
    case ChainId.Polygon:
      return "https://gasstation-mainnet.matic.network/v2";
    case ChainId.Mumbai:
      return "https://gasstation-mumbai.matic.today/v2";
  }
}

const MIN_POLYGON_GAS_PRICE = ethers.utils.parseUnits("31", "gwei");
const MIN_MUMBAI_GAS_PRICE = ethers.utils.parseUnits("1", "gwei");

/**
 * @internal
 */
function getDefaultGasFee(
  chainId: ChainId.Polygon | ChainId.Mumbai,
): BigNumber {
  switch (chainId) {
    case ChainId.Polygon:
      return MIN_POLYGON_GAS_PRICE;
    case ChainId.Mumbai:
      return MIN_MUMBAI_GAS_PRICE;
  }
}

/**
 *
 * @returns the gas price
 * @internal
 */
export async function getPolygonGasPriorityFee(
  chainId: ChainId.Polygon | ChainId.Mumbai,
): Promise<BigNumber> {
  const gasStationUrl = getGasStationUrl(chainId);
  try {
    const data = await (await fetch(gasStationUrl)).json();
    // take the standard speed here, SDK options will define the extra tip
    const priorityFee = data["standard"]["maxPriorityFee"];
    if (priorityFee > 0) {
      const fixedFee = parseFloat(priorityFee).toFixed(9);
      return ethers.utils.parseUnits(fixedFee, "gwei");
    }
  } catch (e) {
    console.error("failed to fetch gas", e);
  }
  return getDefaultGasFee(chainId);
}
