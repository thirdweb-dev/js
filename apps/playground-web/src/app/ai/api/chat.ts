import { stream } from "fetch-event-stream";
import type { NebulaTxData, NebulaUserMessage } from "./types";

// Mock URL for playground - you'll need to configure this
const NEBULA_URL = process.env.NEXT_PUBLIC_NEBULA_URL || "https://nebula-api.thirdweb-dev.com";

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
    session_id: params.sessionId,
    stream: true,
  };

  if (params.context) {
    body.context = {
      chain_ids: params.context.chainIds || [],
      networks: params.context.networks,
      wallet_address: params.context.walletAddress,
    };
  }

  const events = await stream(`${NEBULA_URL}/chat`, {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${params.authToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
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
          data: {
            v: JSON.parse(event.data).v,
          },
          event: "delta",
        });
        break;
      }

      case "presence": {
        params.handleStream({
          data: JSON.parse(event.data),
          event: "presence",
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
          data: data.data,
          event: "image",
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
              data: parsedTxData,
              event: "action",
              request_id: data.request_id,
              type: "sign_transaction",
            });
          } catch (e) {
            console.error("failed to parse action data", e, { event });
          }
        }

        if (data.type === "sign_swap") {
          try {
            const swapData = JSON.parse(data.data) as NebulaSwapData;
            params.handleStream({
              data: swapData,
              event: "action",
              request_id: data.request_id,
              type: "sign_swap",
            });
          } catch (e) {
            console.error("failed to parse action data", e, { event });
          }
        }

        break;
      }

      case "error": {
        const data = JSON.parse(event.data) as {
          code: number;
          error: {
            message: string;
          };
        };

        params.handleStream({
          data: {
            code: data.code,
            errorMessage: data.error.message,
          },
          event: "error",
        });
        break;
      }

      case "init": {
        const data = JSON.parse(event.data);
        params.handleStream({
          data: {
            request_id: data.request_id,
            session_id: data.session_id,
          },
          event: "init",
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
          data: contextData,
          event: "context",
        });
        break;
      }

      case "ping": {
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
    }
  | {
      event: "error";
      data: {
        code: number;
        errorMessage: string;
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
    }
  | {
      event: "error";
      data: string;
    }
  | {
      event: "ping";
      data: string;
    };