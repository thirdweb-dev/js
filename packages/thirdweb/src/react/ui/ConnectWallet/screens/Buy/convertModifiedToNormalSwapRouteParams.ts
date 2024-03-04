import {
  defineChain,
  getChainDataForChain,
} from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { ZERO_ADDRESS } from "../../../../../constants/addresses.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../../../contract/contract.js";
import { decimals } from "../../../../../extensions/erc20/read/decimals.js";
import type { SwapRouteParams } from "../../../../../pay/swap/actions/getSwap.js";
import type { SwapSupportChainId } from "../../../../../pay/swap/actions/getSwap.js";
import { toUnits } from "../../../../../utils/units.js";

// TODO: remove this once the server takes the amount instead of wei for token amount

export type ModifiedSwapRouteParams = {
  client: ThirdwebClient;
  // from
  fromAddress: string;
  fromChainId: SwapSupportChainId;
  fromTokenAddress: string;
  fromTokenAmount?: string; // this is modified
  // to
  toAddress?: string;
  toChainId: SwapSupportChainId;
  toTokenAddress: string;
  toTokenAmount?: string; // this is modified
  // others
  maxSlippageBPS?: number;
};

const createContractCacheKey = (address: string, chainId: SwapSupportChainId) =>
  `${address}-${chainId}`;

// contract address + chainId as key
const contractCache = new Map<string, ThirdwebContract>();

/**
 * @internal
 */
export async function convertModifiedToNormalSwapRouteParams(
  modifiedParams: ModifiedSwapRouteParams,
) {
  let chainDecimals = 18;
  try {
    chainDecimals = (
      await getChainDataForChain(defineChain(modifiedParams.fromChainId))
    ).nativeCurrency.decimals;
  } catch {
    // ignore
  }

  const swapRouteParams: SwapRouteParams = {
    client: modifiedParams.client,
    fromAddress: modifiedParams.fromAddress,
    fromChainId: modifiedParams.fromChainId,
    fromTokenAddress: modifiedParams.fromTokenAddress,
    toChainId: modifiedParams.toChainId,
    toTokenAddress: modifiedParams.toTokenAddress,
  };

  if (modifiedParams.fromTokenAmount) {
    if (modifiedParams.fromTokenAddress === ZERO_ADDRESS) {
      swapRouteParams.fromAmountWei = toUnits(
        modifiedParams.fromTokenAmount,
        chainDecimals,
      ).toString();
    } else {
      const key = createContractCacheKey(
        modifiedParams.fromTokenAddress,
        modifiedParams.fromChainId,
      );

      let _contract = contractCache.get(key);

      if (!_contract) {
        _contract = getContract({
          address: modifiedParams.fromTokenAddress,
          chain: defineChain(modifiedParams.fromChainId),
          client: modifiedParams.client,
        });

        contractCache.set(key, _contract);
      }

      // get the decimals of this contract
      const _decimals = await decimals({
        contract: _contract,
      });

      swapRouteParams.fromAmountWei = toUnits(
        modifiedParams.fromTokenAmount,
        _decimals,
      ).toString();
    }
  } else if (modifiedParams.toTokenAmount) {
    if (modifiedParams.toTokenAddress === ZERO_ADDRESS) {
      swapRouteParams.toAmountWei = toUnits(
        modifiedParams.toTokenAmount,
        chainDecimals,
      ).toString();
    } else {
      const key = createContractCacheKey(
        modifiedParams.toTokenAddress,
        modifiedParams.toChainId,
      );

      let _contract = contractCache.get(key);

      if (!_contract) {
        _contract = getContract({
          address: modifiedParams.toTokenAddress,
          chain: defineChain(modifiedParams.toChainId),
          client: modifiedParams.client,
        });

        contractCache.set(key, _contract);
      }

      // get the decimals of this contract
      const _decimals = await decimals({
        contract: _contract,
      });

      swapRouteParams.toAmountWei = toUnits(
        modifiedParams.toTokenAmount,
        _decimals,
      ).toString();
    }
  }

  return swapRouteParams;
}
