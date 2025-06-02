import type { ThirdwebClient } from "../../client/client.js";
import { stringify } from "../../utils/json.js";
import type { Ecosystem } from "../../wallets/in-app/core/wallet/types.js";
import type { WalletId } from "../../wallets/wallet-types.js";
import { getErrorDetails } from "./helpers.js";
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

/**
 * @internal
 */
export async function trackInsufficientFundsError(args: {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  error: Error | unknown;
  walletAddress?: string;
  chainId?: number;
  contractAddress?: string;
  functionName?: string;
  transactionValue?: bigint;
  requiredAmount?: bigint;
  userBalance?: bigint;
}) {
  const errorDetails = getErrorDetails(args.error);

  return track({
    client: args.client,
    ecosystem: args.ecosystem,
    data: {
      action: "transaction:insufficient_funds",
      clientId: args.client.clientId,
      chainId: args.chainId,
      walletAddress: args.walletAddress,
      contractAddress: args.contractAddress,
      functionName: args.functionName,
      transactionValue: args.transactionValue?.toString(),
      requiredAmount: args.requiredAmount?.toString(),
      userBalance: args.userBalance?.toString(),
      errorMessage: errorDetails.message,
      errorCode: errorDetails.code ? stringify(errorDetails.code) : undefined,
    },
  });
}
