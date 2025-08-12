type SessionContextFilter = {
  chain_ids: string[] | null;
  wallet_address: string | null;
};

type NebulaUserMessageContentItem =
  | {
      type: "image";
      image_url: string | null;
      b64: string | null;
    }
  | {
      type: "text";
      text: string;
    }
  | {
      type: "transaction";
      transaction_hash: string;
      chain_id: number;
    };

type NebulaUserMessageContent = NebulaUserMessageContentItem[];

export type NebulaUserMessage = {
  role: "user";
  content: NebulaUserMessageContent;
};

export type NebulaSessionHistoryMessage =
  | {
      role: "assistant" | "action" | "image";
      content: string;
      timestamp: number;
    }
  | {
      role: "user";
      content: NebulaUserMessageContent | string;
    };

export type NebulaTxData = {
  chainId: number;
  data: `0x${string}`;
  to: string;
  value?: string;
};
