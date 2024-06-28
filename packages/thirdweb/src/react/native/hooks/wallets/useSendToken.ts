import type { ThirdwebClient } from "../../../../client/client.js";
import { useSendTokenCore } from "../../../core/hooks/wallets/useSendToken.js";
import { useActiveWallet } from "./useActiveWallet.js";

/**
 * Send Native or ERC20 tokens from active wallet to given address.
 * @example
 * ```tsx
 * const { mutate: sendToken } = useSendToken(client);
 *
 * // send native currency
 * sendToken({
 *    receiverAddress: "0x...",
 *    amount: "0.1",
 * });
 *
 * // send ERC20
 * sendToken({
 *   tokenAddress,
 *   receiverAddress: "0x...",
 *   amount: "0.5",
 * });
 * ```
 * @wallet
 */
export function useSendToken(client: ThirdwebClient) {
  const wallet = useActiveWallet();
  return useSendTokenCore(client, wallet);
}
