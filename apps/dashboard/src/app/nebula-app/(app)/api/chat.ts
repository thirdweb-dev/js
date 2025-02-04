import { NEXT_PUBLIC_NEBULA_URL } from "@/constants/env";
// TODO - copy the source of this library to dashboard
import { stream } from "fetch-event-stream";
import type { NebulaTxData } from "../components/Chats";

export type NebulaContext = {
  chainIds: string[] | null;
  walletAddress: string | null;
};

export async function promptNebula(params: {
  message: string;
  sessionId: string;
  authToken: string;
  handleStream: (res: ChatStreamedResponse) => void;
  abortController: AbortController;
  context: undefined | NebulaContext;
}) {
  const body: Record<string, string | boolean | object> = {
    message: params.message,
    stream: true,
    session_id: params.sessionId,
  };

  if (params.context) {
    body.context = {
      chain_ids: params.context.chainIds || [],
      wallet_address: params.context.walletAddress,
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
      data: NebulaTxData;
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
