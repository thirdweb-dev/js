import type { ThirdwebClient } from "../../client/client.js";
import { stringify } from "../../utils/json.js";
import type { Ecosystem } from "../../wallets/in-app/core/wallet/types.js";
import type { WalletId } from "../../wallets/wallet-types.js";
import { track } from "./index.js";

type TransactionEvent = {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  transactionHash?: string;
  walletAddress?: string;
  walletType?: WalletId | ({} & string);
  chainId?: number;
  contractAddress?: string;
  functionName?: string;
  gasPrice?: bigint;
  error?: {
    message: string;
    code: string;
  };
};

/**
 * @internal
 */
export async function trackTransaction(args: TransactionEvent) {
  return trackTransactionEvent({
    ...args,
    action: "transaction:sent",
  });
}

/**
 * @internal
 */
function trackTransactionEvent(
  args: TransactionEvent & {
    action: "transaction:sent";
  },
) {
  return track({
    client: args.client,
    ecosystem: args.ecosystem,
    data: {
      action: args.action,
      clientId: args.client.clientId,
      chainId: args.chainId,
      transactionHash: args.transactionHash,
      walletAddress: args.walletAddress,
      walletType: args.walletType,
      contractAddress: args.contractAddress,
      functionName: args.functionName,
      gasPrice: args.gasPrice,
      errorCode: stringify(args.error),
    },
  });
}
