import type { Chain } from "../../chains/types.js";
import {
  getChainDecimals,
  getChainNativeCurrencyName,
  getChainSymbol,
} from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getContract } from "../../contract/contract.js";
import { eth_getBalance } from "../../rpc/actions/eth_getBalance.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { toTokens } from "../../utils/units.js";
import type { Account } from "../interfaces/wallet.js";

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
  name: string;
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
    const { getBalance } = await import(
      "../../extensions/erc20/read/getBalance.js"
    );
    return getBalance({
      contract: getContract({ client, chain, address: tokenAddress }),
      address: account.address,
    });
  }
  // native token case
  const rpcRequest = getRpcClient({ client, chain });

  const [nativeSymbol, nativeDecimals, nativeName, nativeBalance] =
    await Promise.all([
      getChainSymbol(chain),
      getChainDecimals(chain),
      getChainNativeCurrencyName(chain),
      eth_getBalance(rpcRequest, { address: account.address }),
    ]);

  return {
    value: nativeBalance,
    decimals: nativeDecimals,
    displayValue: toTokens(nativeBalance, nativeDecimals),
    symbol: nativeSymbol,
    name: nativeName,
  };
}
