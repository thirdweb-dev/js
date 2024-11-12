import type { Account } from "viem/accounts";

import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { estimateGas } from "../../transaction/actions/estimate-gas.js";
import { sendTransaction } from "../../transaction/actions/send-transaction.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import type { Wallet } from "../../wallets/interfaces/wallet.js";
import type { EIP1193Provider } from "./types.js";

export type ToEip1193ProviderOptions = {
  wallet: Wallet;
  chain: Chain;
  client: ThirdwebClient;
  connectOverride?: (wallet: Wallet) => Promise<Account>;
};

export function toProvider(options: ToEip1193ProviderOptions): EIP1193Provider {
  const { chain, client, wallet, connectOverride } = options;
  const rpcClient = getRpcClient({ client, chain });
  return {
    on: wallet.subscribe,
    removeListener: () => {
      // should invoke the return fn from subscribe instead
    },
    request: async (request) => {
      if (request.method === "eth_sendTransaction") {
        const account = wallet.getAccount();
        if (!account) {
          throw new Error("Account not connected");
        }
        const result = await sendTransaction({
          transaction: prepareTransaction({
            ...request.params[0],
            chain,
            client,
          }),
          account: account,
        });
        return result.transactionHash;
      }
      if (request.method === "eth_estimateGas") {
        const account = wallet.getAccount();
        if (!account) {
          throw new Error("Account not connected");
        }
        return estimateGas({
          transaction: prepareTransaction({
            ...request.params[0],
            chain,
            client,
          }),
          account,
        });
      }
      if (request.method === "personal_sign") {
        const account = wallet.getAccount();
        if (!account) {
          throw new Error("Account not connected");
        }
        return account.signMessage({
          message: {
            raw: request.params[0],
          },
        });
      }
      if (request.method === "eth_signTypedData_v4") {
        const account = wallet.getAccount();
        if (!account) {
          throw new Error("Account not connected");
        }
        const data = JSON.parse(request.params[1]);
        return account.signTypedData(data);
      }
      if (request.method === "eth_accounts") {
        const account = wallet.getAccount();
        if (!account) {
          throw new Error("Account not connected");
        }
        return [account.address];
      }
      if (request.method === "eth_requestAccounts") {
        const account = connectOverride
          ? await connectOverride(wallet)
          : await wallet.connect({
            client,
          });
        if (!account) {
          throw new Error("Unable to connect wallet");
        }
        return [account.address];
      }
      return rpcClient(request);
    },
  };
}
