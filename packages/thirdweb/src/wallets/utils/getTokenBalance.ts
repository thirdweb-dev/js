import {
  getChainSymbol,
  type Chain,
  getChainDecimals,
} from "../../chain/index.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getContract } from "../../contract/index.js";
import { eth_getBalance, getRpcClient } from "../../rpc/index.js";
import type { Account } from "../interfaces/wallet.js";
import { formatUnits } from "viem/utils";

export type GetTokenBalanceOptions = {
  account: Pick<Account, "address">;
  client: ThirdwebClient;
  chain: Chain;
  /**
   * (Optional) The address of the token to retrieve the balance for. If not provided, the balance of the native token will be retrieved.
   */
  tokenAddress?: string;
};

type GetTokenBalanceResult = {
  value: bigint;
  decimals: number;
  displayValue: string;
  symbol: string;
};

/**
 * Retrieves the balance of a token for a given wallet.
 * @param options - The options for retrieving the token balance.
 * @returns A promise that resolves to the token balance result.
 * @example
 * ```ts
 * import { getTokenBalance } from "thirdweb/wallets";
 * const balance = await getTokenBalance({ account, client, chain, tokenAddress });
 * ```
 */
export async function getTokenBalance(
  options: GetTokenBalanceOptions,
): Promise<GetTokenBalanceResult> {
  const { account, client, chain, tokenAddress } = options;
  // erc20 case
  if (tokenAddress) {
    // load balanceOf dynamically to avoid circular dependency
    const { balanceOf } = await import(
      "../../extensions/erc20/read/balanceOf.js"
    );
    return balanceOf({
      contract: getContract({ client, chain, address: tokenAddress }),
      address: account.address,
    });
  }
  // native token case
  const rpcRequest = getRpcClient({ client, chain });

  const [nativeSymbol, nativeDecimals, nativeBalance] = await Promise.all([
    getChainSymbol(chain),
    getChainDecimals(chain),
    eth_getBalance(rpcRequest, { address: account.address }),
  ]);

  return {
    value: nativeBalance,
    decimals: nativeDecimals,
    displayValue: formatUnits(nativeBalance, nativeDecimals),
    symbol: nativeSymbol,
  };
}
