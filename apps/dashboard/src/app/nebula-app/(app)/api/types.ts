type SessionContextFilter = {
  chain_ids: string[] | null;
  wallet_address: string | null;
};

export type SessionInfo = {
  id: string;
  account_id: string;
  modal_name: string;
  archive_at: string | null;
  can_execute: boolean;
  created_at: string;
  deleted_at: string | null;
  history: Array<{
    role: "user" | "assistant" | "action";
    content: string;
    timestamp: number;
  }> | null;
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
