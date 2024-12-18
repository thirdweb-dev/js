import { NEXT_PUBLIC_NEBULA_URL } from "@/constants/env";
// TODO - copy the source of this library to dashboard
import { stream } from "fetch-event-stream";
import type { SendTransactionOption } from "thirdweb/dist/types/wallets/interfaces/wallet";
import type { ExecuteConfig } from "./types";

export type ContextFilters = {
  chainIds?: string[];
  contractAddresses?: string[];
  walletAddresses?: string[];
};

export async function promptNebula(params: {
  message: string;
  sessionId: string;
  config: ExecuteConfig;
  authToken: string;
  handleStream: (res: ChatStreamedResponse) => void;
  abortController: AbortController;
  contextFilters: undefined | ContextFilters;
}) {
  const body: Record<string, string | boolean | object> = {
    message: params.message,
    user_id: "default-user",
    session_id: params.sessionId,
    stream: true,
    execute_config: params.config,
  };

  if (params.contextFilters) {
    body.context_filter = {
      chain_ids: params.contextFilters.chainIds || [],
      contract_addresses: params.contextFilters.contractAddresses || [],
    };
  }

  const events = await stream(`${NEXT_PUBLIC_NEBULA_URL}/chat`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: params.abortController.signal,
  });

  for await (const _event of events) {
    if (!_event.data) {
      continue;
    }

    const event = _event as ChatStreamedEvent;

    switch (event.event) {
      case "delta": {
        params.handleStream({
          event: "delta",
          data: {
            v: JSON.parse(event.data).v,
          },
        });
        break;
      }

      case "presence": {
        params.handleStream({
          event: "presence",
          data: JSON.parse(event.data),
        });
        break;
      }

      case "action": {
        const data = JSON.parse(event.data);

        if (data.type === "sign_transaction") {
          let txData = null;

          try {
            const parsedTxData = JSON.parse(data.data);
            if (
              parsedTxData !== null &&
              typeof parsedTxData === "object" &&
              parsedTxData.chainId
            ) {
              txData = parsedTxData;
            }
          } catch (e) {
            console.error("failed to parse action data", e);
          }

          params.handleStream({
            event: "action",
            type: "sign_transaction",
            data: txData,
          });
        }

        break;
      }

      case "init": {
        const data = JSON.parse(event.data);
        params.handleStream({
          event: "init",
          data: {
            session_id: data.session_id,
            request_id: data.request_id,
          },
        });
        break;
      }
    }
  }
}

type ChatStreamedResponse =
  | {
      event: "init";
      data: {
        session_id: string;
        request_id: string;
      };
    }
  | {
      event: "presence";
      data: {
        session_id: string;
        request_id: string;
        source: "user" | "reviewer" | (string & {});
        data: string;
      };
    }
  | {
      event: "delta";
      data: {
        v: string;
      };
    }
  | {
      event: "action";
      type: "sign_transaction" & (string & {});
      data: SendTransactionOption;
    };

type ChatStreamedEvent =
  | {
      event: "init";
      data: string;
    }
  | {
      event: "presence";
      data: string;
    }
  | {
      event: "delta";
      data: string;
    }
  | {
      event: "action";
      type: "sign_transaction" & (string & {});
      data: string;
    };
