type SessionContextFilter = {
  chain_ids: string[] | null;
  wallet_address: string | null;
};

type NebulaUserMessageContentItem =
  | {
      type: "image";
      image_url: string;
    }
  | {
      type: "image";
      b64: string;
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

export type NebulaUserMessageContent = NebulaUserMessageContentItem[];

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

export type SessionInfo = {
  id: string;
  account_id: string;
  modal_name: string;
  archive_at: string | null;
  can_execute: boolean;
  created_at: string;
  deleted_at: string | null;
  history: Array<NebulaSessionHistoryMessage> | null;
  updated_at: string;
  archived_at: string | null;
  title: string | null;
  is_public: boolean | null;
  context: SessionContextFilter | null;
  // memory
  // action: array<object> | null; <-- type of this is not available on https://nebula-api.thirdweb-dev.com/docs#/default/get_session_session__session_id__get
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
