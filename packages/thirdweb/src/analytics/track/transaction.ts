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
    data: {
      action: args.action,
      chainId: args.chainId,
      clientId: args.client.clientId,
      contractAddress: args.contractAddress,
      errorCode: stringify(args.error),
      functionName: args.functionName,
      gasPrice: args.gasPrice,
      transactionHash: args.transactionHash,
      walletAddress: args.walletAddress,
      walletType: args.walletType,
    },
    ecosystem: args.ecosystem,
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
    data: {
      action: "transaction:insufficient_funds",
      chainId: args.chainId,
      clientId: args.client.clientId,
      contractAddress: args.contractAddress,
      errorCode: errorDetails.code ? stringify(errorDetails.code) : undefined,
      errorMessage: errorDetails.message,
      functionName: args.functionName,
      requiredAmount: args.requiredAmount?.toString(),
      transactionValue: args.transactionValue?.toString(),
      userBalance: args.userBalance?.toString(),
      walletAddress: args.walletAddress,
    },
    ecosystem: args.ecosystem,
  });
}
