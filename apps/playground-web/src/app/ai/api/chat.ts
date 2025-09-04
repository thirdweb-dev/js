import { stream } from "fetch-event-stream";
import {
  API_URL,
  type NebulaContext,
  type NebulaSwapData,
  type NebulaTxData,
  type NebulaUserMessage,
} from "./types";

export async function promptNebula(params: {
  message: NebulaUserMessage;
  handleStream: (res: ChatStreamedResponse) => void;
  abortController: AbortController;
  context: undefined | NebulaContext;
}) {
  const body: Record<string, string | boolean | object> = {
    messages: [params.message],
    stream: true,
  };

  if (params.context) {
    body.context = {
      chain_ids: params.context.chainIds?.map(Number) || [],
      session_id: params.context.sessionId ?? undefined,
      wallet_address: params.context.walletAddress,
    };
  }

  const events = await stream(`${API_URL}/ai/chat`, {
    body: JSON.stringify(body),
    headers: {
      "x-client-id": process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
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
            const parsedTxData = data.data as NebulaTxData;
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
            const swapData = data.data as NebulaSwapData;
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
          session_id: string;
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
        session_id: string;
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
