import type { Chain } from "../chains/types.js";
import { getCachedChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import {
  type PreparedTransaction,
  prepareTransaction,
} from "../transaction/prepare-transaction.js";
import type { Address } from "../utils/address.js";
import { toBigInt } from "../utils/bigint.js";
import type { Hex } from "../utils/encoding/hex.js";
import { getClientFetch } from "../utils/fetch.js";
import type { Account } from "../wallets/interfaces/wallet.js";

const NEBULA_API_URL = "https://nebula-api.thirdweb.com";

export type Input = {
  client: ThirdwebClient;
  account?: Account;
  contextFilter?: {
    chains?: Chain[];
    walletAddresses?: string[];
    contractAddresses?: string[];
  };
  sessionId?: string;
} & (
  | {
      messages: {
        role: "user" | "assistant";
        content: string;
      }[];
    }
  | {
      message: string;
    }
);

export type Output = {
  message: string;
  sessionId: string;
  transactions: PreparedTransaction[];
};

type ApiResponse = {
  message: string;
  session_id: string;
  actions?: {
    type: "init" | "presence" | "sign_transaction";
    source: string;
    data: string;
  }[];
};

export async function nebulaFetch(
  mode: "execute" | "chat",
  input: Input,
): Promise<Output> {
  const fetch = getClientFetch(input.client);
  const response = await fetch(`${NEBULA_API_URL}/${mode}`, {
    body: JSON.stringify({
      ...("messages" in input
        ? {
            messages: input.messages,
          }
        : {
            message: input.message,
          }),
      session_id: input.sessionId,
      ...(input.account
        ? {
            execute_config: {
              mode: "client",
              signer_wallet_address: input.account.address,
            },
          }
        : {}),
      ...(input.contextFilter
        ? {
            context_filter: {
              chain_ids:
                input.contextFilter.chains?.map((c) => c.id.toString()) || [],
              contract_addresses: input.contextFilter.contractAddresses || [],
              wallet_addresses:
                input.contextFilter.walletAddresses ||
                (input.account ? [input.account.address] : []),
            },
          }
        : {}),
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Nebula API error: ${error}`);
  }
  const data = (await response.json()) as ApiResponse;

  // parse transactions if present
  let transactions: PreparedTransaction[] = [];
  if (data.actions) {
    transactions = data.actions
      .map((action) => {
        // only parse sign_transaction actions
        if (action.type === "sign_transaction") {
          const tx = JSON.parse(action.data) as {
            chainId: number;
            to: Address | undefined;
            value: Hex;
            data: Hex;
          };
          return prepareTransaction({
            chain: getCachedChain(tx.chainId),
            client: input.client,
            data: tx.data,
            to: tx.to,
            value: tx.value ? toBigInt(tx.value) : undefined,
          });
        }
        return undefined;
      })
      .filter((tx) => tx !== undefined);
  }

  return {
    message: data.message,
    sessionId: data.session_id,
    transactions,
  };
}
