import { NEXT_PUBLIC_NEBULA_URL } from "@/constants/env";
// TODO - copy the source of this library to dashboard
import { stream } from "fetch-event-stream";
import type { NebulaTxData } from "../components/Chats";
import type { NebulaUserMessage } from "./types";

export type NebulaContext = {
  chainIds: string[] | null;
  walletAddress: string | null;
  networks: "mainnet" | "testnet" | "all" | null;
};

export type NebulaSwapData = {
  action: string;
  transaction: {
    chainId: number;
    to: `0x${string}`;
    data: `0x${string}`;
  };
  to: {
    address: `0x${string}`;
    amount: string;
    chain_id: number;
    decimals: number;
    symbol: string;
  };
  from: {
    address: `0x${string}`;
    amount: string;
    chain_id: number;
    decimals: number;
    symbol: string;
  };
  intent: {
    amount: string;
    destinationChainId: number;
    destinationTokenAddress: `0x${string}`;
    originChainId: number;
    originTokenAddress: `0x${string}`;
    receiver: `0x${string}`;
    sender: `0x${string}`;
  };
};

export async function promptNebula(params: {
  message: NebulaUserMessage;
  sessionId: string;
  authToken: string;
  handleStream: (res: ChatStreamedResponse) => void;
  abortController: AbortController;
  context: undefined | NebulaContext;
}) {
  const body: Record<string, string | boolean | object> = {
    messages: [params.message],
    stream: true,
    session_id: params.sessionId,
  };

  if (params.context) {
    body.context = {
      chain_ids: params.context.chainIds || [],
      wallet_address: params.context.walletAddress,
      networks: params.context.networks,
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

      case "image": {
        const data = JSON.parse(event.data) as {
          data: {
            width: number;
            height: number;
            url: string;
          };
          request_id: string;
        };

        params.handleStream({
          event: "image",
          data: data.data,
          request_id: data.request_id,
        });
        break;
      }

      case "action": {
        const data = JSON.parse(event.data);

        if (data.type === "sign_transaction") {
          try {
            const parsedTxData = JSON.parse(data.data) as NebulaTxData;
            params.handleStream({
              event: "action",
              type: "sign_transaction",
              data: parsedTxData,
              request_id: data.request_id,
            });
          } catch (e) {
            console.error("failed to parse action data", e, { event });
          }
        }

        if (data.type === "sign_swap") {
          try {
            const swapData = JSON.parse(data.data) as NebulaSwapData;
            params.handleStream({
              event: "action",
              type: "sign_swap",
              data: swapData,
              request_id: data.request_id,
            });
          } catch (e) {
            console.error("failed to parse action data", e, { event });
          }
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

      case "context": {
        const data = JSON.parse(event.data) as {
          data: string;
          request_id: string;
          session_id: string;
        };

        const contextData = JSON.parse(data.data) as {
          wallet_address: string;
          chain_ids: number[];
          networks: NebulaContext["networks"];
        };

        params.handleStream({
          event: "context",
          data: contextData,
        });
        break;
      }

      default: {
        console.warn("unhandled event", event);
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
      type: "sign_transaction";
      data: NebulaTxData;
      request_id: string;
    }
  | {
      event: "action";
      type: "sign_swap";
      data: NebulaSwapData;
      request_id: string;
    }
  | {
      event: "image";
      data: {
        width: number;
        height: number;
        url: string;
      };
      request_id: string;
    }
  | {
      event: "context";
      data: {
        wallet_address: string;
        chain_ids: number[];
        networks: NebulaContext["networks"];
      };
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
      event: "image";
      data: string;
    }
  | {
      event: "action";
      type: "sign_transaction" | "sign_swap";
      data: string;
    }
  | {
      event: "context";
      data: string;
    };
