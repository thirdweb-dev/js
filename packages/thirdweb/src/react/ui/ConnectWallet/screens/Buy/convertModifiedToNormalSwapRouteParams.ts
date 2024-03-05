import { defineChain } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { ZERO_ADDRESS } from "../../../../../constants/addresses.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../../../contract/contract.js";
import { decimals } from "../../../../../extensions/erc20/__generated__/IERC20Metadata/read/decimals.js";
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
const nativeTokenDecimals = 18;

/**
 * @internal
 */
export async function convertModifiedToNormalSwapRouteParams(
  modifiedParams: ModifiedSwapRouteParams,
) {
  const swapRouteParams: SwapRouteParams = {
    client: modifiedParams.client,
    fromAddress: modifiedParams.fromAddress,
    fromChainId: modifiedParams.fromChainId,
    fromTokenAddress: modifiedParams.fromTokenAddress,
    toChainId: modifiedParams.toChainId,
    toTokenAddress: modifiedParams.toTokenAddress,
  };

  async function convertAmount(
    amount: string,
    tokenAddress: string,
    chainId: SwapSupportChainId,
  ) {
    const _decimals = await getDecimals(
      tokenAddress,
      chainId,
      modifiedParams.client,
    );

    return toUnits(amount, _decimals).toString();
  }

  // convert fromTokenAmount to fromAmountWei
  if (modifiedParams.fromTokenAmount) {
    swapRouteParams.fromAmountWei = await convertAmount(
      modifiedParams.fromTokenAmount,
      modifiedParams.fromTokenAddress,
      modifiedParams.fromChainId,
    );
  }

  // convert toTokenAmount to toAmountWei
  else if (modifiedParams.toTokenAmount) {
    swapRouteParams.toAmountWei = await convertAmount(
      modifiedParams.toTokenAmount,
      modifiedParams.toTokenAddress,
      modifiedParams.toChainId,
    );
  }

  return swapRouteParams;
}

async function getDecimals(
  tokenAddress: string,
  chainId: SwapSupportChainId,
  client: ThirdwebClient,
) {
  if (tokenAddress === ZERO_ADDRESS) {
    return nativeTokenDecimals;
  }

  const key = createContractCacheKey(tokenAddress, chainId);

  let _contract = contractCache.get(key);

  if (!_contract) {
    _contract = getContract({
      address: tokenAddress,
      chain: defineChain(chainId),
      client: client,
    });

    contractCache.set(key, _contract);
  }

  // get the decimals of this contract
  const _decimals = await decimals({
    contract: _contract,
  });

  return _decimals;
}
