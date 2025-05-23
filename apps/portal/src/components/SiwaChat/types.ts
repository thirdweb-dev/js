type SessionContextFilter = {
  chain_ids: string[] | null;
  wallet_address: string | null;
};

type NebulaUserMessageContentItem =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "transaction";
      transaction_hash: string;
      chain_id: number;
    };

export type NebulaUserMessageContent = NebulaUserMessageContentItem[];

export type NebulaUserMessage = {
  role: "user";
  content: NebulaUserMessageContent;
};

export type NebulaSessionHistoryMessage =
  | {
      role: "assistant" | "action";
      content: string;
      timestamp: number;
    }
  | {
      role: "user";
      content: NebulaUserMessageContent | string;
    };

export type SessionInfo = {
  id: string;
  account_id: string;
  modal_name: string;
  can_execute: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  archived_at: string | null;
  history: Array<NebulaSessionHistoryMessage> | null;
  title: string | null;
  is_public: boolean | null;
  context: SessionContextFilter | null;
};

export type UpdatedSessionInfo = {
  title: string;
  modal_name: string;
  account_id: string;
  context: SessionContextFilter | null;
};

export type DeletedSessionInfo = {
  id: string;
  deleted_at: string;
};

export type TruncatedSessionInfo = {
  created_at: string;
  id: string;
  updated_at: string;
  title: string | null;
};
